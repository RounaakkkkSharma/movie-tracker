"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return <p className="p-6">Loading...</p>;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-500">
        Welcome to Movie Tracker
      </h1>
      <p className="mb-8 text-center max-w-xl">
        Keep track of movies you want to watch and movies you have already seen.
        Manage your watchlist, rate movies, and enjoy your personalized dashboard!
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/auth/signin")}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/auth/signup")}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
