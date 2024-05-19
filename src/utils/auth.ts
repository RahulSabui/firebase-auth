// utils/auth.js
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export const generateOTPSecret = () => {
  const secret = authenticator.generateSecret();
  return secret;
};

export const generateQRCodeURL = (secret:any, user:any) => {
  const otpauth = authenticator.keyuri(user, 'Authentication-5', secret);
  return otpauth;
};

export const generateQRCode = async (otpauth:any) => {
  try {
    const qrCode = await QRCode.toDataURL(otpauth);
    return qrCode;
  } catch (error) {
    console.error('Could not generate QR code', error);
    return null;
  }
};
