#!/bin/bash
# Unified Deployment Script - Deploys to both Codeberg Pages and Hetzner
# Usage: ./deploy-all.sh [commit-message]

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Cleanup function to restore .env if needed
cleanup() {
    if [ -f .env.backup ]; then
        if [ ! -f .env ]; then
            echo "🔄 Restoring .env from backup..."
            mv .env.backup .env
        elif ! cmp -s .env .env.backup 2>/dev/null; then
            echo "🔄 Restoring .env from backup..."
            mv .env.backup .env
        else
            rm -f .env.backup
        fi
    fi
}

# Set trap to run cleanup on exit (success or failure)
trap cleanup EXIT

echo -e "${MAGENTA}🚀 Starting unified deployment to Codeberg Pages AND Hetzner...${NC}"
echo ""

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
    echo -e "${RED}⚠️  You have uncommitted changes in $CURRENT_BRANCH${NC}"
    git status -s
    read -p "Stash changes and continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git stash
        STASHED=true
    else
        exit 1
    fi
fi

# Check if .env file exists for Hetzner deployment
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}💡 Copy .env.example to .env and fill in your Hetzner credentials${NC}"
    exit 1
fi

# Backup .env before branch operations (safety measure)
echo -e "${BLUE}💾 Creating .env backup...${NC}"
cp .env .env.backup

# Load environment variables from .env for Hetzner
export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)

# Validate Hetzner credentials
if [ -z "$HETZNER_HOST" ] || [ -z "$HETZNER_USER" ]; then
    echo -e "${RED}❌ Error: Missing Hetzner credentials in .env${NC}"
    echo -e "${YELLOW}Required: HETZNER_HOST, HETZNER_USER${NC}"
    exit 1
fi

HETZNER_PORT=${HETZNER_PORT:-22}
HETZNER_REMOTE_PATH=${HETZNER_REMOTE_PATH:-.}

# Install dependencies if needed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Run tests once
echo -e "${BLUE}🧪 Running tests...${NC}"
npm run test -- --run || {
    echo -e "${RED}❌ Tests failed! Aborting deployment.${NC}"
    exit 1
}

# Run linter once
echo -e "${BLUE}🔍 Running linter...${NC}"
npm run lint || {
    echo -e "${RED}❌ Linting failed! Aborting deployment.${NC}"
    exit 1
}

echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}    DEPLOYMENT 1/2: Codeberg Pages${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════${NC}"
echo ""

# Build for Codeberg Pages (base: '/portfolio/')
echo -e "${BLUE}🔨 Building for Codeberg Pages (base: /portfolio/)...${NC}"
npm run build || {
    echo -e "${RED}❌ Build failed! Aborting deployment.${NC}"
    exit 1
}

# Save current commit hash
CURRENT_COMMIT=$(git rev-parse --short HEAD)
COMMIT_MSG="${1:-Deploy from commit $CURRENT_COMMIT}"

# Create a temporary directory and copy dist files for Codeberg
echo -e "${BLUE}📂 Preparing Codeberg deployment files...${NC}"
TEMP_DIR_CODEBERG=$(mktemp -d)
cp -r dist/* "$TEMP_DIR_CODEBERG/"

# Switch to pages branch
echo -e "${BLUE}🌿 Switching to pages branch...${NC}"

# Check if pages branch exists locally
if git show-ref --verify --quiet refs/heads/pages; then
    echo -e "${BLUE}📄 Local pages branch exists, switching to it...${NC}"
    git checkout pages
    git pull origin pages 2>/dev/null || echo "No remote pages branch to pull from"
else
    # Try to fetch remote pages branch
    if git fetch origin pages:pages 2>/dev/null; then
        echo -e "${BLUE}📄 Fetched pages branch from remote${NC}"
        git checkout pages
    else
        # Create new orphan pages branch
        echo -e "${BLUE}📄 Creating new pages branch...${NC}"
        git checkout --orphan pages
        git rm -rf . 2>/dev/null || true
        git commit --allow-empty -m "Initialize pages branch"
        git push origin pages
        echo -e "${GREEN}✅ Pages branch created and pushed${NC}"
    fi
fi

# Clean the branch (keep .git, .env, and .env.backup)
echo -e "${BLUE}🧹 Cleaning pages branch...${NC}"
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.env' ! -name '.env.backup' -exec rm -rf {} +

# Copy built files
echo -e "${BLUE}📋 Copying built files...${NC}"
cp -r "$TEMP_DIR_CODEBERG"/* .

# Create .nojekyll file
touch .nojekyll

# Create .gitignore to prevent .env from being committed to pages branch
echo -e "${BLUE}🔒 Ensuring .env is protected...${NC}"
cat > .gitignore << 'EOF'
.env
.env.backup
.env.*
EOF

# Double-check: remove .env from staging if it somehow got added
git reset HEAD .env .env.backup 2>/dev/null || true

# Check if there are any changes
if [[ -z $(git status -s) ]]; then
    echo -e "${GREEN}✅ No changes to deploy to Codeberg (site is up to date)${NC}"
else
    # Add all files (except .env which is gitignored)
    git add -A
    
    # Final safety check: unstage .env files if somehow staged
    git reset HEAD .env .env.backup .env.* 2>/dev/null || true
    
    # Verify .env is not in the commit
    if git diff --cached --name-only | grep -qE "\.env"; then
        echo -e "${RED}❌ SECURITY ERROR: .env file detected in staging area!${NC}"
        echo -e "${RED}Aborting deployment to prevent credential leak.${NC}"
        git checkout "$CURRENT_BRANCH"
        rm -rf "$TEMP_DIR_CODEBERG"
        exit 1
    fi

    # Commit
    git commit -m "$COMMIT_MSG [skip ci]"

    # Push to pages branch
    echo -e "${BLUE}⬆️  Pushing to Codeberg pages branch...${NC}"
    git push origin pages || {
        echo -e "${RED}❌ Failed to push to pages branch!${NC}"
        git checkout "$CURRENT_BRANCH"
        rm -rf "$TEMP_DIR_CODEBERG"
        [ "$STASHED" = true ] && git stash pop
        exit 1
    }
    
    echo -e "${GREEN}✅ Codeberg Pages deployment successful!${NC}"
fi

# Return to original branch
echo -e "${BLUE}🔙 Returning to $CURRENT_BRANCH branch...${NC}"
git checkout "$CURRENT_BRANCH"

# Cleanup Codeberg temp dir
rm -rf "$TEMP_DIR_CODEBERG"

echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}    DEPLOYMENT 2/2: Hetzner${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════${NC}"
echo ""

# Verify node_modules still exists and is valid after branch switch
if [ ! -f "node_modules/.bin/tsc" ]; then
    echo -e "${YELLOW}⚠️  Dependencies missing after branch switch, reinstalling...${NC}"
    npm ci --quiet
fi

# Build for Hetzner (base: '/')
echo -e "${BLUE}🔨 Building for Hetzner (base: /)...${NC}"
npm run build:custom-domain || {
    echo -e "${RED}❌ Build failed! Aborting deployment.${NC}"
    exit 1
}

# Deploy to Hetzner
echo -e "${BLUE}📡 Deploying to Hetzner via SCP...${NC}"
echo -e "   Host: ${HETZNER_USER}@${HETZNER_HOST}:${HETZNER_PORT}"
echo -e "   Path: ${HETZNER_REMOTE_PATH}"
echo ""

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
(cd dist && $SCP_CMD -r . "$TARGET_PATH") || {
    echo -e "${RED}❌ Hetzner deployment failed!${NC}"
    echo -e "${YELLOW}💡 Codeberg Pages was deployed successfully, but Hetzner failed.${NC}"
    [ "$STASHED" = true ] && git stash pop
    exit 1
}

echo -e "${GREEN}✅ Hetzner deployment successful!${NC}"

# Restore stashed changes if any
[ "$STASHED" = true ] && {
    echo -e "${BLUE}📦 Restoring stashed changes...${NC}"
    git stash pop
}

echo ""
echo -e "${MAGENTA}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ALL DEPLOYMENTS SUCCESSFUL!${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌐 Codeberg Pages: https://lxrs.codeberg.page/portfolio/${NC}"
echo -e "${GREEN}🌐 Hetzner: Your custom domain${NC}"
echo -e "${BLUE}💡 Tip: It may take a few minutes for changes to appear.${NC}"
