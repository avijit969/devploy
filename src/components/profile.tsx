"use client";
import React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOutIcon } from "lucide-react";
import useAuthStore from "@/store/auth";

const authClient = createAuthClient();

function Profile() {
    const user = useAuthStore((state) => state)
    const router = useRouter();

    const handleLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    toast.success("Logged out successfully");
                },
            },
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-neutral-700 hover:ring-neutral-500 transition">
                    <AvatarImage
                        src={
                            user?.avatar ??
                            "https://github.com/nextauthjs.png"
                        }
                    />
                    <AvatarFallback>
                        {user?.name?.[0] ?? "U"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="bottom"
                align="end"
                className="w-64 rounded-xl border border-neutral-800 bg-neutral-950 p-4 shadow-xl"
            >
                {/* User Info */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                        <AvatarImage
                            src={
                                user?.avatar ??
                                "https://github.com/nextauthjs.png"
                            }
                        />
                        <AvatarFallback>
                            {user?.name?.[0] ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="font-medium text-white">
                            {user?.name ?? "Guest"}
                        </p>
                        <p className="text-sm text-neutral-400 truncate">
                            {user?.email ?? "No email"}
                        </p>
                    </div>
                </div>

                <DropdownMenuSeparator className="my-3 bg-neutral-800" />

                {/* Actions */}
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition"
                >
                    <LogOutIcon className="h-4 w-4" />
                    Logout
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Profile;
