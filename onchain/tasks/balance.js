const balance = async ({privkey, wallet, contract}, {ethers}) => {
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = new ethers.Wallet(privkey, provider)
  const resume = await ethers.getContractAt('Resume', contract, signer)
  const out = await resume.balanceOf(wallet)
  console.log(out)
}

task('balance', 'Get the NFT balance of a wallet for contract')
  .addParam('contract', 'The address for the contract')
  .addParam('wallet', 'The address we\'re getting the balance for')
  .addParam('privkey', 'The privkey of the wallet we\'re accessing ')
  .setAction(balance)
