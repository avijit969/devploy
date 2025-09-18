"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { GithubIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter()
  const handleLogin = () => {
    authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => {
          router.push("/dashboard");
          toast.success("Logged in successfully");
        },
        onError: () => {
          toast.error("Failed to log in");
        },
      },
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black text-white">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 [background-size:40px_40px] select-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to_right, #262626 1px, transparent 1px), linear-gradient(to_bottom, #262626 1px, transparent 1px)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-10 shadow-2xl backdrop-blur-md">
        {/* Logo / Title */}
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Devploy
        </h1>

        {/* Tagline */}
        <p className="text-center text-base text-neutral-400">
          Connect your GitHub repo and deploy instantly on secure, scalable
          infrastructure. Code, push, and let Devploy handle the rest.
        </p>

        {/* Auth button */}
        <Button
          onClick={handleLogin}
          size={"lg"}
          variant={"outline"}
          className="w-full flex items-center gap-2"
        >
          <GithubIcon className="h-5 w-5" />
          Continue with GitHub
        </Button>
      </div>
    </main>
  );
}

export default Login;
