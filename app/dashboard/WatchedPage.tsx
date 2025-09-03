"use client";

import { useEffect, useState } from "react";

interface WatchedMovie {
  id: number; // include DB id so we can delete
  movieId: number;
  title: string;
  poster: string | null;
  rating: number ;
}

interface Props {
  userId: number;
  onWatchlistChange?: (newCount: number) => void;
  onWatchedChange?: (newCount: number) => void;
}


export default function WatchedPage({ userId }: Props) {
  const [watched, setWatched] = useState<WatchedMovie[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWatched = async () => {
    if (!userId) return;
    setLoading(true);
    const res = await fetch(`/api/watched?userId=${userId}`);
    const data = await res.json();
    setWatched(data);
    setLoading(false);
  };

const deleteWatched = async (movieId: number) => {
  try {
    const res = await fetch(`/api/watched`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, movieId }),
    });

    if (res.ok) {
      setWatched((prev) => prev.filter((movie) => movie.movieId !== movieId));
    } else {
      const err = await res.json();
      console.error("Delete failed:", err.error);
    }
  } catch (error) {
    console.error("Error deleting watched movie:", error);
  }
};

  useEffect(() => {
    fetchWatched();
  }, [userId]);

  if (loading) return <p>Loading watched movies...</p>;
  if (!watched.length) return <p>You haven't watched any movies yet.</p>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {watched.map((movie) => (
        <div key={movie.id} className="border rounded p-4 relative">
          {movie.poster && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
              alt={movie.title}
              className="mb-2 rounded"
              loading="lazy"
            />
          )}
          <h2 className="font-bold text-lg">{movie.title}</h2>
          <p className="text-yellow-500 font-semibold mt-1">
            Rating: {movie.rating}/10
          </p>

          {/* Delete button */}
          <button
            onClick={() => deleteWatched(movie.movieId)}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
