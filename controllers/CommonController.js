import { andhraDistricts, karnatakaDistricts, keralaDistricts, tamilNaduDistricts } from "../utils/districts.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export const getStates = (_, res) => {
    let states = [
        {
            id: 1,
            name: "Andhra Pradesh"
        },
        {
            id: 2,
            name: "Kerala"
        },
        {
            id: 3,
            name: "Tamil Nadu"
        },
        {
            id: 4,
            name: "Karnataka"
        }
    ]

    return res.status(200).json({
        status: "Success",
        message: "States fetched successfully!",
        data: {
            state: states
        }
    })
}


export const getDistricts = (req, res) => {
    const stateId = +req.query.state;

    if (!stateId || stateId > 4) {
        return res.status(400).json({
            status: "Error",
            message: "Districts retrieval failed!",
            data: {
                error: "Missing required fields in query 'state' or invalid state id"
            }
        })
    }

    let districts;

    if (stateId === 1) {
        districts = andhraDistricts
    }
    else if (stateId === 2) {
        districts = keralaDistricts
    }
    else if (stateId === 3) {
        districts = tamilNaduDistricts
    }
    else if (stateId === 4) {
        districts = karnatakaDistricts
    }

    return res.status(200).json({
        status: "Success",
        message: "Districts fetched successfully!",
        data: {
            district: districts
        }
    })
}

const s3Client = new S3Client({
    region: "us-east-1"
});

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            res.status(500).json({
                status: "Error",
                message: "File upload failed",
            });
        }

        const uploadParams = {
            Bucket: "rentitasserts",
            Key: file.originalname,
            Body: file.buffer
        };

        const data = await s3Client.send(new PutObjectCommand(uploadParams));

        // Construct S3 URL
        const s3Url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;

        res.status(200).json({
            status: "Success",
            message: "File uploaded successfully",
            data: {
                fileUrl: s3Url,
                fileName: uploadParams.Key
            }
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Error",
            message: "File upload failed",
        });
    }
}