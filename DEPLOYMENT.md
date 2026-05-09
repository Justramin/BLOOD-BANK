# Deployment Instructions - DYFI Pinarayi Blood Connect

This project is built with Next.js 15, Supabase, and Tailwind CSS.

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the contents of `database.sql` to create the tables and seed initial megalas.
3. Go to **Project Settings > API** and get your `URL` and `anon public` key.
4. Go to **Authentication > Providers** and ensure Email provider is enabled.
5. Go to **Authentication > Users** and manually create an admin user (email/password).

## 2. Environment Variables

Create a `.env.local` file (or set these in your deployment platform):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Local Development

```bash
npm install
npm run dev
```

## 4. Production Build

```bash
npm run build
npm start
```

## 5. Deployment (Vercel/Netlify)

1. Connect your repository.
2. Add the environment variables.
3. Deploy.

---

### Organization Info

**Secretary:** Nivedh K (9656149405)
**President:** Anoop TK (7293774756)
**Treasurer:** Sruthin KK (9562575108)
