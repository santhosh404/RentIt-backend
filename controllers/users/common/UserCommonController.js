import { Owner } from "../../../models/OwnerModel.js";

export const ownerRequestById = async (req, res) => {

    try {

        const owner = await Owner.findOne({ user_id: req.user._id}).populate('store_details');
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
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Owner request retrieval failed!",
            data: {
                error: err.message
            }
        })
    }
    
}

// export const userDetails = async (req, res) => {

// }