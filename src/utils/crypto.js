import CryptoJS from 'crypto-js';
import nacl from 'tweetnacl';

const passwordToKey = (password, salt) => {
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 1000,
    });

    return key.toString(CryptoJS.enc.Hex);
};

const insertSalt = (face_encodings, salt, position) => {
    face_encodings.splice(position, 0, ...salt);
    return face_encodings;
};

const extractSalt = (saltedFaceEncodings, position) => {
    const saltLength = 32;
    const salt = saltedFaceEncodings.slice(position, position + saltLength);
    const faceEncodings = saltedFaceEncodings.slice(0, position).concat(saltedFaceEncodings.slice(position + saltLength));
    return {
        faceEncodings: faceEncodings,
        salt: salt
    };
};

const validatePin = (pin, face_encodings_length) => {
    return Number.isInteger(pin) && pin >= 0 && pin < face_encodings_length;
}

const generateKeyPair = (face_encodings, pin) => {
    if (typeof face_encodings === 'string') {
        face_encodings = face_encodings.split('');
    }
    if (!validatePin(pin, face_encodings.length)) {
        throw new Error("Invalid PIN");
    }
    const password = process.env.REACT_APP_PASSWORD;
    const randomSalt = CryptoJS.lib.WordArray.random(16).toString();
    const combinedSalt = randomSalt + pin;
    const saltedFaceEncodings = insertSalt(face_encodings, combinedSalt, pin);
    const secretKey = passwordToKey(password, JSON.stringify(saltedFaceEncodings));
    const keyPair = nacl.box.keyPair.fromSecretKey(new Uint8Array(secretKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))));

    return {
        publicKey: Array.from(keyPair.publicKey).map(byte => byte.toString(16).padStart(2, '0')).join(''),
        privateKey: Array.from(keyPair.secretKey).map(byte => byte.toString(16).padStart(2, '0')).join(''),
        saltedFaceEncodings: saltedFaceEncodings,
    };
};


const restoreKeyPair = (saltedFaceEncodings, pin) => {
    if (typeof saltedFaceEncodings === 'string') {
        saltedFaceEncodings = saltedFaceEncodings.split('');
    }
    const password = process.env.REACT_APP_PASSWORD;
    const { faceEncodings, salt } = extractSalt(saltedFaceEncodings, pin);
    const newSaltedFaceEncodings = insertSalt(faceEncodings, salt, pin);
    const secretKey = passwordToKey(password, JSON.stringify(newSaltedFaceEncodings));
    const keyPair = nacl.box.keyPair.fromSecretKey(new Uint8Array(secretKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))));

    return {
        publicKey: Array.from(keyPair.publicKey).map(byte => byte.toString(16).padStart(2, '0')).join(''),
        privateKey: Array.from(keyPair.secretKey).map(byte => byte.toString(16).padStart(2, '0')).join(''),
    };
};



















const encrypt = (text, publicKey, privateKey) => {
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const encryptedMessage = nacl.box(
        new Uint8Array(text.split('').map(char => char.charCodeAt(0))),
        nonce,
        new Uint8Array(publicKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
        new Uint8Array(privateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    );

    return {
        nonce: Array.from(nonce).map(byte => byte.toString(16).padStart(2, '0')).join(''),
        message: Array.from(encryptedMessage).map(byte => byte.toString(16).padStart(2, '0')).join(''),
    };
};


const decrypt = (encryptedMessage, publicKey, privateKey) => {
    const decryptedMessage = nacl.box.open(
        new Uint8Array(encryptedMessage.message.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
        new Uint8Array(encryptedMessage.nonce.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
        new Uint8Array(publicKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
        new Uint8Array(privateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    );

    if (!decryptedMessage) {
        throw new Error('Decryption failed');
    }

    return Array.from(decryptedMessage).map(byte => String.fromCharCode(byte)).join('');
};




export { generateKeyPair, restoreKeyPair, encrypt, decrypt };


// Example
// const keyPair = generateKeyPair(password, face_encodings);
//         console.log('Сгенерированный ключевой пары:', keyPair);

//         const restoredKeyPair = restoreKeyPair(password, face_encodings);
//         console.log('Восстановленные ключевые пары:', restoredKeyPair);

//         const text = 'Hello, world!';
//         const encryptedData = encrypt(text, keyPair.publicKey, keyPair.privateKey);
//         console.log('Зашифрованные данные:', encryptedData);

//         const decryptedText = decrypt(encryptedData, keyPair.publicKey, keyPair.privateKey);
//         console.log('Расшифрованный текст:', decryptedText);
