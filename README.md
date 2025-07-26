# Real Estate Viewer

A Next.js application for viewing apartment listings from Poznan, with data stored in Convex. No authentication required - the app is open to all users.

## Setup

1. **Set up Convex:**
   - Create an account at [convex.dev](https://www.convex.dev/)
   - Install the Convex CLI: `npm install -g convex`
   - Initialize your Convex project: `npx convex dev`
   - Follow the prompts to create a new project or connect to existing

2. **Configure Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_CONVEX_URL` to your Convex deployment URL
   - You can get this URL from running `npx convex dev` or your Convex dashboard

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Deploy Convex Functions:**
   ```bash
   npx convex dev
   ```
   Keep this running in a separate terminal for development.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How it Works

- **No Authentication:** The app is publicly accessible
- **Data Storage:** Apartment data and user interactions are stored in Convex database
- **Web Scraping:** Automatically fetches latest apartments from Otodom.pl
- **User Interactions:** View and like states are tracked in Convex
- **Real-time:** Convex provides real-time updates and optimistic UI

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
