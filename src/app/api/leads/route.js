import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { processBatch } from '@/lib/nationalize';

// POST: Process batch of names
export async function POST(request) {
    try {
        const body = await request.json();
        const { names } = body;

        // Validate input
        if (!names || !Array.isArray(names) || names.length === 0) {
            return NextResponse.json(
                { error: 'Please provide an array of names' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Process names through Nationalize.io API (concurrent)
        const enrichedData = await processBatch(names);

        // Apply business logic and save to database
        const leads = await Promise.all(
            enrichedData.map(async (data) => {
                // Rule: probability > 0.6 = "Verified", otherwise "To Check"
                const status = data.probability > 0.6 ? 'Verified' : 'To Check';

                const lead = new Lead({
                    name: data.name,
                    country: data.country,
                    probability: data.probability,
                    status: status,
                    synced: false,
                });

                return await lead.save();
            })
        );

        return NextResponse.json({
            success: true,
            count: leads.length,
            leads: leads,
        });
    } catch (error) {
        console.error('Error processing leads:', error);
        return NextResponse.json(
            { error: 'Failed to process leads', details: error.message },
            { status: 500 }
        );
    }
}

// GET: Retrieve all leads with optional filtering
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Build query based on filter
        const query = status ? { status } : {};

        // Fetch leads, sorted by newest first
        const leads = await Lead.find(query).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: leads.length,
            leads: leads,
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads', details: error.message },
            { status: 500 }
        );
    }
}
