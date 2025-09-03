"use client";

import { useState } from "react";
import LogoutButton from "./LogoutButton";
import MoviesPage from "./MoviesPage";
import WatchlistPage from "./WatchlistPage";
import WatchedPage from "./WatchedPage";

export default function DashboardWrapper({
  user,
  totalMovies,
  watchlistCount,
  watchedCount,
}: any) {
  const [activeSection, setActiveSection] = useState<
    "home" | "movies" | "watchlist" | "watched" | "profile"
  >("home");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col p-6 wrap-break-word">
        <div className="flex items-center mb-8">
          <img
            src={user.profilePic || "https://i.pravatar.cc/150?img=12"}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-sm w-36 text-gray-500 dark:text-gray-400 break-words ">
              {user.email}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-4">
          <button
            className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            onClick={() => setActiveSection("home")}
          >
            Home
          </button>
          <button
            className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            onClick={() => setActiveSection("movies")}
          >
            Movies
          </button>
          <button
            className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            onClick={() => setActiveSection("watchlist")}
          >
            Watchlist
          </button>
          <button
            className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            onClick={() => setActiveSection("watched")}
          >
            Watched
          </button>
          <button
            className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </button>
          <button
            className="text-left p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition text-red-600"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Profile
          </button>

          <LogoutButton />
        </nav>
      </aside>
      {showDeleteModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
      <p className="mb-6">Are you sure you want to delete your profile? This action cannot be undone.</p>
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={async () => {
            try {
              await fetch(`/api/user/${user.id}`, {
                method: "DELETE",
              });
              // Redirect to home or sign-in after deletion
              window.location.href = "/auth/signin";
            } catch (err) {
              console.error(err);
              alert("Failed to delete profile.");
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
{showDeleteModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm z-50">
    <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded shadow-lg w-96 backdrop-blur-md">
      <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
      <p className="mb-6">Are you sure you want to delete your profile? This action cannot be undone.</p>
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={async () => {
            try {
              await fetch(`/api/user/${user.id}`, {
                method: "DELETE",
              });
              // Redirect to home or sign-in after deletion
              window.location.href = "/auth/signin";
            } catch (err) {
              console.error(err);
              alert("Failed to delete profile.");
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeSection === "home" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">
              Welcome back, {user.name}!
            </h1>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-lg font-bold mb-2">Total Movies</h2>
                <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {totalMovies}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-lg font-bold mb-2">Watchlist</h2>
                <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {watchlistCount}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-lg font-bold mb-2">Watched</h2>
                <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {watchedCount}
                </p>
              </div>
            </section>
          </div>
        )}

        {activeSection === "movies" && (
          <MoviesPage userId={parseInt(user.id)} />
        )}
        {activeSection === "watchlist" && (
          <WatchlistPage userId={parseInt(user.id)} />
        )}
        {activeSection === "watched" && (
          <WatchedPage userId={parseInt(user.id)} />
        )}

        {activeSection === "profile" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Profile Details</h1>
            <section className="bg-white dark:bg-gray-800 p-6 rounded shadow">
              <p>
                <span className="font-semibold">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Member since:</span>{" "}
                {new Date(user.createdAt).toDateString()}
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
