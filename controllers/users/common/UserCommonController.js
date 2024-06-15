import { Admin } from "../../../models/AdminModel.js";
import { Owner } from "../../../models/OwnerModel.js";
import { Store } from "../../../models/StoreModel.js";
import User from "../../../models/UserModel.js";
import { ownerRequestToAdmin } from "../../../services/service.js";

export const ownerRequestById = async (req, res) => {

    try {

        const owner = await Owner.findOne({ user_id: req.user._id }).populate('store_details');
        if (!owner) {
            return res.status(200).json({
                status: "Success",
                message: "No owner request found!",
                data: {
                    ownerRequest: null
                }
            })
        }

        return res.status(200).json({
            status: "Success",
            message: "Owner request found!",
            data: {
                ownerRequest: owner
            }
        })

    }
    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Owner request retrieval failed!",
            data: {
                error: err.message
            }
        })
    }

}

export const makeOwnerRequestHandler = async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        phone_number,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        store_details
    } = req.body;

    try {
        if (!first_name || !last_name || !email || !phone_number || !address_line1 || !address_line2 || !city || !state || !pincode || store_details.length === 0) {
            return res.status(400).json({
                status: "Error",
                message: "Signup Failed!",
                data: {
                    error: "Missing required fields 'first_name', 'last_name', 'email', 'phone_number', 'address_line1', 'address_line2', 'city','state', 'pincode','store_details'"
                }
            })
        }

        const myOwner = await Owner.findOne({ email: email });
        let updatedOwner;
        if (!myOwner || myOwner.is_approved === 0) {
            const owner = new Owner({
                first_name,
                last_name,
                email,
                phone_number,
                address_line1,
                address_line2,
                city,
                state,
                pincode,
                user_id: req.user._id
            });
            const createdOwner = await owner.save();

            // Create the new store details against the new owner
            for (let i = 0; i < store_details.length; i++) {
                const store = new Store({
                    square_feet: store_details[i].square_feet,
                    address_line1: store_details[i].address_line1,
                    address_line2: store_details[i].address_line2,
                    city: store_details[i].city,
                    state: store_details[i].state,
                    pincode: store_details[i].pincode,
                    proof: store_details[i].proof,
                    owner_id: createdOwner._id
                })
                await store.save();
            }

            //Finding all the stores of current owner
            const storeIds = await Store.find({ owner_id: createdOwner._id }).select('_id');

            //Update the owner collection with created store information
            updatedOwner = await Owner.findOneAndUpdate({ _id: createdOwner._id }, { $set: { store_details: storeIds, is_approved: 3 } }, { new: true, upsert: true });

        }

        else if (myOwner.is_approved === 3) {
            return res.status(400).json({
                status: "Error",
                message: "Owner Request Failed!",
                data: {
                    error: "Owner request already made. Request is still pending. Contact your Administrator!"
                }
            })
        }

        else if (myOwner.is_approved === 1) {
            return res.status(400).json({
                status: "Error",
                message: "Owner Request Failed!",
                data: {
                    error: "You're already a owner"
                }
            })
        }

        else if (myOwner.is_approved === 2) {
            return res.status(400).json({
                status: "Error",
                message: "Owner Request Failed!",
                data: {
                    error: "Owner request was rejected. Contact your Administrator!"
                }
            })
        }


        //Sending the owner request to admin
        const admin = await Admin.find().select('email');
        if (!admin) {
            return res.status(400).json({
                status: "Error",
                message: "Signup Failed!",
                data: {
                    error: "No admin found!"
                }
            })
        }

        await ownerRequestToAdmin(admin, { first_name: first_name, last_name: last_name, email: email, phone_number: phone_number })
        return res.status(201).json({
            status: "Success",
            message: "Owner request made sucessfully!",
            data: {
                createdOwnerRequest: updatedOwner
            }
        })
    }

    catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "Owner request failed!",
            data: {
                error: err.message
            }
        })
    }

}


export const getUserMailId = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if(!user) {
        return res.status(404).json({
            status: "Error",
            message: "User not found!",
            data: {
                error: `User with id ${req.user._id} not found!`
            }
        })
    }
    return res.status(200).json({
        status: "Success",
        message: "User found!",
        data: {
            user: user
        }
    })
}