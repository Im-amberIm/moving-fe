"use client";

import Image from "next/image";
import React, { useState } from "react";
import assets from "@/variables/images";

// Error Messages 출력은 추후 수정해야함

interface SearchInputProps {
  name: string;
  placeholder?: string;
  className?: string;
}

const styles = {
  container: `relative flex items-center w-full
  `,
  input: `
    input placeholder:text-grayscale-400 rounded-[16px] focus:outline-none
    text-black-400 bg-bg-100 transition-all
    mobile:text-md mobile:w-full mobile:h-[52px] mobile:py-[14px]
    pc:text-xl pc:h-[64px] pc:py-[16px]
  `,
  inputWithValue: `
    mobile:pl-[16px] mobile:pr-[84px]
    pc:pl-[24px] pc:pr-[116px]
  `,
  inputEmpty: ` 
    mobile:pl-[52px] mobile:pr-[16px]
    pc:pl-[72px] pc:pr-[24px]
  `,
  searchIconLeft: `
    absolute transition-all cursor-pointer
    mobile:left-[16px] mobile:w-[24px] mobile:h-[24px]
    pc:left-[24px] pc:w-[36px] pc:h-[36px]
  `,
  searchIconRight: `
    mobile:w-[24px] mobile:h-[24px]
    pc:w-[36px] pc:h-[36px] cursor-pointer
  `,
  iconWrapper: `
    absolute right-0 flex items-center gap-2
    mobile:pr-[16px]
    pc:pr-[24px]
  `,
  clearIcon: `
    cursor-pointer
    mobile:w-[24px] mobile:h-[24px]
    pc:w-[36px] pc:h-[36px]
  `,
};

export default function Input({
  name,
  placeholder = "",
  className = "",
}: SearchInputProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    setInputValue("");
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <input
        id={name}
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={`${styles.input} ${
          inputValue ? styles.inputWithValue : styles.inputEmpty
        }`}
      />

      {!inputValue && (
        <Image
          src={assets.icons.search}
          width={24}
          height={24}
          alt="search"
          className={styles.searchIconLeft}
        />
      )}

      {inputValue && (
        <div className={styles.iconWrapper}>
          <Image
            src={assets.icons.x}
            width={24}
            height={24}
            alt="clear"
            onClick={clearInput}
            className={styles.clearIcon}
          />
          <Image
            src={assets.icons.search}
            width={24}
            height={24}
            alt="search"
            className={styles.searchIconRight}
          />
        </div>
      )}
    </div>
  );
}
