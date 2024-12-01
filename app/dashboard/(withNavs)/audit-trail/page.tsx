"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ButtonDropdown,
  ExtendedColumn,
  PageHeader,
  SMSelectDropDown,
  TextField,
  TMTable,
  Typography,
} from "@/components";
import { pageSizes } from "@/constants/data";
import { IAuditTrailInfo, useGetAuditTrailQuery } from "@/redux/api/property";
import { getCurrentTimeWithAMPM } from "@/utils/getCurrentTime";
import { jsPDF } from "jspdf";

import "jspdf-autotable";

const filterBy = [
  { label: "User Name", value: "username" },
  { label: "Activity", value: "activity" },
  { label: "Name", value: "name" },
  { label: "Description", value: "description" },
];

const AuditTrail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const initialKeyword = searchParams.get("keyword") || "";
  const filter = searchParams.get("filter") || filterBy[0].value;
  const pageSize = pageSizes.sm;

  const [localKeyword, setLocalKeyword] = useState(initialKeyword);
  const debounceTimeout = useRef<number | undefined>(undefined);

  const extraKeyword =
    initialKeyword.length > 0 ? { keyword: initialKeyword } : {};
  const filters = {
    pageSize,
    pageIndex: pageNumber,
    filter,
    ...extraKeyword,
  };

  const { data, isFetching, isLoading } = useGetAuditTrailQuery(filters);
  const totalTableDataCount = data?.totalCount || 0;

  const metadata = {
    currentPage: pageNumber,
    totalPages: Math.ceil(totalTableDataCount / pageSize),
    pageSize,
    totalCount: totalTableDataCount,
    hasPrevious: pageNumber > 1,
    hasNext: pageNumber < Math.ceil(totalTableDataCount / pageSize),
  };

  const columns: ExtendedColumn<IAuditTrailInfo>[] = useMemo(
    () => [
      {
        Header: "User",
        sticky: "left",
        id: "fullName",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1 md:min-w-[120px]">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.fullName}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              ID: {row.original.id}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Activity",
        accessor: "activity",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography noWrap color="TGD" variant="p-m" fontWeight="regular">
              {row.original.activity}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { row } }) => (
          <div className="flex min-w-[150px] flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.description}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Email",
        accessor: "userName",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.userName}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Role",
        accessor: "roleName",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography noWrap color="TGD" variant="p-m" fontWeight="regular">
              {row.original.roleName}
            </Typography>
          </div>
        ),
      },
      {
        Header: "IP Address",
        accessor: "ipAddress",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.ipAddress}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Location",
        accessor: "location",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1">
            <Typography color="TGD" variant="p-m" fontWeight="regular">
              {row.original.location ?? "__"}
            </Typography>
          </div>
        ),
      },
      {
        Header: "Timestamp",
        id: "date",
        Cell: ({ cell: { row } }) => (
          <div className="flex flex-col gap-1 md:min-w-fit">
            <Typography noWrap color="TGD" variant="p-m" fontWeight="regular">
              {new Date(row.original.date).toDateString()}
            </Typography>
            <Typography color="TGBA" variant="p-s" fontWeight="regular">
              {getCurrentTimeWithAMPM(row.original.date)}
            </Typography>
          </div>
        ),
      },
    ],
    [],
  );

  const setPageNumber = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    router.push(`?${newSearchParams.toString()}`, {
      scroll: true,
    });
  };

  const handleFilterBy = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("filter", query);
    newSearchParams.set("keyword", "");
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`, {
      scroll: false,
    });
    setLocalKeyword("");
  };

  const updateSearchQuery = useCallback(
    (query: string) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = window.setTimeout(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("keyword", query);
        newSearchParams.set("page", "1");
        router.push(`?${newSearchParams.toString()}`, {
          scroll: false,
        });
      }, 300);
    },
    [searchParams, router],
  );

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalKeyword(query);
    updateSearchQuery(query);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "User",
      "Activity",
      "Description",
      "Email",
      "Role",
      "IP Address",
      "Location",
      "Timestamp",
    ];
    const tableRows = data?.data.map((item) => [
      item.fullName,
      item.activity,
      item.description,
      item.userName,
      item.roleName,
      item.ipAddress,
      item.location ?? "__",
      `${new Date(item.date).toDateString()} ${getCurrentTimeWithAMPM(item.date)}`,
    ]);
    // @ts-expect-error
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text(`Audit Trail Report`, 14, 15);
    doc.save("audit_trail_report.pdf");
  };

  const exportToCSV = () => {
    const tableColumn = [
      "User",
      "Activity",
      "Description",
      "Email",
      "Role",
      "IP Address",
      "Location",
      "Timestamp",
    ];
    const tableRows = data?.data.map((item) => [
      item.fullName,
      item.activity,
      item.description,
      item.userName,
      item.roleName,
      item.ipAddress,
      item.location ?? "__",
      `${new Date(item.date).toDateString()} ${getCurrentTimeWithAMPM(item.date)}`,
    ]);

    const csvContent = [
      tableColumn.join(","),
      ...(tableRows as string[][]).map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "audit_trail_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBtnClick = (action: string) => {
    switch (action) {
      case "pdf":
        exportToPDF();
        break;
      case "csv":
        exportToCSV();
        break;
      default:
        break;
    }
  };

  const tableContent = (
    <TMTable<IAuditTrailInfo>
      columns={columns}
      data={data?.data || []}
      availablePages={metadata.totalPages}
      title="Audits"
      additionalTitleData={
        <div className="flex w-fit items-center gap-1">
          <div className="w-[200px]">
            <TextField
              name="keyword"
              placeholder={`Search for ${filterBy.find((f) => f.value === filter)?.label}`}
              type="search"
              value={localKeyword}
              onChange={handleKeywordChange}
            />
          </div>

          <div className="max-w-[200px]">
            <SMSelectDropDown
              options={filterBy}
              placeholder="Filter by"
              value={filterBy.find((f) => f.value === filter)}
              onChange={(value) => {
                handleFilterBy(value.value);
              }}
            />
          </div>
          <ButtonDropdown
            heading="Export Options:"
            btnText="Export as"
            iconType="arrow-down"
            noMargin
            buttonGroup={[
              {
                name: "Portable Document Format (PDF)",
                onClick: () => handleBtnClick("pdf"),
              },
              {
                name: "Excel (CSV)",
                onClick: () => handleBtnClick("csv"),
              },
            ]}
          />
        </div>
      }
      setPageNumber={setPageNumber}
      loading={isFetching || isLoading}
      isServerSidePagination={true}
      metaData={metadata}
    />
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Audit Trail"
        subTitle="An overview of the audit trail on your system."
      />
      {tableContent}
    </div>
  );
};

export default AuditTrail;
