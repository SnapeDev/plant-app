"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Import the user context for login state
import Link from "next/link";

export default function HomePage() {
  const { isLoggedIn } = useState(); // Access login state
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard"); // Redirect logged-in users to the dashboard
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Grow</h1>
      <div className="space-x-4">
        <Link href="/login">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
