import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Typography } from "@/components";
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

const imageValidation = (size: number) =>
  Yup.string()
    .test("fileSize", "File too large", (value) => {
      if (!value) return true; // Allow empty for optional fields
      const sizeInBytes = getFileSizeFromBase64(value);
      return sizeInBytes <= size * 1024 * 1024;
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return true; // Allow empty for optional fields
      const mimeType = getMimeTypeFromBase64(value);
      return mimeType.startsWith("image/");
    });

const videoValidation = (size: number) =>
  Yup.string()
    .test("fileSize", "File too large", (value) => {
      if (!value) return true; // Allow empty for optional fields
      const sizeInBytes = getFileSizeFromBase64(value);
      return sizeInBytes <= size * 1024 * 1024;
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return true; // Allow empty for optional fields
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
    const methods = useForm<IListingMediaFormData>({
      defaultValues: initialData,
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

    return (
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <ImageField
          title="Featured Image"
          fieldName="featuredImage"
          watch={watch}
          errors={errors}
          handleFileChange={handleFileChange}
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
            ].map((imageField) => (
              <ImageField
                key={imageField}
                title=""
                fieldName={imageField as keyof IListingMediaFormData}
                watch={watch}
                errors={errors}
                handleFileChange={handleFileChange}
                imageVariant={"square"}
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
        />

        {/* Invisible submit button */}
        <button type="submit" ref={submitRef} style={{ display: "none" }}>
          Submit
        </button>
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
      <FileGrabber
        name={fieldName}
        accept="image/*"
        type="image"
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
        imageVariant={imageVariant}
      />
    </div>
  </fieldset>
);

const VideoField = ({
  title,
  fieldName,
  watch,
  errors,
  handleFileChange,
}: {
  title: string;
  fieldName: keyof IListingMediaFormData;
  watch: any;
  errors: any;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IListingMediaFormData,
  ) => void;
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
        accept="video/*"
        type="video"
        maxSize={100}
        value={
          watch(fieldName) !== undefined
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
      />
    </div>
  </fieldset>
);

ListingMediaForm.displayName = "ListingMediaForm";
