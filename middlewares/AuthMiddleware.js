import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()


const authorize = async (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: "Error",
            message: "Authorization Failed!",
            data: {
                error: "No token provided!"
            }
        });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
        if (err) {
            return res.status(401).json({
                status: "Error",
                message: "Authorization Failed!",
                data: {
                    error: "Token is not valid!"
                }
            });
        }
        req.user = decode;
        next();
    })
}



export { authorize }