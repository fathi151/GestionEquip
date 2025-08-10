# User Management System - Updated Structure

## Overview
The user management system has been updated to support a more comprehensive user structure for equipment management. The system now includes multiple related entities and maintains backward compatibility with existing authentication functionality.

## Entity Structure

### 1. User Entity
**Primary Key**: `registrationNumber` (String)

**Fields**:
- `registrationNumber`: Unique identifier for the user
- `firstName`: User's first name
- `lastName`: User's last name
- `phoneNumber`: Contact phone number
- `cin`: National ID number
- `grade`: User's grade/level
- `employment`: Employment type
- `college`: Associated college/institution
- `startingDate`: Date when user started
- `dob`: Date of birth
- `recruitmentDate`: Date of recruitment

**Relationships**:
- `position`: Many-to-One with Position entity
- `job`: Many-to-One with Job entity
- `harbor`: Many-to-One with Harbor entity
- `status`: Many-to-One with Status entity (JsonIgnored)

**Legacy Fields** (maintained for backward compatibility):
- `username`: Login username
- `email`: User email (unique)
- `password`: Encrypted password
- `role`: User role
- `image`: Profile image
- `poste`: Position (legacy)
- `Secteur`: Sector (legacy)

### 2. Status Entity
**Primary Key**: `id` (Long)
- `title`: Status title

### 3. Position Entity
**Primary Key**: `id` (String)
- `title`: Position title

### 4. Job Entity
**Primary Key**: `id` (Long)
- `title`: Job title

### 5. Harbor Entity
**Primary Key**: `id` (Long)
- `name`: Harbor name
- `location`: Harbor location

### 6. Agent Entity
**Primary Key**: `id` (Long, auto-generated)
- `email`: Agent email
- `gender`: Agent gender
- `phoneNumber`: Agent phone number
- `user`: One-to-One relationship with User
- `username`: Login username (unique)
- `password`: Login password
- `role`: Agent role

## API Endpoints

### Authentication Endpoints (Existing - Preserved)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password
- `POST /auth/ajouterUser` - Add user

### User Management Endpoints (New)
- `GET /api/users/all` - Get all users
- `GET /api/users/{registrationNumber}` - Get user by registration number
- `POST /api/users/create` - Create new user
- `PUT /api/users/update/{registrationNumber}` - Update user
- `DELETE /api/users/delete/{registrationNumber}` - Delete user

### Status Management
- `GET /api/users/statuses` - Get all statuses
- `POST /api/users/statuses` - Create new status

### Position Management
- `GET /api/users/positions` - Get all positions
- `POST /api/users/positions` - Create new position

### Job Management
- `GET /api/users/jobs` - Get all jobs
- `POST /api/users/jobs` - Create new job

### Harbor Management
- `GET /api/users/harbors` - Get all harbors
- `POST /api/users/harbors` - Create new harbor

### Agent Management
- `GET /api/users/agents` - Get all agents
- `POST /api/users/agents` - Create new agent
- `GET /api/users/agents/by-username/{username}` - Get agent by username
- `GET /api/users/agents/by-email/{email}` - Get agent by email

## Migration Notes

### Key Changes:
1. **Primary Key Change**: User entity now uses `registrationNumber` (String) instead of auto-generated Long ID
2. **New Relationships**: User now has relationships with Position, Job, Harbor, and Status entities
3. **Date Fields**: Added multiple date fields with JSON formatting
4. **Agent Entity**: New entity for managing agent-specific information

### Backward Compatibility:
- All existing authentication endpoints remain functional
- UserDTO updated to include both `id` (Long) and `registrationNumber` (String) for compatibility
- Legacy fields (`username`, `email`, `password`, `role`, etc.) are preserved in User entity

### Database Migration Required:
- Update User table structure to include new fields
- Create new tables: Status, Position, Job, Harbor, Agent
- Update foreign key relationships
- Migrate existing user IDs to registration numbers

## Usage Examples

### Creating a Complete User:
```json
{
  "registrationNumber": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "cin": "12345678",
  "grade": "Senior",
  "employment": "Full-time",
  "college": "Engineering College",
  "startingDate": "2024-01-15",
  "dob": "1990-05-20",
  "recruitmentDate": "2024-01-01",
  "email": "john.doe@company.com",
  "username": "johndoe",
  "password": "hashedpassword",
  "role": "USER"
}
```

### Creating Related Entities:
```json
// Status
{
  "id": 1,
  "title": "Active"
}

// Position
{
  "id": "POS001",
  "title": "Software Engineer"
}

// Job
{
  "id": 1,
  "title": "Developer"
}

// Harbor
{
  "id": 1,
  "name": "Main Harbor",
  "location": "Port City"
}
```

## Services and Repositories

### New Repositories:
- `StatusRepository`
- `PositionRepository`
- `JobRepository`
- `HarborRepository`
- `AgentRepository`

### Updated Repositories:
- `UserRepository`: Now extends `JpaRepository<User, String>`
- `user2Repository`: Updated to match new User structure

### New Services:
- `UserService`: Comprehensive service for all user-related operations

## Testing Recommendations

1. Test all existing authentication flows to ensure backward compatibility
2. Test new user creation with relationships
3. Test CRUD operations for all new entities
4. Verify database constraints and relationships
5. Test migration from old user structure to new structure
