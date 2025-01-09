import "@fontsource/inter";
import "@fontsource/jetbrains-mono";

// import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans";
// import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
import { JetBrains_Mono as FontMono } from "next/font/google";

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })
export const fontSans = GeistSans;

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// export const fontSans = {
//   style: {
//     fontFamily: "Geist Sans",
//   },
//   variable: "--font-sans",
// };

// export const fontMono = {
//   style: {
//     fontFamily: "JetBrains Mono",
//   },
//   variable: "--font-mono",
// };

export const cal = {
  style: {
    fontFamily: "Cal Sans",
    src: "./styles/CalSans-SemiBold.otf",
  },
  variable: "--font-title",
};

export const crimsonBold = {
  style: {
    fontFamily: "Crimson Text",
    fontWeight: 700,
  },
  variable: "--font-title",
};

export const inter = {
  style: {
    fontFamily: "Inter",
  },
  variable: "--font-default",
};

export const inconsolataBold = {
  style: {
    fontFamily: "Inconsolata",
    fontWeight: 700,
  },
  variable: "--font-title",
};

export const crimson = {
  style: {
    fontFamily: "Crimson Text",
    fontWeight: 400,
  },
  variable: "--font-default",
};

export const inconsolata = {
  style: {
    fontFamily: "Inconsolata",
    fontWeight: 400,
  },
  variable: "--font-default",
};

export const titleFontMapper = {
  Default: cal.variable,
  Serif: crimsonBold.variable,
  Mono: inconsolataBold.variable,
};

export const defaultFontMapper = {
  Default: inter.variable,
  Serif: crimson.variable,
  Mono: inconsolata.variable,
};
