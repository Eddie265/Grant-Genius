# GrantGenius Africa

An AI-powered grant matching and proposal generation platform for African organizations.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your `.env` file with:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for local)

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. (Optional) Run the backend API server:
```bash
npm run server
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
GrantGenius/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and configs
├── prisma/                # Prisma schema
├── server/                # Express backend API
└── public/                # Static assets
```

## 🎯 Features

- ✅ User Authentication (NextAuth.js)
- ✅ Dashboard with Analytics
- ✅ Grant Management (CRUD)
- ✅ AI Proposal Generator
- ✅ Proposal History
- ✅ Settings & Profile Management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: NextAuth.js
- **AI**: OpenAI GPT-4

## 📝 License

MIT



