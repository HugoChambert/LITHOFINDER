# LithoFinder

A Next.js application for managing and searching natural stone slabs.

## Environment Variables

This project requires the following environment variables to be configured:

### Required for Netlify Deployment

Add these to your Netlify site settings under Site Configuration > Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional (for Stripe integration)

- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Netlify

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Configure the environment variables in Netlify site settings
4. Deploy

The build will complete successfully even without environment variables set, but the application will need them to function properly at runtime.
