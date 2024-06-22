import mongoose from 'mongoose';


const paymentModel = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    transaction_id: {
        type: String,
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    payment_status: {
        type: Number,
        default: 0  // 0 - pending, 1 - success, 2 - failed
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

export const Payment = mongoose.model('Payment', paymentModel);