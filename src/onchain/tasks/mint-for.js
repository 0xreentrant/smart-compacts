const mintFor = async ({privkey, wallet, contract, uri}, {ethers}) => {
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = new ethers.Wallet(privkey, provider)
  const resume = await ethers.getContractAt('Resume', contract, signer)

  const out = await resume.toTRES(wallet, uri)
  console.log(out)
}

task('mint', 'Mint a token for a wallet address')
  .addParam('contract', 'The address for the contract')
  .addParam('privkey', '')
  .addParam('wallet', 'The wallet address')
  .addParam('uri', 'The metadata being saved')
  .setAction(mintFor)
