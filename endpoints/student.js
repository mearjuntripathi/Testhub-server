const database = require('../service/studentDatabase');
const { getOTP, validateOTP } = require('../controller/otp');
const { sendLink, sendGreet } = require('../controller/mail');
const JWT = require('../model/authentication');

async function login(req, res) {
    const { email, test_id, admin_id } = req.body;
    const today = new Date();
    try {
        const admin = await database.adminExist(admin_id);
        if (!admin) {
            return res.status(403).json({ error: 'No test exist' });
        }
        const test = await database.testExist(test_id, admin_id);
        if (!test) {
            return res.status(403).json({ error: 'No test exist' });
        }
        const result = await database.getTestData(admin_id, test_id);

        const testDate = new Date(result[0].test_date); // Convert test_date to a Date object
        if (testDate.toDateString() !== today.toDateString()) {
            return res.status(403).json({ error: 'No test today' });
        }


        const emailStatus = await database.checkEmailTest(email, test_id);
        if (emailStatus === null) {
            return res.status(403).json({ error: 'You are not registered' });
        } else if (emailStatus === 'attend') {
            return res.status(403).json({ error: 'You have already taken the test' });
        } else if (emailStatus === 'suspend') {
            return res.status(403).json({ error: 'You has been suspended from test' });
        }

        const token = JWT.set({ email: email, test_id: test_id });
        res.set("auth", token);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function formatDateWithDayName(dateString) {
    const date = new Date(dateString.substring(0, 4), dateString.substring(4, 6) - 1, dateString.substring(6, 8));
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

async function signup(req, res) {
    const test_id = req.query.test_id;
    const { name, email, resume_link, admin_id } = req.body;

    const today = new Date();
    const formattedToday = formatDate(today);

    try {
        const admin = await database.adminExist(admin_id);
        if (!admin) {
            return res.status(403).json({ error: 'No test exist' });
        }
        const test = await database.testExist(test_id, admin_id);
        if (!test) {
            return res.status(403).json({ error: 'No test exist' });
        }
        const testDate = new Date(test[0].test_date);
        const formattedTestDate = formatDate(testDate);

        if (formattedTestDate <= formattedToday) {
            return res.status(403).json({ error: 'Apply date expire' });
        }

        var emailExist = await database.checkEmailTest(email, test_id);
        if (emailExist) {
            return res.send(403).json({ 'error': "You are already apply for test" });
        }
        emailExist = await database.checkEmail(email);
        if (!emailExist) {
            await database.addStudents(name, email, resume_link, test_id);
            const otp = getOTP(email);
            const token = JWT.set({ otp: otp, email: email, test_id: test_id });
            // send mail with token
            sendLink(email, token, name, formatDateWithDayName(formattedTestDate), 'student')
            res.status(200).json({ message: "Verify your accout to register for test" });
        } else {
            await database.updateStudents(name, email, resume_link, test_id);
            // send mail to congratulation for thay have sucessfully registered
            sendGreet(email, name, `You have successfully registered for the test scheduled on ${test.test_date}.`, 'Successfully Registered');
            return res.status(201).json({ message: "Your are joined" });
        }

    } catch (error) {
        if (error.message === 'Email already exists but not verified') {
            return res.status(409).json({ error: error.message });
        }
        console.log(error);
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

    const { email, otp, test_id } = JWT.get(token);
    if (!validateOTP(email, otp)) {
        return res.status(403).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                    <h2 style="color: #FF0000;">Error</h2>
                    <p>Token Expired. Please sign up again after 24 hours.</p>
                </body>
            </html>
        `);
    }
    try {
        await database.verify(test_id, email);
        return res.status(200).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                    <h2 style="color: #4CAF50;">Verification Successful</h2>
                    <p>Your email has been verified successfully. You can now <a href="${process.env.FRONTEND_STUDENT_URL}" style="color: #4CAF50;">login</a>.</p>
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

async function submitResponse(req, res) {
    const token = req.headers.auth;
    const { email, test_id } = JWT.get(token);
    const { score, response } = req.body;
    try {
        await database.submitResponse(email, test_id, score, JSON.stringify(response));
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function makeSuspend(req, res) {
    const token = req.headers.auth;
    const { email, test_id } = JWT.get(token);
    try {
        await database.makeSuspend(email, test_id);
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { login, signup, verify, submitResponse, makeSuspend };