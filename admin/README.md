# Admin Panel

This is the admin panel for the e-commerce platform, built with React, Vite, Material UI, Supabase, and i18next for bilingual (English/Hebrew) and RTL/LTR support.

## Features
- React + Vite for fast development
- Material UI for modern, beautiful UI
- React Router for navigation
- i18next for English/Hebrew translations
- RTL/LTR switching based on language
- Supabase for database and authentication
- Protected admin routes (Supabase Auth)
- CRUD for products, orders, users
- Dashboard with charts
- Image upload via Cloudinary
- Export to CSV
- Mock Stripe and delivery integration

## Getting Started

### 1. Clone the repo
```
git clone <your-repo-url>
cd admin
```

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `admin` folder:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
(See `.env.example` for reference)

### 4. Run in development mode
```
npm run dev
```

### 5. Build for production
```
npm run build
```

### 6. Preview production build
```
npm run preview
```

## Deployment (Railway)
1. Push your code to GitHub.
2. Go to [Railway](https://railway.app/) and create a new project.
3. Connect your GitHub repo.
4. Set environment variables in Railway dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Railway will auto-build and deploy your app. Use the generated domain or add your own custom domain.

## Supabase Setup
- Create a project at [supabase.com](https://supabase.com/)
- Run the provided SQL schema in the SQL Editor to create tables (products, categories, users, orders, order_items)
- Get your project URL and anon key from Project Settings > API
- Set up authentication providers (email, Google, etc.) in Supabase Auth settings

## Cloudinary Image Upload
- Register at [cloudinary.com](https://cloudinary.com/)
- Create an unsigned upload preset in your Cloudinary dashboard
- In `src/components/CloudinaryUpload.jsx`, set your `CLOUDINARY_URL` and `UPLOAD_PRESET`:
  ```js
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
  const UPLOAD_PRESET = 'YOUR_UNSIGNED_PRESET';
  ```
- The Product form will allow uploading and previewing images for products.

## Stripe Integration (Mock Example)
- In Orders, payment info is shown as a mock column.
- For real payments, integrate Stripe via backend API or Supabase Edge Functions.
- See [Stripe docs](https://stripe.com/docs) for setup and API keys.

## Delivery Cost Calculation (Mock Example)
- In Orders, delivery cost is shown as a mock column.
- For real delivery rates, integrate with Shippo, Google Maps API, or your local provider via backend API.
- See [Shippo docs](https://goshippo.com/docs/) or [Google Maps Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/overview).

## Bilingual & RTL Support
- Use the language switcher at the top to toggle between English and Hebrew.
- The layout will automatically switch to RTL for Hebrew.

## Environment Variables
See `.env.example` for required variables.

## Security
- All admin routes are protected. Only authenticated users can access the admin panel.
- For production, restrict Supabase policies to allow only authorized access.

## Tech Stack
- React, Vite, Material UI, Supabase, i18next, Recharts, Cloudinary, Stripe (mock)

## License
MIT
