"use client";

import React, { useState } from "react";
import { EmptyStateInfoIcon } from "@/assets/svgs";
import { EmptyState, Modal, notify, PdfViewer, Typography } from "@/components";
import { LandDocument, PropertyById } from "@/redux/api/property";
import { base64ToFileType2, cn } from "@/utils/helpers";

type Props = {
  data: PropertyById;
  type: "land" | "apartment";
};

const docTypes: Record<number, string> = {
  1: "Certificate Of Ownership",
  2: "Governor Consent",
  3: "Deed Of Assignment",
  4: "Land Purchase Receipt",
  5: "Land Survey",
};

export const LandDocs: React.FC<Props> = ({ data, type }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<LandDocument | null>(null);

  const handleCardClick = (file: LandDocument) => {
    setModalContent(file);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const docs = type === "land" ? data.landDocuments : data.apartmentDocuments;
  return (
    <div className="flex w-full flex-col">
      {docs.length < 1 && (
        <div className="mx-auto flex min-h-[50vh] w-full items-center justify-center">
          <EmptyState
            icon={<EmptyStateInfoIcon />}
            title="No Document"
            text={`This listing is yet to submit a document`}
          />
        </div>
      )}
      {docs.map((doc) => (
        <RectPreviewComponent
          key={doc.id}
          file={doc}
          title={docTypes[doc.documentType]}
          onClick={() =>
            doc.path.startsWith("http")
              ? notify.error({
                  message: "Inavlid Document Format",
                  subtitle: "Expected base64 string, got link instead",
                })
              : handleCardClick(doc)
          }
        />
      ))}
      <Modal
        mobileLayoutType="full"
        isOpen={modalOpen}
        closeModal={closeModal}
        title={`Viewing Document: ${modalContent?.name}`}
      >
        <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-white md:h-[90vh] md:w-[90vw]">
          {modalContent && (
            <PdfViewer
              url={URL.createObjectURL(
                base64ToFileType2(
                  modalContent.path,
                  "application/pdf",
                  modalContent.name,
                ) as File,
              )}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

const RectPreviewComponent: React.FC<{
  file: LandDocument;
  title: string;
  onClick: (file: LandDocument) => void;
}> = ({ file, title, onClick }) => {
  return (
    <div className="flex cursor-pointer border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
      {title && (
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            {title}
          </Typography>
        </div>
      )}
      <div className="max-w-[512px] flex-1 lg:mx-auto">
        <RenderRectPrev file={file} onClick={onClick} />
      </div>
    </div>
  );
};

const RenderRectPrev = ({
  file,
  onClick,
}: {
  file: LandDocument;
  onClick: (file: LandDocument) => void;
}) => {
  return (
    <div
      className="flex w-full items-center justify-between rounded-md border-[1px] border-N40 px-[14px] py-4 text-center"
      onClick={() => onClick(file)}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative flex aspect-square h-[42px] items-center justify-center rounded-full border border-[#D0D5DD]",
            "border-2 border-solid border-SLGL",
          )}
        >
          <div className="absolute bottom-0 left-0 right-0 top-0 isolate h-full w-full overflow-hidden rounded-[inherit]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6673 1.6665H5.00065C4.55862 1.6665 4.1347 1.8421 3.82214 2.15466C3.50958 2.46722 3.33398 2.89114 3.33398 3.33317V16.6665C3.33398 17.1085 3.50958 17.5325 3.82214 17.845C4.1347 18.1576 4.55862 18.3332 5.00065 18.3332H15.0007C15.4427 18.3332 15.8666 18.1576 16.1792 17.845C16.4917 17.5325 16.6673 17.1085 16.6673 16.6665V6.6665M11.6673 1.6665L16.6673 6.6665M11.6673 1.6665V6.6665H16.6673M13.334 10.8332H6.66732M13.334 14.1665H6.66732M8.33398 7.49984H6.66732"
                stroke="#667085"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div>
          <Typography variant="h-m" className="text-[#667085]">
            {file.name}
          </Typography>
          <Typography variant="p-s" className="text-[#98A2B3]">
            {docTypes[file.documentType] || "Unknown Document"}
          </Typography>
        </div>
      </div>
      <div className="flex cursor-pointer items-center gap-2">
        <Typography variant="h-s">View</Typography>
      </div>
    </div>
  );
};

export default LandDocs;
