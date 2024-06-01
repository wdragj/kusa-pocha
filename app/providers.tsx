"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
// import { AppRouterCacheProvider as MUIProvider } from "@mui/material-nextjs/v13-appRouter";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      {/* <MUIProvider> */}
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      {/* </MUIProvider> */}
    </NextUIProvider>
  );
}
