#!/bin/bash
# safe-merge-test-to-main.sh
# Merges the current branch into main, excluding all .md files
# Usage: ./scripts/safe-merge-test-to-main.sh

set -e

CURRENT_BRANCH=$(git branch --show-current)
TARGET_BRANCH="main"

if [ "$CURRENT_BRANCH" = "$TARGET_BRANCH" ]; then
    echo "Error: Already on $TARGET_BRANCH. Switch to the branch you want to merge."
    exit 1
fi

echo "Merging '$CURRENT_BRANCH' into '$TARGET_BRANCH'..."
echo "Excluding .md files from the merge."
echo ""

# Stage all changes from the current branch, but don't commit yet
git merge "$CURRENT_BRANCH" --no-commit --no-ff

# Unstage all .md files (removes them from the staging area)
git reset HEAD -- '*.md' '**/*.md'

# Also remove any .md files from the working tree that were just merged
git checkout -- '*.md' '**/*.md' 2>/dev/null || true

echo ""
echo "Done. Review the staged changes with: git status"
echo "If everything looks correct, complete with: git commit -m 'Merge $CURRENT_BRANCH into $TARGET_BRANCH'"
echo "To abort: git merge --abort"