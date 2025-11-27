# Deployment Guide - Razmeni

Complete guide for deploying Razmeni to Vercel or other platforms.

## Prerequisites

- GitHub account (recommended)
- Vercel account (free tier works)
- Git installed locally (optional)

## Option 1: Deploy to Vercel (Recommended)

### Quick Deploy (No Git Required)

1. **Prepare the folder**
   ```bash
   cd /Users/unitar/Desktop/ClaudeCode/razmeni-ui-mock
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Login to Vercel
   - Select "Set up and deploy"
   - Project name: `razmeni` (or custom)
   - Framework: None (select "Other")
   - Build Command: (leave empty)
   - Output Directory: (leave empty, or type `.`)
   - Confirm and deploy

5. **Done!** You'll get a URL like: `https://razmeni.vercel.app`

### Deploy via GitHub

1. **Create Git Repository**
   ```bash
   cd /Users/unitar/Desktop/ClaudeCode/razmeni-ui-mock
   git init
   git add .
   git commit -m "Initial commit - Razmeni v2.0"
   ```

2. **Push to GitHub**
   ```bash
   # Create new repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/razmeni.git
   git branch -M main
   git push -u origin main
   ```

3. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `razmeni` repository
   - Click "Deploy"

4. **Configure (if needed)**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: (leave empty)

5. **Deploy!** Vercel will automatically deploy and give you a URL

### Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain (e.g., `razmeni.rs`)
4. Update DNS records as instructed
5. SSL is automatic and free

## Option 2: Deploy to Netlify

### Via Drag & Drop

1. Go to https://app.netlify.com/drop
2. Drag the `razmeni-ui-mock` folder
3. Done! You'll get a URL like `https://random-name.netlify.app`

### Via GitHub

1. Push code to GitHub (see steps above)
2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Connect GitHub and select repository
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or type `.`)
6. Click "Deploy site"

### Custom 404 Page

Netlify configuration (create `netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

## Option 3: Deploy to GitHub Pages

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/razmeni.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages"
   - Source: Deploy from a branch
   - Branch: `main`, folder: `/ (root)`
   - Save

3. **Access at**: `https://YOUR_USERNAME.github.io/razmeni/`

## Option 4: Deploy to Cloudflare Pages

1. Push code to GitHub
2. Go to https://pages.cloudflare.com
3. Create a new project
4. Connect GitHub repository
5. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`
6. Deploy

## Post-Deployment Checklist

### Test All Features

- [ ] Homepage loads correctly
- [ ] Can register new account
- [ ] Can login with demo account
- [ ] Browse listings works
- [ ] Search and filters work
- [ ] Can create new listing
- [ ] Can edit/delete own listings
- [ ] Can propose trades
- [ ] Can accept/decline trades
- [ ] Messaging system works
- [ ] Favorites add/remove works
- [ ] Profile editing works
- [ ] Notifications show correct counts
- [ ] 404 page shows on bad URLs
- [ ] Mobile responsive works
- [ ] No console errors

### Performance Check

- [ ] Lighthouse score > 90
- [ ] Images load quickly
- [ ] No layout shifts
- [ ] Smooth animations

### SEO (Optional)

Add to `<head>` of each page:
```html
<meta name="description" content="Razmeni - Moderna platforma za razmenu proizvoda i usluga u Srbiji">
<meta property="og:title" content="Razmeni">
<meta property="og:description" content="Razmenjujte proizvode i usluge bez novca">
<meta property="og:image" content="/og-image.png">
```

## Environment Variables (Future Backend)

When adding backend, you'll need:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"

# File Upload
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# API Keys
GOOGLE_MAPS_API_KEY="..."
```

## Monitoring (Optional)

### Add Analytics

**Google Analytics:**
```html
<!-- Add to <head> of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Plausible Analytics (privacy-friendly):**
```html
<script defer data-domain="razmeni.rs" src="https://plausible.io/js/script.js"></script>
```

### Error Tracking

**Sentry:**
```html
<script src="https://browser.sentry-cdn.com/..." crossorigin="anonymous"></script>
<script>
  Sentry.init({ dsn: 'your-dsn' });
</script>
```

## Continuous Deployment

### Vercel/Netlify
- Automatically deploys on `git push`
- Preview deployments for branches
- Rollback available

### Manual Updates
```bash
# Make changes
git add .
git commit -m "Update: ..."
git push

# Vercel/Netlify auto-deploys
```

## Troubleshooting

### Issue: 404 on refresh
**Solution**: Check `vercel.json` or `netlify.toml` redirects

### Issue: Images not loading
**Solution**: Check image URLs are absolute or relative correctly

### Issue: LocalStorage not persisting
**Solution**:
- Check browser settings allow localStorage
- HTTPS required for some features
- Private browsing mode clears on close

### Issue: Slow loading
**Solution**:
- Enable Vercel/Netlify CDN
- Optimize images
- Add lazy loading

## Security Notes

### Current (Frontend Only)
- No sensitive data exposed
- LocalStorage only
- No API keys needed
- Safe to deploy publicly

### Future (With Backend)
- Use environment variables for secrets
- Never commit `.env` files
- Enable CORS properly
- Use HTTPS only
- Implement rate limiting
- Sanitize user inputs
- Use prepared statements (SQL injection)

## Scaling Considerations

### Static (Current)
- Can handle unlimited traffic
- Free on Vercel/Netlify
- CDN automatically enabled

### With Backend
- Add caching (Redis)
- Database connection pooling
- Image CDN (Cloudinary)
- Load balancing
- Background job queues

## Costs

### Current (Static)
- **Vercel Free Tier**: Free
- **Netlify Free Tier**: Free
- **GitHub Pages**: Free
- **Cloudflare Pages**: Free

### With Backend
- **Vercel Pro**: $20/month
- **PostgreSQL (Neon)**: Free - $19/month
- **Image Storage (Cloudinary)**: Free - $99/month
- **Email (SendGrid)**: Free - $20/month

## Support

For issues or questions:
1. Check browser console for errors
2. Test in incognito mode
3. Check deployment logs
4. Review `TEST.md` for testing steps

## Next Steps

1. ✅ Deploy to Vercel/Netlify
2. ✅ Test all features
3. ✅ Share demo URL
4. [ ] Plan backend architecture
5. [ ] Set up PostgreSQL database
6. [ ] Implement API endpoints
7. [ ] Add real authentication
8. [ ] Integrate payment (if needed)

---

**Ready to deploy!** Choose your preferred option above and follow the steps.

Good luck! 🚀
