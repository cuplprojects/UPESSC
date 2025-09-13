# Admin Login Setup Documentation

## Overview
This document describes the admin login functionality implemented in the application.

## Features Implemented

### 1. Zustand Store for State Management
- **Location**: `ui/src/stores/authStore.js`
- **Storage**: Session Storage (data persists only during browser session)
- **Features**:
  - User authentication state
  - Admin role verification
  - Automatic logout functionality
  - Session persistence

### 2. Admin Login Component
- **Location**: `ui/src/components/auth/AdminLogin.jsx`
- **Route**: `/admin`
- **Features**:
  - Clean, responsive UI matching application theme
  - Form validation
  - Loading states
  - Error handling with notifications
  - Automatic redirect to home page on successful login

### 3. Updated Authentication Hook
- **Location**: `ui/src/hooks/useAuth.js`
- **Features**:
  - Supports both legacy student login and new admin login
  - Admin role detection
  - Unified logout functionality

## API Requirements

### Admin Login Endpoint
The admin login component expects the following API endpoint:

**Endpoint**: `POST /api/Users/Login`

**Request Body**:
```json
{
  "userName": "string",
  "password": "string"
}
```

**Success Response**:
```json
{
  "uid": 0,
  "userName": "string",
  "name": "string", 
  "password": "string",
  "admin": true
}
```

**Important**: The response must include `"admin": true` for the user to be granted admin access.

### Error Handling
- 401/403: Invalid credentials or access denied
- 500: Server error
- Network errors are handled gracefully

## Usage

### Accessing Admin Login
1. Navigate to `/admin` route
2. Enter admin username and password
3. On successful authentication, user is redirected to `/` (home page)
4. Admin status is stored in session storage

### Admin Authentication Flow
1. User submits login form
2. API call to `/Login` endpoint
3. Response validation (must have `admin: true`)
4. Store user data in Zustand store (persisted to session storage)
5. Show success notification
6. Redirect to home page

### Logout
- Clears both session storage and Zustand store
- Redirects to root page
- Works for both admin and student users

## Security Features
- Session-based storage (clears on browser close)
- Admin role verification
- Input validation
- CSRF protection through API service
- Automatic token expiration handling

## Integration with Existing Code
- Maintains compatibility with existing student login system
- Uses existing notification service
- Follows established UI/UX patterns
- Integrates with existing routing structure

## Environment Configuration
Make sure your `.env` file has the correct API configuration:

```env
VITE_APP_STAGE = development
VITE_API_BASE_URL_LOCAL = http://localhost:7036
VITE_API_BASE_URL_LIVE = http://192.168.1.24:99
```

## Next Steps
1. Implement the `/Login` endpoint in your backend API
2. Ensure the endpoint returns the required response format with `admin: true` for admin users
3. Test the login functionality
4. Implement candidate login system when ready

## Dependencies Added
- `zustand`: State management library for authentication store

## Files Modified/Created
- `ui/src/stores/authStore.js` (new)
- `ui/src/components/auth/AdminLogin.jsx` (updated)
- `ui/src/hooks/useAuth.js` (updated)
- `ui/src/App.jsx` (updated)
- `ui/src/services/notification/NotificationService.jsx` (fixed import)
- `ui/.env` (fixed typo)