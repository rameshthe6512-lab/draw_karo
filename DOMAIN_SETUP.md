# Domain Setup for drawkaro.io

## Step 1: Register Your Domain

1. Choose a registrar:
   - [Namecheap](https://www.namecheap.com) - Good pricing, beginner-friendly
   - [GoDaddy](https://www.godaddy.com)
   - [Google Domains](https://domains.google)
   - [Cloudflare](https://www.cloudflare.com/products/registrar/)

2. Search for `drawkaro.io`
3. Add to cart and purchase
4. Go to your domain dashboard

## Step 2: Configure DNS Records

### Option A: Point to GitHub Pages (Recommended)

**For apex domain (drawkaro.io):**

Add A Records:
```
Host: @
Type: A
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**For www subdomain (www.drawkaro.io):**

Add CNAME Record:
```
Host: www
Type: CNAME
Value: YOUR_USERNAME.github.io
```

### Option B: Using Cloudflare (More Control)

1. Add domain to Cloudflare
2. Update nameservers to Cloudflare's
3. Add DNS records:
   - A record for `drawkaro.io` → GitHub IPs
   - CNAME for `www` → YOUR_USERNAME.github.io

## Step 3: Configure GitHub Pages

1. Go to GitHub repo → Settings → Pages
2. Under "Custom domain", enter: `drawkaro.io`
3. Check "Enforce HTTPS"
4. GitHub automatically creates `CNAME` file and sets up SSL

**Note:** GitHub's automated workflow already handles the CNAME setup through the GitHub Actions deploy.yml file.

## Step 4: Verify DNS

Wait 5-10 minutes, then run:

```bash
# Check A records
dig drawkaro.io

# Check CNAME records
dig www.drawkaro.io

# Should resolve to GitHub Pages IPs
```

Expected output for `dig drawkaro.io`:
```
drawkaro.io. 3600 IN A 185.199.108.153
drawkaro.io. 3600 IN A 185.199.109.153
drawkaro.io. 3600 IN A 185.199.110.153
drawkaro.io. 3600 IN A 185.199.111.153
```

## Step 5: Enable HTTPS

GitHub Pages automatically:
1. Detects custom domain
2. Requests SSL certificate (Let's Encrypt)
3. Enables HTTPS
4. Redirects HTTP → HTTPS

**Timeline:** Takes ~10-30 minutes after DNS setup

## Step 6: Verify Setup

```bash
# Test domain
curl https://drawkaro.io

# Should return your HTML with status 200
# No SSL errors
```

Check in browser:
- ✅ https://drawkaro.io loads
- ✅ HTTPS padlock shows
- ✅ No certificate warnings
- ✅ www.drawkaro.io redirects to drawkaro.io (optional)

## Troubleshooting

### Domain not resolving

1. **Check DNS propagation:** https://www.whatsmydns.net
2. **Verify registrar settings:**
   - Login to registrar dashboard
   - Confirm A records are set
   - Wait 24-48 hours for full propagation

### HTTPS not activating

1. Go to GitHub Pages settings
2. Ensure custom domain is set correctly
3. Check "Enforce HTTPS" checkbox
4. Wait 10-30 minutes for cert generation
5. GitHub sends email when certificate is ready

### www subdomain not working

Add DNS CNAME record:
```
Host: www
Type: CNAME
Value: USERNAME.github.io
```

### Redirects not working

GitHub Pages automatically handles:
- `drawkaro.io` ↔ `www.drawkaro.io`
- `http://` → `https://`

If not working:
1. Clear browser cache
2. Wait for DNS propagation
3. Check browser console for errors

## Email Configuration (Optional)

To use email with your domain:

1. Add MX records (varies by email provider)
2. Popular options:
   - [Google Workspace](https://workspace.google.com)
   - [Mailgun](https://www.mailgun.com)
   - [SendGrid](https://sendgrid.com)

## Advanced: Subdomain for Backend

To use `api.drawkaro.io` for backend:

1. Add A record:
   ```
   Host: api
   Type: A or CNAME
   Value: railway-deployment-url
   ```

2. Update frontend `.env.production`:
   ```
   VITE_API_URL=https://api.drawkaro.io
   ```

3. Configure Railway:
   - Add custom domain: `api.drawkaro.io`
   - Railway provides instructions for SSL

## Resources

- [GitHub Pages Custom Domain Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Troubleshooting](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)
- [Registrar Comparison](https://www.hostinger.com/blog/best-domain-registrars)
