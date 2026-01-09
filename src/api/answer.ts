import { VITE_API_BASE_URL } from "@/const";
import { BasicInfo } from "@/components/journey/BasicInfoStep";

const API_BASE = VITE_API_BASE_URL;


export interface SaveAnswerPayload {
  dummy_question_id: string;

  category?: string;
  sub_section?: string;
  life_stage?: string;

  title?: string;
  prompt?: string;
  help_text?: string;
  context_prompt?: string;

  answer_text?: string;
}

export const saveAnswer = async (payload: SaveAnswerPayload) => {
//   const res = await api.post("/answers/save", payload);
//   return res.data;

console.log("called to save answer with payload",payload)

try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/answers/save`,
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
    // onComplete(formData); // keep your existing flow
    return data;
  } catch (err) {
    console.error("Failed to submit answer", err);
  }
};

export const bulkSaveAnswers = async (answers: SaveAnswerPayload[]) => {
//   const res = await api.post("/answers/bulk-save", { answers });
//   return res.data;
return 
try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/answers/bulk-save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(answers),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Submission failed");
    }

    const data = await res.json();
    // onComplete(formData); // keep your existing flow
    return data;
  } catch (err) {
    console.error("Failed to submit answer", err);
  }

};



export const fetchSavedAnswers = async () => {
  const token = localStorage.getItem("access_token");
  console.log("fetchSavedAnswers called with token:", token);
  const res = await fetch(`${API_BASE}/answers/dummy`, {
    method: "GET",
    headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch saved answers");
  }

  return res.json();
};