"use client";

import React from "react";
import { Typography } from "@/components";

const CookiesComp = () => {
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
              E-Homez Cookie Policy
            </Typography>
          </header>

          <div className="space-y-8 p-8">
            {/* Use of Cookies */}
            <section aria-labelledby="use-section">
              <Typography
                id="use-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                Use of Cookies
              </Typography>
              <Typography variant="p-m" color="N700" gutterBottom>
                E-Homez uses cookies and other technologies to collect
                information on the website. The collection of such information
                helps E-Homez to facilitate your browsing of the website; it
                enables us to improve the website, to promote trust and safety,
                and to monitor the web page flow of the website.
              </Typography>
            </section>

            {/* Categories of Cookies */}
            <section aria-labelledby="categories-section">
              <Typography
                id="categories-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
                className="border-b-2 border-N30 pb-2"
              >
                Categories of Cookies
              </Typography>
              {[
                {
                  title: "Strictly Essential Cookies",
                  description:
                    "These cookies are essential to enable you to move around the website and use its features, such as accessing secure areas of the website. Without these cookies, services that you have selected, like shopping baskets or e-billing, cannot be provided.",
                },
                {
                  title: "Performance Cookies",
                  description:
                    "These cookies collect information about how visitors use a website, for instance, which pages visitors go to most often, and whether they get error messages from web pages. These cookies don't collect information that identifies a visitor.",
                },
                {
                  title: "Functionality Cookies",
                  description:
                    "These cookies allow websites to remember choices you make (such as your username, language, or the region you are in) and to provide enhanced and more personal features.",
                },
                {
                  title: "Targeting or Advertising Cookies",
                  description:
                    "These cookies are used to deliver adverts that are relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign.",
                },
              ].map((category, index) => (
                <div key={index} className="mb-4">
                  <Typography variant="h-s" tag="h3" color="N700" gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography variant="p-m" color="N700">
                    {category.description}
                  </Typography>
                </div>
              ))}
            </section>

            {/* Managing Cookies */}
            <section
              className="rounded-md bg-N20 p-4"
              aria-labelledby="manage-section"
            >
              <Typography
                id="manage-section"
                variant="h-m"
                tag="h2"
                color="GN"
                gutterBottom
              >
                Managing Cookies
              </Typography>
              <Typography variant="p-m" color="N700">
                You can manage the cookies stored on your device by adjusting
                your web browser settings. Some features may not be available or
                function properly if you disable or decline cookies.
              </Typography>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
};

export { CookiesComp };
