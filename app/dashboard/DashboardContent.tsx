"use client";

import { useState, useEffect } from "react";
import MoviesPage from "./MoviesPage";
import WatchlistPage from "./WatchlistPage";
import WatchedPage from "./WatchedPage";

interface Props {
  userId: number;
  totalMovies: number;
}

export default function DashboardContent({ userId, totalMovies }: Props) {
  const [activeSection, setActiveSection] = useState<
    "home" | "movies" | "watchlist" | "watched" | "profile"
  >("home");

  const [watchlistCount, setWatchlistCount] = useState<number>(0);
  const [watchedCount, setWatchedCount] = useState<number>(0);

  // Fetch initial counts
  useEffect(() => {
    const fetchCounts = async () => {
      const [watchRes, watchedRes] = await Promise.all([
        fetch(`/api/watchlist?userId=${userId}`),
        fetch(`/api/watched?userId=${userId}`)
      ]);
      const watchData = await watchRes.json();
      const watchedData = await watchedRes.json();
      setWatchlistCount(watchData.length);
      setWatchedCount(watchedData.length);
    };
    fetchCounts();
  }, [userId]);

  const renderSection = () => {
    switch (activeSection) {
      case "movies":
        return (
          <MoviesPage
            userId={userId}
            onWatchlistChange={(newCount: number) => setWatchlistCount(newCount)}
            onWatchedChange={(newCount: number) => setWatchedCount(newCount)}
          />
        );
      case "watchlist":
        return (
          <WatchlistPage
            userId={userId}
            onWatchlistChange={(newCount: number) => setWatchlistCount(newCount)}
            onWatchedChange={(newCount: number) => setWatchedCount(newCount)}
          />
        );
      case "watched":
        return (
          <WatchedPage
            userId={userId}
            onWatchlistChange={(newCount: number) => setWatchlistCount(newCount)}
            onWatchedChange={(newCount: number) => setWatchedCount(newCount)}
          />
        );
      case "profile":
        return <p>Profile details section.</p>;
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-lg font-bold mb-2">Total Movies</h2>
                <p className="text-2xl font-bold text-blue-500">{totalMovies}</p>
              </div>
              <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-lg font-bold mb-2">Watchlist</h2>
                <p className="text-2xl font-bold text-blue-500">{watchlistCount}</p>
              </div>
              <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                <h2 className="text-lg font-bold mb-2">Watched</h2>
                <p className="text-2xl font-bold text-blue-500">{watchedCount}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6 flex-wrap">
        {["home", "movies", "watchlist", "watched", "profile"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeSection === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setActiveSection(tab as typeof activeSection)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>{renderSection()}</div>
    </div>
  );
}
