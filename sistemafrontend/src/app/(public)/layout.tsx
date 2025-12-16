import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sistema Acadêmico",
  description: "Sistema para controle de notas escolares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#0B1526", color: "#FFF" }}>{children}</body>
    </html>
  );
}
