import { Geist, Geist_Mono, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "./components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "HS Architects",
  description: "HS Architects - Your trusted partner in architectural design and construction",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${caveat.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-white">
          <div className="flex-1">{children}</div>
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
