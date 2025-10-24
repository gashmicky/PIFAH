# PIFAH Windows Server Deployment Guide

Complete guide for deploying the PIFAH application on Windows Server with Nginx.

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Choose LTS version for Windows

2. **PostgreSQL** (v14 or higher)
   - Download: https://www.postgresql.org/download/windows/
   - Remember the password you set during installation

3. **Nginx for Windows**
   - Download: http://nginx.org/en/download.html
   - Choose the stable Windows version

4. **Git for Windows** (optional, for version control)
   - Download: https://git-scm.com/download/win

---

## 🚀 Step 1: Install and Configure Node.js Application

### 1.1 Create Application Directory

```cmd
mkdir C:\inetpub\pifah
cd C:\inetpub\pifah
```

### 1.2 Copy Your Application Files

Copy all your project files to `C:\inetpub\pifah\`

### 1.3 Install Dependencies

```cmd
cd C:\inetpub\pifah
npm install
```

### 1.4 Create Environment File

Create `.env` file in `C:\inetpub\pifah\.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YourPassword@localhost:5432/pifah
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YourPassword
PGDATABASE=pifah

# Session Secret (change this to a random string)
SESSION_SECRET=change-this-to-a-long-random-string-for-production

# OpenAI API Key (for chatbot)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Node Environment
NODE_ENV=production

# Port (Nginx will proxy to this)
PORT=5000

# Replit Domain (change to your domain)
REPLIT_DOMAINS=yourdomain.com,www.yourdomain.com
```

---

## 🗄️ Step 2: Set Up PostgreSQL Database

### 2.1 Create Database

Open **SQL Shell (psql)** from Start Menu:

```sql
-- Login as postgres user
-- Enter password when prompted

-- Create database
CREATE DATABASE pifah;

-- Connect to database
\c pifah

-- Verify connection
\l
```

### 2.2 Initialize Database Schema

In your application directory:

```cmd
npm run db:push
```

This creates all the necessary tables.

---

## 🌐 Step 3: Install and Configure Nginx

### 3.1 Install Nginx

1. Download Nginx from http://nginx.org/en/download.html
2. Extract to `C:\nginx`
3. Your Nginx directory should look like:
   ```
   C:\nginx\
   ├── conf\
   ├── logs\
   ├── html\
   └── nginx.exe
   ```

### 3.2 Configure Nginx

Copy the provided `nginx.conf` to `C:\nginx\conf\nginx.conf`

**Edit the configuration:**

1. Open `C:\nginx\conf\nginx.conf`
2. Replace `yourdomain.com` with your actual domain
3. If using SSL, configure the certificate paths

### 3.3 Test Nginx Configuration

```cmd
cd C:\nginx
nginx -t
```

You should see:
```
nginx: the configuration file C:\nginx/conf/nginx.conf syntax is ok
nginx: configuration file C:\nginx/conf/nginx.conf test is successful
```

### 3.4 Start Nginx

```cmd
cd C:\nginx
start nginx
```

**Check if Nginx is running:**

```cmd
tasklist | findstr nginx
```

You should see nginx.exe processes.

---

## 🔄 Step 4: Run Node.js Application with PM2

### 4.1 Install PM2 Globally

```cmd
npm install -g pm2
```

### 4.2 Create PM2 Ecosystem File

Create `ecosystem.config.js` in `C:\inetpub\pifah\`:

```javascript
module.exports = {
  apps: [{
    name: 'pifah',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

### 4.3 Start Application with PM2

```cmd
cd C:\inetpub\pifah
pm2 start ecosystem.config.js
```

### 4.4 Save PM2 Configuration

```cmd
pm2 save
```

### 4.5 Configure PM2 to Start on Boot

```cmd
pm2 startup windows
```

Follow the instructions provided by the command.

---

## 🔒 Step 5: Configure Firewall

### Open Required Ports

1. Open **Windows Defender Firewall**
2. Click **Advanced settings**
3. Create **Inbound Rules** for:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 5432 (PostgreSQL - only if remote access needed)

**PowerShell commands:**

```powershell
# Allow HTTP
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow

# Allow HTTPS
New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

---

## 🔐 Step 6: SSL Certificate Setup (Optional but Recommended)

### Option A: Self-Signed Certificate (Testing)

```cmd
# Install OpenSSL for Windows first
# Download from: https://slproweb.com/products/Win32OpenSSL.html

# Generate certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout C:\nginx\ssl\private.key -out C:\nginx\ssl\certificate.crt
```

### Option B: Let's Encrypt (Production)

Use **win-acme** for Windows:
1. Download from: https://www.win-acme.com/
2. Run the setup wizard
3. Follow instructions to generate certificates

### Enable HTTPS in Nginx

1. Uncomment the HTTPS server block in `nginx.conf`
2. Update certificate paths
3. Reload Nginx:
   ```cmd
   nginx -s reload
   ```

---

## 🎯 Step 7: Verify Deployment

### 7.1 Check Services

**Node.js Application:**
```cmd
pm2 status
pm2 logs pifah
```

**Nginx:**
```cmd
tasklist | findstr nginx
```

**PostgreSQL:**
```cmd
# Open Services (services.msc)
# Look for "postgresql-x64-XX"
```

### 7.2 Test Application

1. Open browser: `http://localhost`
2. Or: `http://yourdomain.com`
3. Check if PIFAH application loads
4. Test login functionality
5. Test AI chatbot (WebSocket)

---

## 🔄 Step 8: Maintenance Commands

### Node.js Application

```cmd
# View logs
pm2 logs pifah

# Restart app
pm2 restart pifah

# Stop app
pm2 stop pifah

# View status
pm2 status

# Monitor resources
pm2 monit
```

### Nginx

```cmd
# Test configuration
nginx -t

# Reload (zero downtime)
nginx -s reload

# Stop
nginx -s stop

# Start
start nginx

# View error logs
type C:\nginx\logs\error.log

# View access logs
type C:\nginx\logs\access.log
```

### Database

```cmd
# Access PostgreSQL
psql -U postgres -d pifah

# Backup database
pg_dump -U postgres pifah > C:\backups\pifah_backup.sql

# Restore database
psql -U postgres pifah < C:\backups\pifah_backup.sql
```

---

## 🔧 Troubleshooting

### Issue: Cannot connect to application

**Check:**
1. Node.js app is running: `pm2 status`
2. Nginx is running: `tasklist | findstr nginx`
3. Firewall allows port 80/443
4. Check Nginx error log: `type C:\nginx\logs\error.log`

### Issue: 502 Bad Gateway

**Solution:**
1. Check if Node.js is running on port 5000
2. Verify `.env` has correct PORT=5000
3. Check PM2 logs: `pm2 logs pifah`

### Issue: Database connection error

**Solution:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Test connection: `psql -U postgres -d pifah`

### Issue: WebSocket not working (AI Chatbot)

**Solution:**
1. Verify Nginx WebSocket configuration (Upgrade headers)
2. Check browser console for WebSocket errors
3. Ensure proxy_buffering is off in nginx.conf

---

## 📊 Monitoring and Logs

### Application Logs

```cmd
# PM2 logs
pm2 logs pifah

# PM2 log files
C:\inetpub\pifah\logs\pm2-error.log
C:\inetpub\pifah\logs\pm2-out.log
```

### Nginx Logs

```cmd
C:\nginx\logs\access.log
C:\nginx\logs\error.log
```

### Database Logs

```cmd
# PostgreSQL data directory (usually)
C:\Program Files\PostgreSQL\XX\data\log\
```

---

## 🔄 Update Workflow

When you make code changes on Replit:

### 1. On Development (Replit)
```bash
# Commit changes
git add .
git commit -m "Your changes"
git push origin main
```

### 2. On Production (Windows Server)
```cmd
# Navigate to app directory
cd C:\inetpub\pifah

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Update database schema (if changed)
npm run db:push

# Restart application
pm2 restart pifah

# Check status
pm2 status
pm2 logs pifah --lines 50
```

---

## 🎉 Success Checklist

- [ ] Node.js installed and working
- [ ] PostgreSQL installed and database created
- [ ] Nginx installed and configured
- [ ] Application files deployed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Database schema initialized (`npm run db:push`)
- [ ] PM2 running application
- [ ] Nginx proxying to Node.js
- [ ] Firewall ports opened
- [ ] Application accessible via browser
- [ ] AI Chatbot working (WebSocket)
- [ ] SSL certificate configured (production)

---

## 📞 Support

If you encounter issues:
1. Check logs (PM2, Nginx, PostgreSQL)
2. Verify all services are running
3. Test each component individually
4. Check firewall settings
5. Review environment variables

---

**Deployment Date:** _________________

**Server IP:** _________________

**Domain:** _________________

**Admin Contact:** _________________
