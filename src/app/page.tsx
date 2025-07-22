"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import axios from "axios";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner"; // ensure this package is installed
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type InputForm = {
  repositoryUrl: string;
  applicationName: string;
};

const { useSession } = createAuthClient();

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<InputForm>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const onSubmit: SubmitHandler<InputForm> = async (data) => {
    setLoading(true);
    setMessage("");
    setDeployedUrl("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}/api/deploy`,
        data
      );
      setMessage(`✅ Deployed to: ${response.data.url}`);
      setDeployedUrl(response.data.url);
    } catch (err) {
      setMessage("❌ Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (deployedUrl) {
      navigator.clipboard.writeText(deployedUrl);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold">Devploy</h1>
        <p className="text-lg text-center mt-2">
          Devploy is a platform for developers to deploy their applications
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full md:w-1/2 p-6 mt-6 border rounded-md"
        >
          <Input
            placeholder="Repository URL"
            {...register("repositoryUrl", { required: true })}
          />
          {errors.repositoryUrl && (
            <p className="text-red-500">Repository URL is required</p>
          )}

          <Input
            placeholder="Application Name (subdomain)"
            {...register("applicationName", { required: true })}
          />
          {errors.applicationName && (
            <p className="text-red-500">Application Name is required</p>
          )}

          <Button type="submit" disabled={loading} className="relative">
            {loading ? (
              <>
                <span className="absolute left-3 w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></span>
                Deploying...
              </>
            ) : (
              "Deploy"
            )}
          </Button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}

        {deployedUrl && (
          <div className="flex flex-row items-center gap-4 mt-4">
            <p className="text-center">
              {deployedUrl}{" "}
              <CopyIcon
                onClick={handleCopy}
                size={20}
                className="inline cursor-pointer"
                aria-label="Copy URL"
              />
            </p>
            <Button onClick={() => window.open(deployedUrl, "_blank")}>
              Open
            </Button>
          </div>
        )}

        {session?.user && (
          <p className="mt-4 text-center text-sm text-gray-500">
            Logged in as: <span className="font-medium">{session.user.name}</span>
          </p>
        )}
        {session?.user && (
          <Button onClick={() => authClient.signOut(
            {
              fetchOptions: {
                onSuccess: () => {
                  router.push("/login")
                  toast.success("Logged out successfully")
                }
              }
            }
          )}>Sign out</Button>
        )}
      </div>
    </main>
  );
}
