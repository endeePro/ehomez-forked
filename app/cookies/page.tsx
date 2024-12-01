import { Metadata } from "next";

import { CookiesComp } from "./component/CookiesComp";

export const metadata: Metadata = {
  title: "E-Homez Cookie Policy | Website Tracking and Data Usage",
  description:
    "Understand how E-Homez uses cookies to enhance your browsing experience and improve our website functionality.",
  keywords: [
    "E-Homez",
    "cookie policy",
    "website tracking",
    "data collection",
    "browser cookies",
    "real estate platform cookies",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://e-homez.com/cookies",
  },
  openGraph: {
    title: "E-Homez Cookie Policy",
    description: "Comprehensive explanation of cookie usage on E-Homez",
    type: "website",
    url: "https://e-homez.com/cookies",
  },
};

const Cookies = () => {
  return <CookiesComp />;
};

export default Cookies;
