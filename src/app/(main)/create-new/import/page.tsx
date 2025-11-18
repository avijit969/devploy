"use client";
import { Button } from "@/components/ui/button";
import { createProject, isProjectNameTaken } from "@/lib/server/actions";
import { registerGithubWebhook } from "@/lib/server/web-hook";
import useAuthStore from "@/store/auth";
import { createAuthClient } from "better-auth/react";
import { Github, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
const { useSession, getAccessToken } = createAuthClient();
export default function CreateProjectWithGithubId() {
    const params = useSearchParams();
    const { data } = useSession();
    const githubUrl = params.get("github-url");

    const defaultName = githubUrl
        ?.split("/")
        .pop()
        ?.replace(".git", "");

    const [projectName, setProjectName] = useState(defaultName || "");
    const [isTaken, setIsTaken] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isStarted, setIsStarted] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [deployedUrl, setDeployedUrl] = useState("");
    const [deployLogs, setDeployLogs] = useState("");
    const [accessToken, setAccessToken] = useState<string>("");

    useEffect(() => {
        (async () => {
            const token = await getAccessToken(
                {
                    providerId: "github",
                    userId: data?.session.userId || "",
                }
            );
            setAccessToken(token.data?.accessToken || "");
        }
        )()
        console.log("accessToken", accessToken);
    }, [data]);
    const handleDeploy = () => {
        if (!githubUrl || !projectName || isTaken) return;

        startTransition(async () => {
            setIsStarted(true);
            await registerGithubWebhook({
                accessToken: accessToken,
                owner: githubUrl.split("/")[3],
                repo: githubUrl.split("/")[4].replace(".git", ""),
                webhookUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webhook`,
                secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET!,
            });
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deploy`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repositoryUrl: githubUrl,
                    applicationName: projectName,
                }),
            });

            if (!response.ok) {
                console.error("Deployment failed");
                return;
            }

            const data = await response.json();
            await createProject({
                name: projectName,
                repoUrl: githubUrl,
                liveUrl: data.url,
                status: "success"
            });
            setDeployedUrl(data.url);
            setDeployLogs(data.logs);
            setIsDone(true);
        });
    };

    useEffect(() => {
        if (!projectName) return;

        startTransition(async () => {
            const result = await isProjectNameTaken(projectName);
            setIsTaken(result);
        });
    }, [projectName]);

    if (isDone) {
        return (
            <div className="min-h-screen bg-black text-white flex justify-center py-10 px-4">
                <div className="w-full max-w-2xl border border-neutral-800 rounded-xl p-6 space-y-6 bg-neutral-950">

                    <h1 className="text-3xl font-semibold">Deployment Successful 🎉</h1>

                    <p className="text-neutral-400">
                        Your project <strong>{projectName}</strong> has been deployed successfully.
                    </p>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                        <p className="text-neutral-400 text-sm mb-2">Live URL:</p>
                        <a
                            href={deployedUrl}
                            target="_blank"
                            className="text-blue-400 underline break-all"
                        >
                            {deployedUrl}
                        </a>
                    </div>

                    <div className="relative w-full overflow-hidden rounded-lg border border-neutral-800"
                        style={{ paddingTop: "62.5%" }}  // 16:10 ratio (good for desktop)
                    >
                        <iframe
                            src={deployedUrl}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                        ></iframe>
                    </div>


                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 max-h-64 overflow-auto whitespace-pre-wrap text-sm">
                        <p className="text-neutral-400 text-sm mb-2">Build Logs:</p>
                        <pre className="text-neutral-300">{deployLogs}</pre>
                    </div>
                </div>
            </div>
        );
    }
    if (isStarted && !isDone) {
        return (
            <div className="min-h-screen bg-black text-white flex justify-center py-10 px-4">
                <div className="w-full max-w-2xl border border-neutral-800 rounded-xl p-6 space-y-6 bg-neutral-950">
                    <h1 className="text-3xl font-semibold">Deployment Started</h1>
                    <p className="text-neutral-400">
                        Deployment has started for <strong>{projectName}</strong>.
                    </p>
                    <p className="text-neutral-500 text-sm">
                        Fetching build logs and finishing deployment...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex justify-center py-10 px-4">
            <div className="w-full max-w-2xl border border-neutral-800 rounded-xl p-6 space-y-8 bg-neutral-950">

                <h1 className="text-3xl font-semibold tracking-tight">Create New Project</h1>

                {/* GitHub box */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-2">
                    <p className="text-neutral-400 text-sm">Importing from GitHub</p>
                    <div className="flex items-center gap-2 text-neutral-200">
                        <Github className="w-5 h-5" />
                        <span className="truncate">
                            {githubUrl?.replace("https://github.com/", "").replace(".git", "")}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Project Name */}
                    <div className="space-y-1">
                        <label className="text-sm text-neutral-400">Project Name</label>
                        <input
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 focus:outline-none"
                        />
                        {projectName && (
                            <p className={`text-xs ${isTaken ? "text-red-400" : "text-green-400"}`}>
                                {isTaken ? "Name is already taken" : "Name is available"}
                            </p>
                        )}
                    </div>

                    {/* Framework */}
                    <div className="space-y-1">
                        <label className="text-sm text-neutral-400">Framework Preset</label>
                        <button className="w-full flex justify-between items-center bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2">
                            <span className="flex items-center gap-2">
                                <img src="/vite.svg" className="w-5 h-5" />
                                Vite
                            </span>
                            <ChevronDown className="w-4 h-4 text-neutral-400" />
                        </button>
                    </div>

                    {/* Root Directory */}
                    <div className="space-y-1">
                        <label className="text-sm text-neutral-400">Root Directory</label>
                        <div className="flex gap-2">
                            <input
                                defaultValue="./"
                                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                            />
                            <button className="bg-neutral-800 px-3 rounded-md border border-neutral-700">
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-md px-4 py-3 flex justify-between items-center cursor-pointer">
                        <span>Build & Output Settings</span>
                        <ChevronDown className="w-4 h-4 text-neutral-300" />
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-md px-4 py-3 flex justify-between items-center cursor-pointer">
                        <span>Environment Variables</span>
                        <ChevronDown className="w-4 h-4 text-neutral-300" />
                    </div>
                </div>

                {/* Deploy Button */}
                <Button
                    className="w-full py-3 text-md"
                    disabled={!projectName || isTaken || isPending}
                    onClick={handleDeploy}
                >
                    {isPending ? "Deploying..." : "Deploy Project"}
                </Button>
            </div>
        </div>
    );
}
