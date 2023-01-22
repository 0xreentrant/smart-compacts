require("@nomiclabs/hardhat-waffle");
require('./onchain/tasks/mint-for.js')
require('./onchain/tasks/balance.js')
require('./onchain/tasks/decodetx.js')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.0",
  paths: {
    root: './onchain/'
  }
};
