import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "../index.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mayara & Rychell — Lista de casamento",
  description: "Lista de presentes do casamento de Mayara e Rychell",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💍</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased`}
        style={{ background: "#F7F2EA", margin: 0 }}
      >
        <div
          style={{
            maxWidth: 390,
            margin: "0 auto",
            minHeight: "100dvh",
            background: "#F7F2EA",
            position: "relative",
            overflowX: "hidden",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
