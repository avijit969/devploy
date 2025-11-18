"use client";

import { getProjectById } from "@/lib/server/actions";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export default function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const [project, setProject] = useState<{
        name: string;
        description: string | null;
        repo_url: string;
        live_url: string | null;
        deploy_status: string;
        userId: string;
    }>({
        name: "",
        description: null,
        repo_url: "",
        live_url: null,
        deploy_status: "",
        userId: "",
    });

    useEffect(() => {
        getProjectById(Number(id)).then((data) => setProject(data as any));
    }, [id]);

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">{project.name || "Loading..."}</h1>
                {project.deploy_status && (
                    <Badge
                        variant={
                            project.deploy_status === "success"
                                ? "default"
                                : project.deploy_status === "failed"
                                    ? "destructive"
                                    : "secondary"
                        }
                    >
                        {project.deploy_status}
                    </Badge>
                )}
            </div>

            {/* Project Details */}
            <div className="bg-muted/40 p-6 rounded-xl space-y-3 shadow-md">
                <p className="text-gray-700">
                    <strong>Description:</strong> {project.description || "No description"}
                </p>

                <p className="text-gray-700">
                    <strong>Repository:</strong>{" "}
                    <a
                        href={project.repo_url}
                        target="_blank"
                        className="text-blue-600 underline"
                    >
                        {project.repo_url}
                    </a>
                </p>

                <p className="text-gray-700">
                    <strong>Live URL:</strong>{" "}
                    {project.live_url ? (
                        <a
                            href={project.live_url}
                            target="_blank"
                            className="text-blue-600 underline"
                        >
                            {project.live_url}
                        </a>
                    ) : (
                        "Not deployed"
                    )}
                </p>

                {/* Preview Button */}
                {project.live_url && (
                    <Button asChild>
                        <a href={project.live_url} target="_blank" className="flex items-center gap-2">
                            Preview Website <ExternalLink size={16} />
                        </a>
                    </Button>
                )}
            </div>

            {/* Iframe Preview */}
            {project.live_url ? (
                <div className="border rounded-xl shadow-lg overflow-hidden">
                    <iframe
                        src={project.live_url}
                        className="w-full h-[650px] border-0"
                    />
                </div>
            ) : (
                <p className="text-center text-gray-500 py-10 text-lg">
                    No live preview available.
                </p>
            )}
        </div>
    );
}
