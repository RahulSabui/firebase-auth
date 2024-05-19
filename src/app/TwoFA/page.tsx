'use client';
import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  generateOTPSecret,
  generateQRCodeURL,
  generateQRCode,
} from "@/utils/auth";
import { authenticator } from "otplib";
import Image from "next/image";
import { auth } from "@/utils/firebase";
import { db } from "@/utils/firestore"; 
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const TwoFA: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fireStoredata, setFireStoredata] =  useState<string>("");
  const [qrCode, setQRCode] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setCurrentUser(user);
        console.log(user);
      } else {
        setCurrentUser(null);
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGenerateQRCode = async () => {
    const newSecret = generateOTPSecret();
    setSecret(newSecret);
    const user = currentUser?.email || "";
    const otpauth = generateQRCodeURL(newSecret, user);
    const qrCodeDataURL = await generateQRCode(otpauth);
    if (qrCodeDataURL) {
        setQRCode(qrCodeDataURL);
      } 

    try {
      const q = query(collection(db, "users"), where("email", "==", currentUser?.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
        await updateDoc(userDocRef, {
          secret: newSecret,
          updatedAt: new Date(),
        });
        console.log("Secret updated in Firestore");
      } else {
        await addDoc(collection(db, "users"), {
          email: currentUser?.email,
          secret: newSecret,
          createdAt: new Date(),
        });
        console.log("Secret and email stored in Firestore");
      }
    } catch (e) {
      console.error("Error adding or updating document: ", e);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    try {
      const q = query(collection(db, "users"), where("email", "==", currentUser?.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const storedSecret = userData.secret;
        setFireStoredata(userData.email);
        console.log(storedSecret, otpCode);

        if (authenticator.check(otpCode, storedSecret)) {
          setVerificationMessage("OTP is valid!");
          router.replace("/");
        } else {
          setVerificationMessage("OTP is invalid. Please try again.");
        }
      } else {
        setVerificationMessage("No secret found for this email.");
      }
    } catch (e) {
      console.error("Error verifying OTP: ", e);
      setVerificationMessage("An error occurred. Please try again.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Two-Factor Authentication
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Please open the Authenticator app and enter the code.
        </p>
        {fireStoredata && (
          <button
            onClick={handleGenerateQRCode}
            className="w-full px-4 py-2 mb-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Generate QR Code
          </button>
        )}

        {qrCode && (
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Scan the QR code with your Authenticator app
            </h2>
            <Image
              src={qrCode}
              alt="QR Code"
              width={200}
              height={200}
              className="mb-4"
            />
          </div>
        )}

        <div className="flex justify-center mb-4">
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className="w-12 h-12 mx-1 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOTP}
          className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300"
        >
          Verify OTP
        </button>

        {verificationMessage && (
          <p className="mt-4 text-center font-medium text-gray-700">
            {verificationMessage}
          </p>
        )}
      </div>
    </main>
  );
};

export default TwoFA;
