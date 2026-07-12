import api from "./api";
import * as mockAuth from "./mockAuth";
import { USE_MOCK_AUTH } from "../utils/authMode";

export async function login(email, password) {
  if (USE_MOCK_AUTH) return mockAuth.login(email, password);
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function register(payload) {
  if (USE_MOCK_AUTH) return mockAuth.register(payload);
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function fetchCurrentUser() {
  if (USE_MOCK_AUTH) return mockAuth.fetchCurrentUser();
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("transitops_token");
  localStorage.removeItem("transitops_user");
}
