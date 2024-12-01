"use client";

import React from "react";
import { Typography } from "@/components";

const AgreementComp = () => {
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
              End User License Agreement
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
                1. Software License
              </Typography>
              <Typography variant="p-m" color="N700" gutterBottom>
                This End User License Agreement ("Agreement") is between Eria
                Clonial Limited, owners of E-Homez Software ("Company") and you
                for the use of E-Homez Software.
              </Typography>
              <Typography variant="p-m" color="N700" className="mt-4">
                <strong>
                  BY INSTALLING, COPYING OR USING THE SOFTWARE, YOU AGREE TO BE
                  BOUND BY THE TERMS OF THIS AGREEMENT.
                </strong>
              </Typography>
            </section>

            {/* License Limitations */}
            <section aria-labelledby="limitations-section">
              <Typography
                id="limitations-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                2. License Limitations
              </Typography>
              <ul className="list-disc space-y-2 pl-5">
                {[
                  "Distribute, sub-license, sell, assign, or otherwise transfer the Software",
                  "Use the Software for purposes other than intended",
                  "Reverse engineer or attempt to discover the source code",
                  "Modify, adapt, or create derivative works of the Software",
                  "Connect the Software with unauthorized online services",
                  "Remove or circumvent copy protection features",
                  "Remove or alter proprietary rights notices",
                ].map((item, index) => (
                  <li key={index}>
                    <Typography variant="p-m" color="N700">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </section>

            {/* Ownership and Confidentiality */}
            <section aria-labelledby="ownership-section">
              <Typography
                id="ownership-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                3. Ownership and Confidentiality
              </Typography>
              <Typography variant="p-m" color="N700" gutterBottom>
                The Software is licensed, not sold. We or our licensors own all
                intellectual property rights. No ownership is transferred to you
                by this Agreement.
              </Typography>
              <Typography variant="p-m" color="N700" className="mt-4">
                <strong>
                  YOU ARE PROHIBITED FROM DISCLOSING THE SOFTWARE TO ANY PERSON
                  OR ENTITY.
                </strong>
              </Typography>
            </section>

            {/* Contact and Legal */}
            <section
              className="rounded-md bg-N20 p-4"
              aria-labelledby="legal-section"
            >
              <Typography
                id="legal-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
              >
                9. Governing Law
              </Typography>
              <Typography variant="p-m" color="N700">
                This Agreement is governed by the laws of the Federal Republic
                of Nigeria. All disputes shall be decided within the
                jurisdiction of Nigerian courts.
              </Typography>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
};

export { AgreementComp };
