"use client";

import { getUserProjects } from "@/lib/server/actions";
import useAuthStore from "@/store/auth";
import { createAuthClient } from "better-auth/react";
import { MenuIcon, PlusIcon, EllipsisVertical, Ellipsis } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import ProjectCard from "@/components/project-card";
const { useSession, getAccessToken } = createAuthClient();

export default function Dashboard() {

    const { data: session } = useSession();
    const { login } = useAuthStore();
    const [projects, setProjects] = useState<{ id: string; name: string; repo: string, liveUrl: string }[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (session) {
            login({
                name: session.user.name,
                email: session.user.email,
                avatar: session.user.image || "",
                accessToken: session.session.token || "",
            });
        }
    }, [session, login]);
    useEffect(() => {
        setLoading(true);
        getUserProjects().then((data) => {
            setProjects(
                data.map((project: any) => ({
                    id: project.id.toString(),
                    name: project.name,
                    repo: project.repo_url,
                    liveUrl: project.live_url,
                }))
            );
        }).finally(() => setLoading(false));

    }, []);
    return (
        <main className="min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-white p-4 transition-colors">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="lg:text-2xl md:text-xl text-sm font-semibold">
                    Welcome, {session?.user?.name ?? "Guest"} 👋
                </h1>
                <Link
                    href="/create-new"
                    className="flex items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 lg:text-xl text-xs font-medium text-neutral-900 hover:bg-neutral-300 transition dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                    <PlusIcon className="h-4 w-4" />
                    <p className="lg:text-xl text-xs">New Project</p>
                </Link>
            </div>
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Skeleton className=" h-32 mb-4" />
                    <Skeleton className=" h-32 mb-4" />
                    <Skeleton className=" h-32 mb-4" />
                </div>
            )}
            {!loading && !projects.length ? (
                <div className="flex flex-col items-center justify-center mt-32 gap-4">
                    <div className="rounded-full bg-neutral-100 dark:bg-neutral-900 p-6 border border-neutral-300 dark:border-neutral-900">
                        <PlusIcon className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <h2 className="text-lg font-medium">No projects yet</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Create your first project and start deploying instantly.
                    </p>
                    <Link
                        href="/create-new"
                        className="mt-4 rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-300 transition dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        Create New Project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </main>
    );
}
