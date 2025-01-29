"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../../../context/UserContext";

export default function AppLayout({ children }) {
  const router = useRouter();

  const { isLoggedIn, logout, login } = useUser();

  // Check login status on initial mount and dynamically
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (token && user) {
        login(user); // Update state based on token presence
      }
    };

    checkLoginStatus();

    // Listen for changes to localStorage
    window.addEventListener("storage", checkLoginStatus);

    // Cleanup listener on unmount
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Handle log out
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    localStorage.removeItem("user"); // Clear user details
    logout(); // Update context state
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-plants bg-cover">
      <header className="bg-white text-black p-4 shadow-md">
        <nav className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-700 hover:text-green-800 font-playfair font-semibold">
            GROW
          </h1>
          <div className="space-x-4">
            {isLoggedIn ? (
              // Show when logged in
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/add">Add Plant</Link>
                <button className="text-blue-500" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              // Show when logged out
              <>
                <Link href="/login">Login</Link>
                <Link href="/sign-up">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
