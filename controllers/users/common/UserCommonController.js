import moment from "moment";
import { Admin } from "../../../models/AdminModel.js";
import { Booking } from "../../../models/BookingModel.js";
import { Owner } from "../../../models/OwnerModel.js";
import { RentalStores } from "../../../models/RentalStores.js";
import { Store } from "../../../models/StoreModel.js";
import User from "../../../models/UserModel.js";
import { ownerRequestToAdmin } from "../../../services/service.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { Payment } from "../../../models/PaymentModel.js";
dotenv.config();


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
            message: "Internal Server Error!",
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
            message: "Internal Server Error!",
            data: {
                error: err.message
            }
        })
    }

}


export const getUserMailId = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
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

export const updateProfile = async (req, res) => {

    let { password, ...rest } = req.body

    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({
                status: "Error",
                message: "User not found!",
                data: {
                    error: `User with id ${req.user._id} not found!`
                }
            })
        }
        let update = { ...rest };

        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, update, { new: true });
        res.status(200).json({
            status: "Success",
            message: "Profile updated successfully!",
            data: {
                user: updatedUser
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


export const makeRentRequestHandler = async (req, res) => {
    const {
        start_date,
        end_date,
        rent_store_id
    } = req.body;

    try {
        if (!start_date || !end_date || !rent_store_id) {
            return res.status(400).json({
                status: "Error",
                message: "Booking request Failed!",
                data: {
                    error: "Missing required fields'start_date', 'end_date','rent_store_id'"
                }
            })
        }

        const store = await RentalStores.findOne({ _id: rent_store_id });
        if (!store) {
            return res.status(404).json({
                status: "Error",
                message: "Store not found!",
                data: {
                    error: `Rental Store with id ${rent_store_id} not found!`
                }
            })
        }

        const bookings = await Booking.find({ rental_store_id: rent_store_id });

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Check if the duration is at least 3 months
        const duration = moment(endDate).diff(moment(startDate), 'months', true);
        if (duration < 3) {
            return res.status(400).json({
                status: "Error",
                message: "Booking duration too short!",
                data: {
                    error: "Booking Should be at least 3 months"
                }
            });
        }


        const isDateConflict = bookings.some(booking => {
            const bookingStartDate = new Date(booking.start_date);
            const bookingEndDate = new Date(booking.end_date);
            return (
                (startDate >= bookingStartDate && startDate <= bookingEndDate) ||
                (endDate >= bookingStartDate && endDate <= bookingEndDate) ||
                (startDate <= bookingStartDate && endDate >= bookingEndDate)
            );
        });

        if (isDateConflict) {
            return res.status(409).json({
                status: "Error",
                message: "Selected dates are already booked for rent. Please select other dates and try again",
                data: {
                    error: "The requested dates conflict with an existing booking."
                }
            });
        }

        const newBooking = new Booking({
            start_date: startDate,
            end_date: endDate,
            rental_store_id: rent_store_id,
            is_available: 0,
            user_id: req.user._id
        });

        await newBooking.save();

        //Update the RentalStore Collection with booking id
        await RentalStores.findOneAndUpdate({ _id: rent_store_id }, { $push: { bookings: newBooking._id } }, { new: true, upsert: true });

        return res.status(201).json({
            status: "Success",
            message: "Rent request made successfully!",
            data: {
                newBooking: newBooking
            }
        });


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


export const allRentalStoresHandler = async (req, res) => {
    try {
        const rentalStores = await RentalStores.find({ user_id: { $ne: req.user._id } });
        return res.status(200).json({
            status: "Success",
            message: "All rental stores found!",
            data: {
                rentalStores: rentalStores
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

export const getRentRequestOfUserHandler = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    try {
        const bookings = await Booking.aggregate([
            {
                $match: { user_id: userId }
            },
            {
                $lookup: {
                    from: 'rentalstores',
                    localField: 'rental_store_id',
                    foreignField: '_id',
                    as: 'rental_store'
                }
            },
            {
                $unwind: '$rental_store'
            },
            {
                $group: {
                    _id: '$rental_store_id',
                    rental_store: { $first: '$rental_store' },
                    dates: {
                        $push: {
                            booking_id: '$_id',
                            start_date: '$start_date',
                            end_date: '$end_date',
                            status: '$is_available'
                        }
                    }
                }
            }
        ]);
        // const bookings = await Booking.find({ user_id: req.user._id });
        return res.status(200).json({
            status: "Success",
            message: "All rent requests found!",
            data: {
                bookings: bookings
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


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const makePaymentHandler = async (req, res) => {
    let {
        amount,
        booking_id
    } = req.body;

    console.log(amount)
    try {
        if (!amount || !booking_id) {
            return res.status(400).json({
                status: "Error",
                message: "Payment Failed!",
                data: {
                    error: "Missing required fields 'amount', 'booking_id'"
                }
            })
        }
        const store = await Booking.findOne({ _id: booking_id });
        if (!store) {
            return res.status(404).json({
                status: "Error",
                message: "Store not found!",
                data: {
                    error: `Booking with id ${booking_id} not found!`
                }
            })
        }

        const payment = await razorpay.orders.create({
            // amount: parseInt(amount * 100),
            // currency: "INR"
            amount: 50000,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
              key1: "value3",
              key2: "value2"
            }
        });

        console.log(payment)

        const newPayment = new Payment({
            amount: payment.amount,
            transaction_id: payment.id,
            booking_id: booking_id,
            user_id: req.user._id
        })

        const newPaymentResponse = await newPayment.save();
        return res.status(201).json({
            status: "Success",
            message: "Payment made successfully!",
            data: {
                newPayment: newPaymentResponse
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


export const paymentVerificationHandler = async (req, res) => {

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body_data = razorpay_order_id + "|" + razorpay_payment_id;

    const expect = crypto
        .createHmac("sha256", config.RAZORPAY_KEY_SECRET || "")
        .update(body_data)
        .digest("hex");

    const isValid = expect === razorpay_signature;
    console.log(isValid);

    try {
        if (isValid) {
            console.log("payment is successful");

            await Payment.findOneAndUpdate(
                { transaction_id: razorpay_order_id },
                {
                    $set: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
                }
            );

            res.redirect(
                `${process.env.FRONTEND_BASE_URL}/success/payment_id=${razorpay_order_id}`
            );
            return;
        } else {
            res.redirect(
                `${process.env.FRONTEND_BASE_URL}/failure/payment_id=${razorpay_order_id}`
            );
        }
    }

    catch(err) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error!",
            data: {
                error: err.message
            }
        })
    }
   
}