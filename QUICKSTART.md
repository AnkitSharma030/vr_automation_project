# Quick Start Guide

## Step 1: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
MONGODB_URI=<your_mongodb_connection_string>
CRON_SECRET=<generate_random_secret>
API_URL=http://localhost:3000
```

### Get MongoDB URI (Free):
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

### Generate CRON_SECRET:
Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 2: Start the Development Server

The server is already running! Check http://localhost:3000

If not running:
```bash
npm run dev
```

## Step 3: Start the Background Sync (Optional for now)

Open a **new terminal** and run:
```bash
npm run sync
```

This will sync verified leads to the "CRM" every 5 minutes.

## Step 4: Test the Application

1. Open http://localhost:3000
2. Enter names: `Peter, Aditi, Ravi, Satoshi`
3. Click "Process Names"
4. Watch the results appear in the table!
5. Test the filters (All, Verified, To Check)

## What's Next?

- Add your MongoDB credentials to `.env.local`
- Test the application with real data
- Review the README.md for deployment instructions
- Take screenshots of the database for submission

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments in each file
- Test the API endpoints with the cURL commands in README.md
