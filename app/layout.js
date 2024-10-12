import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Miguel's Calculator: Calculadora de Algebra",
  description: "Uma calculadora de algebra feita com integração com o GPT-4o para resoluções com explicações passo a passo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
