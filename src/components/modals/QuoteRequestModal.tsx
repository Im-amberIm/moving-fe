"use client";

import assets from "@/variables/images";
import Button from "@/components/common/Button";
import Image from "next/image";

export default function QuoteRequestModal() {
  const handleClick = () => console.log("일반 견적 요청 하기");

  const styles = {
    container: `bg-white w-fit h-[208px] rounded-[24px] px-[16px] py-[24px]
    pc:w-[608px] pc:h-[278px] pc:px-[24px] pc:py-[32px]`,
    title: `relative flex justify-between`,
    titleText: `text-2lg font-bold text-black-400 mb-[30px]
    pc:mb-[40px] pc:text-2xl pc:font-semibold`,
    close: "absolute top-0 right-0 cursor-pointer pc:w-[36px] pc:h-[36px]",
    description: "text-2lg font-medium text-black-300 mb-[24px] pc:mb-[40px]",
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p className={styles.titleText}>지정 견적 요청하기</p>
        <Image
          src={assets.icons.x}
          alt="close"
          width={24}
          height={24}
          className={styles.close}
        />
      </div>
      <p className={styles.description}>일반 견적 요청을 먼저 진행해 주세요.</p>
      <Button
        onClick={handleClick}
        children="일반 견적 요청하기"
        variant="primary"
        width="100%"
        height="54px"
        className=""
      />
    </div>
  );
}
