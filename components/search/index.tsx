"use client";

import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import SearchIcon from "@/assets/svgs/search-icon.svg";
import clsx from "clsx";

import { ISearchProps } from "./types";

const Search: FC<ISearchProps> = (props) => {
  const {
    placeholder = "Enter a search term",
    onChange,
    onSubmit,
    value: receivedValue = "",
    className,
  } = props;

  const [searchTerm, setSearchTerm] = useState<string>(receivedValue);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e, newValue);
    } else {
      handleSearchInput(e);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e, searchTerm || receivedValue);
  };

  const classes = clsx(
    `flex justify-normal items-center border border-N40 rounded py-2 px-3 focus-within:border-B100 focus-within:border-2`,
    className,
  );

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <input
        type="search"
        name="search"
        id="search"
        value={onChange ? receivedValue : searchTerm}
        placeholder={placeholder}
        onChange={handleChange}
        className="grow focus:outline-none"
      />
      <button type="submit">
        <SearchIcon />
      </button>
    </form>
  );
};

export { Search };
