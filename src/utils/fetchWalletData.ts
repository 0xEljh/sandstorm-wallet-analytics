import axios from "axios";

export default async function fetchWalletData(address: string) {
  const url =
    "https://api.helius.xyz/v1/nft-events?api-key=" +
    process.env.REACT_APP_HELIUS_API_KEY;
  return await axios
    .post(url, {
      query: {
        accounts: [address],
        types: ["NFT_SALE", "NFT_MINT"],
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      return res.data.result;
    });
}
