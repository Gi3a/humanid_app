import CryptoJS from 'crypto-js';
import * as openpgp from 'openpgp';


// Генерирует соленное лицо
export function generateSaltedFaceEncodings(face_encodings, pin) {
    const salt = CryptoJS.SHA256(face_encodings + pin).toString();
    const saltWithPin = salt + pin;
    const position = parseInt(pin) % face_encodings.length;
    const saltedFaceEncodings = face_encodings.slice(0, position) + saltWithPin + face_encodings.slice(position);
    return { saltedFaceEncodings };
}

// Достает соль из лица
export function extractSalt(saltedFaceEncodings, pin) {
    const pinStr = pin.toString();
    const saltWithPinLength = 64 + pinStr.length;
    const position = parseInt(pin) % saltedFaceEncodings.length;
    const saltWithPin = saltedFaceEncodings.substr(position, saltWithPinLength);
    const salt = saltWithPin.substr(0, 64);
    return salt;
}

// Восстановление соленного лица
export function recoverSaltedFaceEncodings(faceEncodings, extractedSalt, pin) {
    const pinStr = pin.toString();
    const position = parseInt(pin) % faceEncodings.length;
    return (
        faceEncodings.slice(0, position) +
        extractedSalt +
        pinStr +
        faceEncodings.slice(position)
    );
}

// Восстановление оригинального лица
export function recoverFaceEncodings(saltedFaceEncodings, pin) {
    const pinStr = pin.toString();
    const saltWithPinLength = 64 + pinStr.length;
    const position = parseInt(pin) % saltedFaceEncodings.length;

    const beforeSalt = saltedFaceEncodings.substring(0, position);

    const afterSalt = saltedFaceEncodings.substring(position + saltWithPinLength);

    const recoveredFaceEncodings = beforeSalt + afterSalt;

    return recoveredFaceEncodings;
}

// def recover_face_encodings(salted_face_encodings, pin):
//     pin_str = str(pin)
//     salt_with_pin_length = 64 + len(pin_str)
//     position = int(pin) % len(salted_face_encodings)

//     before_salt = salted_face_encodings[:position]
//     after_salt = salted_face_encodings[position + salt_with_pin_length:]

//     recovered_face_encodings = before_salt + after_salt
//     return recovered_face_encodings

export async function encryptData(data, publicKeysArmored) {
    if (!Array.isArray(publicKeysArmored)) {
        publicKeysArmored = [publicKeysArmored];
    }

    const publicKeys = await Promise.all(
        publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))
    );

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: data }), // input as Message object
        encryptionKeys: publicKeys,
    });

    return encrypted;
}



export async function decryptData(encryptedData, privateKeyArmored, passphrase) {

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });


    const message = await openpgp.readMessage({
        armoredMessage: encryptedData // parse armored message
    });

    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
    });


    return decrypted
}

export async function generateKeyPair(saltedFaceEncodings, name, email) {
    const { privateKey, publicKey } = await openpgp.generateKey({
        type: "rsa",
        rsaBits: 2048,
        userIDs: [{ name, email }],
        passphrase: saltedFaceEncodings,
    });

    return { privateKeyArmored: privateKey, publicKeyArmored: publicKey };
}


// Instead letters using digitals
// export function generateSaltedFaceEncodings(face_encodings, pin) {
//     const salt = CryptoJS.SHA256(face_encodings + pin).toString();
//     const saltWithPin = salt + pin;
//     const position = parseInt(pin) % face_encodings.length;

//     const saltedFaceEncodingsArray = face_encodings
//       .split("")
//       .map((char, index) => {
//         const saltChar = saltWithPin[index % saltWithPin.length];
//         return ((char.charCodeAt(0) + saltChar.charCodeAt(0)) % 10).toString();
//       });

//     const saltedFaceEncodings = saltedFaceEncodingsArray.join("");
//     return { saltedFaceEncodings, salt };
//   }
