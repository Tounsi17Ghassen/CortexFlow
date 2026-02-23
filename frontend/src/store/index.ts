import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members: string[];
}

interface Page {
  _id: string;
  title: string;
  content: any;
  workspace: string;
  parent?: string;
  archived: boolean;
  lastEditedBy?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  pages: Page[];
  currentPage: Page | null;
  fetchWorkspaces: () => Promise<void>;
  fetchWorkspace: (id: string) => Promise<void>;
  fetchPages: (workspaceId: string) => Promise<void>;
  fetchPage: (pageId: string) => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  createPage: (workspaceId: string, title: string, parentId?: string) => Promise<Page>;
  updatePage: (pageId: string, data: Partial<Page>) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        set({ user: data.user, token: data.token });
      },
      register: async (name, email, password) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        set({ user: data.user, token: data.token });
      },
      logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },
    }),
    { name: 'auth-storage' }
  )
);

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  pages: [],
  currentPage: null,
  fetchWorkspaces: async () => {
    const { data } = await axios.get('/api/workspaces');
    set({ workspaces: data });
  },
  fetchWorkspace: async (id) => {
    const { data } = await axios.get(`/api/workspaces/${id}`);
    set({ currentWorkspace: data });
  },
  fetchPages: async (workspaceId) => {
    const { data } = await axios.get(`/api/workspaces/${workspaceId}/pages`);
    set({ pages: data });
  },
  fetchPage: async (pageId) => {
    const { data } = await axios.get(`/api/pages/${pageId}`);
    set({ currentPage: data });
  },
  createWorkspace: async (name, description) => {
    const { data } = await axios.post('/api/workspaces', { name, description });
    set((state) => ({ workspaces: [...state.workspaces, data] }));
    return data;
  },
  createPage: async (workspaceId, title, parentId) => {
    const { data } = await axios.post('/api/pages', { workspaceId, title, parentId });
    set((state) => ({ pages: [...state.pages, data] }));
    return data;
  },
  updatePage: async (pageId, pageData) => {
    await axios.put(`/api/pages/${pageId}`, pageData);
    set((state) => ({
      pages: state.pages.map((p) => (p._id === pageId ? { ...p, ...pageData } : p)),
      currentPage: state.currentPage?._id === pageId
        ? { ...state.currentPage, ...pageData }
        : state.currentPage,
    }));
  },
  deletePage: async (pageId) => {
    await axios.delete(`/api/pages/${pageId}`);
    set((state) => ({
      pages: state.pages.filter((p) => p._id !== pageId),
      currentPage: state.currentPage?._id === pageId ? null : state.currentPage,
    }));
  },
}));
