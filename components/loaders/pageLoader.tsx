import React from "react";

// import "./pageLoader.css";

const PageLoader = () => {
  return (
    <div className="relative m-auto h-12 w-12">
      <div className="absolute left-0 top-0 h-12 w-12 animate-bxSpin rounded bg-GB"></div>
      <div className="absolute left-0 top-[60px] h-[5px] w-12 animate-shadow rounded-[50%] bg-black opacity-5"></div>
    </div>
  );
};

export { PageLoader };
