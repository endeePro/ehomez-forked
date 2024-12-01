import { useEffect, useState } from "react";

interface IPResponse {
  ip: string;
}

export const useUserIP = () => {
  const [ip, setIP] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
          throw new Error("Failed to fetch IP address");
        }
        const data: IPResponse = await response.json();
        setIP(data.ip);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      }
    };

    fetchIP();
  }, []);

  return { ip, error };
};
