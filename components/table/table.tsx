"use client";

import React from "react";
import { EmptyStateIcon, SearchErrorIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import {
  Column,
  Row,
  TableInstance,
  useBlockLayout,
  usePagination,
  UsePaginationInstanceProps,
  UsePaginationState,
  useTable,
} from "react-table";
import { useSticky } from "react-table-sticky";

import { InfiniteProgressBar } from "../infiniteProgressBar/infiniteProgressBar";
import { PaginationElement } from "../pagination/pagination";
import { Typography } from "../typography";

export type ExtendedColumn<T extends object> = Column<T> & {
  sticky?: string;
};

interface TMTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  additionalTitleData?: React.ReactNode;
  availablePages: number;
  setPageNumber: (pageNumber: number) => void;
  loading: boolean;
  isServerSidePagination?: boolean;
  controlledPageCount?: number;
  searchParams?: string;
  hasPerformedQuery?: boolean;
  customEmptyStateMessage?: string;
  additionalFooterData?: React.ReactNode;
  noBottomSpace?: boolean;
  metaData?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
  onRowClick?: (row: Row<T>) => void;
  isStickyColumn?: boolean;
}

export type PaginationTableInstance<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> & {
    state: UsePaginationState<T>;
  };

const TMTable = <T extends object>({
  columns,
  data,
  title,
  additionalTitleData,
  availablePages,
  setPageNumber,
  loading,
  isServerSidePagination = true,
  controlledPageCount,
  searchParams = "",
  hasPerformedQuery,
  customEmptyStateMessage,
  additionalFooterData,
  noBottomSpace,
  metaData,
  onRowClick,
  isStickyColumn = false,
}: TMTableProps<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    gotoPage,
    pageOptions,
  } = useTable<T>(
    {
      columns,
      data,
      // @ts-expect-error : invalid value error
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: isServerSidePagination,
      ...(controlledPageCount && { pageCount: controlledPageCount }),
    },
    usePagination,
    useSticky,
    isStickyColumn && useBlockLayout,
  ) as PaginationTableInstance<T>;

  const list = { hidden: { opacity: loading ? 0 : 1 } };

  const rowData = isServerSidePagination ? rows : page;
  const isPageGreaterThan1 = isServerSidePagination
    ? availablePages > 1
    : pageOptions.length > 1;

  return (
    <div className="rounded-lg border border-[#E4E7EC]">
      {(title || additionalTitleData) && (
        <div className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-N40 px-6 py-5">
          <Typography
            variant="h-m"
            fontWeight="bold"
            color={"text-default"}
            className="mb-0"
          >
            {title}
          </Typography>
          {additionalTitleData}
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        {loading && <InfiniteProgressBar />}
        <div className={noBottomSpace ? "" : "overflow-x-scroll"}>
          <motion.table
            className={`w-full border-collapse ${loading ? "blur-sm" : ""}`}
            {...getTableProps()}
            initial={{ visibility: "hidden", x: -25 }}
            animate={{ visibility: "visible", x: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="border-b border-solid border-N40 bg-N0"
                  key={Math.random()}
                >
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps()}
                      className={cn(
                        "bg-[#F9FAFB] px-6 py-4 first-of-type:rounded-tl-lg last-of-type:rounded-tr-lg",
                        // @ts-expect-error : not implemented
                        column.sticky && "shadow-sm",
                      )}
                      key={Math.random() * index}
                    >
                      <Typography
                        variant="c-s"
                        fontWeight={"medium"}
                        noWrap
                        color={"text-light"}
                        align="left"
                        className="py-1"
                      >
                        {column.render("Header")}
                      </Typography>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <motion.tbody {...getTableBodyProps()}>
              <AnimatePresence mode="wait">
                {rowData.map((row) => {
                  prepareRow(row);
                  return (
                    <motion.tr
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      variants={list}
                      {...row.getRowProps()}
                      key={Math.PI * Math.random()}
                      className="border-b border-N40 last-of-type:border-none"
                    >
                      {row.cells.map((cell, index) => (
                        <motion.td
                          {...cell.getCellProps()}
                          key={index}
                          className="max-w-[270px] bg-white px-5 py-4 text-p-m font-normal text-N900"
                          initial={{ visibility: "hidden", x: -25 }}
                          animate={{ visibility: "visible", x: 5 }}
                          transition={{ type: "spring", stiffness: 100 }}
                        >
                          {cell.render("Cell")}
                        </motion.td>
                      ))}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </motion.tbody>
          </motion.table>
        </div>
        {!loading && rowData.length === 0 && (
          <div className="flex w-full flex-col items-center justify-center border border-t-0 border-gray-200 p-5">
            {hasPerformedQuery ? <SearchErrorIcon /> : <EmptyStateIcon />}
            <h4>
              {hasPerformedQuery
                ? `No result found${
                    searchParams && ` for  "${searchParams}"`
                  }, check your selection and try again`
                : customEmptyStateMessage ||
                  "Your request results will be displayed here"}
            </h4>
          </div>
        )}
        {!noBottomSpace && isPageGreaterThan1 && (
          <div className="flex w-full flex-wrap-reverse items-center justify-between gap-2 border-t border-solid border-N40 p-4">
            <div>
              {metaData && (
                <Typography>
                  Showing{" "}
                  {metaData.pageSize * metaData.currentPage -
                    metaData.pageSize +
                    1}{" "}
                  -{" "}
                  {data.length === metaData.pageSize
                    ? metaData.pageSize * metaData.currentPage
                    : metaData.pageSize * metaData.currentPage -
                      (metaData.pageSize - data.length)}{" "}
                  of <b>{metaData.totalCount}</b>
                </Typography>
              )}
            </div>
            <div className={loading ? "blur-sm" : ""}>
              <PaginationElement
                setPageNumber={
                  isServerSidePagination ? setPageNumber : gotoPage
                }
                noOfPages={
                  isServerSidePagination ? availablePages : pageOptions.length
                }
                isServerSidePagination={isServerSidePagination}
              />
            </div>
          </div>
        )}
        <div>{additionalFooterData}</div>
      </div>
    </div>
  );
};

export { TMTable };
