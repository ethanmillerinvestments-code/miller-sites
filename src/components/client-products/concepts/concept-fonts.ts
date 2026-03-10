import {
  Bodoni_Moda,
  Chivo,
  Fraunces,
  Instrument_Sans,
  Manrope,
  Rajdhani,
} from "next/font/google";

export const northlineDisplay = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-northline-display",
});

export const northlineBody = Chivo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-northline-body",
});

export const summitDisplay = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-summit-display",
});

export const summitBody = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-summit-body",
});

export const fieldformDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fieldform-display",
});

export const fieldformBody = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fieldform-body",
});
