# PIFAH Database Export & Import Guide

Complete guide for backing up and restoring your PIFAH PostgreSQL database.

---

## 📦 **Available Database Files**

You now have 3 SQL dump files:

### 1. **pifah_complete.sql** (901 KB)
- **Contains:** Full database (schema + data)
- **Use for:** Complete backup and restoration
- **Recommended for:** Moving to Windows Server

### 2. **pifah_schema.sql** (6.7 KB)
- **Contains:** Table structures only (no data)
- **Use for:** Creating empty database structure
- **Recommended for:** Fresh installations

### 3. **pifah_data.sql** (895 KB)
- **Contains:** Data only (INSERT statements)
- **Use for:** Importing data into existing schema
- **Recommended for:** Data migration only

---

## 📊 **Current Database Contents**

Your database contains:

- **4 Users:**
  - Admin: gashmicky28@gmail.com (your account)
  - Focal Person: focal@pifah.org
  - Approver: approver@pifah.org
  - Admin: admin@pifah.org

- **8 Projects:**
  - 5 template/demo projects (approved)
  - 3 user-submitted projects (various statuses)

- **Custom Settings:**
  - Uploaded logo (base64 encoded)

---

## 🔄 **Importing on Windows Server**

### **Method 1: Using the Batch Script (Easiest)**

1. **Copy Files to Windows:**
   - `pifah_complete.sql`
   - `database_import.bat`

2. **Run the Script:**
   ```cmd
   # Right-click database_import.bat → "Run as Administrator"
   # Or from Command Prompt:
   cd C:\path\to\files
   database_import.bat
   ```

3. **Follow Prompts:**
   - Enter PostgreSQL connection details
   - Select option 1 (complete database)
   - Enter PostgreSQL password

4. **Done!** Your database is now imported.

---

### **Method 2: Manual Import via Command Line**

#### **Step 1: Create Database**

```cmd
psql -U postgres
```

```sql
-- Create database
CREATE DATABASE pifah;

-- Exit psql
\q
```

#### **Step 2: Import Complete Database**

```cmd
cd C:\path\to\sql\files

psql -U postgres -d pifah -f pifah_complete.sql
```

Enter your PostgreSQL password when prompted.

#### **Step 3: Verify Import**

```cmd
psql -U postgres -d pifah
```

```sql
-- Check tables
\dt

-- Check users
SELECT email, role FROM users;

-- Check projects
SELECT id, project_title, status FROM projects;

-- Exit
\q
```

---

### **Method 3: Using pgAdmin (GUI)**

1. **Open pgAdmin**
2. **Right-click** on Databases → **Create** → **Database**
3. **Name:** `pifah`
4. **Click** Save
5. **Right-click** on `pifah` database → **Restore**
6. **Format:** Plain (SQL file)
7. **Filename:** Browse to `pifah_complete.sql`
8. **Click** Restore

---

## 🔙 **Exporting Database (Backup)**

### **On Replit (Current Development)**

```bash
# Complete database
pg_dump $DATABASE_URL --no-owner --no-privileges --column-inserts > backup_complete.sql

# Schema only
pg_dump $DATABASE_URL --schema-only --no-owner > backup_schema.sql

# Data only
pg_dump $DATABASE_URL --data-only --no-owner --column-inserts > backup_data.sql
```

### **On Windows Server (Production)**

```cmd
# Set password (optional)
set PGPASSWORD=YourPassword

# Complete database
pg_dump -U postgres -d pifah --no-owner --column-inserts > backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql

# With compression
pg_dump -U postgres -d pifah --no-owner --column-inserts | gzip > backup.sql.gz
```

---

## 📝 **Important Notes**

### **Passwords & Security**

⚠️ **The exported SQL files contain:**
- User information (emails)
- Project data
- Settings (including base64 encoded logo)

🔒 **Security recommendations:**
- Do NOT commit these files to public repositories
- Store backups in secure locations
- Use encrypted storage for sensitive data

### **User Passwords**

This application uses **Replit Auth** (OAuth), so:
- No traditional passwords stored in database
- Users authenticate via Replit accounts
- Test accounts (focal@pifah.org, etc.) are for reference only

### **Environment Variables**

After importing database, configure `.env`:

```env
DATABASE_URL=postgresql://postgres:YourPassword@localhost:5432/pifah
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YourPassword
PGDATABASE=pifah
SESSION_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

---

## 🛠️ **Troubleshooting**

### **Error: Database "pifah" does not exist**

**Solution:** Create database first:
```cmd
psql -U postgres -c "CREATE DATABASE pifah;"
```

### **Error: Permission denied**

**Solution:** Run as Administrator or use postgres superuser

### **Error: psql command not found**

**Solution:** Add PostgreSQL bin to PATH:
```cmd
set PATH=%PATH%;C:\Program Files\PostgreSQL\16\bin
```

Or set permanently:
1. Control Panel → System → Advanced → Environment Variables
2. Edit PATH, add: `C:\Program Files\PostgreSQL\16\bin`

### **Error: Role "postgres" does not exist**

**Solution:** Use the username you created during PostgreSQL installation:
```cmd
psql -U YourUsername -d pifah -f pifah_complete.sql
```

### **Warning: errors ignored on restore**

This is normal for `--no-owner` dumps. The data is still imported correctly.

---

## 🔄 **Common Workflows**

### **Workflow 1: Fresh Windows Server Setup**

```cmd
# 1. Create database
psql -U postgres -c "CREATE DATABASE pifah;"

# 2. Import complete database
psql -U postgres -d pifah -f pifah_complete.sql

# 3. Verify
psql -U postgres -d pifah -c "SELECT COUNT(*) FROM users;"
```

### **Workflow 2: Update Production with Development Data**

```cmd
# On Replit (development)
pg_dump $DATABASE_URL --no-owner --column-inserts > latest_backup.sql

# Transfer file to Windows Server

# On Windows (production)
# Backup current database first!
pg_dump -U postgres -d pifah > backup_before_update.sql

# Drop and recreate (CAUTION!)
psql -U postgres -c "DROP DATABASE pifah;"
psql -U postgres -c "CREATE DATABASE pifah;"

# Import new data
psql -U postgres -d pifah -f latest_backup.sql
```

### **Workflow 3: Scheduled Backups**

Create `backup_pifah.bat`:

```batch
@echo off
set BACKUP_DIR=C:\backups\pifah
set BACKUP_FILE=%BACKUP_DIR%\pifah_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.sql

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

pg_dump -U postgres -d pifah --no-owner --column-inserts > "%BACKUP_FILE%"

echo Backup completed: %BACKUP_FILE%
```

**Schedule with Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 2 AM
4. Action: Start program → `C:\path\to\backup_pifah.bat`

---

## 📋 **Database Schema Overview**

Your PIFAH database includes:

### **Tables:**
1. **users** - User accounts with roles
2. **projects** - Project submissions
3. **sessions** - User sessions (Replit Auth)
4. **notifications** - User notifications
5. **countries** - African countries data
6. **settings** - App settings (logo, banner)

### **Key Features:**
- UUID primary keys
- Foreign key relationships
- Array columns (PostgreSQL specific)
- Timestamp tracking
- JSONB session data

---

## ✅ **Verification Checklist**

After import, verify:

- [ ] All tables created (`\dt` in psql)
- [ ] User count matches (4 users)
- [ ] Project count matches (8 projects)
- [ ] Settings imported (logo data)
- [ ] No errors in import output
- [ ] Application connects successfully
- [ ] Can login with existing accounts
- [ ] Projects display on map

---

## 🆘 **Need Help?**

**Common commands:**

```cmd
# List databases
psql -U postgres -l

# Connect to database
psql -U postgres -d pifah

# List tables
\dt

# Describe table
\d users

# Count records
SELECT COUNT(*) FROM users;

# Exit psql
\q
```

---

**Export Date:** October 24, 2025

**Database Version:** PostgreSQL 16.9

**Total Size:** ~901 KB (complete dump)
