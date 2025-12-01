# Fix Chunk Loading Error

## Quick Fix Steps

### 1. Clear Build Cache (Windows PowerShell)
```powershell
# Run the fix script
.\fix-build.ps1

# Or manually:
Remove-Item -Recurse -Force .next
```

### 2. Reinstall Dependencies
```bash
npm install
```

### 3. Restart Dev Server
```bash
npm run dev
```

## What Was Fixed

1. **Dashboard Page**: Added client-side checks for `window` object
2. **Next.js Config**: Added webpack fallbacks for canvas and node modules
3. **Canvas Charts**: Fixed devicePixelRatio handling with fallback

## If Error Persists

### Option 1: Full Clean Install
```powershell
# Delete all build artifacts
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install

# Restart
npm run dev
```

### Option 2: Check for Missing Dependencies
Ensure all packages are installed:
```bash
npm install next@^15.0.0 react@^18.3.1 react-dom@^18.3.1 next-auth@^4.24.5
```

### Option 3: Check Environment Variables
Make sure `.env` file exists with:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL`
- `OPENAI_API_KEY`

## Common Causes

1. **Build Cache Corruption**: `.next` folder contains corrupted chunks
2. **Missing Dependencies**: Some packages weren't installed properly
3. **Server/Client Mismatch**: Components using server-only APIs on client
4. **Network Issues**: Dev server timeout during chunk loading

## Verification

After fixing, you should see:
- No chunk loading errors in console
- Dashboard loads with charts
- All pages accessible
- No runtime errors



