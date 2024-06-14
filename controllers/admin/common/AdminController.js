import mongoose from "mongoose";
import { Owner } from "../../../models/OwnerModel.js";

export const approveOwnerRequestHandler = async (req, res) => {
    const ownerId = new mongoose.Types.ObjectId(req.body.id)

    try {

        if (!req.body.id) {
            return res.status(400).json({
                status: "Error",
                message: "Owner approval failed!",
                data: {
                    error: "Owner id is required!"
                }
            })
        }

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return res.status(404).json({
                status: "Error",
                message: "Owner not found!"
            })
        }
        if (owner.is_approved === 1) {
            return res.status(400).json({
                status: "Error",
                message: "Owner approval failed!",
                data: {
                    error: "Owner already approved!"
                }
            })
        }
        else if (owner.is_approved === 2) {
            return res.status(400).json({
                status: "Error",
                message: "Owner approval failed!",
                data: {
                    error: "Owner already rejected!"
                }
            })
        }

        const approveOwner = await Owner.findOneAndUpdate({ _id: ownerId }, { $set: { is_approved: 1 } }, { new: true })
        return res.status(200).json({
            status: "Success",
            message: "Owner approved successfully",
            data: {
                approved_owner: approveOwner
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Owner approval failed!",
            data: {
                error: err.message
            }
        })
    }
}

export const rejectOwnerRequestHandler = async (req, res) => {
    const ownerId = new mongoose.Types.ObjectId(req.body.id)

    try {

        if (!req.body.id) {
            return res.status(400).json({
                status: "Error",
                message: "Owner rejection failed!",
                data: {
                    error: "Owner id is required!"
                }
            })
        }

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return res.status(404).json({
                status: "Error",
                message: "Owner not found!"
            })
        }
        if (owner.is_approved === 1) {
            return res.status(400).json({
                status: "Error",
                message: "Owner rejection failed!",
                data: {
                    error: "Owner already approved!"
                }
            })
        }
        else if (owner.is_approved === 2) {
            return res.status(400).json({
                status: "Error",
                message: "Owner rejection failed!",
                data: {
                    error: "Owner already rejected!"
                }
            })
        }

        const rejectedOwner = await Owner.findOneAndUpdate({ _id: ownerId }, { $set: { is_approved: 2 } }, { new: true })
        return res.status(200).json({
            status: "Success",
            message: "Owner rejected successfully",
            data: {
                rejected_owner: rejectedOwner
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Owner rejection failed!",
            data: {
                error: err.message
            }
        })
    }
}

export const allOwnerRequestHandler = async (req, res) => {

    const status = +req.query.status;

    try {
        if(!status) {
            return res.status(400).json({
                status: "Error",
                message: "Owners retrieval failed!",
                data: {
                    error: "Missing required fields in query 'status'"
                }
            })
        }
        if (status === 1) {
            const owners = await Owner.find({ is_approved: 1 }).populate('store_details');
            return res.status(200).json({
                status: "Success",
                message: "Owners retrieved successfully",
                data: {
                    owners
                }
            })
        }

        else if(status === 2) {
            const owners = await Owner.find({ is_approved: 2 }).populate('store_details');
            return res.status(200).json({
                status: "Success",
                message: "Owners retrieved successfully",
                data: {
                    owners
                }
            })
        }

        else if(status === 3) {
            const owners = await Owner.find({ is_approved: 3 }).populate('store_details');
            return res.status(200).json({
                status: "Success",
                message: "Owners retrieved successfully",
                data: {
                    owners
                }
            })
        }

    }
    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Owners retrieval failed!",
            data: {
                error: err.message
            }
        })
    }
}