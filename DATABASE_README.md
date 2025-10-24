# PIFAH Database Export Files

Complete PostgreSQL database backup for PIFAH Project Management System.

---

## 📦 **Files Included**

| File | Size | Lines | Description |
|------|------|-------|-------------|
| `pifah_complete.sql` | 901 KB | 362 | **Complete database** (schema + data) |
| `pifah_schema.sql` | 6.7 KB | 258 | **Schema only** (table structures) |
| `pifah_data.sql` | 895 KB | 126 | **Data only** (INSERT statements) |
| `database_import.bat` | 5 KB | - | **Windows import script** |
| `DATABASE_EXPORT_IMPORT_GUIDE.md` | - | - | **Complete instructions** |

---

## ⚡ **Quick Start (Windows Server)**

### **Option 1: Automated Import (Recommended)**

1. **Copy these files to Windows Server:**
   - `pifah_complete.sql`
   - `database_import.bat`

2. **Run the import script:**
   ```cmd
   # Right-click → "Run as Administrator"
   database_import.bat
   ```

3. **Follow the prompts:**
   - Select option 1 (complete database)
   - Enter PostgreSQL password

4. **Done!**

---

### **Option 2: Manual Import**

```cmd
# Create database
psql -U postgres -c "CREATE DATABASE pifah;"

# Import data
psql -U postgres -d pifah -f pifah_complete.sql

# Verify
psql -U postgres -d pifah -c "SELECT COUNT(*) FROM users;"
```

---

## 📊 **Database Contents**

### **Current Data (as of October 24, 2025)**

#### **Users (4 total)**
| Email | Role | Account Type |
|-------|------|--------------|
| gashmicky28@gmail.com | Admin | Your account |
| focal@pifah.org | Focal Person | Test account |
| approver@pifah.org | Approver | Test account |
| admin@pifah.org | Admin | Test account |

#### **Projects (8 total)**
| Project | Country | Status | Pillar |
|---------|---------|--------|--------|
| National Health Diagnostic Centers Network | Kenya | Approved | Diagnostics & Imaging |
| West African Pharmaceutical Manufacturing Hub | Ghana | Approved | Local Manufacturing |
| AI-Powered Telemedicine Platform | South Africa | Approved | Digital Health & AI |
| Regional Hospital Infrastructure Modernization | Nigeria | Approved | Health Infrastructure |
| Medical Education Excellence Program | Ethiopia | Approved | Human Capital Development |
| test 1 | South Africa | Under Review | Diagnostics & Imaging |
| New Test With Tati | Cameroon | Pending | Human Capital Development |
| Test Project | South Africa | Pending | Health Infrastructure |

#### **Settings**
- Custom logo uploaded (base64 encoded in database)
- Banner image support configured

---

## 📋 **Database Schema**

### **Tables**

1. **users**
   - User authentication and role management
   - Fields: id, email, firstName, lastName, role, createdAt, updatedAt

2. **projects**
   - Complete project information
   - Fields: 40+ fields covering all PIFAH requirements
   - Includes workflow tracking (submitted, reviewed, approved)

3. **sessions**
   - User session storage for Replit Auth
   - Fields: sid, sess (JSONB), expire

4. **notifications**
   - User notifications system
   - Fields: id, userId, projectId, type, message, read, createdAt

5. **countries**
   - African countries master data
   - Fields: id, name, capital, population, area, region, gdp, languages

6. **settings**
   - Application settings
   - Fields: id, logoUrl, bannerImageUrl, updatedAt

---

## 🔒 **Security Notes**

### **⚠️ Important: These files contain:**
- User email addresses
- Project information
- Application settings
- Base64 encoded images (~800KB logo data)

### **🔐 Recommendations:**
- Store backups securely
- Do NOT commit to public repositories
- Use encrypted storage for production backups
- Limit access to authorized personnel only

### **Authentication:**
This application uses **Replit Auth** (OAuth):
- No passwords stored in database
- Test accounts are for structure reference only
- Users authenticate via Replit platform

---

## 🛠️ **Technical Details**

### **PostgreSQL Version**
- Dumped from: PostgreSQL 16.9
- Compatible with: PostgreSQL 12+

### **Export Options Used**
- `--no-owner` - No ownership information
- `--no-privileges` - No access privileges
- `--column-inserts` - Named column INSERT statements (more portable)

### **Special Features**
- UUID generation (`gen_random_uuid()`)
- Array columns (PostgreSQL specific)
- JSONB data type (sessions)
- Timestamp with timezone
- Foreign key constraints

---

## 📖 **Documentation**

For detailed instructions, see:
- **DATABASE_EXPORT_IMPORT_GUIDE.md** - Complete import/export guide
- **DEPLOYMENT_GUIDE.md** - Windows Server deployment
- **nginx.conf** - Nginx configuration
- **replit.md** - Project architecture

---

## 🔄 **Common Use Cases**

### **1. Fresh Windows Server Setup**
Use: `pifah_complete.sql`

### **2. Migrate Data Only**
Use: `pifah_data.sql` (requires schema already exists)

### **3. Create Empty Database Structure**
Use: `pifah_schema.sql`

### **4. Daily Backup**
Export new dump with timestamp

### **5. Disaster Recovery**
Use latest `pifah_complete.sql`

---

## ✅ **Verification After Import**

Run these commands to verify successful import:

```sql
-- Check tables exist
\dt

-- Count users
SELECT COUNT(*) FROM users;
-- Expected: 4

-- Count projects
SELECT COUNT(*) FROM projects;
-- Expected: 8

-- Check settings
SELECT logo_url IS NOT NULL as has_logo FROM settings;
-- Expected: true

-- List user roles
SELECT role, COUNT(*) FROM users GROUP BY role;
-- Expected: admin (2), Focal Person (1), Approver (1)
```

---

## 🆘 **Troubleshooting**

### **Error: relation "users" already exists**
You're importing into a database that already has tables.

**Solutions:**
1. Drop existing tables first (⚠️ destroys data)
2. Create a new empty database
3. Use `pifah_data.sql` to update data only

### **Error: permission denied**
Run import as PostgreSQL superuser or database owner.

### **Large file import is slow**
This is normal for the 901KB file with base64 logo data.
Estimated time: 10-30 seconds on typical hardware.

---

## 📞 **Support**

Need help? Check:
1. **DATABASE_EXPORT_IMPORT_GUIDE.md** - Detailed instructions
2. **DEPLOYMENT_GUIDE.md** - Full deployment guide
3. PostgreSQL logs - Check for specific error messages

---

**Export Information:**
- **Date:** October 24, 2025
- **Source:** Replit Development Environment
- **Database:** pifah
- **PostgreSQL Version:** 16.9
- **Total Size:** 901 KB (uncompressed)
- **Compression:** Not compressed (use gzip for smaller size)

---

## 🎯 **Next Steps**

1. ✅ Read **DATABASE_EXPORT_IMPORT_GUIDE.md**
2. ✅ Copy files to Windows Server
3. ✅ Run `database_import.bat`
4. ✅ Configure environment variables
5. ✅ Start your PIFAH application
6. ✅ Test login and functionality

---

**Ready to deploy!** 🚀
