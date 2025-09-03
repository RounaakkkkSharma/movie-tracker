"use client";

import { useEffect, useState } from "react";

interface Movie {
  movieId: number;
  title: string;
  poster: string | null;
}

interface Props {
  userId: number;
  onWatchlistChange?: (newCount: number) => void;
  onWatchedChange?: (newCount: number) => void;
}

export default function WatchlistPage({
  userId,
  onWatchlistChange,
  onWatchedChange
}: Props) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/watchlist?userId=${userId}`);
      const data = await res.json();
      setWatchlist(data);
      onWatchlistChange?.(data.length); // update dashboard
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId: number) => {
    try {
      await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, movieId }),
      });
      const newList = watchlist.filter((m) => m.movieId !== movieId);
      setWatchlist(newList);
      onWatchlistChange?.(newList.length); // update dashboard
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkWatched = async (movie: Movie) => {
  const rating = prompt("Rate this movie (1-10):");
  if (!rating) return;

  try {
    // Add movie to watched
    await fetch("/api/watched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        movieId: movie.movieId,
        title: movie.title,
        poster: movie.poster,
        rating: Number(rating),
      }),
    });

    // Remove from watchlist
    await handleRemove(movie.movieId);

    // Fetch updated watched count and update dashboard
    const watchedRes = await fetch(`/api/watched?userId=${userId}`);
    const watchedData = await watchedRes.json();
    onWatchedChange?.(watchedData.length);

    alert(`${movie.title} added to watched list!`);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    fetchWatchlist();
  }, [userId]);

  if (loading) return <p>Loading watchlist...</p>;
  if (!watchlist.length) return <p>Your watchlist is empty.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {watchlist.map((movie) => (
        <div key={movie.movieId} className="border rounded p-4">
          {movie.poster && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
              alt={movie.title}
              className="mb-2 rounded"
              loading="lazy"
            />
          )}
          <h2 className="font-bold text-lg">{movie.title}</h2>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleMarkWatched(movie)}
              className="bg-blue-500 text-white px-2 py-1 rounded flex-1"
            >
              Mark as Watched
            </button>
            <button
              onClick={() => handleRemove(movie.movieId)}
              className="bg-red-500 text-white px-2 py-1 rounded flex-1"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
