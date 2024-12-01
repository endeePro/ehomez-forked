"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Modal, notify, Typography } from "@/components";
import { IApiError } from "@/redux/api/genericInterface";
import {
  IEditRentPropertyPayload,
  SupplementaryImage,
  SupplementaryVideo,
  useDeletePropertyFileMutation,
  useGetPropertyByIdQuery,
} from "@/redux/api/property";
import { setListingMedia } from "@/redux/api/property/formState.slice";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  base64ToFile,
  fieldSetterAndClearer,
  fileToBase64,
  getFileSizeFromBase64,
  getMimeTypeFromBase64,
  getPreviewImageLink,
  isLink,
} from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import FileGrabber from "@/components/fileGrabbers/fileGrabber";

import { ConfirmListingDialog } from "../../../_components";

const imageValidation = (size: number) =>
  Yup.string()
    .test("fileSize", "File too large", (value) => {
      if (!value || isLink(value)) return true;
      const sizeInBytes = getFileSizeFromBase64(value);
      return sizeInBytes <= size * 1024 * 1024;
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value || isLink(value)) return true;
      const mimeType = getMimeTypeFromBase64(value);
      return mimeType.startsWith("image/");
    });

const videoValidation = (size: number) =>
  Yup.string()
    .test("fileSize", "File too large", (value) => {
      if (!value || isLink(value)) return true;
      const sizeInBytes = getFileSizeFromBase64(value);
      return sizeInBytes <= size * 1024 * 1024;
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value || isLink(value)) return true;
      const mimeType = getMimeTypeFromBase64(value);
      return mimeType.startsWith("video/");
    });

const schema = Yup.object().shape({
  featuredImage: imageValidation(3).required("Featured image is required"),
  supplementaryImage1: imageValidation(3),
  supplementaryImage2: imageValidation(3),
  supplementaryImage3: imageValidation(3),
  supplementaryImage4: imageValidation(3),
  supplementaryVideo: videoValidation(100),
});

export interface IListingMediaFormData {
  featuredImage: string; // Base64 string
  supplementaryImage1?: string; // Optional fields
  supplementaryImage2?: string;
  supplementaryImage3?: string;
  supplementaryImage4?: string;
  supplementaryVideo?: string;
}

interface ChildFormProps {
  onSubmit: SubmitHandler<IListingMediaFormData>;
  initialData: IListingMediaFormData;
}

export const ListingMediaForm = forwardRef<HTMLButtonElement, ChildFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const [deleteFile, { isLoading, isSuccess }] =
      useDeletePropertyFileMutation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{
      url: string;
      isImage: boolean;
    } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteData, setDeleteData] =
      useState<Partial<IEditRentPropertyPayload> | null>(null);
    const dispatch = useDispatch();

    const [activeName, setActiveName] = useState("");

    const pathName = usePathname();
    const pathSplit = pathName.split("/");
    const id = pathSplit[pathSplit.length - 3];

    const { data } = useGetPropertyByIdQuery(
      {
        id: id,
      },
      {
        skip: !id,
      },
    );

    const methods = useForm<IListingMediaFormData>({
      defaultValues: {
        ...initialData,
        featuredImage:
          initialData.featuredImage.length > 0
            ? initialData.featuredImage
            : undefined,
        supplementaryVideo: initialData?.supplementaryVideo,
      },
      resolver: yupResolver(schema),
    });

    const {
      formState: { errors },
      handleSubmit,
      setValue,
      clearErrors,
      watch,
    } = methods;

    const submitRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => submitRef.current!);

    const handleDelete = async (values: Partial<IEditRentPropertyPayload>) => {
      try {
        await deleteFile({
          propertyId: id,
          payload: values,
        }).unwrap();
        methods.setValue(activeName as keyof IListingMediaFormData, undefined);
        notify.success({ message: "Property file deleted successfully" });
        dispatch(setListingMedia(methods.getValues()));
      } catch (err) {
        notify.error({
          message: "Unable to delete file",
          subtitle: getErrorMessage(err as IApiError),
        });
      }
    };
    const handleFileChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: keyof IListingMediaFormData,
    ) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        const file = files[0];
        try {
          const base64String = await fileToBase64(file);
          fieldSetterAndClearer({
            value: base64String,
            setterFunc: setValue,
            setField: field,
            clearErrors,
          });
        } catch (error) {
          console.error("Error converting file to Base64:", error);
        }
      }
    };

    const handleCardClick = (url: string, isImage: boolean) => {
      setModalContent({ url, isImage });
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
      setModalContent(null);
    };

    const triggerhandleDelete = (
      fieldName: string,
      fileId?: Partial<IEditRentPropertyPayload>,
    ) => {
      if (fileId) {
        setShowDeleteModal(true);
        setDeleteData(fileId);
        setActiveName(fieldName);
        return;
      }
      methods.setValue(fieldName as keyof IListingMediaFormData, undefined);
    };

    return (
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(
          (data) => {
            onSubmit(data);
          },
          (err) => console.log(err),
        )}
      >
        <ImageField
          title="Featured Image"
          fieldName="featuredImage"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
          handleView={() => {
            handleCardClick(watch("featuredImage") as string, true);
          }}
        />

        {/* Supplementary Images */}
        <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
          <div className="w-[200px]">
            <Typography variant="c-m" className="text-[#344054]">
              Supplementary Images
            </Typography>
          </div>
          <div className="grid max-w-[512px] flex-1 grid-cols-2 gap-4 lg:mx-auto">
            {[
              "supplementaryImage1",
              "supplementaryImage2",
              "supplementaryImage3",
              "supplementaryImage4",
            ].map((imageField, index) => (
              <ImageField
                key={imageField}
                title=""
                fieldName={imageField as keyof IListingMediaFormData}
                watch={watch}
                errors={errors}
                handleFileChange={handleFileChange}
                imageVariant={"square"}
                handleDelete={() => {
                  triggerhandleDelete(
                    imageField,
                    // @ts-expect-error
                    isLink(watch(imageField))
                      ? {
                          supplementaryImagesToDelete: [
                            ...[
                              (
                                data?.data
                                  ?.supplementaryImages as SupplementaryImage[]
                              )[index]?.id,
                            ],
                          ],
                        }
                      : undefined,
                  );
                }}
                handleView={() => {
                  handleCardClick(
                    watch(imageField as keyof IListingMediaFormData) as string,
                    true,
                  );
                }}
              />
            ))}
          </div>
        </fieldset>
        <VideoField
          title="Supplementary Video"
          fieldName="supplementaryVideo"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
          handleDelete={() => {
            triggerhandleDelete("supplementaryVideo", {
              supplementaryVideosToDelete: [
                ...[
                  (data?.data?.supplementaryVideos as SupplementaryVideo[])[0]
                    ?.id,
                ],
              ],
            });
          }}
          handleView={() => {
            handleCardClick(watch("supplementaryVideo") as string, false);
          }}
        />

        {/* Invisible submit button */}
        <button type="submit" ref={submitRef} style={{ display: "none" }}>
          Submit
        </button>

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
                src={
                  isLink(modalContent.url)
                    ? modalContent.url
                    : getPreviewImageLink(
                        base64ToFile(
                          modalContent?.url,
                          getMimeTypeFromBase64(modalContent?.url),
                        ) as File,
                      )
                }
                alt="Modal Content"
                className="h-auto w-full object-cover"
                fill
              />
            </div>
          ) : (
            <div className="relative aspect-square w-[90vw] bg-white py-6 lg:aspect-video lg:w-[900px]">
              <video
                src={
                  isLink(modalContent?.url ?? "")
                    ? modalContent?.url
                    : getPreviewImageLink(
                        base64ToFile(
                          modalContent?.url as string,
                          getMimeTypeFromBase64(modalContent?.url as string),
                        ) as File,
                      )
                }
                controls
                className="h-auto w-full"
              />
            </div>
          )}
        </Modal>
        {/* Modal Delete */}
        <Modal
          mobileLayoutType="normal"
          isOpen={showDeleteModal}
          closeModal={() => {
            setDeleteData(null);
            setShowDeleteModal(false);
          }}
        >
          <ConfirmListingDialog
            isError={isSuccess}
            title="Delete upload"
            paragraph={
              <div className="flex flex-col gap-1">
                <Typography variant="p-m" className="text-base">
                  Are you sure you want to delete this upload? This action
                  cannot be undone.
                </Typography>
              </div>
            }
            onCancel={() => {
              setDeleteData(null);
              setShowDeleteModal(false);
            }}
            onApprove={() => (deleteData ? handleDelete(deleteData) : null)}
            isLoading={isLoading}
            cancleBtnText="No, Cancel"
            variant={"danger"}
            proceedBtnText="Yes, Delete"
            type="button"
          />
        </Modal>
      </form>
    );
  },
);

const ImageField = ({
  title,
  fieldName,
  watch,
  errors,
  handleFileChange,
  imageVariant = "rect",
  handleView,
  handleDelete,
}: {
  imageVariant?: "square" | "rect";
  title: string;
  fieldName: keyof IListingMediaFormData;
  watch: any;
  errors: any;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IListingMediaFormData,
  ) => void;
  handleView?: () => void;
  handleDelete?: () => void;
}) => (
  <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
    {title && (
      <div className="w-[200px]">
        <Typography variant="c-m" className="text-[#344054]">
          {title}
        </Typography>
      </div>
    )}
    <div className="max-w-[512px] flex-1 lg:mx-auto">
      {isLink(watch(fieldName)) ? (
        <div>
          <FileGrabber
            name={fieldName}
            accept="image/*"
            type="image"
            maxSize={3}
            value={null}
            previewLink={{
              path: watch(fieldName),
            }}
            errorText={errors[fieldName]}
            onChange={(e) => handleFileChange(e, fieldName)}
            imageVariant={imageVariant}
            handleView={handleView}
            handleDelete={handleDelete}
          />
        </div>
      ) : (
        <FileGrabber
          name={fieldName}
          accept="image/*"
          type="image"
          maxSize={3}
          value={
            watch(fieldName) !== undefined && !isLink(watch(fieldName))
              ? [
                  base64ToFile(
                    watch(fieldName),
                    getMimeTypeFromBase64(watch(fieldName)),
                  ) as File,
                ]
              : null
          }
          errorText={errors[fieldName]}
          onChange={(e) => handleFileChange(e, fieldName)}
          imageVariant={imageVariant}
          handleView={handleView}
          handleDelete={handleDelete}
        />
      )}
    </div>
  </fieldset>
);

const VideoField = ({
  title,
  fieldName,
  watch,
  errors,
  handleFileChange,
  handleDelete,
  handleView,
}: {
  title: string;
  fieldName: keyof IListingMediaFormData;
  watch: any;
  errors: any;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IListingMediaFormData,
  ) => void;
  handleDelete?: () => void;
  handleView?: () => void;
}) => (
  <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
    <div className="w-[200px]">
      <Typography variant="c-m" className="text-[#344054]">
        {title}
      </Typography>
    </div>
    <div className="max-w-[512px] flex-1 lg:mx-auto">
      {isLink(watch(fieldName)) ? (
        <div>
          <FileGrabber
            name={fieldName}
            accept="video/*"
            type="video"
            maxSize={100}
            value={null}
            previewLink={{
              path: watch(fieldName),
            }}
            errorText={errors[fieldName]}
            onChange={(e) => handleFileChange(e, fieldName)}
            handleDelete={handleDelete}
            handleView={handleView}
          />
        </div>
      ) : (
        <FileGrabber
          name={fieldName}
          accept="video/*"
          type="video"
          maxSize={100}
          value={
            watch(fieldName) !== undefined && !isLink(watch(fieldName))
              ? [
                  base64ToFile(
                    watch(fieldName),
                    getMimeTypeFromBase64(watch(fieldName)),
                  ) as File,
                ]
              : []
          }
          errorText={errors[fieldName]}
          onChange={(e) => handleFileChange(e, fieldName)}
          handleDelete={handleDelete}
          handleView={handleView}
        />
      )}
    </div>
  </fieldset>
);

ListingMediaForm.displayName = "ListingMediaForm";
