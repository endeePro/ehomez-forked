"use client";

import React from "react";
import { Typography } from "@/components";

const PrivacyComp = () => {
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
              E-Homez Privacy Notice
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
                Introduction
              </Typography>
              <Typography variant="p-m" color="N700" gutterBottom>
                E-Homez ('We', 'Us', 'Our') is committed to protecting and
                respecting your privacy. This Policy sets out the basis on which
                We use the information collected about you via{" "}
                <Typography
                  tag="a"
                  // @ts-expect-error: mock link
                  href="https://e-homez.com"
                  variant="p-m"
                  color="GN"
                  underline="hover"
                >
                  www.e-homez.com
                </Typography>
                . By using the Website, you are accepting and consenting to the
                practices described in this Policy.
              </Typography>
            </section>

            {/* Information Collection */}
            <section aria-labelledby="collection-section">
              <Typography
                id="collection-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                1. Information Collection and Use
              </Typography>
              <Typography variant="h-s" tag="h3" color="N700" gutterBottom>
                1.1 Information we collect
              </Typography>
              <ul className="list-disc space-y-2 pl-5">
                {[
                  {
                    title: "Information you give Us",
                    description:
                      "This is information about you that you give Us by filling in forms on the Website or by corresponding with Us by phone, e-mail or otherwise. It includes information you provide when you use Our Website, subscribe to Our service and when you report a problem with the Website. The information you give Us may include your name, address, e-mail address, and phone number.",
                  },
                  {
                    title: "Information We collect about you",
                    description:
                      "This includes information about your visit to Our Website. We will automatically collect your IP address which We use to help administer the Website. We may also gather other information such as the type of internet browser used to provide you with a more effective service.",
                  },
                  {
                    title: "Information We receive from other sources",
                    description:
                      "This is information We may receive about you if you use any of the other websites We operate or other services We provide. We will notify you when We receive information about you from them and the purposes for which We intend to use that information.",
                  },
                ].map((item, index) => (
                  <li key={index}>
                    <Typography
                      variant="p-m"
                      color="N700"
                      className="font-bold"
                    >
                      {item.title}:
                    </Typography>
                    <Typography variant="p-m" color="N700">
                      {item.description}
                    </Typography>
                  </li>
                ))}
              </ul>
            </section>

            {/* Contact Section */}
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
                9. Contact Us
              </Typography>
              <Typography variant="p-m" color="N700">
                If you have any questions or suggestions about our Privacy
                Policy, do not hesitate to contact us.
              </Typography>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
};

export { PrivacyComp };
