// src/api/bookSetup.ts
import { VITE_API_BASE_URL } from "@/const";
import { BookSetupData } from "@/components/journey/BookSetupStep";


import axios from "axios";
const API_BASE = VITE_API_BASE_URL;


// export async function submitBookSetup(data: any) {
//   const res = await axios.post("/api/book/create", {
//     book_setup: data,
//   });
//   return res.data;
// }

export async function checkBookStatus(bookId: string) {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${API_BASE}/book/status/${bookId}`,{
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  });
  return res.data;
}

export async function fetchResearchData(bookId: string) {
  const token = localStorage.getItem("access_token");
  const res = await axios.get(`${API_BASE}/book/research-data/${bookId}`,{
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  });
  return res.data;
}




export async function submitBookSetup(data: BookSetupData) {
  const token = localStorage.getItem("access_token");
  

  const payload = {
    book_setup: {
      genre: data.genre,
      custom_genre: data.genre === "custom" ? data.customGenre : null,
      working_title: data.workingTitle,
      chapter_count: data.chapterCount,
      desired_length: data.desiredLength,
      dedication: data.dedication,
      gdpr_consent: data.gdprConsent,
    },
  };

  const newjourney = localStorage.getItem("newjourney");
  const path=newjourney==="true"?"book/create":"book/update";

  const res = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to submit book setup");
  }
  console.log("Book setup submitted successfully", res);
  const resp = await res.json();
  if(!resp.success){
    console.log("Book setup submission unsuccessful:", resp.message);
    throw new Error("Book setup submission unsuccessful");
  }
  console.log("Book setup response data:", resp);

  return resp;
}



export const CreateBookOutline = async (
) => {
    

try {
  console.log("create book outline called")
    const token = localStorage.getItem("access_token");
    const current_book_id = localStorage.getItem("current_book_id");


    const res = await fetch(
      `${API_BASE}/book/create/outline/${current_book_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!res.ok) {
      console.log("response not ok from create outline")
      const err = await res.json();
      throw new Error(err.detail || "Submission failed");
    }
    console.log("response ok from create outline")

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to submit create book outline", err);
  }
};  




export const CreateBookFinal = async (
) => {
    

try {
  console.log("create book final called")
    const token = localStorage.getItem("access_token");
    const current_book_id = localStorage.getItem("current_book_id");


    const res = await fetch(
      `${API_BASE}/book/pdf/create/${current_book_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Submission failed");
    }
    console.log("response from create book final:", res);
    

    const data = await res.json();
    console.log("create book final response data:", data);
    // if(!data.success){
    //   throw new Error("Failed to create book pdf");
    // }
    return data;
  } catch (err) {
    console.error("Failed to submit create book pdf final", err);
  }
};  




export const fetchBookSetup = async () => {
  console.log("Fetching book setup data");
  const newjourney = localStorage.getItem("newjourney");
  if(newjourney==="true") {
    console.log("newjourney:", newjourney);
    return null;
  }
  const path=newjourney==="true"?"book/setup/dummy/empty":"book/last-book-data";
  const token = localStorage.getItem("access_token");
  
  const res = await fetch(`${API_BASE}/${path}`, {
    method: "GET",
    headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch book setup");
  }

  return res.json();
};