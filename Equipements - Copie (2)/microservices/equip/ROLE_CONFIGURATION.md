# Role Configuration Guide

## Overview
This document describes the role-based access control (RBAC) configuration for the Equipment Microservice.

## Available Roles

### 1. USER
- **Description**: Standard User
- **Access**: Basic equipment functions
- **Permissions**: View equipment, create basic requests

### 2. ADMIN
- **Description**: Administrator
- **Access**: Full system access
- **Permissions**: All equipment operations, user management

### 3. DSI
- **Description**: Direction des Systèmes d'Information
- **Access**: IT management functions
- **Permissions**: Equipment management, system configuration

### 4. DAG
- **Description**: Direction Administrative et Générale
- **Access**: Administrative functions
- **Permissions**: Equipment allocation, administrative reports

### 5. JURIDIQUE
- **Description**: Service Juridique
- **Access**: Legal compliance functions
- **Permissions**: Equipment compliance, legal reports

## Security Configuration

### URL Patterns
- `/auth/**` - Public access (authentication endpoints)
- `/api/users/**` - Public access (user management)
- `/images/**` - Public access (static resources)
- `/equi/**` - Requires any of: USER, ADMIN, DSI, DAG, JURIDIQUE roles

### Method-Level Security
Method-level security is enabled with `@PreAuthorize` annotations:
- `@PreAuthorize("hasRole('ADMIN')")` - Admin only
- `@PreAuthorize("hasRole('ADMIN') or hasRole('DSI')")` - Admin or DSI

## API Endpoints

### Role Management
- `GET /api/roles/all` - Get all available roles
- `GET /api/roles/details` - Get detailed role information
- `GET /api/roles/current` - Get current user's role and permissions
- `GET /api/roles/validate/{roleCode}` - Validate a role code
- `GET /api/roles/stats` - Get role statistics (Admin/DSI only)

### Equipment Testing
- `GET /equi/test-auth` - Test authentication and view current user info

## Testing the Configuration

### 1. Start the Application
```bash
mvn spring-boot:run
```

### 2. Login and Get JWT Token
Make a POST request to `/auth/login` with user credentials.

### 3. Test Authentication
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/equi/test-auth
```

### 4. Test Role Access
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/roles/current
```

## Database Setup

### User Table
Ensure users have proper roles assigned:
```sql
UPDATE users SET role = 'ADMIN' WHERE registration_number = 'admin_user';
UPDATE users SET role = 'USER' WHERE registration_number = 'regular_user';
UPDATE users SET role = 'DSI' WHERE registration_number = 'dsi_user';
```

### Agent Table (if using Agent-based authentication)
```sql
UPDATE agents SET role = 'ADMIN' WHERE email = 'admin@example.com';
UPDATE agents SET role = 'USER' WHERE email = 'user@example.com';
```

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Check if user has the required role
   - Verify JWT token is valid
   - Ensure role is properly set in database

2. **Role Not Found**
   - Check if role exists in the allowed roles list
   - Verify role spelling (case-sensitive)
   - Check CustomUserDetailsService logs

3. **Authentication Failed**
   - Verify JWT token format
   - Check token expiration
   - Ensure user exists in database

### Debug Information
The application logs authentication details:
- User loading with role information
- JWT token validation
- Authority assignment

Check console output for debug messages starting with:
- "Loading user: ... with role: ..."
- "User authenticated: ..."
- "User authorities: ..."

## Role Assignment Best Practices

1. **Default Role**: New users get USER role by default
2. **Role Validation**: Invalid roles are automatically converted to USER
3. **Case Insensitive**: Role codes are case-insensitive but stored in uppercase
4. **Null Handling**: Null or empty roles default to USER

## Security Features

1. **JWT Authentication**: Stateless authentication using JWT tokens
2. **Role-Based Access**: URL and method-level security
3. **CORS Configuration**: Configured for frontend integration
4. **Password Encoding**: BCrypt password encoding
5. **Method Security**: Fine-grained access control with annotations
