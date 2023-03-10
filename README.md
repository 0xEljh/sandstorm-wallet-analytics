# Wallet Analytics for NFT Traders, Collectors and Whitelisters: A Solana Sandstorm project

## Overview
A React Web App that uses ChakraUI and Helius' NFT API to display wallet analytics for NFT traders, collectors and whitelisters.

## Motivation
NFT project owners look for ways to whitelist users that would be valuable members of the community and would hold their NFTs. This project is a tool that allows project owners to whitelist users based on their wallet analytics.

Additionally, wallet analytics will help NFT traders (include alpha callers and followers) to identify traders with true insights from LARPers. This project may also eventually have SoFi applications through enabling trade journaling, social trading/trading vaults (think STFX), etc.

## Application

A working demo of the application can be found at https://nftanalytics.dev/

![NFT Analytics of a wallet in the /profile page](/screenshots/nftanalytics-screenshot-1.jpg)

Currently, the application does not handle multiple wallets or NFT AMM transactions (like tensor) so well but these are planned features.

### Dependencies/Setup

This project requires the (https://docs.helius.xyz/solana-apis/nft-api)[Helius NFT API key] to be run. It also requires Firebase for logging purposes (and in the future, as the backend). Hence a firebase project and configuration is required.

Place all keys in a .env file in the root directory of the project. The .env file should look like this:
    
    ```
    REACT_APP_HELIUS_API_KEY=""

    REACT_APP_FIREBASE_API_KEY=""
    REACT_APP_FIREBASE_AUTH_DOMAIN=""
    REACT_APP_FIREBASE_PROJECT_ID=""
    REACT_APP_FIREBASE_STORAGE_BUCKET=""
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
    REACT_APP_FIREBASE_APP_ID = ""
    ```

## Features

- [x] Wallet NFT trading Win Rate Statistics and Profit
- [x] Wallet NFT Holdings
- [x] Wallet "Status" Tags (e.g. "Flipper", "Collector", "Whale", etc.)
- [x] Upload and download wallet whitelists
- [ ] Account Creation
- [ ] Featured Wallets & Profiles
- [ ] Trade Journaling
- [ ] Multiple wallet support
- [ ] NFT AMM transaction support
- [ ] Social Trading/Trading Vaults


## Contributing

Contributions are welcome! Please feel free to open an issue or pull request. If you'd like to contribute in other ways or offer feedback, reach out to me via Discord (0xEljh#0898) or Twitter (@0xEljh). You may also email me at elijahng96@gmail.com

Finally, my SOL/ETH address is 0xeljh.sol or 0xeljh.eth if you'd like to send me a tip! (such domains/addresses are not currently supported by the app hopefully I'll get there soon!)

## License

This project is licensed under GNU General Public License v3.0. See LICENSE for more details.

## Acknowledgements

- (https://helius.xyz/)[Helius] and their easy-to-use (https://docs.helius.xyz/solana-apis/nft-api)[Solana NFT API]. Currently on free-tier for dev purposes.

