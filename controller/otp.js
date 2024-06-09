const otps = new Map();

function getOTP(email) {
    const getRandomValue = Math.floor(100000 + Math.random() * 999999);
    otps.set(email, getRandomValue);
    return getRandomValue;
}

function validateOTP(email, otp) {
    if (otps.has(email) && otps.get(email) === Number(otp)) {
        otps.delete(email);
        return true;
    } else {
        return false;
    }
}

module.exports = { getOTP, validateOTP };