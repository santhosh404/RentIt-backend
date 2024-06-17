import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    },
});


export async function sendMailToResetPassword(emailId, resetPasswordLink) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.USER,
        to: emailId,
        subject: "Reset Your Password",
        html: `<!-- resetPasswordTemplate.html -->
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Password Reset</title>
            <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                   font-family: "Work Sans", sans-serif !important;
                    background-color: #f6f6f6;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-size-adjust: none;
                    width: 100% !important;
                }
                .container {
                    display: block;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #e9e9e9;
                }
                .content {
                    max-width: 600px;
                    margin: 0 auto;
                    display: block;
                    padding: 20px;
                }
                h1 {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0 0 20px;
                }
                p {
                    font-size: 14px;
                    margin: 0 0 20px;
                }
                a {
                    color: #348eda;
                    text-decoration: underline;
                }
                .btn {
                    text-decoration: none;
                    color: #fff !important;
                    background-color: #348eda;
                    padding: 10px 20px;
                    font-size: 16px;
                    font-weight: bold;
                    margin: 20px 0;
                    display: inline-block;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <table class="container">
                <tr>
                    <td>
                        <div class="content">
                            <h1>Password Reset Request</h1>
                            <p>Hello,</p>
                            <p>We received a request to reset your password. Click the button below to reset it:</p>
                            <p>
                                <a href="${resetPasswordLink}" class="btn">Reset Password</a>
                            </p>
                            <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                            <p>Thanks,<br>The Support Team<br/><small><i>ShortIt - Free URL Shortner</i></small></p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>`
    });

    return info;
}



export async function ownerRequestToAdmin(mailId, requestDetails) {
    const mailIds = mailId.map(mailId => mailId.email).join(',');

    // send mail with defined transport object
    await transporter.sendMail({
        from: process.env.USER,
        to: mailIds,
        subject: "New Owner Request",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>New Owner Request</title>
            <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap"
            rel="stylesheet"
            />
            <style>
            body {
                font-family: "Work Sans", sans-serif !important;
                background-color: #f6f6f6;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: none;
                width: 100% !important;
            }
            .container {
                display: block;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #e9e9e9;
            }
            .content {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                font-size: 24px;
                font-weight: bold;
                margin: 0 0 20px;
                text-align: center; /* Center the h1 tag */
            }
            p {
                font-size: 14px;
                margin: 0 0 20px;
            }
            a {
                color: #348eda;
                text-decoration: underline;
            }
            .btn {
                text-decoration: none;
                color: #fff !important;
                background-color: #348eda;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0;
                display: inline-block;
                border-radius: 5px;
            }
            li {
                font-weight: normal !important;
                margin: 10px auto;
                font-size: 14px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1 style="text-align: center">New Owner Request</h1>
                <div class="content">
                    <p>Hello Admin,</p>
                    <p>A new owner request has been submitted.</p>
                    <ul>
                    <li>Name: ${requestDetails.first_name.charAt(0).toUpperCase() + requestDetails.first_name.slice(1).toLowerCase()} ${requestDetails.last_name.charAt(0).toUpperCase() + requestDetails.last_name.slice(1).toLowerCase()}</li>
                    <li>Email: ${requestDetails.email}</li>
                    <li>Phone: ${requestDetails.phone_number}</li>
                    </ul>
                    <p>Please review the request and take appropriate action.</p>
                    <p>
                    <a href="${process.env.FRONTEND_BASE_URL}/admin/sign-in" class="btn"
                        >View Request</a
                    >
                    </p>
                    <p>
                    Thanks,<br />The Support Team<br /><small
                        ><i>The Rental Providing Platform</i></small
                    >
                    </p>
                </div>
            </div>
        </body>
        </html>`
    })
}


export async function statusUpdateToOwner(mailId, status, firstName) {

    const statusMessage = status === 'accepted'
        ? 'We are pleased to inform you that your request has been accepted.'
        : 'We regret to inform you that your request has been rejected.';

    const actionMessage = status === 'accepted'
        ? 'You can now access your dashboard using the link below:'
        : 'Please contact your administrator for further assistance.';

    const buttonText = status === 'accepted' ? 'Go to Dashboard' : 'Contact Administrator';
    const buttonLink = status === 'accepted'
        ? `${process.env.FRONTEND_BASE_URL}/user/sign-in`
        : `mailto:admin@rentit.com`; // Replace with actual administrator contact email

    await transporter.sendMail({
        from: process.env.USER,
        to: mailId,
        subject: "Update On Your Owner Request",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Update On Your Owner Request</title>
            <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap"
            rel="stylesheet"
            />
            <style>
            body {
                font-family: "Work Sans", sans-serif !important;
                background-color: #f6f6f6;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: none;
                width: 100% !important;
            }
            .container {
                display: block;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #e9e9e9;
            }
            .content {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                font-size: 24px;
                font-weight: bold;
                margin: 0 0 20px;
                text-align: center;
            }
            p {
                font-size: 14px;
                margin: 0 0 20px;
            }
            a {
                color: #348eda;
                text-decoration: underline;
            }
            .btn {
                text-decoration: none;
                color: #fff !important;
                background-color: #348eda;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0;
                display: inline-block;
                border-radius: 5px;
            }
            li {
                font-weight: normal !important;
                margin: 10px auto;
                font-size: 14px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1 style="text-align: center">Owner Request Status</h1>
                <div class="content">
                    <p>Hello, ${firstName}</p>
                    <p>${statusMessage}</p>
                    <p>${actionMessage}</p>
                    <p>
                    <a href="${buttonLink}" class="btn">${buttonText}</a>
                    </p>
                    <p>
                    Thanks,<br />The Support Team<br /><small
                        ><i>RentIt - The Rental Providing Platform</i></small
                    >
                    </p>
                </div>
            </div>
        </body>
        </html>`
    });
}