"use client";

import React from "react";
import { Typography } from "@/components";

const TermsComp = () => {
  return (
    <main className="min-h-screen bg-GB py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <article className="overflow-hidden rounded-xl bg-white shadow-lg">
          <header className="bg-GN p-6 text-white">
            <Typography
              variant="h-l"
              tag="h1"
              color="N0"
              align="center"
              fontWeight="bold"
            >
              E-HOMEZ TERMS OF USE
            </Typography>
          </header>

          <div className="space-y-8 p-8">
            {/* Introduction */}
            <section aria-labelledby="introduction-section">
              <Typography
                id="introduction-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                1. Introduction
              </Typography>
              <Typography variant="p-m" color="N700">
                These Terms and Conditions ('Terms') govern Your use of{" "}
                <Typography
                  tag="a"
                  // @ts-expect-error
                  href="https://e-homez.com"
                  variant="p-m"
                  color="GN"
                  underline="hover"
                  aria-label="Visit E-Homez Website"
                >
                  www.e-homez.com
                </Typography>{" "}
                ('Website') and Your relationship with E-Homez ('We', 'Us',
                'Our'). Please read them carefully. By clicking on the link to
                proceed, you agree to the terms and conditions below.
              </Typography>
            </section>

            {/* Use of Website */}
            <section aria-labelledby="website-use-section">
              <Typography
                id="website-use-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                2. Use of the Website
              </Typography>
              <Typography variant="p-m" color="N700" gutterBottom>
                It is imperative that you read the following terms and
                conditions as these terms of use constitute a legally binding
                agreement between you and the Company regarding your use of our
                website and services.
              </Typography>

              <ul
                className="list-disc space-y-2 pl-5"
                aria-label="Website Usage Terms"
              >
                {[
                  "The content is for general information and use, subject to change without notice.",
                  "Website uses cookies to monitor browsing preferences.",
                  "No warranty is provided for the accuracy or completeness of information.",
                  "Use of information is entirely at your own risk.",
                  "Reproduction of website content is prohibited.",
                  "Unauthorized use may result in legal action.",
                ].map((item, index) => (
                  <li key={index}>
                    <Typography variant="p-m" color="N700">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </section>

            {/* Restricted Uses */}
            <section aria-labelledby="prohibited-uses-section">
              <Typography
                id="prohibited-uses-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                2.2 Prohibited Uses
              </Typography>
              <ul
                className="list-disc space-y-2 pl-5"
                aria-label="Prohibited Website Uses"
              >
                {[
                  "Disseminating unlawful or harassing material",
                  "Transmitting content encouraging criminal conduct",
                  "Interfering with other users' website experience",
                  "Making unauthorized electronic copies",
                  "Uploading malicious software",
                  "Sharing private third-party information",
                ].map((item, index) => (
                  <li key={index}>
                    <Typography variant="p-m" color="N700">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </section>

            {/* Contact and Legal */}
            <section
              className="rounded-md bg-N20 p-4"
              aria-labelledby="contact-section"
            >
              <Typography
                id="contact-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
              >
                9. How to Contact E-Homez
              </Typography>
              <Typography variant="p-m" color="N700">
                If you have queries or comments, please email{" "}
                <Typography
                  tag="a"
                  // @ts-expect-error
                  href="mailto:info@E-Homez.ng"
                  variant="p-m"
                  color="GN"
                  underline="hover"
                  aria-label="Send email to E-Homez"
                >
                  info@E-Homez.ng
                </Typography>
              </Typography>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
};

export { TermsComp };
