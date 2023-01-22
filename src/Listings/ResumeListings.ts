import {Resume} from '../onchain/typechain-types/Resume'

const DEMO_WALLET = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' // hardhat wallet

export class ResumeListings {
  public resume!: Resume

  constructor(_resume: Resume) {
    this.resume = _resume
  }

  getTokenURIWithId = async (tokenId: number) => {
    return { tokenId, ...JSON.parse(await this.resume.tokenURI(tokenId)) } // TODO: validate data
  }

  queryPrivateResumes = async () => {
    const numNft = await this.resume.balanceOf(DEMO_WALLET)
    const queries = Array(numNft.toNumber()).fill(null) // create array to map on 
      .map(async (_, i) => {
        return await this.resume.tokenOfOwnerByIndex(DEMO_WALLET, i)
          .then((id) => this.getTokenURIWithId(id.toNumber()))
      })

    return Promise.all(queries)
  }

  queryPublicResumes = async () => {
    const numNft = await this.resume.totalSupply()
    const queries = Array(numNft.toNumber()).fill(null) // create array to map on 
      .map(async (_, i) => {
        return await this.resume.tokenByIndex(i)
          .then((id) => this.getTokenURIWithId(id.toNumber()))
      })

    return Promise.all(queries)
  }
}
