/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
const secrets = require("./secrets.js");
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganachecli: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganachegui: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          secrets.rinkeby.mnemonic,
          secrets.rinkeby.rpcServer
        );
      },
      network_id: "4", // Rinkeby ID 4
      gas: 4500000,
      gasPrice: 10000000000
    }
  }
};
