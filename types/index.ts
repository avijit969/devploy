interface Rroject {
  id: string;
  name: string;
  description: string | null;
  repo_url: string;
  live_url: string | null;
  deploy_status: string;
  userId: string;
}

interface User {
  name: string;
  email: string;
  avatar: string;
  accessToken?: string;
}

export type { Rroject, User };
