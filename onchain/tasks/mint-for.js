const mintFor = async ({wallet, privkey, contract, uri}, {ethers}) => {
  console.log(privkey)
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = new ethers.Wallet(privkey, provider)
  const resume = await ethers.getContractAt('Resume', contract, signer)

  console.log('-- SIGNER --')
  console.log(JSON.stringify(signer, null, 2))
  console.log('-- WALLET --')
  console.log(JSON.stringify(resume, null, 2))

  const out = await resume.toTRES(wallet, uri)
  console.log(out)
}

task('mint', 'Mint a token for a wallet address')
  .addParam('contract', 'The address for the contract')
  .addParam('wallet', 'The wallet address')
  .addParam('privkey', 'The privkey of the wallet we\'re accessing ')
  .addParam('uri', 'The metadata being saved')
  .setAction(mintFor)
