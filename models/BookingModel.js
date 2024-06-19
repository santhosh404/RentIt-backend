import mongoose from "mongoose";


const bookingModel = mongoose.Schema({
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    rental_store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RentalStore"
    },
    is_available: {
        type: Number,
        default: 0
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Booking = mongoose.model("Booking", bookingModel);