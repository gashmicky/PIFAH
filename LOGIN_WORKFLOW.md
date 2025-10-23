# PIFAH Internal User Login Workflow

## Overview
The PIFAH system uses **Replit Auth** for authentication with role-based access control. There are 4 user roles with different permissions.

## User Roles

### 1. **Admin** (admin@pifah.org)
**Full system access** including:
- View, review, and manage all projects
- Access to admin dashboard (`/admin`)
- Project approval workflow management
- Country management and color customization
- Application settings (upload logo/banner)
- CSV and PDF export of all project data
- User management capabilities

### 2. **Focal Person** (focal@pifah.org)
**Regional review responsibilities**:
- Review and approve regional project submissions
- Access to focal person dashboard (`/focal-person`)
- View all projects with map and table views
- Filter and search capabilities
- Provide focal person review/approval
- Export project data for their region

### 3. **Approver** (approver@pifah.org)
**Final approval authority**:
- Provide final approval for reviewed projects
- Access to approver dashboard (`/approver`)
- View all projects (approved and pending)
- Map and table view of project distribution
- Filter and search capabilities
- Export approved project data

### 4. **Public** (No login required)
**Public access**:
- View approved projects on interactive Africa map
- Browse project statistics by PIFAH pillar
- View REC (Regional Economic Communities) statistics
- Submit new project proposals (requires registration)

## Login Process

### For Public Users (Registration & Submission)
1. Visit the PIFAH portal home page
2. Click **"Register"** or **"Login"** button in the header
3. Use Replit Auth to authenticate
4. After login, you can submit project proposals
5. Access the submission form at `/submit-project`

### For Internal Users (Admin, Focal Person, Approver)

#### Step 1: Navigate to Login
- Go to the PIFAH portal: `https://[your-replit-domain].replit.dev`
- Click **"Login"** button in the header
- Or directly access: `https://[your-replit-domain].replit.dev/api/login`

#### Step 2: Authenticate with Replit
- The system uses **Replit Auth** integration
- Click **"Continue with Replit"**
- Authenticate using your Replit account

#### Step 3: Role-Based Redirect
After successful authentication, you'll be automatically redirected based on your role:

- **Admin** → `/admin` (Admin Dashboard)
- **Focal Person** → `/focal-person` (Focal Person Dashboard)
- **Approver** → `/approver` (Approver Dashboard)
- **Public** → `/` (Map Page with submission access)

## Test Accounts

For testing purposes, the following accounts are available:

```
Admin Account:
Email: admin@pifah.org
Role: Administrator

Focal Person Account:
Email: focal@pifah.org
Role: Focal Person (Regional Reviewer)

Approver Account:
Email: approver@pifah.org
Role: Final Approver
```

**Note**: These accounts use Replit Auth. Contact your system administrator for access credentials.

## Project Workflow

### Submission Flow
1. **Public User** submits project via `/submit-project`
   - Status: `pending`
   
2. **Focal Person** reviews submission
   - Access via `/focal-person`
   - Reviews regional projects
   - Updates status to `under_review`
   - Provides focal review approval
   
3. **Approver** provides final approval
   - Access via `/approver`
   - Reviews projects with focal approval
   - Updates status to `approved`
   - Project becomes public on the map

### Dashboard Features

#### Admin Dashboard (`/admin`)
- **Statistics Overview**: Total projects, approved, pending review
- **Projects Table**: Complete project list with all fields
- **Advanced Filtering**: By status, country, PIFAH pillar, search
- **Export Options**: CSV and PDF format
- **Settings**: Logo upload, banner upload, color customization
- **Country Management**: View and manage African countries data

#### Focal Person Dashboard (`/focal-person`)
- **Statistics**: Pending review, under review, reviewed counts
- **Projects Table**: Projects requiring focal review
- **Map View**: Interactive visualization of project distribution
- **Filter & Search**: Find projects quickly
- **Review Actions**: Approve or request changes

#### Approver Dashboard (`/approver`)
- **Statistics**: Pending approval, approved, total projects
- **Projects Table**: Projects awaiting final approval
- **Map View**: Approved projects visualization
- **Filter & Search**: Advanced project filtering
- **Approval Actions**: Final approval or rejection

## Export Features

Both **CSV** and **PDF** export are available in all dashboards:

### CSV Export
- Includes all project fields
- Complete audit trail (submitted by, reviewed by, approved by)
- Timestamps for all workflow steps
- Suitable for data analysis and record keeping

### PDF Export
- Professional formatted document
- Key project information in table format
- PIFAH branding with green color scheme
- Ideal for reports and presentations
- Landscape orientation for better readability

## Security & Permissions

- **Session-Based Authentication**: Secure PostgreSQL session store
- **Role-Based Access Control**: Route-level protection
- **API Protection**: All endpoints require authentication
- **Workflow Tracking**: Complete audit trail of all actions

## Support

For login issues or access requests:
1. Contact your PIFAH system administrator
2. Verify your Replit account is properly configured
3. Ensure you're using the correct test account email
4. Check that your role has been assigned in the database

## Technical Notes

- Authentication powered by **Replit Auth** integration
- User roles stored in PostgreSQL `users` table
- Session management via `connect-pg-simple`
- Frontend route protection in `App.tsx`
- Backend API authentication in `server/routes.ts`
