import { Ellipsis, Trash } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        repo: string;
        liveUrl: string;
    };
}

function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="group block rounded-lg border border-neutral-300 bg-neutral-100 p-6 hover:border-neutral-400 transition dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold group-hover:text-neutral-900 dark:group-hover:text-white text-neutral-700 dark:text-neutral-300">
                    {project.name}
                </h3>

                {/* Prevent dropdown click from triggering card link */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="p-1"
                    >
                        <Ellipsis className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        onClick={(e) => e.stopPropagation()} // stops Link navigation
                    >
                        <DropdownMenuItem>Add to Favorite</DropdownMenuItem>
                        <DropdownMenuItem>View Logs</DropdownMenuItem>

                        <DropdownMenuItem className="text-red-600">
                            Delete
                            <Trash className="ml-2 h-4 w-4 text-red-500" />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <p className="text-sm text-neutral-500 pl-2">Repository</p>

                        <DropdownMenuItem>
                            <Link href={project.repo} target="_blank">
                                View Git Repository
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                {project.repo}
            </p>

            {project.liveUrl && (
                <Link
                    href={project.liveUrl}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()} // avoid opening project page
                    className="mt-4 inline-block text-sm text-blue-600 underline"
                >
                    Live URL
                </Link>
            )}
        </Link>
    )
}

export default ProjectCard;
