# Deploying Trade With LK Legist

Step-by-step for the Ubuntu server at `157.245.201.61`. Written for a first
deployment — run the commands in order, top to bottom.

---

## ⚠️ Read this first — this project deploys differently to your others

Your other projects are **Django + React**: React is built into a static `dist/`
folder and Apache serves the files directly.

**This project is Next.js.** It renders pages on the server, so it needs a
**Node process running all the time** (like your Django/gunicorn services), and
Apache just forwards traffic to it.

| Your Django/React projects | This project |
|---|---|
| Apache serves `frontend/dist/` | Apache forwards everything to Node |
| gunicorn on port 800X for the API | `next start` on port **8004** for everything |
| `python manage.py migrate` | `npm run db:migrate` |
| `createsuperuser` | `npm run db:seed` |

There is **no `dist/` folder** and no separate frontend/backend. One app.

**Node version:** the server has v20.20.2. Next.js 16 needs ≥ 20.9.0. ✅

---

## Step 1 — Create the database and its own user

Do **not** use the MySQL `root` account for the app. If the site is ever
compromised, root hands over every database on the server — including your live
CRMs. This creates a user that can only touch this one database.

```bash
ssh root@157.245.201.61
mysql -u root -p
```

Enter your MySQL root password when prompted, then:

```sql
CREATE DATABASE lk_legist CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'lk_legist'@'localhost' IDENTIFIED BY 'ChooseAStrongPassword123';

GRANT ALL PRIVILEGES ON lk_legist.* TO 'lk_legist'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> **Pick a password with no `@ : / ? # [ ] %` characters.** Those have special
> meaning inside a database URL and must otherwise be escaped. Letters and
> numbers are safest.

Check it worked:

```bash
mysql -u lk_legist -p lk_legist -e "SELECT 'connected' AS status;"
```

---

## Step 2 — Your database link (`DATABASE_URL`)

This is the "database link" the app needs. The format is:

```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

**On the server** (the app and MySQL are on the same machine, so the host is
`127.0.0.1`):

```
mysql://lk_legist:ChooseAStrongPassword123@127.0.0.1:3306/lk_legist
```

That's it — swap in the password you chose in Step 1.

### If your password contains special characters

They must be percent-encoded, or the link is read wrongly:

| Character | Write it as |
|---|---|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `#` | `%23` |
| `%` | `%25` |

Example — the password `Infokatta@7788` becomes:

```
mysql://root:Infokatta%407788@127.0.0.1:3306/lk_legist
```

(This is the same `@` problem your deployment guide flags for Python.)

---

## Step 3 — Upload the project

From **your Windows machine**, in the project folder:

```bash
cd "C:\Projects\IB_Websites\Trade With Lk"

scp -r Trade-With-LK-Legist root@157.245.201.61:/var/www/lk_legist
```

> If `scp` is slow, zip it first and skip `node_modules` — it is reinstalled on
> the server anyway and is the bulk of the size.

Alternatively, if the project is in git:

```bash
ssh root@157.245.201.61
cd /var/www
git clone <your-repo-url> lk_legist
```

---

## Step 4 — Install dependencies and create `.env`

```bash
ssh root@157.245.201.61
cd /var/www/lk_legist

# Remove anything copied up from Windows — these must be rebuilt on Linux
rm -rf node_modules .next

npm install
```

Generate a session secret and copy the output:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create the environment file:

```bash
nano .env
```

Paste this, replacing the two placeholder values:

```bash
DATABASE_URL="mysql://lk_legist:ChooseAStrongPassword123@127.0.0.1:3306/lk_legist"
SESSION_SECRET="paste-the-long-random-string-from-above"

# Your admin login — used once by the seed, then you can delete these lines
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="ChooseYourAdminPassword"

# Optional: live market news. Leave empty and the site shows built-in articles.
FINNHUB_API_KEY=""

NODE_ENV="production"
```

Save with `Ctrl+O`, `Enter`, then `Ctrl+X`.

Lock the file down so only root can read it:

```bash
chmod 600 .env
```

---

## Step 5 — Create the tables and load your content

```bash
cd /var/www/lk_legist

npx prisma migrate deploy   # creates the tables
npm run db:seed             # loads your website content + creates your login
```

You should see a list of ticks ending with `Admin user ready: you@example.com`.

> **`migrate deploy` vs `migrate dev`:** use `deploy` on the server. It only
> applies existing migrations and never prompts or resets data. `migrate dev`
> is for your own machine.

Once seeded, remove the admin password from `.env`:

```bash
nano .env    # delete the ADMIN_EMAIL and ADMIN_PASSWORD lines
```

---

## Step 6 — Build the site

```bash
cd /var/www/lk_legist
npm run build
```

Wait for `✓ Compiled successfully`. Quick test that it starts:

```bash
npx next start -p 8004
```

Open another terminal and check:

```bash
curl -I http://127.0.0.1:8004
```

You want `HTTP/1.1 200 OK`. Press `Ctrl+C` to stop the test.

---

## Step 7 — Keep it running with systemd

This is the equivalent of your `hrms` and `mtk` services.

```bash
nano /etc/systemd/system/lk-legist.service
```

Paste:

```ini
[Unit]
Description=Trade With LK Legist (Next.js)
After=network.target mariadb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/lk_legist
EnvironmentFile=/var/www/lk_legist/.env
Environment=NODE_ENV=production
Environment=PORT=8004
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

`www-data` must be able to read the app:

```bash
chown -R www-data:www-data /var/www/lk_legist
chmod 600 /var/www/lk_legist/.env
chown www-data:www-data /var/www/lk_legist/.env
```

Start it:

```bash
systemctl daemon-reload
systemctl enable lk-legist
systemctl start lk-legist
systemctl status lk-legist
```

You want `active (running)`. Live logs:

```bash
journalctl -u lk-legist -f
```

---

## Step 8 — Point Apache at it

Enable the proxy modules (harmless if already on):

```bash
a2enmod proxy proxy_http headers rewrite
```

Create the site config:

```bash
nano /etc/apache2/sites-available/lk-legist.conf
```

Paste, replacing `yourdomain.com`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com

    # Next.js renders on the server, so everything goes to Node.
    # Do NOT set a DocumentRoot — there are no static files to serve.
    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:8004/
    ProxyPassReverse / http://127.0.0.1:8004/

    # Pass the real visitor IP through
    RequestHeader set X-Forwarded-Proto "http"

    ErrorLog  ${APACHE_LOG_DIR}/lk-legist-error.log
    CustomLog ${APACHE_LOG_DIR}/lk-legist-access.log combined
</VirtualHost>
```

**Always test before reloading** — a broken config takes down your live CRMs too:

```bash
a2ensite lk-legist
apache2ctl configtest
```

Only if it says `Syntax OK`:

```bash
systemctl reload apache2
```

---

## Step 9 — DNS

In your domain registrar, add an **A record**:

| Type | Name | Value |
|---|---|---|
| A | `@` | `157.245.201.61` |
| A | `www` | `157.245.201.61` |

Wait a few minutes, then confirm it points at the server:

```bash
dig +short yourdomain.com
```

Do not continue to SSL until this returns `157.245.201.61`.

---

## Step 10 — HTTPS

```bash
certbot --apache -d yourdomain.com -d www.yourdomain.com
```

Choose **redirect HTTP to HTTPS** when asked. Then update the forwarded
protocol header so the app knows it is on HTTPS:

```bash
nano /etc/apache2/sites-available/lk-legist-le-ssl.conf
```

Change the line to:

```apache
RequestHeader set X-Forwarded-Proto "https"
```

```bash
apache2ctl configtest && systemctl reload apache2
```

---

## Final checks

```bash
systemctl status lk-legist          # active (running)
curl -I https://yourdomain.com      # 200 OK
```

In a browser:

- [ ] Home page loads, coin spins on its podium
- [ ] LK logo shows in the browser tab (favicon)
- [ ] Menu links jump to the right sections
- [ ] Contact form submits and shows a success message
- [ ] `/admin` redirects to `/admin/login`
- [ ] You can sign in with the email + password from Step 4
- [ ] Editing a section and saving changes the public site
- [ ] Your submitted message appears under **Contact Enquiries**
- [ ] Existing sites still work: `crm.infokatta.com`, `crm.tradingkatta.com`

---

## Deploying changes later

```bash
ssh root@157.245.201.61
cd /var/www/lk_legist

git pull                      # or scp the changed files up
npm install                   # only if package.json changed
npx prisma migrate deploy     # only if the schema changed
npm run build
systemctl restart lk-legist
```

The site is briefly down during `restart` (a second or two).

---

## Troubleshooting

**Service won't start**
```bash
journalctl -u lk-legist -n 50 --no-pager
```

**502 Bad Gateway from Apache** — Node isn't running or is on the wrong port:
```bash
systemctl status lk-legist
ss -tlnp | grep 8004
```

**"Can't reach database server"** — check the credentials work on their own:
```bash
mysql -u lk_legist -p lk_legist -e "SELECT 1;"
```
If the password contains `@` or `:`, it must be percent-encoded in `DATABASE_URL`
(see Step 2).

**Website loads but shows old content after an edit** — the app caches pages.
`systemctl restart lk-legist` clears it.

**Site shows content but the admin says the database isn't connected** — this is
by design. The public site falls back to its built-in content so visitors never
see a broken page. Fix `DATABASE_URL` and restart.

**Port 8004 already taken** — pick 8005, and change it in *both* the systemd
file (`Environment=PORT=`) and the Apache config (`ProxyPass`).

---

## Working on your own machine

MySQL on the server only accepts local connections (correctly — it isn't exposed
to the internet). To develop locally against it, open an SSH tunnel:

```bash
ssh -N -L 3307:127.0.0.1:3306 root@157.245.201.61
```

Leave that running, and in your **local** `.env` use port **3307**:

```bash
DATABASE_URL="mysql://lk_legist:ChooseAStrongPassword123@127.0.0.1:3307/lk_legist"
```

Then `npm run dev` as usual.

---

## Security follow-ups

1. **Rotate the MySQL root password** — it has been shared in plain text.
2. Keep `.env` at `chmod 600`; it is already git-ignored.
3. The app never uses the root MySQL account.
4. Consider a firewall so only 22/80/443 are reachable:
   ```bash
   ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw enable
   ```
