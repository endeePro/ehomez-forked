import { ISelectItemPropsWithValueGeneric } from "@/redux/api/genericInterface";
import { FormFields } from "@/redux/api/property/formState.slice";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const queryStringToObject = (queryString: string): Record<string, string> => {
  const pairs = queryString.split("&");
  return pairs.reduce(
    (acc, pair) => {
      const [key, value] = pair.split("=");
      if (key) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

type QueryParams = Record<
  string,
  string | number | boolean | Array<string | number | boolean>
>;

const objectToQueryString = (queryParams: QueryParams): string => {
  let queries = "?";
  for (const [key, value] of Object.entries(queryParams || {})) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        queries += `${key}=${encodeURIComponent(String(value[i]))}&`;
      }
    } else if (value !== undefined && value !== null) {
      queries += `${key}=${encodeURIComponent(String(value))}&`;
    }
  }
  return queries.slice(0, -1);
};

export function convertToCapitalized(names: string | undefined) {
  if (!names) return "";
  const nameArray = names.split(" ");
  const convertedNames = [];
  for (const name of nameArray) {
    const capitalized =
      name.toLowerCase().charAt(0).toUpperCase() + name.toLowerCase().slice(1);
    convertedNames.push(capitalized);
  }

  const result = convertedNames.join(" ");

  return result;
}

export function getInitials(fullname: string) {
  const words = fullname ? fullname.trim().split(" ") : [];
  const initials = words && words.map((word) => word[0].toUpperCase()).join("");
  return initials;
}

export const queryParamsHelper = {
  queryStringToObject,
  objectToQueryString,
};

export function truncateString(str: string, length: number): string {
  if (typeof str !== "string" || typeof length !== "number" || length < 0) {
    throw new Error(
      "Invalid input: Expecting a string and a positive number for length.",
    );
  }

  if (str.length <= length) {
    return str;
  }

  return str.substring(0, length) + "...";
}

export const useAmount = () => {
  function convertToAmount(amount: number | string) {
    return `${Number(amount || 0)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`;
  }

  function convertToAmountInNaira(amount: number | string) {
    return `₦${Number(amount || 0)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`;
  }

  return { convertToAmount, convertToAmountInNaira };
};

export const findPropertyStatusIndex = (str: string) =>
  str === "pending-listing"
    ? 1
    : str === "approved-listing"
      ? 2
      : str === "declined-listing"
        ? 3
        : str === "closed-listing"
          ? 4
          : str === "under-review"
            ? 5
            : 6;

export const formatSelectItems = <T extends object>(
  items: T[],
  label: keyof T,
  value: keyof T,
): ISelectItemPropsWithValueGeneric[] => {
  return items?.length > 0
    ? items.map((data) => {
        const itemValue = data[value];
        return {
          value:
            typeof itemValue === "string" || typeof itemValue === "number"
              ? itemValue
              : String(itemValue),
          label: String(data[label]),
        };
      })
    : [];
};

type FieldSetterAndClearerParams<T> = {
  value: T[keyof T];
  setterFunc: (field: keyof T, value: T[keyof T] | null) => void;
  setField: keyof T;
  clearFields?: Array<keyof T>;
  clearErrors: (field: keyof T) => void;
};

export const fieldSetterAndClearer = <T>({
  value,
  setterFunc,
  setField,
  clearFields,
  clearErrors,
}: FieldSetterAndClearerParams<T>): void => {
  setterFunc(setField, value);
  clearErrors(setField);
  clearFields?.forEach((field) => setterFunc(field, null));
};

export function objectToFormData<T extends object>(obj: T): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.every((item) => item instanceof File)) {
        value.forEach((file) => formData.append(key, file));
      } else {
        value.forEach((item, index) =>
          formData.append(`${key}[${index}]`, item),
        );
      }
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export function getMimeTypeFromFileName(fileName: string): string {
  const extension = fileName?.split?.(".").pop()?.toLowerCase?.();

  const mimeTypes: { [key: string]: string } = {
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    json: "application/json",
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    xml: "application/xml",
    zip: "application/zip",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };

  return extension && extension in mimeTypes
    ? mimeTypes[extension]
    : "application/octet-stream";
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const result = `${base64String}::filename:${encodeURIComponent(file.name)}`;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const base64ToFile = (
  base64String: string,
  defaultMimeType: string = "application/octet-stream",
): File | undefined => {
  if (base64String === undefined || base64String.trim() === "")
    return undefined;

  let base64Data: string;
  let fileName: string = "default_filename";
  let mimeType: string;

  // Check if the base64String includes filename
  if (base64String.includes("::filename:")) {
    const [dataWithMimeType, fileNamePart] = base64String.split("::filename:");
    fileName = decodeURIComponent(fileNamePart || fileName);
    base64Data = dataWithMimeType;
  } else {
    base64Data = base64String;
  }

  // Determine MIME type
  try {
    mimeType = getMimeTypeFromBase64(base64Data);
  } catch (error) {
    console.warn(
      "Could not determine MIME type, using default:",
      defaultMimeType,
    );
    mimeType = defaultMimeType;
  }

  // Extract the base64 data
  const base64Content = base64Data.includes("base64,")
    ? base64Data.split("base64,")[1]
    : base64Data;

  try {
    const byteString = atob(base64Content);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: mimeType });
    return new File([blob], fileName, { type: mimeType });
  } catch (error) {
    console.error("Error converting base64 to File:", error);
    return undefined;
  }
};

export const base64ToFileType2 = (
  base64String: string,
  mimeType: string,
  fileName: string = "default_filename",
): File | undefined => {
  if (!base64String) return;

  // Extract the actual base64 content (assuming format like `data:<mimetype>;base64,<data>`)
  const base64Content = base64String.includes(",")
    ? base64String.split(",")[1]
    : base64String;

  // Convert base64 to byte array
  const byteString = atob(base64Content);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Create a Blob and File object from the byte array
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
};

export function getMimeTypeFromBase64(base64String: string): string {
  if (base64String === undefined || base64String.trim() === "") {
    return "";
  }

  // Check if the string is in data URI format
  if (base64String.startsWith("data:")) {
    const mimeTypeMatch = base64String.match(/^data:(.+?);base64,/);
    if (mimeTypeMatch && mimeTypeMatch[1]) {
      return mimeTypeMatch[1];
    }
  }

  // If not in data URI format, try to detect MIME type from the decoded content
  try {
    const decodedString = atob(base64String.split(",").pop() || base64String);
    const uint8Array = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
      uint8Array[i] = decodedString.charCodeAt(i);
    }

    // Check for common file signatures
    if (
      uint8Array[0] === 0xff &&
      uint8Array[1] === 0xd8 &&
      uint8Array[2] === 0xff
    ) {
      return "image/jpeg";
    }
    if (
      uint8Array[0] === 0x89 &&
      uint8Array[1] === 0x50 &&
      uint8Array[2] === 0x4e &&
      uint8Array[3] === 0x47
    ) {
      return "image/png";
    }
    if (
      uint8Array[0] === 0x47 &&
      uint8Array[1] === 0x49 &&
      uint8Array[2] === 0x46
    ) {
      return "image/gif";
    }
    if (
      uint8Array[0] === 0x25 &&
      uint8Array[1] === 0x50 &&
      uint8Array[2] === 0x44 &&
      uint8Array[3] === 0x46
    ) {
      return "application/pdf";
    }

    // If no specific type is detected, return a generic binary type
    return "application/octet-stream";
  } catch (error) {
    throw new Error("Invalid Base64 string.");
  }
}

/**
 * Converts a raw base64 string to a data URI format.
 * @param base64String The raw base64 string to convert.
 * @param mimeType The MIME type of the data (optional, default is 'application/octet-stream').
 * @param fileName The name of the file (optional).
 * @returns A string in data URI format.
 */
export function attachMetadataToBase64(
  base64String: string,
  mimeType: string = "application/octet-stream",
  fileName?: string,
): string {
  // Remove any existing data URI scheme prefix if present
  const cleanBase64 = base64String?.replace(/^data:.*,/, "");

  // Create the data URI
  let dataUri = `data:${mimeType};base64,${cleanBase64}`;

  // Attach filename if provided
  if (fileName) {
    const encodedFileName = encodeURIComponent(fileName);
    dataUri += `::filename:${encodedFileName}`;
  }

  return dataUri;
}

export function getFileSizeFromBase64(base64String: string): number {
  if (!base64String) return 0;
  const sizeInBytes =
    (base64String.length * 3) / 4 -
    (base64String.indexOf("=") > 0
      ? base64String.length - base64String.indexOf("=")
      : 0);
  return sizeInBytes;
}

export const isLink = (input: string): boolean => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" +
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" +
      "(\\#[-a-zA-Z\\d_]*)?$",
    "i",
  );
  return !!urlPattern.test(input);
};

export const isMediaLink = (input: string): boolean => {
  const mediaPattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-zA-Z\\d_]*)?$" + // fragment locator
      "(\\.(png|jpg|jpeg|gif|mp4|mov|avi|webm|mkv|mov))$", // file extension for images and videos
    "i", // case insensitive
  );
  return !!mediaPattern.test(input);
};

export const formsToPreFillDictionary: Record<string, FormFields[]> = {
  "rent-apartment": ["basicInformation", "listingMedia", "billing"],
  "rent-land": [
    "basicInformationRentLand",
    "propertyMeasurements",
    "ownershipDocs",
    "listingMedia",
    "billing",
  ],
  "sale-apartment": [
    "basicInformation",
    "ownershipDocs",
    "listingMedia",
    "billingSales",
  ],
  "sale-land": [
    "basicInformationRentLand",
    "propertyMeasurements",
    "ownershipDocs",
    "listingMedia",
    "billingSales",
  ],
  "short-let": ["basicInformation", "listingMedia", "billingShortlet"],
};

export const formsToPreFill = (string: string): FormFields[] => {
  return (
    formsToPreFillDictionary[string] ??
    formsToPreFillDictionary["rent-apartment"]
  );
};

export function getPreviewImageLink(file: File): string {
  if (!(file instanceof File)) {
    return "";
  }

  // Generate a preview URL for the image
  const previewUrl = URL.createObjectURL(file);

  // Optional: Clean up the URL after usage to avoid memory leaks
  // Consider doing this when the image is no longer needed
  // URL.revokeObjectURL(previewUrl);

  return previewUrl;
}
