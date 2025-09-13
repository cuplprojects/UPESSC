# AES Key Configuration Guide

## Problem
The candidate login system requires the AES encryption key to decrypt OTP data from your backend. Currently getting error:
```
AES key data must be 128 or 256 bits
```

## Solution

### Step 1: Find Your AES Key in Backend
Your AES key is configured in your C# backend. Look for it in:

1. **appsettings.json** or **appsettings.Development.json**:
```json
{
  "AES_Key": "your-hex-key-here"
}
```

2. **Environment variables** or **configuration files**

### Step 2: Validate Key Format
The key should be:
- **32 characters** for AES-128 (16 bytes)
- **64 characters** for AES-256 (32 bytes)
- **Hexadecimal format** (0-9, A-F)

Example valid keys:
```
AES-128: 1234567890ABCDEF1234567890ABCDEF
AES-256: 1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF
```

### Step 3: Add to Frontend Environment
Update your `ui/.env` file:
```env
VITE_AES_KEY = YOUR_ACTUAL_HEX_KEY_HERE
```

### Step 4: Restart Development Server
After updating the .env file:
```bash
cd ui
npm run dev
```

## Testing Without AES Key (Temporary)

If you want to test the UI flow without the AES key, you can temporarily enable the fallback mode in `CandidateLogin.jsx`:

1. Find the commented section in the `handleVerifyOTP` function
2. Uncomment the lines that create a temporary candidate login
3. This will allow you to test the UI flow without backend decryption

**Note**: This is only for development testing and should be removed in production.

## Backend API Endpoints Used

1. **Send OTP**: `POST /api/Candidates/Login`
   - Input: `{ "rollNumber": "string" }`
   - Output: Encrypted string containing OTP data

2. **Get Token**: `POST /api/Candidates/GetToken`
   - Input: `{ "UID": number, "IsVerified": true }`
   - Output: JWT token string

## Current Status

✅ OTP is being sent successfully (you received it)
✅ Loading state issue fixed (removed global loading interference)
❌ AES key configuration needed for OTP verification

## Quick Fix Applied

**Problem**: Loading screen was covering the OTP input field
**Solution**: Removed global `setLoading` calls that were interfering with the UI

**Problem**: AES key validation error
**Solution**: Added better error handling and validation

## Testing Tools

1. **AES Key Validator**: Open `test-aes-key.html` in your browser to validate your AES key format
2. **API Tester**: Use `test-api.html` to test API connectivity

The system is working correctly - you just need to configure the correct AES key!