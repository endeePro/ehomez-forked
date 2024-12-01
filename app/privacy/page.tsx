import { Metadata } from "next";

import { PrivacyComp } from "./component/privacyComp";

export const metadata: Metadata = {
  title: "E-Homez Privacy Policy | Data Protection and User Information",
  description:
    "Read our comprehensive Privacy Policy to understand how E-Homez collects, uses, and protects your personal information.",
  keywords: [
    "E-Homez",
    "privacy policy",
    "data protection",
    "user information",
    "personal data",
    "real estate platform privacy",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://e-homez.com/privacy",
  },
  openGraph: {
    title: "E-Homez Privacy Policy",
    description:
      "Comprehensive privacy policy for E-Homez real estate platform",
    type: "website",
    url: "https://e-homez.com/privacy",
  },
};

const Privacy = () => {
  return <PrivacyComp />;
};

export default Privacy;
