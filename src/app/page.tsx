"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { CopyIcon } from "lucide-react";

type InputForm = {
  repositoryUrl: string;
  applicationName: string;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");

  const onSubmit: SubmitHandler<InputForm> = async (data) => {
    setLoading(true);
    setMessage("");
    setDeployedUrl("");
    try {
      const response = await axios.post("http://localhost:3001/api/deploy", data);
      setMessage(`✅ Deployed to: ${response.data.url}`);
      setDeployedUrl(response.data.url);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Devploy</h1>
        <p className="text-lg text-center mt-2">
          Devploy is a platform for developers to deploy their applications
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full md:w-1/2 p-6 mt-6 border rounded-md"
        >
          <Input placeholder="Repository URL" {...register("repositoryUrl", { required: true })} />
          {errors.repositoryUrl && <p className="text-red-500">Repository URL is required</p>}
          <Input placeholder="Application Name (subdomain)" {...register("applicationName", { required: true })} />
          {errors.applicationName && <p className="text-red-500">Application Name is required</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Deploying..." : "Deploy"}
          </Button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
        <div className="flex flex-row gap-4">
          {deployedUrl && <p className="mt-4 text-center">{deployedUrl} <CopyIcon className="inline" onClick={() => navigator.clipboard.writeText(deployedUrl)} size={20} cursor="pointer" /></p>}
          {deployedUrl && <Button className="mt-4" onClick={() => window.open(deployedUrl, "_blank")}>Open</Button>}
        </div>
      </div>
    </main>
  );
}
