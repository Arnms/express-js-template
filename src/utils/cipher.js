/**
 * Use these functions when using two-way encryption.
 */

const crypto = require('node:crypto');

const cipherConfig = {
    key: process.env.CIPHER_KEY,
    salt: process.env.CIPHER_SALT,
    ivLength: process.env.CIPHER_IV_LENGTH
};

exports.encryptedAes256 = (value) => {
    const iv = crypto.randomBytes(cipherConfig.ivLength);
    const key = crypto.scryptSync(cipherConfig.key, cipherConfig.salt, 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encryptedText =
        cipher.update(value, 'utf8', 'base64') + cipher.final('base64');
    const authTag = cipher.getAuthTag();
    const result = [
        iv.toString('hex'),
        authTag.toString('hex'),
        encryptedText
    ].join(':');

    return result;
};

exports.decryptedAes256 = (value) => {
    const decryptKeys = value.split(':');
    const key = crypto.scryptSync(cipherConfig.key, cipherConfig.salt, 32);
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(decryptKeys[0], 'hex')
    );

    decipher.setAuthTag(Buffer.from(decryptKeys[1], 'hex'));
    const decryptedText = decipher.update(decryptKeys[2], 'base64', 'utf8');
    const result = decryptedText + decipher.final('utf8');

    return result;
};
