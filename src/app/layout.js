import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import "./globals.css";

// Luxury editorial serif font for headings
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

// Clean, professional sans-serif for body text and UI
const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans-3",
  display: "swap",
});

export const metadata = {
  title: "Desi To Global Travel - Craft Your Next Great Story",
  description: "Premium travel experiences across India and the world. We don't just book trips, we craft your next great story.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${sourceSans3.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
