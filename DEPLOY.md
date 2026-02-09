# Deploying Portrade to Render.com (Free Tier)

This guide explains how to deploy the application on Render.com's free tier while maintaining data persistence using a **PostgreSQL** database.

## Prerequisites

1.  A GitHub repository with this code.
2.  A [Render.com](https://render.com) account.

## Step 1: Create a PostgreSQL Database

Since Render's free web services lose file data on restart, and free disks aren't available, we use a database to store our JSON data.

1.  On the Render Dashboard, click **"New +"** -> **"PostgreSQL"**.
2.  **Name**: `portrade-db` (or similar).
3.  **Instance Type**: `Free`.
4.  **Create Database**.
5.  Once created, copy the **Internal Database URL** (if deploying the web service on Render too) or **External Database URL** (if connecting from outside).
    - _Note: For a Render Web Service communicating with a Render Database, use the Internal URL for speed/security._

## Step 2: Create a Web Service

1.  Click **"New +"** -> **"Web Service"**.
2.  Connect your GitHub repository.
3.  **Name**: `portrade`.
4.  **Runtime**: `Node`.
5.  **Build Command**: `npm install && npm run build` (or `pnpm install; pnpm build`).
6.  **Start Command**: `npm start` (or `pnpm start`).
7.  **Instance Type**: `Free`.

## Step 3: Connect the Database

1.  In your Web Service settings, go to **"Environment"**.
2.  Add an Environment Variable:
    - **Key**: `DATABASE_URL`
    - **Value**: (Paste the PostgreSQL Connection String from Step 1)
3.  **Deploy**.

## How it Works

1.  On startup, the app checks if `DATABASE_URL` is set.
2.  If yes, it creates a table `portrade_data` in your database.
3.  It then attempts to read the data.
    - **First Run**: The database is empty. The app reads the default `data/catalog.json` file properly and **saves it to the database**.
    - **Subsequent Runs**: The app reads your data (orders, group buys) directly from the database.
4.  Every time you Create an Order or Update a Group Buy, it saves to the Database.

This structure works robustly on the Free Tier!
