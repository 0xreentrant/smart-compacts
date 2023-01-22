const decodeTx = async ({privkey, wallet, contract, hash}, {ethers}) => {
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = new ethers.Wallet(privkey, provider)
  const resume = await ethers.getContractAt('Resume', contract, signer)

  const {interface} = resume
  const tx = await provider.getTransaction(hash)

  out = interface.parseTransaction(tx)
  console.log(out)
}

task('decodetx', 'Decode the transaction data')
  .addParam('contract', 'The address for the contract')
  .addParam('wallet', 'The address we\'re getting the balance for')
  .addParam('privkey', 'The privkey of the wallet we\'re accessing ')
  .addParam('hash', 'The transaction hash to decode')
  .setAction(decodeTx)

