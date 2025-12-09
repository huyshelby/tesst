import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import RequireAuth from "@/components/require-auth";
import { ModeToggle } from "@/components/mode-toggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
          {/* <ModeToggle></ModeToggle>x */}
        </ThemeProvider>
      </body>
    </html>
  );
}
