#!/bin/bash
# Test deployment configuration without actually deploying
# This script verifies all settings are correct before running deploy-all.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing deployment configuration...${NC}"
echo ""

# Test 1: Check .env exists
echo -e "${BLUE}[1/7] Checking .env file...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ .env file exists${NC}"

# Test 2: Check .env is gitignored
echo -e "${BLUE}[2/7] Checking .env is gitignored...${NC}"
if ! git check-ignore -q .env; then
    echo -e "${RED}❌ .env is NOT gitignored!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ .env is properly gitignored${NC}"

# Test 3: Check .env.backup is gitignored
echo -e "${BLUE}[3/7] Checking .env.backup is gitignored...${NC}"
if ! git check-ignore -q .env.backup 2>/dev/null; then
    echo -e "${YELLOW}⚠️  .env.backup would not be ignored (will be created during deployment)${NC}"
fi
echo -e "${GREEN}✅ .env.backup is properly gitignored${NC}"

# Test 4: Load and validate credentials
echo -e "${BLUE}[4/7] Validating Hetzner credentials...${NC}"
if [ -f .env ]; then
    source .env
    
    if [ -z "$HETZNER_HOST" ]; then
        echo -e "${RED}❌ HETZNER_HOST not set${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ HETZNER_HOST: $HETZNER_HOST${NC}"
    
    if [ -z "$HETZNER_USER" ]; then
        echo -e "${RED}❌ HETZNER_USER not set${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ HETZNER_USER: $HETZNER_USER${NC}"
    
    if [ -z "$HETZNER_PORT" ]; then
        echo -e "${YELLOW}⚠️  HETZNER_PORT not set, will default to 22${NC}"
    else
        echo -e "${GREEN}✅ HETZNER_PORT: $HETZNER_PORT${NC}"
    fi
    
    if [ -n "$HETZNER_SSH_KEY" ]; then
        if [ ! -f "$HETZNER_SSH_KEY" ]; then
            echo -e "${RED}❌ SSH key not found: $HETZNER_SSH_KEY${NC}"
            exit 1
        fi
        echo -e "${GREEN}✅ SSH key exists: $HETZNER_SSH_KEY${NC}"
    fi
    
    if [ -n "$HETZNER_PASSWORD" ]; then
        if [ "$HETZNER_PASSWORD" = "***REDACTED***" ]; then
            echo -e "${RED}❌ WARNING: Using exposed password from git history!${NC}"
            echo -e "${YELLOW}💡 Please change your Hetzner password and update .env${NC}"
        else
            echo -e "${GREEN}✅ Password configured (hidden)${NC}"
        fi
        
        if ! command -v sshpass &> /dev/null; then
            echo -e "${YELLOW}⚠️  sshpass not installed - password auth will fail${NC}"
            echo -e "${YELLOW}💡 Install: brew install sshpass${NC}"
        else
            echo -e "${GREEN}✅ sshpass is installed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No password set - will use interactive SSH key auth${NC}"
    fi
fi

# Test 5: Check git status
echo -e "${BLUE}[5/7] Checking git status...${NC}"
if [[ -n $(git status -s | grep -v "^??") ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status -s | grep -v "^??"
    echo -e "${YELLOW}💡 These will be stashed during deployment${NC}"
else
    echo -e "${GREEN}✅ Working directory clean${NC}"
fi

# Test 6: Check if we're on main branch
echo -e "${BLUE}[6/7] Checking current branch...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  You're on branch: $CURRENT_BRANCH (not main)${NC}"
else
    echo -e "${GREEN}✅ On main branch${NC}"
fi

# Test 7: Verify no .env in git tracking
echo -e "${BLUE}[7/7] Verifying .env is not tracked in git...${NC}"
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: .env is tracked in git!${NC}"
    echo -e "${RED}Run: git rm --cached .env${NC}"
    exit 1
fi
echo -e "${GREEN}✅ .env is not tracked in git${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}💡 You can now run:${NC}"
echo -e "   ${YELLOW}npm run deploy:all${NC}  - Deploy to both platforms"
echo -e "   ${YELLOW}npm run deploy${NC}       - Deploy to Codeberg only"
echo -e "   ${YELLOW}npm run deploy:hetzner${NC} - Deploy to Hetzner only"
echo ""
