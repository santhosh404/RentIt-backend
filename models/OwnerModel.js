import mongoose from 'mongoose';

const ownerModel = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    address_line1: {
        type: String,
        required: true
    },
    address_line2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    store_details: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'Store'
    },
    is_approved: {
        type: Number,
        default: 0  // 0 - no actions taken, 1 - approved, 2 - rejected, 3 - pending
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pincode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export const Owner = mongoose.model('Owner', ownerModel);