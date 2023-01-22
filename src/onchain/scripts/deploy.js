// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Resume = await hre.ethers.getContractFactory("Resume");
  const resume = await Resume.deploy();

  await resume.deployed();

  console.log("Resume deployed to:", resume.address);
  console.log('Minting for first address')

  const wallet = async idx => (await hre.ethers.getSigners())[idx].address
  const buildURI = (str, url) => ({ title: `Test Resume ${str}`, createdOn:`${new Date()}`, ipfsHash: `${url}`})

  const private = await resume.toTRES(await wallet(0), JSON.stringify(buildURI('private', 'QmVwMmp4sD7ravgiEcLXNVKBYUVXsEh5NmU4JY1UzdmGMk')))
  const public = await resume.toTRES(await wallet(1), JSON.stringify(buildURI('public', 'QmZdVsxDkJZa5nBbgzqCtjryLLgZ6yMYXk6VNY5BiUbCjW')))

  console.log('Minted private ("connected") wallet', private)
  console.log('Minted public wallet', public)
  console.log('Showing all minted')

  const numNft = (await resume.totalSupply()).toNumber()
  console.log('Num nfts', numNft)

  const nftQueries = Array(numNft).fill().map((_, i) => {
    return resume.tokenByIndex(i).then(id => {
      const tokenId = id.toNumber()
      return Promise.all([tokenId, resume.tokenURI(tokenId)])
    })
  })

  return Promise.all(nftQueries).then(allNfts => {
    allNfts.forEach(([tokenId, tokenURI]) => console.log('Id:', tokenId, '\nData:', tokenURI, '\n'))
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
