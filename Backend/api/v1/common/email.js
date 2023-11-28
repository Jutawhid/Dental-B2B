
require('dotenv').config();
const nodemailer = require('nodemailer');


// mail sending
let sgMail = require('@sendgrid/mail');
let API_KEY = process.env.SENDGRID_API_KEY; //"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";
sgMail.setApiKey(API_KEY);


let sentEmailByHtmlFormate = async (receiverEmailAddress, subject, bodyText = "", buttonText = "", buttonLink = "") => {
    // const message = {
    //     to: receiverEmailAddress,
    //     from: process.env.send_email_address,
    //     subject: subject,
    //     html: htmlBody
    // }

    // try {
    //     let sentResult = await sgMail.send(message);
    //     if (sentResult[0].statusCode == 202) {
    //         return {
    //             success: true,
    //             message: "Email send successfully done"
    //         }
    //     } else {
    //         return {
    //             success: false,
    //             message: "Email send fail"
    //         }
    //     }

    // } catch (error) {
    //     return {
    //         success: false,
    //         message: "Catch Email send fail"
    //     }

    // }



    // New Code 

    var transporter = nodemailer.createTransport({
        host: process.env.send_email_host,
        port: 465,
        secure: true,
        auth: {
            user: process.env.send_email_address,
            pass: process.env.send_email_password
        }
    });

    var mailOptions = {
        from: process.env.send_email_address,
        to: receiverEmailAddress,
        subject: subject,
        html: await getHTMLBody(bodyText, buttonText, buttonLink)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            //console.log(error);
            return {
                success: false,
                message: "Email send fail"
            }
        } else {
            return {
                success: true,
                message: "Email send successfully done"
            }
        }
    });

}

let getHTMLBody = async (body = "", buttonText = "", buttonLink = "") => {
    return `<div style="padding: 40px 30px; 
        background-color: white; 
        filter: drop-shadow( 0 0 20px rgba(0,0,0,.16));
        border-radius: 10px;
        max-width: 400px;
        margin: auto;
        ">

        <img style="width: 80px;" src="https://iili.io/VhTOuf.png" alt="Easifi logo">

        <p style="font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 18px;
            margin: 40px 0 0 0;">${body}</p>

        

        <a href="${buttonLink}">
            <button style="width: 100%;
            padding: 10px 0px;
            background-color: #00E2F2;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
            border: none;
            border-radius: 5px;
            margin-top: 10px;
            cursor: pointer;">${buttonText}</button>
        </a>

        </div>`
}

module.exports = {
    sentEmailByHtmlFormate
}