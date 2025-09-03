// app/dashboard/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/"); // Redirect to homepage after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="text-left p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
    >
      Logout
    </button>
  );
}
