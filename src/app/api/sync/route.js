import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';

// POST: Sync verified leads (called by background job or manually)
export async function POST(request) {
    return handleSync(request);
}

// GET: Sync verified leads (called by Vercel Cron)
export async function GET(request) {
    return handleSync(request);
}

async function handleSync(request) {
    try {
        await connectDB();

        // Find all verified leads that haven't been synced yet
        const leadsToSync = await Lead.find({
            status: 'Verified',
            synced: false,
        });

        // Simulate CRM sync
        let syncCount = 0;
        for (const lead of leadsToSync) {

            console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);

            // Update synced status to ensure idempotency
            lead.synced = true;
            await lead.save();

            syncCount++;
        }

        return NextResponse.json({
            success: true,
            synced: syncCount,
            message: `Successfully synced ${syncCount} verified leads`,
        });
    } catch (error) {
        console.error('Error syncing leads:', error);
        return NextResponse.json(
            { error: 'Failed to sync leads', details: error.message },
            { status: 500 }
        );
    }
}
