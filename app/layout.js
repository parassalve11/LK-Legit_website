import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Trade with LK55 — Master the Markets with LK",
  description:
    "Premium educational trading content for Indian stock, options, gold and crypto traders. Learn. Analyze. Execute. Repeat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#050505] text-[#f2f0eb]" style={{ overflowX: "clip" }}>
        {children}
      </body>
    </html>
  );
}
