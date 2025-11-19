# GitHub Pages Deployment Guide

## Quick Setup

1. Go to your repository: https://github.com/razavioo/energic
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Save the settings
5. Wait 2-3 minutes for the workflow to complete
6. Your site will be available at: https://razavioo.github.io/energic/

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

