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

## Candidate Login System

### Features Implemented

#### 1. **Candidate Login Component**
- **Location**: `ui/src/components/auth/CandidateLogin.jsx`
- **Features**:
  - Two-step authentication (Roll Number + OTP)
  - Captcha verification
  - AES decryption of OTP data
  - Email and SMS OTP delivery
  - Automatic token generation

#### 2. **Crypto Utilities**
- **Location**: `ui/src/utils/cryptoUtils.js`
- **Features**:
  - AES-CBC decryption matching C# SecurityService
  - Base64 and hex string conversion
  - Web Crypto API integration

#### 3. **Login Selector**
- **Location**: `ui/src/components/auth/LoginSelector.jsx`
- **Features**:
  - Toggle between Candidate and Admin login
  - Language selection
  - Unified UI experience

### Candidate API Endpoints

#### Step 1: Send OTP
**Endpoint**: `POST /api/Candidates/Login`

**Request Body**:
```json
{
  "rollNumber": "string"
}
```

**Success Response**: Encrypted string containing:
```json
{
  "ID": 123,
  "otp": "123456",
  "expires": "2024-01-01T12:00:00Z"
}
```

#### Step 2: Get Token
**Endpoint**: `POST /api/Candidates/GetToken`

**Request Body**:
```json
{
  "UID": 123,
  "IsVerified": true
}
```

**Success Response**: JWT Token string

### Environment Configuration

Add the AES key to your `.env` file:
```env
VITE_AES_KEY = YOUR_HEX_AES_KEY_HERE
```

**Important**: The AES key must match the one used in your C# backend configuration.

### Security Features
- AES-CBC encryption/decryption
- OTP expiration validation
- Captcha verification
- JWT token authentication
- Session-based storage

## Next Steps
1. ✅ Admin login system implemented
2. ✅ Candidate login system implemented
3. Configure AES key in environment variables
4. Test both login systems
5. Ensure backend APIs are running and accessible

## Dependencies Added
- `zustand`: State management library for authentication store

## Files Modified/Created
- `ui/src/stores/authStore.js` (new)
- `ui/src/components/auth/AdminLogin.jsx` (updated)
- `ui/src/hooks/useAuth.js` (updated)
- `ui/src/App.jsx` (updated)
- `ui/src/services/notification/NotificationService.jsx` (fixed import)
- `ui/.env` (fixed typo)