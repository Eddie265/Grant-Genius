# GrantGenius Africa - Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- OpenAI API key
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/grantgenius?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# Node Environment
NODE_ENV="development"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or create a migration (for production)
npx prisma migrate dev --name init
```

### 4. Create Admin User (Optional)

You can create an admin user directly in the database or via Prisma Studio:

```bash
npx prisma studio
```

In Prisma Studio, create a user and set `role` to `ADMIN`.

Or use a seed script (create `prisma/seed.ts`):

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@grantgenius.com' },
    update: {},
    create: {
      email: 'admin@grantgenius.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Then add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

### 5. Run Development Server

```bash
# Start Next.js dev server
npm run dev

# (Optional) Start Express backend server
npm run server
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
GrantGenius/
├── app/                      # Next.js 15 App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── grants/          # Grant CRUD endpoints
│   │   └── proposals/       # Proposal endpoints
│   ├── (auth)/              # Auth pages (login, register)
│   ├── dashboard/           # Dashboard pages
│   │   ├── grants/          # Grants listing & admin
│   │   ├── proposals/       # Proposals listing & editor
│   │   └── settings/        # User settings
│   └── layout.tsx           # Root layout
├── components/              # React components
│   └── Sidebar.tsx          # Dashboard sidebar
├── lib/                     # Utilities
│   ├── auth.ts              # NextAuth configuration
│   ├── openai.ts            # OpenAI integration
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Helper functions
├── prisma/                  # Database schema
│   └── schema.prisma        # Prisma schema
├── server/                  # Express backend (optional)
│   └── index.js            # Express server
└── types/                   # TypeScript types
    └── next-auth.d.ts       # NextAuth type definitions
```

## Features

### ✅ Implemented

1. **User Authentication**
   - Sign up, Login, Logout
   - NextAuth.js with JWT sessions
   - Password hashing with bcrypt

2. **Dashboard**
   - Sidebar navigation
   - Analytics (proposals count, grants count)
   - Recent proposals list

3. **Grant Management**
   - Browse and search grants
   - Filter by category, region, funding body
   - Admin CRUD interface (for admins)

4. **AI Proposal Generator**
   - Input form (grant title, goal, org type)
   - OpenAI GPT-4 integration
   - TipTap rich text editor
   - Autosave functionality

5. **Proposal History**
   - List all user proposals
   - Edit proposals
   - Delete proposals
   - Export as PDF/Word

6. **Settings**
   - Profile management
   - API key management (placeholder)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Grants
- `GET /api/grants` - List grants (with filters)
- `GET /api/grants/[id]` - Get single grant
- `POST /api/grants` - Create grant (Admin only)
- `PATCH /api/grants/[id]` - Update grant (Admin only)
- `DELETE /api/grants/[id]` - Delete grant (Admin only)

### Proposals
- `GET /api/proposals` - List user's proposals
- `GET /api/proposals/[id]` - Get single proposal
- `POST /api/proposals/generate` - Generate AI proposal
- `PATCH /api/proposals/[id]` - Update proposal
- `DELETE /api/proposals/[id]` - Delete proposal
- `POST /api/proposals/[id]/autosave` - Autosave proposal

## Admin Access

To access admin features:
1. Create a user with `role: "ADMIN"` in the database
2. Log in with that user
3. You'll see "Admin Grants" in the sidebar

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database credentials

### NextAuth Issues
- Ensure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your app URL

### OpenAI API Issues
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- Review OpenAI API rate limits

### Build Errors
- Run `npx prisma generate` after schema changes
- Clear `.next` folder and rebuild
- Check TypeScript errors

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend & Database
- **Render**: Deploy Express server and PostgreSQL
- **Supabase**: Use Supabase PostgreSQL and deploy backend separately

## Next Steps

- [ ] Add email verification
- [ ] Implement payment/subscription system
- [ ] Add more AI customization options
- [ ] Enhance proposal templates
- [ ] Add collaboration features
- [ ] Implement grant recommendations
- [ ] Add analytics dashboard
- [ ] Mobile responsive improvements



