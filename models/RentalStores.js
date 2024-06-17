import mongoose from "mongoose";


const rentalStores = mongoose.Schema({

    square_feet: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    specification: {
        type: String,
        required: true
    },

    rate: {
        type: Number,
        required: true
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

    pincode: {
        type: String,
        required: true
    },

    is_available: {
        type: Number,
        default: 0,
    },

    available_from: {
        type: String,
        required: true
    },

    available_to: {
        type: String,
        required: true
    },

    keywords: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 5;
            },
            message: () => `Keywords array exceeds the maximum limit of 5!`
        }
    },
    images: {
        type: [String]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

export const RentalStores = mongoose.model('RentalStore', rentalStores);