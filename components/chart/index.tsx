"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Chart, { ChartOptions, ChartType } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

interface ChartData {
  [key: string]: string | number;
}

interface ChartWrapperProps {
  type: ChartType;
  backgrounds: string[];
  stepSize?: number;
  chartData: ChartData[];
  aspectRatio?: number;
  borderRadius?: number;
  datasetLabels?: string[];
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  backgrounds,
  stepSize,
  chartData,
  aspectRatio,
  borderRadius,
  datasetLabels = [],
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const { labels, values } = useMemo(() => {
    const labels = chartData.map((data) => Object.values(data)[0] as string);
    const values = chartData.map((data) => Object.values(data)[1] as number);
    return { labels, values };
  }, [chartData]);

  const info = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: datasetLabels,
          data: values,
          backgroundColor: backgrounds,
          borderWidth: 1,
          borderRadius: borderRadius || 0,
        },
      ],
    }),
    [labels, values, datasetLabels, backgrounds, borderRadius],
  );

  const centerText = useCallback((chart: Chart) => {
    const { ctx, data } = chart;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bolder 21px Montserrat";
    ctx.fillStyle = "#121517";
    const total = (data.datasets[0].data as number[]).reduce(
      (a, b) => a + (typeof b === "number" ? b : 0),
      0,
    );
    ctx.fillText(
      `${total}`,
      chart.getDatasetMeta(0).data[0].x,
      chart.getDatasetMeta(0).data[0].y - 10,
    );
  }, []);

  const centerText2 = useCallback((chart: Chart) => {
    const { ctx } = chart;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "normal 12px sans-serif";
    ctx.fillStyle = "#4E5053";
    ctx.fillText(
      "Total Tickets",
      chart.getDatasetMeta(0).data[0].x,
      chart.getDatasetMeta(0).data[0].y + 10,
    );
  }, []);

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
            text: "Number of Listing",
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
            text: "Month",
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
    [aspectRatio],
  );

  const doughnutOptions: ChartOptions = useMemo(
    () => ({
      responsive: true,
      scales: {
        y: {
          display: false,
        },
        x: {
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0,
              );
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${percentage}%`;
            },
          },
        },
        datalabels: {
          align: "center",
          color: "white",
          fontWeight: "300",
          fontSize: 30,
          formatter: (value: number, context: any) => {
            const datapoints = context.chart.data.datasets[0].data;
            const totalValue = datapoints.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage = ((value / totalValue) * 100).toFixed(1);
            return `${percentage}%`;
          },
        },
      },
    }),
    [],
  );

  const lineOptions: ChartOptions = useMemo(
    () => ({
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize,
          },
          display: true,
        },
        x: {
          display: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }),
    [stepSize],
  );

  const pieOptions: ChartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    }),
    [],
  );

  useEffect(() => {
    if (chartRef.current) {
      const context = chartRef.current.getContext("2d");
      if (context) {
        if ((chartRef.current as any).chart) {
          (chartRef.current as any).chart.destroy();
        }

        let chartConfig: {
          type: ChartType;
          data: typeof info;
          options: ChartOptions;
          plugins?: any[];
        };

        switch (type) {
          case "doughnut":
            chartConfig = {
              type: "doughnut",
              data: {
                ...info,
                // @ts-expect-error:suppress this warning
                datasets: [{ ...info.datasets[0], borderColor: backgrounds }],
              },
              options: doughnutOptions,
              plugins: [
                { id: "centerText", beforeDraw: centerText },
                { id: "centerText2", beforeDraw: centerText2 },
                ChartDataLabels,
              ],
            };
            break;
          case "line":
            chartConfig = {
              type: "line",
              data: info,
              options: lineOptions,
            };
            break;
          case "pie":
            chartConfig = {
              type: "pie",
              data: info,
              options: pieOptions,
            };
            break;
          default:
            chartConfig = {
              type: "bar",
              data: info,
              options,
            };
        }
        // @ts-expect-error: suppress warning
        const newChart = new Chart(context, chartConfig);
        (chartRef.current as any).chart = newChart;
      }
    }
  }, [
    chartData,
    type,
    info,
    backgrounds,
    options,
    doughnutOptions,
    lineOptions,
    pieOptions,
    centerText,
    centerText2,
  ]);

  return <canvas ref={chartRef} />;
};
