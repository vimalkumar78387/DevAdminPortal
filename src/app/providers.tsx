"use client";

import { SWRConfig } from "swr";
import { Toaster } from "react-hot-toast";

const fetcher = async (input: string | URL | Request, init?: RequestInit) => {
  const res = await fetch(input, { credentials: "include", ...init });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </SWRConfig>
  );
}
