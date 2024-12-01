import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Modal, PdfViewer, Typography } from "@/components";
import {
  base64ToFile,
  fieldSetterAndClearer,
  fileToBase64,
  getFileSizeFromBase64,
  getMimeTypeFromBase64,
} from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

import FileGrabber from "@/components/fileGrabbers/fileGrabber";

const DocumentValidation = (size: number) =>
  Yup.string()
    .test("fileSize", "File too large", (value) => {
      if (!value) return true; // Allow empty for optional fields
      const sizeInBytes = getFileSizeFromBase64(value);
      return sizeInBytes <= size * 1024 * 1024;
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return true; // Allow empty for optional fields
      const mimeType = getMimeTypeFromBase64(value);
      return mimeType.startsWith("application/pdf");
    });

const schema = Yup.object().shape({
  certificateOfOwnership: DocumentValidation(5).required(
    "Certificate of ownership is required",
  ),
  governorConsent: DocumentValidation(5).required(
    "Governor consent is required",
  ),
  deedOfAssignment: DocumentValidation(5).required(
    "Deed of assignment is required",
  ),
  landPurchaseReceipt: DocumentValidation(5).required(
    "Land purchase receipt is required",
  ),
  landSurvey: DocumentValidation(5).required("Land survey is required"),
});

export interface IOwnershipDocsFormData {
  certificateOfOwnership: string;
  governorConsent: string;
  deedOfAssignment: string;
  landPurchaseReceipt: string;
  landSurvey: string;
}

interface ChildFormProps {
  onSubmit: SubmitHandler<IOwnershipDocsFormData>;
  initialData: IOwnershipDocsFormData;
}

export const OwnershipDocsForm = forwardRef<HTMLButtonElement, ChildFormProps>(
  ({ onSubmit, initialData }, ref) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<{
      file: string;
      name: string;
    } | null>(null);

    const handleCardClick = (file: { file: string; name: string }) => {
      setModalContent(file);
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
      setModalContent(null);
    };

    const methods = useForm<IOwnershipDocsFormData>({
      defaultValues: initialData,
      resolver: yupResolver(schema),
    });
    const {
      formState: { errors },
      handleSubmit,
      setValue,
      clearErrors,
      getValues,
      watch,
    } = methods;

    console.log(getValues());

    const submitRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => submitRef.current!);

    const handleFileChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: keyof IOwnershipDocsFormData,
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
    return (
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <DocField
          title="Certificate Of ownership"
          fieldName="certificateOfOwnership"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
          handleView={() => {
            handleCardClick({
              file: watch("certificateOfOwnership"),
              name: "Certificate of ownership",
            });
          }}
        />
        <DocField
          title="Governor Consent"
          fieldName="governorConsent"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
          handleView={() => {
            handleCardClick({
              file: watch("governorConsent"),
              name: "Governor consent",
            });
          }}
        />
        <DocField
          title="Deed Of Assignment"
          fieldName="deedOfAssignment"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
          handleView={() => {
            handleCardClick({
              file: watch("deedOfAssignment"),
              name: "Deed of assignment",
            });
          }}
        />{" "}
        <DocField
          title="Land Purchase Receipt"
          fieldName="landPurchaseReceipt"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
          handleView={() => {
            handleCardClick({
              file: watch("landPurchaseReceipt"),
              name: "Land purchase receipt",
            });
          }}
        />
        <DocField
          title="Land Survey"
          fieldName="landSurvey"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
          handleView={() => {
            handleCardClick({
              file: watch("landSurvey"),
              name: "Land survey",
            });
          }}
        />
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
                  base64ToFile(
                    modalContent.file,
                    getMimeTypeFromBase64(modalContent?.name),
                  ) as File,
                )}
              />
            )}
          </div>
        </Modal>
        {/* Invisible submit button */}
        <button type="submit" ref={submitRef} style={{ display: "none" }}>
          Submit
        </button>
      </form>
    );
  },
);

const DocField = ({
  title,
  fieldName,
  watch,
  errors,
  handleFileChange,
  handleView,
}: {
  title: string;
  fieldName: keyof IOwnershipDocsFormData;
  watch: any;
  errors: any;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IOwnershipDocsFormData,
  ) => void;
  handleView?: () => void;
}) => (
  <fieldset className="flex border-b border-solid border-[#EAECF0] pb-6 mmd:flex-col mmd:gap-2">
    <div className="w-[200px]">
      <Typography variant="c-m" className="text-[#344054]">
        {title}
      </Typography>
    </div>

    <div className="max-w-[512px] flex-1 lg:mx-auto">
      <FileGrabber
        name={fieldName}
        accept={"application/pdf"}
        type={"document"}
        maxSize={3}
        value={
          watch(fieldName) !== undefined
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
        imageVariant={"rect"}
        handleView={handleView}
      />
    </div>
  </fieldset>
);

OwnershipDocsForm.displayName = "OwnershipDocsForm";
