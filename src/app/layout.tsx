import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "joguinho pra tonton",
  description: "joguinho pra tonton",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}