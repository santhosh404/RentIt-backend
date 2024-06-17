import { Admin } from "../../../models/AdminModel.js";
import User from "../../../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const signUpAdminHandler = async (req, res) => {
    try {
        let { first_name, last_name, email, phone_number, password } = req.body;
        if (!first_name || !last_name || !email || !phone_number || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Signup Failed!",
                data: {
                    error: "Missing required fields 'first_name', 'last_name', 'email', 'phone_number', 'password'"
                }
            })
        }
        const admin = await Admin.findOne({ email: email });

        if (admin) {
            return res.status(400).json({
                status: "Error",
                message: "Signup Failed!",
                data: {
                    error: `Admin with email id ${email} already exists!`
                }
            })
        }

        password = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ first_name, last_name, email, phone_number, password });
        await newAdmin.save();

        //Updating the User model
        const user = await User.findOne({ email: email });
        if (user) {
            user.is_admin = true;
            await user.save();
        }

        return res.status(201).json({
            status: "Success",
            message: "Admin Added Successfully!",
            data: {
                first_name: newAdmin.first_name,
                last_name: newAdmin.last_name,
                email: newAdmin.email
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

export const signInAdminHandler = async (req, res) => {
    let { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Signin Failed!",
                data: {
                    error: "Missing required fields 'email', 'password'"
                }
            })
        }

        //Find if the user not exists
        const user = await Admin.findOne({ email: email })

        if (!user) {
            return res.status(404).json({
                status: "Error",
                message: "Signin Failed!",
                data: {
                    error: `User with email id ${email} not found!`
                }
            })
        }

        // if (user.verified === false) {
        //     return res.status(400).json({
        //         status: "Error",
        //         message: "Signin Failed!",
        //         data: {
        //             error: `User with an Account ${email} is not activated. Please activate your account to proceed!`
        //         }
        //     })
        // }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        //Comparing password
        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (isPasswordSame) {
            return res.status(200).json({
                status: "Success",
                message: "Signin Success!",
                data: {
                    user: user,
                    token: token
                }
            })
        }
        else {
            return res.status(400).json({
                status: "Error",
                message: "Signin Failed!",
                data: {
                    error: `Email and Password doesn't match!`
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