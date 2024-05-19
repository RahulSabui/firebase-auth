"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

import Cookies from 'js-cookie';


const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth();
  const router = useRouter();


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

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const onSignOut = async () => {
    try {
      await signOut(auth);
      Cookies.remove('token');
      console.log("Sign-out successful.");
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to Dashboard
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <button
            onClick={onSignOut}
            className="mb-6 lg:mb-0 px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-700 transition duration-300"
          >
            LOGOUT
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between p-56">
        {currentUser ? (
          <div>
            <div>Dashboard - Welcome, {currentUser?.email}</div>
          
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </main>
  );
};

export default Home;


// ki3K1QPO7LwLoynGf2tZ