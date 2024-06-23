import mongoose from "mongoose";
import { Owner } from "../../../models/OwnerModel.js";
import { statusUpdateToOwner } from "../../../services/service.js";
import User from "../../../models/UserModel.js";

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

        const owner = await Owner.findById(ownerId).populate('user_id');
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

        // Update user with is_owner
        await User.findOneAndUpdate({ _id: owner.user_id._id }, { $set: { is_owner:  true} }, { new: true })


        //Sending the mail to owner regarding the status
        await statusUpdateToOwner(owner.email, 'accepted', owner.first_name)

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
            message: "Internal Server Error!",
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

        //Sending the mail to owner regarding the status
        await statusUpdateToOwner(owner.email, 'rejected', owner.first_name);

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
            message: "Internal Server Error!",
            data: {
                error: err.message
            }
        })
    }
}

export const allOwnerRequestHandler = async (req, res) => {
    try {
        const owners = await Owner.find({ is_approved: { $gt: 0 } }).populate('store_details');
        return res.status(200).json({
            status: "Success",
            message: "Owners retrieved successfully",
            data: {
                ownerRequest: owners
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error!",
            data: {
                error: err.message
            }
        })
    }
}

export const ownerRequestFilterHandler = async (req, res) => {

    const status = +req.query.status;

    try {
        if (!status) {
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
                    ownerRequest: owners
                }
            })
        }

        else if (status === 2) {
            const owners = await Owner.find({ is_approved: 2 }).populate('store_details');
            return res.status(200).json({
                status: "Success",
                message: "Owners retrieved successfully",
                data: {
                    ownerRequest: owners
                }
            })
        }

        else if (status === 3) {
            const owners = await Owner.find({ is_approved: 3 }).populate('store_details');
            return res.status(200).json({
                status: "Success",
                message: "Owners retrieved successfully",
                data: {
                    ownerRequest: owners
                }
            })
        }

        else if (status === 0) {
            const owners = await Owner.find().populate('store_details');
            return res.status(200).json({
                status: "Success",
                message: "Owners retrieved successfully",
                data: {
                    ownerRequest: owners
                }
            })
        }

    }
    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error!",
            data: {
                error: err.message
            }
        })
    }
}


export const ownerByIdHandler = async (req, res) => {
    const ownerId = new mongoose.Types.ObjectId(req.params.id);

    try {
        const owner = await Owner.findById(ownerId).populate('store_details');
        if (!owner) {
            return res.status(404).json({
                status: "Error",
                message: "Owner not found!"
            })
        }
        return res.status(200).json({
            status: "Success",
            message: "Owner retrieved successfully",
            data: {
                ownerRequest: owner
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error!",
            data: {
                error: err.message
            }
        })
    }
}