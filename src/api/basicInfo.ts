
import { VITE_API_BASE_URL } from "@/const";
import { BasicInfo } from "@/components/journey/BasicInfoStep";

const API_BASE = VITE_API_BASE_URL;


// export const handleSubmitBasicInfo = async (payload) => {
//   console.log("handle submitbasicinfo called")
//
//
//
//   try {
//     const token = localStorage.getItem("access_token");
//     const refresh_token = localStorage.getItem("refresh_token");
//
//     const res = await fetch(
//       `${API_BASE}/onboarding/submit`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify(payload),
//       }
//     );
//
//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.detail || "Submission failed");
//     }
//
//     const data = await res.json();
//     // onComplete(formData); // keep your existing flow
//     return data;
//   } catch (err) {
//     console.error("Failed to submit onboarding", err);
//   }
// };


export const handleSubmitBasicInfo = async (payload) => {
  console.log("handleSubmitBasicInfo called");

  const submitRequest = async (accessToken) => {
    return fetch(`${API_BASE}/onboarding/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  };

  try {
    let accessToken = localStorage.getItem("access_token");

    // 1️⃣ first attempt
    let res = await submitRequest(accessToken);

    // 2️⃣ access token expired → refresh
    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

        console.log("REFRESH TOKEN SENT:", refreshToken); // 🔴 must log a JWT

        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });


      if (!refreshRes.ok) {
        throw new Error("Session expired. Please login again.");
      }

      const refreshData = await refreshRes.json();
      accessToken = refreshData.access_token;
      localStorage.setItem("access_token", accessToken);

      // 🔁 retry SAME API
      res = await submitRequest(accessToken);
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Submission failed");
    }

    return await res.json();

  } catch (err) {
    console.error("Failed to submit onboarding:", err.message);
    throw err;
  }
};