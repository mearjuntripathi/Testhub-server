const crypto = require('crypto');
require('dotenv').config();

class JWT {
    #base64UrlEncode(data) {
        return Buffer.from(data).toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    #base64UrlDecode(data) {
        const padded = data + '='.repeat((4 - data.length % 4) % 4);
        return Buffer.from(padded, 'base64').toString('utf8');
    }

    constructor() {
        this.secret = process.env.SECRET_KEY;
    }

    set(payload) {
        const header = { alg: 'HS256', typ: 'JWT' };
        const headerEncoded = this.#base64UrlEncode(JSON.stringify(header));
        const payloadEncoded = this.#base64UrlEncode(JSON.stringify(payload));
        const data = `${headerEncoded}.${payloadEncoded}`;
        const signature = crypto.createHmac('sha256', this.secret).update(data).digest('base64');
        const token = `${data}.${this.#base64UrlEncode(signature)}`;
        return token;
    }

    verify(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return false; // Token has incorrect format
        }

        const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
        const data = `${headerEncoded}.${payloadEncoded}`;
        const signature = crypto.createHmac('sha256', this.secret).update(data).digest('base64');
        const signatureDecoded = this.#base64UrlDecode(signatureEncoded);
        return signature === signatureDecoded;
    }

    get(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null; // Token has incorrect format
        }

        const [headerEncoded, payloadEncoded] = parts;
        const payloadDecoded = this.#base64UrlDecode(payloadEncoded);
        return JSON.parse(payloadDecoded);
    }
}

// // Example usage
const jwt = new JWT();
// const payload = { userId: 123, username: 'arjuntripathi' };

// const token = jwt.set(payload);
// console.log('Generated Token:', token);

// const isTokenValid = jwt.verify(token);
// console.log('Is Token Valid:', isTokenValid);

// const decodedData = jwt.get(token);
// console.log('Decoded Data:', decodedData);

module.exports = jwt;