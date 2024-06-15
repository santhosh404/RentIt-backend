import { Admin } from "../models/AdminModel.js";

export const isAdmin = async (req, res, next) => {

    try {
        const user = await Admin.findById(req.user._id)
        
        //Check if the user is admin
        if (user && user.is_admin) {
            next();
        }
        else {
            return res.status(401).json({
                status: "Error",
                message: "Authorization Failed!",
                data: {
                    error: "Permission denied. Contact your administrator!"
                }
            });
        }
    }
    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Authorization Failed!",
            data: {
                error: err.message
            }
        });
    }
}