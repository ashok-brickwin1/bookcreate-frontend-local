import { useEffect, useRef, useState } from "react";
import { checkBookStatus, fetchResearchData } from "@/api/bookSetup";

export function useBookStatus(bookId: string | null) {
  const [status, setStatus] = useState<string | null>(null);
  const [researchData, setResearchData] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  console.log("useBookStatus hook called with bookid",bookId)

  useEffect(() => {
    if (!bookId) return;
    console.log("polling started")

    intervalRef.current = setInterval(async () => {
      try {
        const res = await checkBookStatus(bookId);
        setStatus(res.status);
        

        if (res.status === "outline_ready") {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }

          const researchRes = await fetchResearchData(bookId);
          setResearchData(researchRes.research_data);
        }
      } catch (err) {
        console.error("Status polling failed", err);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookId]);

  return { status, researchData };
}
