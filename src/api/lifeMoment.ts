import axios from "axios";
import { VITE_API_BASE_URL } from "@/const";

const API_BASE = VITE_API_BASE_URL;


export interface LifeMomentPayload {
  moment_type: "high" | "low";
  life_stage: "foundations" | "growth" | "mastery" | "wisdom";
  year?: number;
  what_happened: string;
  story?: string;
  lesson_learned?: string;
}

export const createLifeMoment = async (payload: LifeMomentPayload) => {
  const res = await axios.post("/life-moments", payload);
  return res.data;
};

export const fetchLifeMoments = async () => {
  const res = await axios.get("/life-moments");
  return res.data;
};

export const deleteLifeMoment = async (id: string) => {
  await axios.delete(`/life-moments/${id}`);
};


export const bulkSaveLifeMoments = async (
  moments: LifeMomentPayload[]
) => {
    
//   const { data } = await axios.post("/life-moments/bulk", {
//     moments,
//   });
//   return data;

try {
    const token = localStorage.getItem("access_token");
    const payload={"moments":moments}

    const res = await fetch(
      `${API_BASE}/life-moments/bulk/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Submission failed");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to submit answer", err);
  }
};  