require('@typechain/hardhat')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('./src/onchain/tasks/mint-for.js')
require('./src/onchain/tasks/balance.js')
require('./src/onchain/tasks/decodetx.js')
require('./src/onchain/tasks/enumerate.js')
require('./src/onchain/tasks/list-all.js')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.0",
  paths: {
    root: './src/onchain/'
  }
};
