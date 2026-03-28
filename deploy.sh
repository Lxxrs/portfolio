#!/bin/bash
# Manual Deployment Script for Codeberg Pages
# Usage: ./deploy.sh [commit-message]

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Cleanup function to restore branch and stash on any exit
STASHED=false
CURRENT_BRANCH=""
TEMP_DIR=""
cleanup() {
    local exit_code=$?
    if [ -n "$CURRENT_BRANCH" ] && [ "$(git branch --show-current)" != "$CURRENT_BRANCH" ]; then
        git checkout "$CURRENT_BRANCH" 2>/dev/null || true
    fi
    [ -n "$TEMP_DIR" ] && rm -rf "$TEMP_DIR"
    [ "$STASHED" = true ] && git stash pop 2>/dev/null || true
    exit $exit_code
}
trap cleanup EXIT

echo -e "${BLUE}🚀 Starting deployment to Codeberg Pages...${NC}"

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
        trap - EXIT
        exit 1
    fi
fi

# Install dependencies if needed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
yarn install --immutable 2>/dev/null || yarn install

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
yarn test --run || {
    echo -e "${RED}❌ Tests failed! Aborting deployment.${NC}"
    exit 1
}

# Run linter
echo -e "${BLUE}🔍 Running linter...${NC}"
yarn lint || {
    echo -e "${RED}❌ Linting failed! Aborting deployment.${NC}"
    exit 1
}

# Build the site
echo -e "${BLUE}🔨 Building site...${NC}"
yarn build || {
    echo -e "${RED}❌ Build failed! Aborting deployment.${NC}"
    exit 1
}

# Save current commit hash
CURRENT_COMMIT=$(git rev-parse --short HEAD)
COMMIT_MSG="${1:-Deploy from commit $CURRENT_COMMIT}"

# Create a temporary directory and copy dist files
echo -e "${BLUE}📂 Preparing deployment files...${NC}"
TEMP_DIR=$(mktemp -d)
cp -r dist/* "$TEMP_DIR/"
echo "Files staged in $TEMP_DIR"

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

# Clean the branch (keep .git)
echo -e "${BLUE}🧹 Cleaning pages branch...${NC}"
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# Copy built files
echo -e "${BLUE}📋 Copying built files...${NC}"
cp -r "$TEMP_DIR"/* .

# Create .nojekyll file
touch .nojekyll

# Check if there are any changes
if [[ -z $(git status -s) ]]; then
    echo -e "${GREEN}✅ No changes to deploy (site is up to date)${NC}"
    exit 0
fi

# Add all files
git add -A

# Show what will be committed
echo -e "${BLUE}📝 Changes to be deployed:${NC}"
git status -s

# Commit
git commit -m "$COMMIT_MSG [skip ci]"

# Push to pages branch
echo -e "${BLUE}⬆️  Pushing to pages branch...${NC}"
git push origin pages || {
    echo -e "${RED}❌ Failed to push to pages branch!${NC}"
    exit 1
}

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Your site will be available at: https://lxrs.codeberg.page/portfolio/${NC}"
echo -e "${BLUE}💡 Tip: It may take a few minutes for changes to appear.${NC}"
