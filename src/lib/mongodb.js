import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(' Please define the MONGODB_URI environment variable inside .env.local');
}

// Global cache
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        // console.log('✅ MongoDB already connected');
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('Creating new MongoDB connection...');
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('MongoDB connection established');
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;
