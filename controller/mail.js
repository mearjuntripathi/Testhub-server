const transporter = require('../model/mail');

async function sendOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP Verification',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2 style="color: #4CAF50;">Your OTP Verification Code</h2>
                <p>Your OTP is:</p>
                <h1 style="font-size: 36px; color: #4CAF50;">${otp}</h1>
                <p>Please use this code to complete your verification.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
}

async function sendLink(email, token, name, { date, test_id }, to) {
    const url = `${process.env.ROOT_URL}/${to}/auth/verify?token=${token}`;
    const loginUrl = `${process.env.FRONTEND_STUDENT_URL}/login`;

    let message;

    // Customize message based on recipient type
    if (to === 'student') {
        message = `
            You have applied for a test scheduled on ${date}. Click the button below to verify your email and complete the registration process.<br><br>
            After compler varification process: <a href="${loginUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">LOGIN</a>
            <br><br>
            Please keep this Test ID: <strong>${test_id}</strong> for future reference. You will need to enter your email and this Test ID to log in for the test. The test will be available from 12:00 AM to 11:59 PM on the scheduled date.
        `;
    } else if (to === 'admin') {
        message = `Hello ${name}, you have a new admin registration request. Click the button below to verify the email address of ${email}.`;
    } else {
        message = `Hello ${name}, click the button below to verify your email.`;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2 style="color: #4CAF50;">Verify Your Email</h2>
                <p>${message}</p>
                <a href="${url}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending verification link email:', error);
        return false;
    }
}



async function sendGreet(email, name, { message, test_id }, subject) {
    const url = `${process.env.FRONTEND_STUDENT_URL}/login`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2 style="color: #4CAF50;">Hello ${name},</h2>
                <p>${message}</p>
                <p>Keep this Test ID: <strong>${test_id}</strong> for future reference. You will need to enter your email and this Test ID to log in for the test. The test will be available from 12:00 AM to 11:59 PM on the scheduled date.</p>
                <a href="${url}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">LOGIN Page</a>
                <p>Best regards,<br/>TestHub</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending greeting email:', error);
        return false;
    }
}


module.exports = { sendOTP, sendLink, sendGreet };
