import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { DM_Sans } from "next/font/google";
import { dark } from "@clerk/themes";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nextusnest",
  description: "All in one Agency Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider appearance={{baseTheme:dark}}>
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider
       attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
  <body className={font.className}>{children}</body>
      </ThemeProvider>
    
    </html>
    </ClerkProvider>
  );
}
