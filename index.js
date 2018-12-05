const secret = require("./secrets");
const Web3 = require("web3");
const fs = require("fs");

const config = secret.ganacheGui;
const web3 = new Web3(config.rpcServer);
const contractJSON = JSON.parse(
  fs.readFileSync("./build/contracts/StarNotary.json")
);

const contractAddress = "0x118aEB80053717c84ec460349EF3Cd45B1D11520";

const stars = [
  [
    "Star power 101!",
    "I love my wonderful star1",
    "ra_032.155",
    "dec_121.874",
    "mag_245.978"
  ]
];
(async () => {
  try {
    const contract = new web3.eth.Contract(contractJSON.abi, contractAddress);

    const starTokenId = 1;
    contract.methods
      .createStar(...stars[0], starTokenId)
      .call({ from: config.accounts[0].address })
      .then((error, result) => {
        console.log("e", error);
        console.log("result", result);
      })
      .catch(console.error);
    contract.methods
      .starIdToStarInfo(starTokenId)
      .call({ from: config.accounts[0].address })
      .then((error, result) => {
        console.log("si e", error);
        console.log("si result", result);
      })
      .catch(console.error);
  } catch (e) {
    console.error(e);
  }
})();
