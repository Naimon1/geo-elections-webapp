# Guild Elections Webapp

This is a Next.js application built for the Guild of Students Contingent Presidential Elections. It features a public-facing site for viewing candidate information and an admin portal for uploading candidate data and media.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Database:** Google Sheets API (Read-only for public site)
- **Media Storage:** Cloudinary
- **Automation:** Make.com (Webhook for admin uploads)
- **Deployment:** Vercel

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```env
# Google Sheets API
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
GOOGLE_SHEET_ID=your_google_sheet_id

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Make.com Webhook
MAKE_WEBHOOK_URL=your_make_webhook_url

# Admin Authentication
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### 2. Google Sheets Setup
Create a Google Sheet with three tabs:
1. **Candidates**: Columns A-I (Name, Position, Headshot URL, Manifesto URL, Video URL, Key Points, Instagram, Twitter, Facebook)
2. **Dates**: Columns A-B (Title, Date)
3. **FAQ**: Columns A-B (Question, Answer)

Make sure the sheet is accessible via the Google Sheets API using your API Key.

### 3. Cloudinary Setup
1. Create a Cloudinary account.
2. Go to Settings > Upload and create an "Upload Preset". Set the Signing Mode to "Unsigned".
3. Use your Cloud Name and Upload Preset in the environment variables.

### 4. Make.com Setup
1. Create a new scenario in Make.com.
2. Add a "Webhooks - Custom webhook" module as the trigger. Copy the webhook URL to your `.env.local`.
3. Add a "Google Sheets - Add a Row" module. Connect it to your Google Sheet and map the incoming webhook data (name, position, headshotUrl, manifestoUrl, videoUrl, keyPoints, instagram, twitter, facebook) to the corresponding columns in the "Candidates" tab.

### 5. Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deployment
Deploy the application to Vercel:
1. Push your code to a GitHub repository.
2. Import the repository in Vercel.
3. Add all the environment variables in the Vercel dashboard.
4. Click Deploy.
