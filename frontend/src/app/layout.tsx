import "./globals.css";
import Providers from "../components/Providers";

export const metadata = {
  title: "MAGERWA Vehicle Management System",
  description: "Professional vehicle tracking and management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}