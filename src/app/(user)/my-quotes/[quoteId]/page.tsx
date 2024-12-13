import QuoteDetail from "./QuoteDetail";

import { getQuote } from "@/api/quotes";
import { GetQuoteApiResponseData } from "@/types/api";

async function fetchQuoteData(
  quoteId: number
): Promise<GetQuoteApiResponseData> {
  return getQuote(quoteId);
}

export interface MyQuotesDetailPageProps {
  params: {
    quoteId: string;
  };
}

export default async function MyQuotesDetailPage({
  params,
}: MyQuotesDetailPageProps) {
  const { quoteId } = await params;

  const data = await fetchQuoteData(Number(quoteId));

  const styles = {
    topBar: `flex flex-row gap-2.5 items-center justify-center w-[328px] h-[54px] 
      tablet:w-[600px] 
      pc:w-[1400px] pc:h-[96px]`,
    barItem: `flex flex-row items-center w-[328px] h-full 
      text-2lg text-[#2b2b2b] font-semibold 
      tablet:w-[600px] 
      pc:w-[1400px] pc:text-2xl`,
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className={styles.topBar}>
        <div className={styles.barItem}>견적 상세</div>
      </div>
      <QuoteDetail data={data} />
    </div>
  );
}