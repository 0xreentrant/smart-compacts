const resumeABI = require('../contracts/artifacts/Resume.json')

const listAll = async ({privkey, contract}, {ethers}) => {
  const provider = new ethers.providers.JsonRpcProvider()
  const Resume =  new ethers.Contract(contract, resumeABI.abi, provider)
  const resume = Resume.connect(provider)
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

task('list-all', 'List all the nfts on contract')
  .addParam('contract', 'The address for the contract')
  .addParam('wallet', 'The address we\'re getting the nfts for')
  .addParam('privkey', 'The privkey of the wallet we\'re accessing ')
  .setAction(listAll)
