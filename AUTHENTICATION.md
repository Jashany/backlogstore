# Authentication System Documentation

This document explains how authentication works in the Backlog Store application, covering both the server-side implementation and the Next.js frontend integration.

## Overview

The authentication system uses a **dual-token approach** with:
- **Access Tokens**: Short-lived JWT tokens (15 minutes) stored in memory
- **Refresh Tokens**: Long-lived tokens (7 days) stored in HTTP-only cookies

This approach provides a secure balance between user experience and security.

## Security Features

### Server-Side Security (Express.js)

1. **Password Hashing**: bcrypt with salt rounds (10)
2. **HTTP-only Cookies**: Refresh tokens are stored in HTTP-only cookies to prevent XSS attacks
3. **Token Rotation**: Refresh tokens are rotated on each refresh operation
4. **Token Revocation**: Old refresh tokens are revoked when new ones are issued
5. **CSRF Protection**: SameSite cookie attribute (`lax` in dev, `none` in production)
6. **Secure Cookie Flag**: Enabled in production (HTTPS only)

### Frontend Security (Next.js)

1. **In-Memory Access Tokens**: Access tokens are stored in memory (not localStorage) to prevent XSS attacks
2. **Automatic Token Refresh**: Access tokens are automatically refreshed when expired
3. **Route Protection**: AuthGuard component prevents unauthorized access
4. **Client-Side Only**: Auth components are client-side only ('use client')

## Architecture

### Server-Side (Express.js)

Located in `server/src/`:

**Key Files:**
- `controllers/authController.ts` - Authentication endpoints
- `middlewares/auth.ts` - JWT verification middleware
- `utils/jwt.ts` - Token generation and verification
- `utils/cookies.ts` - Cookie configuration
- `routes/authRoute.ts` - Auth route definitions

**API Endpoints:**

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me (protected)
```

**Authentication Flow:**

1. User signs up or logs in
2. Server generates access token (JWT, 15min) and refresh token (JWT, 7d)
3. Access token sent in response body
4. Refresh token set as HTTP-only cookie
5. Client stores access token in memory
6. Protected requests include `Authorization: Bearer <access-token>` header
7. When access token expires, client automatically calls `/api/auth/refresh`
8. Server validates refresh token from cookie and issues new token pair

### Frontend (Next.js)

Located in `backlogstore/`:

**Key Files:**
- `lib/auth.ts` - AuthService class for API calls
- `hooks/use-auth.tsx` - React context and hook for auth state
- `components/auth/auth-guard.tsx` - Route protection component
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `app/account/*` - Protected user account pages

**Authentication Components:**

1. **AuthService** (`lib/auth.ts`)
   - Handles all authentication API calls
   - Manages access tokens in memory
   - Automatically refreshes expired tokens
   - Provides `authenticatedFetch()` helper for protected API calls

2. **AuthProvider** (`hooks/use-auth.tsx`)
   - React Context provider for auth state
   - Manages user state across the app
   - Provides login, signup, logout functions
   - Checks authentication on mount

3. **useAuth Hook**
   - Access current user and auth state
   - Trigger login, signup, logout operations
   - Check if user is authenticated

4. **AuthGuard** (`components/auth/auth-guard.tsx`)
   - Protects routes from unauthenticated access
   - Redirects to login if not authenticated
   - Shows loading state during auth check

## Usage Examples

### Frontend Usage

#### Using the Auth Hook

```tsx
'use client';

import { useAuth } from '@/hooks/use-auth';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.firstName}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => login(email, password)}>Login</button>;
}
```

#### Protecting Routes

```tsx
// app/protected-page/layout.tsx
'use client';

import { AuthGuard } from '@/components/auth/auth-guard';

export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

#### Making Authenticated API Calls

```tsx
import { AuthService } from '@/lib/auth';

async function fetchUserData() {
  try {
    const response = await AuthService.authenticatedFetch(
      `${API_URL}/user/data`,
      {
        method: 'GET',
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}
```

### Server-Side Usage

#### Protecting Routes

```typescript
import auth from '../middlewares/auth';

// Protected route
router.get('/profile', auth, getProfile);
```

The `auth` middleware:
1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies the JWT token
3. Attaches `userId` to request object
4. Returns 401 if token is invalid or expired

## Token Refresh Flow

### Automatic Refresh (Frontend)

The frontend automatically handles token refresh:

```typescript
// In AuthService class
static async getValidAccessToken(): Promise<string | null> {
  if (this.accessToken) {
    // Check if token is expired or about to expire
    const isExpired = this.isTokenExpired(this.accessToken);

    if (!isExpired) {
      return this.accessToken;
    }
  }

  // Token is expired or doesn't exist, try to refresh
  return await this.refreshAccessToken();
}
```

### Server-Side Refresh

```typescript
// POST /api/auth/refresh
export const refreshToken = async (req: Request, res: Response) => {
  // 1. Get refresh token from HTTP-only cookie
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  // 2. Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // 3. Check if token exists in database and is not revoked
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  // 4. Generate new token pair
  const newTokens = generateTokenPair(user.id, user.email);

  // 5. Revoke old refresh token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { isRevoked: true },
  });

  // 6. Store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newTokens.refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiration(),
    },
  });

  // 7. Set new refresh token as cookie
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, newTokens.refreshToken, options);

  // 8. Return new access token
  return res.json({ success: true, accessToken: newTokens.accessToken });
};
```

## Environment Variables

### Server (.env)

```env
# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Node Environment
NODE_ENV=development
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Admin Authentication

The admin authentication system works similarly but is separate:

- **Admin Auth Service**: `lib/admin-auth.ts`
- **Admin Auth Hook**: `hooks/use-admin-auth.tsx`
- **Admin Guard**: `components/admin/admin-guard.tsx`
- **Admin Routes**: `/admin/*`

Admin authentication uses localStorage for simplicity but follows the same security principles.

## Security Best Practices

### Do's ✅

1. **Always use HTTPS in production** - Ensures secure cookie transmission
2. **Store access tokens in memory** - Prevents XSS attacks
3. **Use HTTP-only cookies for refresh tokens** - Prevents JavaScript access
4. **Implement token rotation** - Limits the damage from token theft
5. **Set short expiration for access tokens** - Reduces attack window
6. **Validate inputs** - Prevent injection attacks
7. **Use strong password requirements** - Minimum 8 characters
8. **Hash passwords with bcrypt** - Never store plain text passwords

### Don'ts ❌

1. **Never store tokens in localStorage** - Vulnerable to XSS
2. **Never expose sensitive data in tokens** - Keep payloads minimal
3. **Never skip HTTPS in production** - Cookies can be intercepted
4. **Never trust client-side data** - Always validate on server
5. **Never log tokens** - Could expose sensitive data
6. **Never use predictable secrets** - Use strong random values

## Troubleshooting

### Common Issues

**Issue: "Invalid or expired token"**
- Solution: Token may have expired. The app should automatically refresh. If not, try logging out and back in.

**Issue: "Not Authorized. Please login again."**
- Solution: Access token missing or invalid. Check if user is logged in.

**Issue: Refresh token errors**
- Solution: Refresh token may be expired or revoked. User needs to log in again.

**Issue: CORS errors in development**
- Solution: Ensure `credentials: 'include'` is set in fetch requests and server allows credentials.

### Debugging

Enable debug logging in development:

```typescript
// In AuthService methods
console.log('Access token:', this.accessToken);
console.log('Token expired:', this.isTokenExpired(token));
```

Check cookies in browser DevTools:
- Application → Cookies → Check for `refreshToken` cookie
- Ensure `HttpOnly` and `Secure` flags are set appropriately

## Testing

### Manual Testing

1. **Signup Flow**
   - Navigate to `/auth/signup`
   - Create account with valid email and password
   - Should redirect to `/account`

2. **Login Flow**
   - Navigate to `/auth/login`
   - Login with credentials
   - Should redirect to `/account`

3. **Protected Routes**
   - Try accessing `/account` without login
   - Should redirect to `/auth/login`

4. **Token Refresh**
   - Login and wait for access token to expire (15 min)
   - Make a protected request
   - Should automatically refresh and succeed

5. **Logout**
   - Click logout
   - Should clear tokens and redirect to home

## Future Enhancements

Potential improvements to consider:

1. **OAuth Integration** - Google, GitHub, etc.
2. **Two-Factor Authentication** - SMS or TOTP
3. **Rate Limiting** - Prevent brute force attacks
4. **Account Verification** - Email verification
5. **Session Management** - View and revoke active sessions
6. **Remember Me** - Longer refresh token expiration
7. **Biometric Auth** - WebAuthn support
8. **Audit Logging** - Track authentication events

## Support

For issues or questions:
1. Check this documentation
2. Review server logs for error details
3. Check browser console for frontend errors
4. Verify environment variables are set correctly
