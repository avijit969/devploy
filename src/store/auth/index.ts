import { create } from "zustand";

type State = {
  name: string;
  email: string;
  avatar: string;
  accessToken?: string;
  isAuthenticated: boolean;
};

type Actions = {
  login: (user: {
    name: string;
    email: string;
    avatar: string;
    accessToken?: string;
  }) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<State, "isAuthenticated">>) => void;
};

const useAuthStore = create<State & Actions>((set) => ({
  name: "",
  email: "",
  avatar: "",
  accessToken: undefined,
  isAuthenticated: false,

  // actions
  login: (user) =>
    set(() => ({
      ...user,
      isAuthenticated: true,
    })),

  logout: () =>
    set(() => ({
      name: "",
      email: "",
      avatar: "",
      accessToken: undefined,
      isAuthenticated: false,
    })),

  updateProfile: (updates) =>
    set((state) => ({
      ...state,
      ...updates,
    })),
}));

export default useAuthStore;
