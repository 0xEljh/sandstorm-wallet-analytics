import { solToLamp } from "./currencyConversion";
import { unixTimeToDate } from "./timeConversion";

export function getWinLossData(
  nftData: { [key: string]: any }[],
  nftHodlData: { [key: string]: any }[]
) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return {
    wins: nftData.filter((datum) => datum.profit > 0).length,
    losses: nftData.filter((datum) => datum.profit < 0).length,
    profit: nftData
      .map((datum) => datum.profit)
      .reduce((prev, curr) => prev + curr, 0),
    hodls: nftHodlData.filter(
      (datum) => unixTimeToDate(datum.buyTimestamp) < threeMonthsAgo
    ).length,
  };
}

export function getWalletTags(
  nftData: { [key: string]: any }[],
  nftHodlData: { [key: string]: any }[],
  transactionData: { [key: string]: number }
) {
  let tags = <string[]>[];
  // assign whale if inflow volume > 1000 sol
  if (transactionData.inflow > solToLamp(1000)) {
    tags.push("whale");
  }
  const { wins, losses, profit, hodls } = getWinLossData(nftData, nftHodlData);
  if (wins > losses + hodls && profit > solToLamp(100)) {
    tags.push("flipper");
  }

  // if last nft purchase is greater than 6 months ago, assign NFT_GOD
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  if (
    nftData.filter((datum) => unixTimeToDate(datum.buyTimestamp) > sixMonthsAgo)
      .length === 0 &&
    nftData.length > 0
  ) {
    tags.push("nft_god");
  }

  if (transactionData.mint > 10 && transactionData.mintSpend > solToLamp(20)) {
    tags.push("minter");
  }

  return tags;
}
