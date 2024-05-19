"use client";
import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
// import { GoogleAuthProvider } from "firebase/auth/cordova";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const authData = auth.currentUser;
  console.log(authData, "{authdata}");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCookies(auth?.currentUser);
      router.replace("/TwoFA");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      console.log(auth?.currentUser, "vhbjnkml");
      setCookies(auth?.currentUser);
      router.replace("/TwoFA");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleMicrosoftSignIn = async () => {
    const provider = new OAuthProvider("microsoft.com");
    try {
      await signInWithPopup(auth, provider);
      console.log(provider);
      setCookies(auth?.currentUser);
      router.replace("/TwoFA");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const setCookies = (user:any) => {
    // Example: Set a cookie named "user" with user's ID
    Cookies.set('token', user?.email, { expires: 1 });
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 sm:p-10">
      <div className="mt-12 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Login</h2>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="flex justify-center gap-2">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoogleSignIn}
              className="bg-white hover:bg-gray-100 text-black font-bold p-3 rounded-full focus:outline-none focus:shadow-outline flex items-center"

              // className=" bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                fill="currentColor"
              >
                <path
                  fill="#4285F4"
                  d="M44.5 20H24v8.5h11.8c-1.7 4.7-6 8-11.8 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.2 0 6.1 1.2 8.3 3.1l6.2-6.2C33.6 7.2 29 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c10 0 18.4-7.2 19-17h-8.5z"
                />
                <path
                  fill="#34A853"
                  d="M6.3 14.5L12 18.8c1.7-3.5 4.7-6.3 8.3-7.7l-6.2-6.2c-3.7 2-6.7 5-8.8 8.6z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 5c4.9 0 9.4 1.9 12.8 5l6.2-6.2C38.6 1.5 31.6 0 24 0 17.4 0 11.5 2.3 6.9 6.1l6.2 6.2c2.2-1.4 4.9-2.3 7.9-2.3z"
                />
                <path
                  fill="#EA4335"
                  d="M44.5 20H24v8.5h11.8c-1.7 4.7-6 8-11.8 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.2 0 6.1 1.2 8.3 3.1l6.2-6.2C33.6 7.2 29 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c10 0 18.4-7.2 19-17h-8.5z"
                />
              </svg>
              Google
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleMicrosoftSignIn}
              // className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              // className=" bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              className="bg-white hover:bg-gray-100 text-black font-bold p-3 rounded-full focus:outline-none focus:shadow-outline flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
              Microsoft
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
