import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API,
  timeout: 10000,
});

export async function getBhajans(params?: {
  search?: string;
  category?: string | null;
}) {
  const res = await api.get("/bhajans", {
    params: {
      search: params?.search || undefined,
      category: params?.category || undefined,
    },
  });

  return res.data;
}

export async function searchBhajans(q: string) {
  const res = await api.get("/bhajans/search", {
    params: { q },
  });

  return res.data;
}

export async function getCategories() {
  const res = await api.get("/categories");
  return res.data;
}