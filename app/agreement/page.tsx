import { Metadata } from "next";

import { AgreementComp } from "./component/AgreementComp";

export const metadata: Metadata = {
  title: "E-Homez End User License Agreement | Legal Terms",
  description:
    "Read the comprehensive End User License Agreement for E-Homez, outlining the terms of use for our real estate platform.",
  keywords: [
    "E-Homez",
    "end user license agreement",
    "EULA",
    "legal terms",
    "software license",
    "user rights",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://e-homez.com/agreement",
  },
  openGraph: {
    title: "E-Homez End User License Agreement",
    description: "Comprehensive legal terms for using E-Homez software",
    type: "website",
    url: "https://e-homez.com/agreement",
  },
};

const Agreement = () => {
  return <AgreementComp />;
};

export default Agreement;
