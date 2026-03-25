import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChoreQuest",
  description: "Hester Family Chore Tracker — earn coins, grow your pet!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
