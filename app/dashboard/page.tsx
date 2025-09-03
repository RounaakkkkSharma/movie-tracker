import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import DashboardWrapper from "./DashboardWrapper";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  const userId = parseInt(session.user.id);

  // Fetch user including watchlist & watched
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { watchlist: true, watched: true },
  });

  if (!user) return <div>User not found.</div>;

  // Fetch total movies count from TMDB
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`
  );
  const data = await res.json();
  const totalMovies = data.total_results;

  return (
    <DashboardWrapper
      user={user}
      totalMovies={totalMovies}
      watchlistCount={user.watchlist.length}
      watchedCount={user.watched.length}
    />
  );
}
