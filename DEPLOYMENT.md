# GitHub Pages Deployment Guide

## Quick Setup

### Method 1: Enable GitHub Pages in Settings (Recommended)

1. Go to your repository: https://github.com/razavioo/energic
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"** (NOT "Deploy from a branch")
4. Click **Save**
5. Go to **Actions** tab and wait for the workflow to complete (2-3 minutes)
6. Your site will be available at: https://razavioo.github.io/energic/

**Important**: You MUST manually enable GitHub Pages in Settings first. The workflow cannot enable it automatically without repository admin permissions.

### Method 2: Alternative Deployment (If Method 1 doesn't work)

If you encounter issues with GitHub Actions, you can use the alternative workflow that deploys to `gh-pages` branch:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **"Deploy from a branch"**
3. Select branch: **gh-pages**
4. Select folder: **/ (root)**
5. Click **Save**
6. The alternative workflow (deploy-gh-pages.yml) will automatically deploy on each push

## Automatic Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:
- Builds the project on every push to `main` branch
- Deploys to GitHub Pages
- Updates the live site automatically

## Manual Deployment

If you need to manually trigger a deployment:

1. Go to **Actions** tab in your repository
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** button
4. Select the branch (usually `main`)
5. Click **"Run workflow"**

## Troubleshooting

### Site shows 404

- Make sure GitHub Pages is enabled in Settings → Pages
- Check that the Source is set to "GitHub Actions"
- Verify the workflow completed successfully in the Actions tab
- Wait a few minutes after the workflow completes

### Build fails

- Check the Actions tab for error messages
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version compatibility

### Assets not loading

- Check that `vite.config.js` has the correct `base` path (`/energic/`)
- Verify all asset paths are relative
- Clear browser cache and try again

## Verification

After deployment, verify the site is working:
- Visit: https://razavioo.github.io/energic/
- Check browser console for any errors
- Test all interactive features

