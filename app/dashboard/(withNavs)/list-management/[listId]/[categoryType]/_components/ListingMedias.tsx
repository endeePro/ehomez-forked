import React, { useState } from "react";
import Image from "next/image";
import { Button, Modal, Typography } from "@/components";
import { PropertyById, SupplementaryImage } from "@/redux/api/property";
import { cn } from "@/utils/helpers";

export const ListingMedias = ({ data }: { data: PropertyById }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    url: string;
    isImage: boolean;
  } | null>(null);

  const handleCardClick = (url: string, isImage: boolean) => {
    setModalContent({ url, isImage });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Featured Image */}
      <RectPreviewComponent
        isImage={true}
        url={data.featuredImage}
        name={data.name}
        title="Featured Image"
        onClick={() => handleCardClick(data.featuredImage, true)}
      />

      {/* Supplementary Images */}
      {data.supplementaryImages.length > 0 && (
        <SupplementaryImageComponent
          title="Supplementary Images"
          image={data.supplementaryImages}
          onClick={handleCardClick}
        />
      )}

      {/* Supplementary Videos */}
      {data.supplementaryVideos[0] && data.supplementaryVideos[0].path && (
        <RectPreviewComponent
          isImage={false}
          url={data.supplementaryVideos[0]?.path}
          name={data.supplementaryVideos[0]?.name}
          title="Supplementary Videos"
          onClick={() =>
            handleCardClick(data.supplementaryVideos[0].path, false)
          }
        />
      )}

      {/* Modal */}

      <Modal
        mobileLayoutType="normal"
        isOpen={modalOpen}
        closeModal={closeModal}
        title={`Viewing ${modalContent?.isImage ? "Image File" : "Video File"}`}
      >
        {modalContent?.isImage ? (
          <div className="relative aspect-square w-[90vw] py-6 lg:aspect-video lg:w-[900px]">
            <Image
              src={modalContent.url}
              alt="Modal Content"
              className="h-auto w-full object-cover"
              fill
            />
          </div>
        ) : (
          <div className="relative aspect-square w-[90vw] bg-white py-6 lg:aspect-video lg:w-[900px]">
            <video
              src={modalContent?.url ?? ""}
              controls
              className="h-auto w-full"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const SupplementaryImageComponent: React.FC<{
  image: SupplementaryImage[];
  title: string;
  onClick: (url: string, isImage: boolean) => void;
}> = ({ image, title, onClick }) => {
  return (
    <div className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
      {title && (
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            {title}
          </Typography>
        </div>
      )}
      <div className="max-w-[512px] flex-1 lg:mx-auto">
        <RendeImagePreview images={image} onClick={onClick} />
      </div>
    </div>
  );
};

const RendeImagePreview = ({
  images,
  onClick,
}: {
  images: SupplementaryImage[];
  onClick: (url: string, isImage: boolean) => void;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image) => (
        <div
          key={image.path}
          className="relative isolate flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-[1px] border-N40 text-center"
          onClick={() => onClick(image.path, true)}
        >
          <Image
            src={image.path}
            alt={image.name}
            className="z-[-1] h-full w-full rounded-[inherit] object-cover"
            fill
          />
          <div className="m-auto flex flex-col items-center">
            <Button className="rounded-[50px] px-[30px]">
              <div className="flex items-center gap-2">
                <Typography variant="p-s">View</Typography>
              </div>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const RectPreviewComponent: React.FC<{
  url: string;
  title: string;
  isImage: boolean;
  name: string;
  onClick: () => void;
}> = ({ url, title, isImage, name, onClick }) => {
  return (
    <div
      className="flex cursor-pointer border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2"
      onClick={onClick}
    >
      {title && (
        <div className="w-[200px]">
          <Typography variant="c-m" className="text-[#344054]">
            {title}
          </Typography>
        </div>
      )}
      <div className="max-w-[512px] flex-1 lg:mx-auto">
        <RenderRectPrev name={name} url={url} isImage={isImage} />
      </div>
    </div>
  );
};

const RenderRectPrev = ({
  url,
  isImage,
  name,
}: {
  url: string;
  isImage: boolean;
  name: string;
}) => {
  return (
    <div className="flex w-full items-center justify-between rounded-md border-[1px] border-N40 px-[14px] py-4 text-center">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative flex aspect-square h-[42px] items-center justify-center rounded-full border border-[#D0D5DD]",
            "border-2 border-solid border-SLGL",
          )}
        >
          {isImage ? (
            <Image
              src={url}
              alt={name}
              className="h-full w-full rounded-[inherit] object-cover"
              fill
            />
          ) : (
            <div className="absolute bottom-0 left-0 right-0 top-0 isolate h-full w-full overflow-hidden rounded-[inherit]">
              <video
                src={url}
                controls
                className="h-full w-full object-cover"
              />
              <div className="bg-white/ absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center rounded-full">
                {/* Play icon for videos */}
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
          )}
        </div>
        <div>
          <Typography variant="h-m" className="text-[#667085]">
            {name}
          </Typography>
        </div>
      </div>
      <div className="flex cursor-pointer items-center gap-2">
        <Typography variant="h-s">View</Typography>
      </div>
    </div>
  );
};

export default ListingMedias;
