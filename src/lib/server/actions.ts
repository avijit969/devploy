"use server";
import db from "@/db";
import { projects } from "@/db/schema";
import { auth } from "../auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const createProject = async (projectData: {
  name: string;
  description?: string;
  repoUrl: string;
  liveUrl?: string;
  status?: string;
}) => {
  const { name, description, repoUrl, liveUrl } = projectData;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const result = await db
    .insert(projects)
    .values({
      name,
      description,
      repo_url: repoUrl,
      userId: session.user.id,
      live_url: liveUrl,
      deploy_status: projectData.status || "pending",
    })
    .returning();

  return result;
};

export const isProjectNameTaken = async (name: string) => {
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.name, name))
    .limit(1);
  return existingProject.length > 0;
};
export const getProjectById = async (id: number) => {
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return project[0] || null;
};
export const getUserProjects = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const allprojects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id));
  return allprojects;
};

export const deleteProject = async (id: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const result = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();
  return result;
};
