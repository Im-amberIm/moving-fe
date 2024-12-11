import Image from "next/image";
import assets from "@/variables/images";
import ServiceChip from "./card/ServiceChip";
import QuoteModalMover from "./card/QuoteModalUser";
import Input from "./Input";
import Textarea from "./Textarea";
import Button from "./Button";
import { useState } from "react";

const MIN_COMMENT_LENGTH = 10;

interface QuoteModalProps {
  onClose?: () => void;
  onSubmit?: (data: { cost: number; comment: string }) => void;
  serviceType: number;
  isDesignatedQuote: boolean;
  isRejected: boolean;
  startAddress: string;
  endAddress: string;
  moveDate: string;
  customerName: string;
}

const styles = {
  container: `flex flex-col bg-white px-[24px] pt-[32px] pb-[40px] rounded-t-[32px] w-full
  tablet:rounded-[32px]
  pc:px-[24px] pc:pt-[32px] pc:pb-[40px] pc:rounded-[32px]`,
  titleContainer: `flex flex-row justify-between items-center mb-[26px] text-2lg font-bold text-black-400
  pc:text-2xl pc:font-semibold pc:mb-[40px]`,
  closeIcon: `cursor-pointer pc:w-[32px] pc:h-[32px]`,
  chipsContainer: `flex gap-[8px] mb-[14px] pc:mb-[24px]`,
  quoteContainer: `mb-[20px] pb-[20px] border-b-[1px] border-solid border-line-200
  pc:mb-[32px] pc:pb-[32px] pc:text-2xl`,
  Title: `mb-[16px] text-lg font-semibold text-black-300
  pc:text-xl`,
  commentContainer: `mb-[26px] pc:mb-[40px]`,
};

export default function QuoteModal({
  onClose = () => {},
  onSubmit = () => {},
  serviceType,
  isDesignatedQuote,
  isRejected = false,
  startAddress = "서울특별시 강남구 테헤란로 14길 6 남도빌딩",
  endAddress = "서울특별시 강남구 테헤란로 14길 6 남도빌딩",
  moveDate = "2024. 01. 01(목)",
  customerName = "김코드",
}: QuoteModalProps) {
  const service: "smallMove" | "homeMove" | "officeMove" =
    serviceType === 2
      ? "homeMove"
      : serviceType === 3
      ? "officeMove"
      : "smallMove";

  const [quote, setQuote] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const isValid = isRejected
    ? comment.length >= MIN_COMMENT_LENGTH && typeof comment === "string"
    : quote.length > 0 &&
      !isNaN(Number(quote)) &&
      comment.length >= MIN_COMMENT_LENGTH &&
      typeof comment === "string";

  const handleCallApi = () => {
    onSubmit({ cost: Number(quote), comment });
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <p>{isRejected ? "반려요청" : "견적 보내기"}</p>
        <Image
          src={assets.icons.x}
          alt="close"
          width={24}
          height={24}
          onClick={onClose}
          className={styles.closeIcon}
        />
      </div>
      <div className={styles.chipsContainer}>
        <ServiceChip variant={service} />
        {isDesignatedQuote && <ServiceChip variant="designatedQuote" />}
      </div>
      <QuoteModalMover
        customerName={customerName}
        moveDate={moveDate}
        startAddress={startAddress}
        endAddress={endAddress}
      />
      {!isRejected && (
        <div className={styles.quoteContainer}>
          <p className={styles.Title}>견적가를 입력해주세요</p>
          <Input
            name="quote"
            placeholder="견적가 입력"
            value={quote}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuote(e.target.value)
            }
          />
        </div>
      )}
      <div className={styles.commentContainer}>
        <p className={styles.Title}>코멘트를 입력해 주세요</p>
        <Textarea
          name="comment"
          placeholder={`최소 ${MIN_COMMENT_LENGTH}자 이상 입력해주세요`}
          value={comment}
          onChange={(value: string) => setComment(value)}
        />
      </div>
      <Button
        children={isRejected ? "반려하기" : "견적 보내기"}
        variant="primary"
        onClick={handleCallApi}
        disabled={!isValid}
      />
    </div>
  );
}
