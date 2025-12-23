import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
    },
    probability: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
    },
    status: {
        type: String,
        required: true,
        enum: ['Verified', 'To Check'],
    },
    synced: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent model recompilation during hot reload
export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
