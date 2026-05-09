"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data 5 dakika fresh kalır
            staleTime: 5 * 60 * 1000,
            // 30 dakika cache'de tutulur
            gcTime: 30 * 60 * 1000,
            // Sayfa focus olduğunda yeniden fetch etme
            refetchOnWindowFocus: false,
            // Network yeniden bağlandığında yeniden fetch etme
            refetchOnReconnect: false,
            // Hata retry ayarları
            retry: 1,
            retryDelay: 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
