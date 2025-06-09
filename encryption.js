//encryption algorithm

const encoder = new TextEncoder();
const decoder = new TextDecoder();

//AES-GCM algorithm configuration
const algorithm = {
    name: "AES-GCM",
    length: 256
};

const ivLength = 12; // 96 bits

//generate new aes-gcm key
export async function generateKey() {
    return await crypto.subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]);
}

//derive key from a password/passphrase (PBKDF2) and a Uint8Array salt
export async function getKeyFromPassphrase(passphrase, saltBytes) {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(passphrase),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBytes,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        algorithm,
        false,
        ["encrypt", "decrypt"]
    );
}

//Encrypt data using AES-GCM
export async function encryptData(text, key) {
    const iv = crypto.getRandomValues(new Uint8Array(ivLength));
    const encodedText = encoder.encode(text);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedText
    );

    return {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
    };
}

//Decrypt encrypted object
export async function decryptText(encryptedObj, key) {
    const iv = new Uint8Array(encryptedObj.iv);
    const encryptedData = new Uint8Array(encryptedObj.data);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        encryptedData
    );
    return decoder.decode(decrypted);
}

export function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16)); // 128 bits
}