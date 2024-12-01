"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Chart, ChartData, ChartOptions, ChartType } from "chart.js/auto";

interface DataPoint {
  label: string;
  value: number;
}

interface ChartDataSet {
  label: string;
  backgroundColors: string[];
  data: DataPoint[];
}

interface BarChartWrapperProps {
  type: ChartType;
  stepSize?: number;
  chartData: ChartDataSet[];
  aspectRatio?: number;
  borderRadius?: number;
  legendTitleX: string;
  legendTitleY: string;
}

export const BarChartWrapper: React.FC<BarChartWrapperProps> = ({
  type,

  chartData,
  aspectRatio,
  borderRadius = 0,
  legendTitleX,
  legendTitleY,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const labels = chartData[0].data.map((data) => data.label);
  const datasets = chartData.map((data) => ({
    data: data.data.map((v) => v.value),
    backgroundColor: data.backgroundColors,
    label: data.label,
    borderWidth: 1,
    borderRadius,
  }));

  const data: ChartData = useMemo(
    () => ({
      labels,
      datasets,
    }),
    [labels, datasets],
  );

  const options: ChartOptions = useMemo(
    () => ({
      aspectRatio,
      responsive: true,
      scales: {
        y: {
          grid: {
            drawOnChartArea: true,
            drawBorder: false,
          },
          ticks: {
            display: true,
          },
          title: {
            display: true,
            text: legendTitleY,
          },
          stacked: true,
        },
        x: {
          display: true,
          grid: {
            drawOnChartArea: true,
            display: false,
          },
          title: {
            display: true,
            text: legendTitleX,
          },
          stacked: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          align: "end",
          labels: {
            usePointStyle: true,
          },
        },
      },
    }),
    [aspectRatio, legendTitleX, legendTitleY],
  );

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if ((chartRef.current as any).chart) {
          (chartRef.current as any).chart.destroy();
        }

        const newChart = new Chart(ctx, {
          type,
          data,
          options,
        });

        (chartRef.current as any).chart = newChart;
      }
    }
  }, [chartData, type, options, data]);

  return <canvas ref={chartRef} />;
};
