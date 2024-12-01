import { ChangeEvent, FormEvent } from "react";

export type OnSubmitType = (
  event: FormEvent<HTMLFormElement>,
  searchTerm: string,
) => void;

export type OnChangeType = (
  event: ChangeEvent<HTMLInputElement>,
  searchTerm: string,
) => void;

export interface ISearchProps {
  placeholder?: string;
  onSubmit: OnSubmitType;
  onChange?: OnChangeType;
  className?: string;
  value?: string;
}
