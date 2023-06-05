import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import CryptoJS from 'crypto-js';
import * as openpgp from 'openpgp';
import { keccak256 } from 'js-sha3';

export function generatePinnedFaceEncodings(face_encodings, pin) {
    const position = parseInt(pin) % face_encodings.toString().length;
    const saltedFaceEncodings = face_encodings.slice(0, position) + pin + face_encodings.slice(position);
    const hash = CryptoJS.SHA256(saltedFaceEncodings).toString();
    return hash;
}

export async function encryptData(data, publicKeysArmored) {
    if (!Array.isArray(publicKeysArmored)) {
        publicKeysArmored = [publicKeysArmored];
    }

    const publicKeys = await Promise.all(
        publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))
    );

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: data }),
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
        armoredMessage: encryptedData
    });

    const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
    });


    return decrypted
}


export async function generateKeyPair(pinnedFaceEncodings, name, email) {
    const { privateKey, publicKey } = await openpgp.generateKey({
        type: "rsa",
        rsaBits: 2048,
        userIDs: [{ name, email }],
        passphrase: pinnedFaceEncodings,
    });

    return { privateKeyArmored: privateKey, publicKeyArmored: publicKey };
}

export function generatePublicKey(email, phone) {
    const data = `${email}:${phone}`;
    const publicKeyArray = nacl.hash(naclUtil.decodeUTF8(data));

    // Ethereum address is the last 20 bytes of the keccak256 hash of the public key
    const publicKey = '0x' + keccak256.array(publicKeyArray).slice(-20).map(byte => byte.toString(16).padStart(2, '0')).join('');

    return publicKey;
}

export function viewPublicKey(key) {
    return (key.slice(0, 5) + "..." + key.slice(-4));
}