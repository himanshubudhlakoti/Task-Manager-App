import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import envConfig from "src/src-gate/libs/security/env.config";

const saltRounds: number = 10;
//encryption config------------
const ENCRYPTION_KEY: string = envConfig.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH: number = 16; // For AES, this is always 16
//-----------------------------
export async function getHashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, saltRounds);
}

export async function comparePassword(plainPassword: string, hashPassword: string): Promise<boolean> {
    let match = await bcrypt.compare(plainPassword, hashPassword);
    if (match) {
        return true;
    } else {
        return false;
    }
}

export function encryption(plainText: string): string {

    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(plainText);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryption(encryptedText: string): string {
    let textParts = encryptedText.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedTextUpdated = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedTextUpdated);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString('utf-8'));
}
