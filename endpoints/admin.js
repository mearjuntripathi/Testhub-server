const { getOTP, validateOTP } = require('../controller/otp');
const JWT = require('../model/authentication');
const database = require('../service/adminDatabase');
const { sendOTP, sendLink } = require('../controller/mail');
const fs = require('fs');
const csv = require('csv-parser');
const { Readable } = require('stream'); // Import Readable from the stream module


async function signup(req, res) {
    const { name, email, password } = req.body;
    try {
        const result = await database.create(name, email, password);
        const admin_id = result.adminId;
        const otp = getOTP(admin_id);
        const token = JWT.set({ otp: otp, admin_id: admin_id });
        sendLink(email, token, name, null, "admin");
        return res.status(201).json({ message: "Go and verify your account you get a mail" });
    } catch (err) {
        if (err.message === 'Email already exists') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function verify(req, res) {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                    <h2 style="color: #FF0000;">Error</h2>
                    <p>Token not provided</p>
                </body>
            </html>
        `);
    }

    try {

        if (!JWT.verify(token)) {
            return res.status(401).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                        <h2 style="color: #FF0000;">Error</h2>
                        <p>Your Token Is Invalid</p>
                    </body>
                </html>
            `);
        }

        const { admin_id, otp } = JWT.get(token);

        if (!validateOTP(admin_id, otp)) {
            return res.status(403).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                        <h2 style="color: #FF0000;">Error</h2>
                        <p>Token Expired. Please sign up again after 24 hours.</p>
                    </body>
                </html>
            `);
        }

        await database.verify(admin_id);
        return res.status(200).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                    <h2 style="color: #4CAF50;">Verification Successful</h2>
                    <p>Your email has been verified successfully. You can now <a href="${process.env.FRONTEND_ADMIN_URL}/login" style="color: #4CAF50;">login</a>.</p>
                </body>
            </html>
        `);

    } catch (err) {
        return res.status(500).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                    <h2 style="color: #FF0000;">Error</h2>
                    <p>Invalid token or internal server error.</p>
                </body>
            </html>
        `);
    }
}


async function login(req, res) {
    const { email, password } = req.body;
    try {
        const result = await database.authenticate(email, password);
        if (!result.success) {
            return res.status(401).json({ error: result.message });
        }

        const admin = result.admin;
        const token = JWT.set({ verify: true, id: admin.admin_id, name: admin.name, email: admin.email });

        return res.status(200).json({ info: { name: admin.name, email: admin.email }, token: token });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function forgetPassword(req, res) {
    const { email } = req.body;
    const otp = getOTP(email);
    try {
        const result = await database.emailExists(email);
        if (!result) {
            return res.status(401).json({ error: 'Email Not found' });
        }
        // send a mail
        sendOTP(email, otp);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updatePassword(req, res) {
    const { email, otp, password } = req.body;
    if (!validateOTP(email, otp)) {
        return res.status(403).json({ error: 'Invalid OTP' });
    }
    try {
        const result = await database.updatePassword(email, password);
        if (!result) {
            return res.status(401).json({ error: result.message });
        }
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

async function pastTest(req, res) {
    const id = req.admin_id;
    try {
        const result = await database.pastTable(id);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function allTest(req, res) {
    const id = req.admin_id;
    try {
        const result = await database.allTable(id);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function createTest(req, res) {
    const id = req.admin_id;
    const { test_name, test_timing, test_date } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const results = [];

    // Convert buffer to a readable stream
    const readableFile = new Readable();
    readableFile._read = () => { }; // _read is required but you can noop it
    readableFile.push(fileBuffer);
    readableFile.push(null);

    readableFile
        .pipe(csv(['question', 'option1', 'option2', 'option3', 'option4', 'answer']))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const formattedResults = results.map((item, index) => ({
                id: index + 1,
                question: `Question ${index + 1}: ${item.question}`,
                options: [item.option1, item.option2, item.option3, item.option4],
                answer: item.answer
            }));

            try {
                const questions = JSON.stringify(formattedResults);
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const formattedDate = `${year}${month}${day}`;
                const test_id = `test_${id.slice(6)}${formattedDate}`;
                await database.createTest(id, test_id, test_name, questions, test_timing, test_date);
                res.status(200).json({ "test_id": test_id });
            } catch (error) {
                if (error.message === 'Test already exists') {
                    res.status(409).json({ error: 'You can create one test in one day' });
                } else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        });
}

async function getStudents(req, res) {
    const id = req.admin_id;
    const test_id = req.query.test_id;
    const numberPart = test_id.slice(5, 9);
    if (`admin_${numberPart}` !== id) {
        return res.status(404).json({ error: 'This Test is not Found' });
    }
    try {
        const response = await database.testExists(test_id, id);
        if (!response) {
            return res.status(404).json({ error: 'This Test is not Found' });
        }
        const result = await database.getStudents(test_id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { signup, verify, login, forgetPassword, updatePassword, pastTest, allTest, createTest, getStudents };