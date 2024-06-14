import mongoose from "mongoose";

const storeModel = mongoose.Schema({
    square_feet: {
        type: Number,
        required: true
    },
    address_line1: {
        type: String,
        required:true
    },
    address_line2: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
    },
    state: {
        type: String,
        required:true
    },
    pincode: {
        type: String,
        required:true
    },
    proof: {
        type: String,
        required:true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner"
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

export const Store = mongoose.model("Store", storeModel);