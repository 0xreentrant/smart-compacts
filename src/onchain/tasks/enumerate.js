const enumerate = async ({privkey, wallet, contract}, {ethers}) => {
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = new ethers.Wallet(privkey, provider)
  const resume = await ethers.getContractAt('Resume', contract, signer)
  const numNft = (await resume.balanceOf(wallet)).toNumber()

  const nftQueries = Array(numNft).fill().map((_, i) => {
    return resume.tokenOfOwnerByIndex(wallet, i).then(id => {
      const tokenId = id.toNumber()
      return Promise.all([tokenId, resume.tokenURI(tokenId)])
    })
  })

  return Promise.all(nftQueries).then(allNfts => {
    allNfts.forEach(([tokenId, tokenURI]) => console.log('Id:', tokenId, '\nData:', tokenURI, '\n'))
  })
}

task('enumerate', 'Get the NFTs of a wallet for contract')
  .addParam('contract', 'The address for the contract')
  .addParam('wallet', 'The address we\'re getting the nfts for')
  .addParam('privkey', 'The privkey of the wallet we\'re accessing ')
  .setAction(enumerate)
