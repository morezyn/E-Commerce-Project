# Vercel Deployment Guide - NovaShop Full-Stack App

Vercel is an excellent cloud platform for hosting web applications. Since this project is structured as a monorepo with a React frontend (`client/`) and an Express backend (`server/`), you have two options to deploy:

1. **Option A (Recommended & Simplest):** Deploy the React Frontend on Vercel, and host the Express Backend on Render (Free) or Heroku.
2. **Option B (Serverless Monorepo):** Host both frontend and backend on Vercel using Vercel Serverless functions.

Below are step-by-step guides for both options.

---

## Option A: React Frontend on Vercel + Backend on Render/Heroku

In this scenario, your Express backend runs on a server platform (Render or Heroku) and Vercel hosts your static React frontend.

### Step 1: Deploy Backend (Render / Heroku)
Follow the [walkthrough.md](file:///C:/Users/zynee/.gemini/antigravity-ide/brain/f4f78e97-fa0b-4906-8eb9-792d94c783d5/walkthrough.md) instructions to host your backend.
* Once hosted, copy your live backend API URL (e.g., `https://novashop-api.onrender.com`).

### Step 2: Import Project on Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **New Project** and select your GitHub repository containing the project.
3. On the configuration page, modify the following settings:
   * **Project Name:** `novashop-frontend`
   * **Framework Preset:** `Vite` (Vercel detects this automatically).
   * **Root Directory:** Edit this and select the `client` folder.
4. Expand **Build and Development Settings**:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`

### Step 3: Add Environment Variables
Expand the **Environment Variables** section and add:
* **Key:** `VITE_API_URL`
* **Value:** `https://your-backend-api-url.onrender.com` (Your live backend URL from Step 1)

### Step 4: Click Deploy 🚀
Vercel will build your React application and serve it on a free sub-domain like `https://novashop-frontend.vercel.app`.

---

## Option B: Full-Stack Monorepo on Vercel (Serverless Backend)

If you want to host both frontend and backend on Vercel, you need to configure the backend to run as a **Vercel Serverless Function**.

### Step 1: Add a Vercel Config to Backend
Create a `vercel.json` file inside the `server/` folder containing the following configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```
*Note: You will also need to export your Express app in `server.js` (e.g. `export default app;`) instead of just calling `app.listen` in production, as Vercel runs Serverless functions on-demand rather than listening continuously on a port.*

### Step 2: Deploy Frontend on Vercel
1. On Vercel, click **New Project** and link your repo.
2. Select the `client` folder as the **Root Directory**.
3. Set the Environment Variable `VITE_API_URL` pointing to your Vercel backend deployment URL.
4. Click **Deploy**.

### Step 3: Deploy Backend on Vercel
1. Go back to Vercel Dashboard, click **New Project**, and select the same repo.
2. Select the `server` folder as the **Root Directory**.
3. Under **Environment Variables**, add:
   * `MONGO_URI` = `mongodb+srv://zyneermoreno22_db_user:7fsKmtQYOyhURTY0@cluster0.yu1e4sb.mongodb.net/finals-project?retryWrites=true&w=majority&appName=Cluster0`
   * `JWT_SECRET` = `your_custom_jwt_secret`
   * `NODE_ENV` = `production`
4. Click **Deploy**. Copy the generated URL and update your frontend's `VITE_API_URL` if needed.

---

## 🛠️ Deploying via Vercel CLI (Command Line)

If you prefer deploying directly from your local terminal instead of linking GitHub:

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Navigate to your frontend folder:
   ```bash
   cd client
   ```
3. Run the login command and authorize:
   ```bash
   vercel login
   ```
4. Run the deploy command:
   ```bash
   vercel
   ```
   * Set the project name, root path (`.`), and confirm Vercel defaults.
5. Set environment variable during/after setup:
   ```bash
   vercel env add VITE_API_URL https://your-backend-api.onrender.com
   ```
6. Push to production:
   ```bash
   vercel --prod
   ```
