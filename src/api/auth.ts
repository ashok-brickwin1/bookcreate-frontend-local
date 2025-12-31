import { VITE_API_BASE_URL } from "@/const";



const API_BASE = VITE_API_BASE_URL;

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);   // OAuth2 uses "username"
  formData.append("password", password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return res.json(); // { access_token, token_type }
}


export async function register(
  email: string,
  password: string,
  fullName?: string
) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Signup failed");
  }

  return res.json();
}
