# Admin Panel & API

This project implements a Next.js Admin Panel and API for managing dynamic categories of items.

## Features

- **Dynamic Categories**: Manage items across various categories (Bonds, Loans, HR, News, etc.).
- **CRUD Operations**: Create, Read, Update, and Delete items.
- **PostgreSQL**: Data persistence using PostgreSQL.
- **Authentication**: Basic authentication protection for Admin UI and API.
- **Responsive UI**: Built with Tailwind CSS.

## Setup

1.  **Environment Variables**:
    Create a `.env` file in the root directory with the following variables:

    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/dbname
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=your_access_key
    AWS_SECRET_ACCESS_KEY=your_secret_key
    AWS_S3_BUCKET_NAME=your_bucket_name
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Database Migration**:
    Run the SQL script in `migrations/001_create_admin_items.sql` to create the necessary table.

    ```bash
    psql $DATABASE_URL -f migrations/001_create_admin_items.sql
    ```

4.  **Run Development Server**:

    ```bash
    npm run dev
    ```

## API Usage

### Authentication
Basic Auth is enabled. Default credentials:
- Username: `admin`
- Password: `password`

### Endpoints

-   **GET /api/admin/[category]**
    -   Fetch all items in a category.
    -   Example: `curl -u admin:password http://localhost:3000/api/admin/news`

-   **POST /api/admin/[category]**
    -   Create a new item.
    -   Body: `{ "title": "Title", "image_url": "url", "payload": {} }`
    -   Example:
        ```bash
        curl -u admin:password -X POST http://localhost:3000/api/admin/news \
          -H "Content-Type: application/json" \
          -d '{"title": "New Item", "image_url": "http://example.com/img.jpg"}'
        ```

-   **PUT /api/admin/[category]/[id]**
    -   Update an item.
    -   Body: `{ "title": "Updated Title", ... }`

-   **DELETE /api/admin/[category]/[id]**
    -   Delete an item.

## Deployment

-   **Vercel**: Connect your GitHub repository to Vercel. Add `DATABASE_URL` to Vercel Environment Variables.
-   **Postgres**: Use a managed Postgres service like Vercel Postgres, Supabase, or AWS RDS.
