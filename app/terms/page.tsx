import { Metadata } from "next";

import { TermsComp } from "./component/terms";

export const metadata: Metadata = {
  title: "E-Homez Terms of Use | Legal Agreement",
  description:
    "Read the comprehensive Terms of Use for E-Homez. Understand your rights and responsibilities when using our real estate website and services.",
  keywords: [
    "E-Homez",
    "terms of use",
    "legal agreement",
    "website terms",
    "real estate services",
    "user agreement",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://e-homez.com/terms-of-use",
  },
  openGraph: {
    title: "E-Homez Terms of Use",
    description:
      "Comprehensive legal terms for using E-Homez real estate platform",
    type: "website",
    url: "https://e-homez.com/terms-of-use",
  },
};

const Terms = () => {
  return <TermsComp />;
};

export default Terms;
