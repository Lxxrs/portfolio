#!/bin/bash
# SFTP Deployment Script for Hetzner
# Usage: ./deploy-hetzner.sh

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment to Hetzner...${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}💡 Copy .env.example to .env and fill in your credentials:${NC}"
    echo -e "   cp .env.example .env"
    echo -e "   nano .env"
    exit 1
fi

# Load environment variables from .env
echo -e "${BLUE}📋 Loading credentials from .env...${NC}"
export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)

# Validate required variables
if [ -z "$HETZNER_HOST" ] || [ -z "$HETZNER_USER" ]; then
    echo -e "${RED}❌ Error: Missing required credentials in .env${NC}"
    echo -e "${YELLOW}Required: HETZNER_HOST, HETZNER_USER${NC}"
    exit 1
fi

# Set default remote path to current directory if not specified
HETZNER_REMOTE_PATH=${HETZNER_REMOTE_PATH:-.}

# Set default port if not specified
HETZNER_PORT=${HETZNER_PORT:-22}

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}⚠️  Warning: You're not on main branch (currently on $CURRENT_BRANCH)${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies if needed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm run test -- --run || {
    echo -e "${RED}❌ Tests failed! Aborting deployment.${NC}"
    exit 1
}

# Run linter
echo -e "${BLUE}🔍 Running linter...${NC}"
npm run lint || {
    echo -e "${RED}❌ Linting failed! Aborting deployment.${NC}"
    exit 1
}

# Build the site for custom domain (base: '/')
echo -e "${BLUE}🔨 Building site for custom domain...${NC}"
npm run build:custom-domain || {
    echo -e "${RED}❌ Build failed! Aborting deployment.${NC}"
    exit 1
}

# Show deployment info
echo -e "${BLUE}📡 Deploying to Hetzner via SCP...${NC}"
echo -e "   Host: ${HETZNER_USER}@${HETZNER_HOST}:${HETZNER_PORT}"
echo -e "   Path: ${HETZNER_REMOTE_PATH}"
echo ""

# Upload using scp (simpler, more reliable, allows interactive auth)
echo -e "${BLUE}⬆️  Uploading files...${NC}"

# Build scp options
SCP_OPTS="-r -P ${HETZNER_PORT} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

# Add SSH key if specified
if [ -n "$HETZNER_SSH_KEY" ]; then
    SCP_OPTS="$SCP_OPTS -i $HETZNER_SSH_KEY"
fi

# Determine target path
if [ "$HETZNER_REMOTE_PATH" != "." ] && [ -n "$HETZNER_REMOTE_PATH" ]; then
    TARGET_PATH="${HETZNER_USER}@${HETZNER_HOST}:${HETZNER_REMOTE_PATH}/"
else
    TARGET_PATH="${HETZNER_USER}@${HETZNER_HOST}:~/"
fi

# Check if password authentication is requested
if [ -n "$HETZNER_PASSWORD" ]; then
    # Use sshpass for password authentication
    if ! command -v sshpass &> /dev/null; then
        echo -e "${RED}❌ sshpass not found!${NC}"
        echo -e "${YELLOW}💡 Install it: brew install sshpass${NC}"
        echo -e "${YELLOW}   Or remove HETZNER_PASSWORD from .env to use interactive password prompt${NC}"
        exit 1
    fi
    echo -e "${BLUE}🔑 Using password authentication${NC}"
    
    # Export password for sshpass to use via environment variable (safer than -p)
    export SSHPASS="$HETZNER_PASSWORD"
    
    # Test connection first (SFTP-only compatible)
    echo -e "${BLUE}🔌 Testing SFTP connection...${NC}"
    if ! echo "quit" | sshpass -e sftp -P "$HETZNER_PORT" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=10 "${HETZNER_USER}@${HETZNER_HOST}" 2>&1 | grep -q "Connected to"; then
        echo -e "${RED}❌ Connection test failed!${NC}"
        echo -e "${YELLOW}💡 Please check your password in .env${NC}"
        echo -e "${YELLOW}💡 Or try removing HETZNER_PASSWORD to use SSH key interactively${NC}"
        unset SSHPASS
        exit 1
    fi
    echo -e "${GREEN}✅ Connection test passed${NC}"
    
    SCP_CMD="sshpass -e scp $SCP_OPTS"
else
    SCP_CMD="scp $SCP_OPTS"
fi

# Upload entire dist directory contents
# Using cd dist && scp to avoid creating extra "dist" folder on server
(cd dist && $SCP_CMD -r . "$TARGET_PATH") || {
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo -e "${YELLOW}💡 Troubleshooting:${NC}"
    echo -e "   1. Test SSH: ssh -p ${HETZNER_PORT} -i ${HETZNER_SSH_KEY} ${HETZNER_USER}@${HETZNER_HOST}"
    echo -e "   2. Check remote path exists and has write permissions"
    echo -e "   3. Verify credentials in .env file"
    exit 1
}

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Your site should be live at your domain now${NC}"
echo -e "${BLUE}💡 Tip: It may take a few minutes for changes to appear.${NC}"
