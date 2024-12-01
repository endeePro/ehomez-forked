import React from "react";
import { PageLoader } from "@/components";

const Loading = () => {
  return (
    <div className="m-auto flex h-full w-full items-center justify-center">
      <PageLoader />
    </div>
  );
};

export default Loading;
