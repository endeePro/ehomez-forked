import React from "react";

interface ChartCardsProps {
  children?: React.ReactNode;
  height?: string | number;
}

export const ChartCards: React.FC<ChartCardsProps> = ({ children, height }) => {
  return (
    <div className="bg-transparent" style={{ height: height }}>
      {children || "content"}
    </div>
  );
};
