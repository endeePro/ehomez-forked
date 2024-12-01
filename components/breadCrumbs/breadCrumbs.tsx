import React from "react";
import Link from "next/link";

export interface Crumb {
  name: string | React.ReactNode;
  path?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    <nav className="flex h-[45px] w-full border-y border-solid border-[#EAECF0] bg-[#FCFCFD] tab-box-shadow">
      <ol className="m-0 my-auto flex list-none items-center p-0 px-4">
        {crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <li className="text-sm font-medium text-GB last-of-type:text-gray-600 hover:text-green-700 last-of-type:hover:text-gray-600">
              {crumb.path ? (
                <Link href={crumb.path} passHref>
                  <p className="text-[inherit] transition-colors duration-200 hover:underline">
                    {crumb.name}
                  </p>
                </Link>
              ) : (
                <span className="text-[inherit] transition-colors duration-200">
                  {crumb.name}
                </span>
              )}
            </li>
            {index < crumbs.length - 1 && (
              <span className="mx-2">
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 9L5 5L1 1"
                    stroke="#D0D5DD"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
