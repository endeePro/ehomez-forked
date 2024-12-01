import React from "react";
import Image from "next/image";
import { cn } from "@/utils/helpers";
import { FieldError } from "react-hook-form";
import { FaEye, FaTrash } from "react-icons/fa";

import { Button } from "../buttons";
import { Typography } from "../typography";

type FileType = "document" | "image" | "video";

interface PreviewFile {
  path: string;
}

interface FileGrabberProps {
  name: string;
  accept?: string;
  multiple?: boolean;
  type: FileType;
  maxSize?: number;
  imageVariant?: "square" | "rect";
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: File[] | null;
  previewLink?: PreviewFile;
  errorText: FieldError | undefined;
  handleDelete?: () => void;
  handleView?: () => void;
}

const FileGrabber: React.FC<FileGrabberProps> = ({
  name,
  accept,
  multiple = false,
  type,
  maxSize = 3,
  imageVariant = "rect",
  onChange,
  value,
  previewLink,
  errorText,
  handleDelete,
  handleView,
}) => {
  const renderPreview = (
    file: File | PreviewFile,
    index: number,
    isLink: boolean = false,
  ) => {
    const isPreviewFile = isLink;
    const isImage = isPreviewFile
      ? (file as PreviewFile)?.path?.match(/\.(jpg|jpeg|png|gif|mov)$/i)
      : (file as File)?.type?.startsWith("image/");

    try {
      return (
        <div key={index} className="group relative">
          {imageVariant !== "square" && (
            <FilePreviewRect
              file={file}
              type={type}
              size={maxSize}
              handleDelete={handleDelete}
              handleView={handleView}
              isPreviewFile={isPreviewFile}
            />
          )}
          {isImage && imageVariant === "square" && (
            <FileImagePreviewSquare
              file={file}
              type={type}
              size={maxSize}
              handleDelete={handleDelete}
              handleView={handleView}
              isPreviewFile={isPreviewFile}
            />
          )}
        </div>
      );
    } catch (error) {
      console.error("Error rendering preview:", error);
      return null;
    }
  };
  const renderPlaceholder = () => {
    const commonProps = {
      accept,
      maxSize,
      type,
    };

    switch (type) {
      case "document":
        return <DocumentPlaceholder {...commonProps} />;
      case "image":
        return imageVariant === "rect" ? (
          <ImagePlaceholderRect {...commonProps} />
        ) : (
          <ImagePlaceholderSquare {...commonProps} />
        );
      case "video":
        return <VideoPlaceholder {...commonProps} />;
      default:
        return null;
    }
  };
  return (
    <div className="">
      <label
        htmlFor={name}
        className="block cursor-pointer text-sm font-medium text-gray-700"
      >
        <input
          id={name}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
        />
        <div className="">
          {previewLink ? (
            renderPreview(previewLink, 0, true)
          ) : value && value.length > 0 ? (
            Array.from(value).map((file: File, index: number) =>
              renderPreview(file, index, false),
            )
          ) : (
            <div className="flex w-full cursor-pointer justify-center rounded-md border-[1px] border-N40 px-[14px] py-4 transition-colors duration-200 hover:border-N40">
              {renderPlaceholder()}
            </div>
          )}
        </div>
      </label>
      {errorText && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {errorText.message}
        </p>
      )}
    </div>
  );
};

interface PlaceholderProps {
  accept?: string;
  maxSize: number;
  type: FileType;
}

const DocumentPlaceholder: React.FC<PlaceholderProps> = ({
  accept,
  maxSize,
}) => (
  <div className="flex w-full items-center justify-between text-center">
    <div className="flex items-center gap-3">
      <div className="flex aspect-square h-[42px] items-center justify-center rounded-full border border-[#D0D5DD]">
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
      <div>
        <Typography variant="h-m" className="text-[#667085]">
          Click to upload
        </Typography>
        <Typography variant="p-s" className="text-[#98A2B3]">
          {`${accept} up to ${maxSize}MB`}
        </Typography>
      </div>
    </div>
    <UploadIcon />
  </div>
);

const ImagePlaceholderRect: React.FC<PlaceholderProps> = ({
  accept,
  maxSize,
}) => (
  <div className="flex w-full items-center justify-between text-center">
    <div className="flex items-center gap-3">
      <div className="flex aspect-square h-[42px] items-center justify-center rounded-full border border-[#D0D5DD]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5ZM4.16667 17.5L13.3333 8.33333L17.5 12.5M8.33333 7.08333C8.33333 7.77369 7.77369 8.33333 7.08333 8.33333C6.39298 8.33333 5.83333 7.77369 5.83333 7.08333C5.83333 6.39298 6.39298 5.83333 7.08333 5.83333C7.77369 5.83333 8.33333 6.39298 8.33333 7.08333Z"
            stroke="#667085"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <Typography variant="h-m" className="text-[#667085]">
          Click to upload
        </Typography>
        <Typography variant="p-s" className="text-[#98A2B3]">
          {`${accept} PNG, JPG up to ${maxSize}MB`}
        </Typography>
      </div>
    </div>
    <UploadIcon />
  </div>
);

const ImagePlaceholderSquare: React.FC<PlaceholderProps> = ({
  accept,
  maxSize,
}) => (
  <div className="flex aspect-square w-[173px] flex-col items-center justify-center text-center">
    <div className="flex aspect-square h-[42px] items-center justify-center rounded-full border border-[#D0D5DD] bg-white">
      <UploadIcon />
    </div>
    <div className="mt-3 flex flex-col items-center">
      <Typography variant="h-m" className="text-[#667085]">
        Click to upload
      </Typography>
      <Typography variant="p-s" className="text-[#98A2B3]">
        {`${accept} PNG, JPG up to ${maxSize}MB`}
      </Typography>
    </div>
  </div>
);

const VideoPlaceholder: React.FC<PlaceholderProps> = ({ accept, maxSize }) => (
  <div className="flex w-full items-center justify-between text-center">
    <div className="flex items-center gap-3">
      <div className="flex aspect-square h-[42px] items-center justify-center rounded-full border border-[#D0D5DD]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5ZM4.16667 17.5L13.3333 8.33333L17.5 12.5M8.33333 7.08333C8.33333 7.77369 7.77369 8.33333 7.08333 8.33333C6.39298 8.33333 5.83333 7.77369 5.83333 7.08333C5.83333 6.39298 6.39298 5.83333 7.08333 5.83333C7.77369 5.83333 8.33333 6.39298 8.33333 7.08333Z"
            stroke="#667085"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <Typography variant="h-m" className="text-[#667085]">
          Click to upload
        </Typography>
        <Typography variant="p-s" className="text-[#98A2B3]">
          {`${accept} MP4, AVI, MOV up to ${maxSize}MB`}
        </Typography>
      </div>
    </div>
    <UploadIcon />
  </div>
);

interface FilePreviewProps {
  file: File | PreviewFile;
  type: FileType;
  size: number;
  isPreviewFile: boolean;
  handleDelete?: () => void;
  handleView?: () => void;
}

const FilePreviewRect: React.FC<FilePreviewProps> = ({
  file,
  type,
  size,
  isPreviewFile,
  handleDelete,
  handleView,
}) => {
  const fileName = isPreviewFile
    ? (file as PreviewFile)?.path
    : (file as File)?.name;
  const fileSize = isPreviewFile
    ? (0 / (1024 * 1024)).toFixed(3)
    : ((file as File)?.size / (1024 * 1024))?.toFixed(3);
  const fileUrl = isPreviewFile
    ? (file as PreviewFile)?.path
    : URL.createObjectURL?.(file as File);

  console.log(fileUrl, "fileUrl");

  return (
    <div className="relative flex w-full items-center justify-between gap-3 rounded-md border-[1px] border-N40 px-[14px] py-4 text-center">
      <div className="flex w-[calc(100%_-_200px)] flex-1 flex-grow items-center gap-3">
        <div
          className={cn(
            "relative flex aspect-square h-[42px] items-center justify-center rounded-full border border-[#D0D5DD]",
            (type === "image" || type === "video") &&
              "border-2 border-solid border-SLGL",
          )}
        >
          {type === "image" ? (
            <Image
              src={fileUrl}
              alt={fileName}
              className="h-full w-full rounded-[inherit] object-cover"
              fill
            />
          ) : type === "video" ? (
            <div className="absolute bottom-0 left-0 right-0 top-0 isolate h-full w-full overflow-hidden rounded-[inherit]">
              <video
                src={fileUrl}
                controls
                className="h-full w-full object-cover"
              />
              <div className="bg-white/ absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center rounded-full">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_b_4875_16171)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM10.125 16.4016L16.875 12.6288C17.375 12.3493 17.375 11.6507 16.875 11.3712L10.125 7.59836C9.625 7.31889 9 7.66823 9 8.22717V15.7728C9 16.3318 9.625 16.6811 10.125 16.4016Z"
                      fill="white"
                      fillOpacity="0.3"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_b_4875_16171"
                      x="-16"
                      y="-16"
                      width="56"
                      height="56"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="8"
                      />
                      <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_4875_16171"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_4875_16171"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          ) : (
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
          )}
        </div>
        <div className="grid w-[calc(100%_-_60px)] flex-1 flex-grow grid-cols-1">
          <Typography
            variant="h-m"
            className="text-ellipsis text-[#667085]"
            noWrap
          >
            {fileName}
          </Typography>
          <Typography
            variant="p-s"
            className="!w-full text-ellipsis text-[#98A2B3]"
          >
            {`${fileSize}MB / ${size}MB`}
          </Typography>
        </div>
      </div>
      <div>
        {(handleDelete || handleView) && (
          <div className="absolute right-0 top-[-40px] z-10 flex gap-2 rounded-sm bg-white p-2 shadow-lg">
            {handleView && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView();
                }}
                variant={"secondary"}
                type="button"
              >
                <FaEye />
              </Button>
            )}

            {handleDelete && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                type="button"
                variant={"danger"}
              >
                <FaTrash />
              </Button>
            )}
          </div>
        )}
        <div className="flex w-[90px] items-center justify-center gap-2">
          <Typography variant="h-s">Change</Typography>
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_4875_16180)">
                <path
                  d="M7.33398 2.66665H2.66732C2.3137 2.66665 1.97456 2.80713 1.72451 3.05718C1.47446 3.30723 1.33398 3.64637 1.33398 3.99999V13.3333C1.33398 13.6869 1.47446 14.0261 1.72451 14.2761C1.97456 14.5262 2.3137 14.6667 2.66732 14.6667H12.0007C12.3543 14.6667 12.6934 14.5262 12.9435 14.2761C13.1935 14.0261 13.334 13.6869 13.334 13.3333V8.66665M12.334 1.66665C12.5992 1.40144 12.9589 1.25244 13.334 1.25244C13.7091 1.25244 14.0688 1.40144 14.334 1.66665C14.5992 1.93187 14.7482 2.29158 14.7482 2.66665C14.7482 3.04173 14.5992 3.40144 14.334 3.66665L8.00065 9.99999L5.33398 10.6667L6.00065 7.99999L12.334 1.66665Z"
                  stroke="#133F30"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_4875_16180">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

const FileImagePreviewSquare: React.FC<FilePreviewProps> = ({
  file,
  isPreviewFile,
  handleView,
  handleDelete,
}) => {
  const fileUrl = isPreviewFile
    ? (file as PreviewFile)?.path
    : URL?.createObjectURL?.(file as File);
  const fileName = isPreviewFile
    ? (file as PreviewFile)?.path
    : (file as File)?.name;
  return (
    <div className="relative isolate flex aspect-square w-full flex-col items-center justify-center rounded-md border-[1px] border-N40 text-center">
      <Image
        src={fileUrl}
        alt={fileName}
        className="z-[-1] h-full w-full rounded-[inherit] object-cover"
        fill
      />
      <div className="m-auto flex flex-col items-center">
        <div className="duration-400 flex items-center justify-center gap-4 rounded-[50px] bg-SLGB px-[12px] py-[10px] text-GB transition-all ease-in-out hover:bg-SLGBA">
          {/* Change Button */}
          <div className="flex items-center gap-2">
            <Typography variant="p-s">Change</Typography>
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_4875_16180)">
                  <path
                    d="M7.33398 2.66665H2.66732C2.3137 2.66665 1.97456 2.80713 1.72451 3.05718C1.47446 3.30723 1.33398 3.64637 1.33398 3.99999V13.3333C1.33398 13.6869 1.47446 14.0261 1.72451 14.2761C1.97456 14.5262 2.3137 14.6667 2.66732 14.6667H12.0007C12.3543 14.6667 12.6934 14.5262 12.9435 14.2761C13.1935 14.0261 13.334 13.6869 13.334 13.3333V8.66665M12.334 1.66665C12.5992 1.40144 12.9589 1.25244 13.334 1.25244C13.7091 1.25244 14.0688 1.40144 14.334 1.66665C14.5992 1.93187 14.7482 2.29158 14.7482 2.66665C14.7482 3.04173 14.5992 3.40144 14.334 3.66665L8.00065 9.99999L5.33398 10.6667L6.00065 7.99999L12.334 1.66665Z"
                    stroke="#133F30"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4875_16180">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </div>
          {handleView && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              className="absolute right-14 top-3 z-10"
              variant={"secondary"}
              type="button"
            >
              <FaEye />
            </Button>
          )}

          {handleDelete && (
            <Button
              type="button"
              variant={"danger"}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="absolute right-3 top-3 z-10"
            >
              <FaTrash />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const UploadIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.5 11.5V14.8333C16.5 15.2754 16.3244 15.6993 16.0118 16.0118C15.6993 16.3244 15.2754 16.5 14.8333 16.5H3.16667C2.72464 16.5 2.30072 16.3244 1.98816 16.0118C1.67559 15.6993 1.5 15.2754 1.5 14.8333V11.5M13.1667 5.66667L9 1.5M9 1.5L4.83333 5.66667M9 1.5V11.5"
      stroke="#667085"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FileGrabber;
