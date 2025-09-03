"use client";

import { useEffect, useState, useRef } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

interface Props {
  userId: number;
  onWatchlistChange?: (newCount: number) => void;
  onWatchedChange?: (newCount: number) => void;
}


export default function MoviesPage({
  userId,
  onWatchlistChange,
  onWatchedChange
}: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [watchedIds, setWatchedIds] = useState<number[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchMovies = async (pageNum = 1, search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies?page=${pageNum}&query=${encodeURIComponent(search)}`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLists = async () => {
    if (!userId) return;
    try {
      const [watchRes, watchedRes] = await Promise.all([
        fetch(`/api/watchlist?userId=${userId}`),
        fetch(`/api/watched?userId=${userId}`)
      ]);
      const watchData = await watchRes.json();
      const watchedData = await watchedRes.json();
      setWatchlistIds(watchData.map((m: any) => m.movieId));
      setWatchedIds(watchedData.map((m: any) => m.movieId));
      onWatchlistChange?.(watchData.length);
      onWatchedChange?.(watchedData.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies(page, query);
  }, [page]);

  useEffect(() => {
    fetchUserLists();
  }, [userId]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchMovies(1, query);
    }, 500);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query]);

  const handleAddWatchlist = async (movie: Movie) => {
    if (!userId) return alert("Please log in first");
    if (watchlistIds.includes(movie.id) || watchedIds.includes(movie.id)) return;

    setWatchlistIds((prev) => {
      const newIds = [...prev, movie.id];
      onWatchlistChange?.(newIds.length);
      return newIds;
    });

    try {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path
        })
      });
    } catch (err) {
      console.error(err);
      setWatchlistIds((prev) => prev.filter((id) => id !== movie.id));
      onWatchlistChange?.(watchlistIds.length);
    }
  };

  const handleAddWatched = async (movie: Movie) => {
    if (!userId) return alert("Please log in first");
    if (watchedIds.includes(movie.id)) return;

    const rating = prompt("Rate this movie (1-10):");
    if (!rating) return;

    setWatchedIds((prev) => {
      const newIds = [...prev, movie.id];
      onWatchedChange?.(newIds.length);
      return newIds;
    });

    if (watchlistIds.includes(movie.id)) {
      setWatchlistIds((prev) => {
        const newIds = prev.filter((id) => id !== movie.id);
        onWatchlistChange?.(newIds.length);
        return newIds;
      });
      fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, movieId: movie.id })
      }).catch(console.error);
    }

    try {
      await fetch("/api/watched", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          rating: Number(rating)
        })
      });
    } catch (err) {
      console.error(err);
      setWatchedIds((prev) => prev.filter((id) => id !== movie.id));
      onWatchedChange?.(watchedIds.length);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Movies</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="border rounded p-4">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="mb-2 rounded"
                />
              )}
              <h2 className="font-bold text-lg">{movie.title}</h2>
              <p className="text-sm text-gray-500">{movie.release_date}</p>

              <div className="mt-2 flex gap-2">
                <button
                  className={`bg-green-500 text-white px-2 py-1 rounded ${
                    watchlistIds.includes(movie.id) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleAddWatchlist(movie)}
                  disabled={watchlistIds.includes(movie.id) || watchedIds.includes(movie.id)}
                >
                  {watchlistIds.includes(movie.id) ? "In Watchlist" : "Add to Watchlist"}
                </button>

                <button
                  className={`bg-blue-500 text-white px-2 py-1 rounded ${
                    watchedIds.includes(movie.id) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleAddWatched(movie)}
                  disabled={watchedIds.includes(movie.id)}
                >
                  {watchedIds.includes(movie.id) ? "Watched" : "Add to Watched"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2 py-2">{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
