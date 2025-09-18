"use client";

import { useEffect, useState } from "react";
import { GithubIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Repo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    updated_at: string;
    clone_url: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

export default function Dashboard() {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(5); // you can change this
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();
    useEffect(() => {
        async function fetchRepos() {
            setLoading(true);
            try {
                const res = await fetch(`/api/repos?page=${page}&per_page=${perPage}`);
                const data = await res.json();

                // Assuming API returns { repos: Repo[], total: number }
                setRepos(data.repos);
                setTotalPages(data.pagination.hasNextPage ? page + 1 : page);
            } catch (err) {
                console.error("Failed to fetch repos", err);
            } finally {
                setLoading(false);
            }
        }
        fetchRepos();
    }, [page, perPage]);

    const filteredRepos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-black text-white px-6 py-12">
            {/* Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Let&apos;s build something new.</h1>
                <p className="text-neutral-400 mt-2 text-sm">
                    To deploy a new Project, import an existing Git Repository or get started with one of our Templates.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Import Git Repos */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Import Git Repository</h2>

                    {/* Search bar */}
                    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 mb-4">
                        <GithubIcon className="h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-neutral-500"
                        />
                    </div>

                    {/* Repo List */}
                    {loading ? (
                        <p className="text-neutral-500 text-sm">Loading repositories...</p>
                    ) : filteredRepos.length === 0 ? (
                        <p className="text-neutral-500 text-sm">No repositories found.</p>
                    ) : (
                        <ul className="divide-y divide-neutral-800">
                            {filteredRepos.map((repo) => (
                                <li
                                    key={repo.id}
                                    className="flex items-center justify-between py-3 hover:bg-neutral-900 px-2 rounded-md transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={repo.owner.avatar_url}
                                            alt={repo.owner.login}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{repo.name}</p>
                                            <p className="text-xs text-neutral-500">
                                                {repo.private ? (
                                                    <span className="flex items-center gap-1">
                                                        <LockIcon className="h-3 w-3" /> Private
                                                    </span>
                                                ) : (
                                                    "Public"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            router.push(`/deploy/${repo.clone_url}`);
                                        }}
                                    >
                                        Import
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 rounded bg-neutral-800 text-xs text-white disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <p className="text-xs text-neutral-500">
                            Page {page} of {totalPages}
                        </p>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded bg-neutral-800 text-xs text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    <p className="text-xs text-neutral-500 mt-4">
                        Import Third-Party Git Repository →
                    </p>
                </div>

                {/* Templates */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Clone Template</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-neutral-800 rounded-md overflow-hidden hover:border-neutral-600 transition cursor-pointer">
                            <div className="bg-neutral-900 h-32 flex items-center justify-center text-neutral-400 text-sm">
                                Next.js Boilerplate
                            </div>
                            <div className="p-3 text-xs text-neutral-400">Next.js Boilerplate</div>
                        </div>
                        <div className="border border-neutral-800 rounded-md overflow-hidden hover:border-neutral-600 transition cursor-pointer">
                            <div className="bg-neutral-900 h-32 flex items-center justify-center text-neutral-400 text-sm">
                                AI Chatbot
                            </div>
                            <div className="p-3 text-xs text-neutral-400">AI Chatbot</div>
                        </div>
                        <div className="border border-neutral-800 rounded-md overflow-hidden hover:border-neutral-600 transition cursor-pointer">
                            <div className="bg-neutral-900 h-32 flex items-center justify-center text-neutral-400 text-sm">
                                Commerce
                            </div>
                            <div className="p-3 text-xs text-neutral-400">Commerce</div>
                        </div>
                        <div className="border border-neutral-800 rounded-md overflow-hidden hover:border-neutral-600 transition cursor-pointer">
                            <div className="bg-neutral-900 h-32 flex items-center justify-center text-neutral-400 text-sm">
                                Vite + React
                            </div>
                            <div className="p-3 text-xs text-neutral-400">Vite + React Starter</div>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-4">Browse All Templates →</p>
                </div>
            </div>
        </main>
    );
}
