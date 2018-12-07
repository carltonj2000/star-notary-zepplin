# Star Notary Project

The code in this repository is for project 5 of the
[Udacity Blockchain Developer Nanodegree](https://www.udacity.com/course/blockchain-developer-nanodegree--nd1309).

The `StarNotary` contract was deployed to the `rinkeby` network, a star
was claimed and put up for sale. The related information follows.

| Information      | Details                                                            |
| ---------------- | ------------------------------------------------------------------ |
| Contract Hash    | 0x8a8ba5cde1f3ad1eaa4629e012a7839a736206f1512098fbdd7a74e0bb05a137 |
| Contract Address | 0x45fd9be7bf2f4778ce74cd9a9ca723de4a90e99b                         |
| New Star Hash    | 0x748c929718188ceca965b057ec30d66a447c7fd2f2a937c0fdc08c4a10e6c373 |
| New Star ID      | 1                                                                  |
| Sale Hash        | 0x50a11101f7bfe69fab1c262798091515544a9f2dc19ce646844c6caaf99d10df |
| Sale Price       | 0.1 Ether                                                          |

In order to verify the code do the following.

- install the `ganache` GUI/CLI for local testing
- create an account on the `rinkeby` test network and fund it from a faucet
- install the `metamask` browser extension
- import the `ganache` or `rinkeby` accounts into `metamask`
- to run the `StarNotary` contract execute the following on the command line
  - `npm install` to install dependencies
  - update `truffle.js` or `truffle.config.js` with your network information
  - `npm run migrate:ganacheGui` to deploy contract to ganache GUI
  - `npm run migrate:ganacheCli` to deploy contract to ganache CLI
  - `npm run migrate:rinkeby` to deploy contract to rinkeby
  - copy `./build/contracts/StarNotary.json` to `./` if needed
  - during development VSCode `live server` was used to serve the GUI
  - `npm run server` will serve GUI in a web browser on port `3000`
  - Use the web GUI to enter the contract address, create stars and find stars

Note the `./index*.js` file are an incomplete attempt to use `node` or `truffle`
on the CLI to access the notary but are not completed yet due to insufficient
time.

## Repository History

The initial checkin of the repository is the Udacity provided starter code and
this readme.
