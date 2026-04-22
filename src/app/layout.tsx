import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/hooks/use-theme";
import { cn } from "@/utils/cn";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "SplitFair",
    template: "%s | SplitFair",
  },
  description: "Fair expense splitting for group trips",
};

function ThemeScript() {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static theme script, no user input
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem("splitfair-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})()`,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={cn(outfit.variable, "bg-background font-sans antialiased")}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
