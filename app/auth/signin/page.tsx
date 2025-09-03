"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      router.push("/"); // redirect to home/dashboard
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 border rounded flex flex-col gap-3" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4 ">Sign In</h1>
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded cursor-pointer">
          Sign In
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-blue-600 underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
