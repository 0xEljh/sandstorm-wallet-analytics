export default function parseWalletData(
  data: { [key: string]: any }[],
  account: string
) {
  // iterate through data and parse it for metadata
  // metadata includes: source, transaction volume,
  const sourceCounts: { [key: string]: number } = {};
  const transactionVolume = { buy: 0, sell: 0, total: 0 };

  // gather also nft data:
  // it is possible for a user to repurchase an nft after selling...
  // for this scenario, have to count transaction number on the nft.
  const nftTransactionCount: { [key: string]: number } = {};
  const nftBuyPrice: { [key: string]: number } = {};
  const nftSellPrice: { [key: string]: number } = {};
  // const nftProfits: { [key: string]: number } = {};
  const nftBuyTimestamps: { [key: string]: Date } = {};
  const nftSellTimestamps: { [key: string]: Date } = {};

  data.forEach((item) => {
    const source = item.source as string;
    const amount = item.amount;
    const nftName = item.nfts[0].name;
    sourceCounts[source] = sourceCounts[source] ? sourceCounts[source] + 1 : 1;
    transactionVolume.total += amount;
    nftTransactionCount[nftName] = nftTransactionCount[nftName]
      ? nftTransactionCount[nftName] + 1
      : 1;

    // transactions are ordered from latest to earliest.
    // nft sell event occurs before buy event.
    if (item.buyer === account || item.type === "NFT_MINT") {
      // treat nft mint as a buy event for transaction purposes
      transactionVolume.buy += amount;
      // check if nft was sold -> if sold, find profit
      // else set profit to 0 since nft has not been sold yet
      nftBuyPrice[nftName] = amount;
      nftBuyTimestamps[nftName] = item.timestamp;
    } else {
      // sell transaction
      transactionVolume.sell += amount;
      nftSellPrice[nftName] = amount;
      nftSellTimestamps[nftName] = item.timestamp;
    }
  });

  // nft data into array of objects:
  const nftData = Object.keys(nftTransactionCount).map((key) => {
    return {
      name: key,
      transactionCount: nftTransactionCount[key],
      profit:
        nftSellPrice[key] && nftBuyPrice[key]
          ? nftSellPrice[key] - nftBuyPrice[key]
          : 0,
      buyTimestamp: nftBuyTimestamps[key],
      sellTimestamp: nftSellTimestamps[key],
      buyPrice: nftBuyPrice[key],
      sellPrice: nftSellPrice[key],
    };
  });
  // if transaction count is odd, nft is still owned by user.

  return { nftData, sourceCounts, transactionVolume };
}
