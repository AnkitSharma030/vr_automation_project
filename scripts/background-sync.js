import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration
console.log("CRON_SECRET", process.env.CRON_SECRET);
console.log("API_URL", process.env.API_URL);

const API_URL = process.env.API_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
    console.error('ERROR: CRON_SECRET environment variable is not set!');
    process.exit(1);
}

console.log('🚀 Background Sync Service Started');
console.log(`📡 API URL: ${API_URL}`);
console.log('⏰ Schedule: Every 5 minutes');
console.log('─'.repeat(50));

// Function to execute the sync
async function executeSyncTask() {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] Running sync task...`);

    try {
        const response = await axios.post(
            `${API_URL}/api/sync`,
            {},
            {
                headers: {
                    'x-cron-secret': CRON_SECRET,
                },
            }
        );

        const data = response.data;
        console.log(`✅ Sync completed: ${data.synced} leads synced`);
    } catch (error) {
        if (error.response) {
            console.error(`❌ Sync failed: ${error.response.status} - ${error.response.data.error}`);
        } else {
            console.error(`❌ Sync failed: ${error.message}`);
        }
    }
}

// Schedule the task to run every 5 minutes
// Cron expression: */5 * * * * (every 5 minutes)
cron.schedule('* * * * *', executeSyncTask, {
    scheduled: true,
    timezone: 'UTC',
});

console.log('✅ Cron job scheduled successfully');

// Run once immediately on startup
console.log('\n🔄 Running initial sync...');
executeSyncTask();

// Keep the process running
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down background sync service...');
    process.exit(0);
});
