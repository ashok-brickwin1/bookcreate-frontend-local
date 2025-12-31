import { VisionQuestion } from "@/types/vision";

import { VITE_API_BASE_URL } from "@/const";



const API_BASE = VITE_API_BASE_URL;

export async function fetchVisionQuestions(): Promise<VisionQuestion[]> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_BASE}/vision/question/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch vision questions");
  }

  return res.json();
}
