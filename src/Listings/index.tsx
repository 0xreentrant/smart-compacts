import {useEffect, useState} from 'react'
import {useContext} from 'react'
import {EthersContext} from '../EthersContext'
import {EntriesList} from './EntriesList'
import {EntriesHeader} from './EntriesHeader'
import {Resume} from '../onchain/typechain-types/Resume'

const DEMO_WALLET = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' // hardhat wallet

export const Listings = () => {
  const resume = useContext(EthersContext) as Resume
  const [publicListings, setPublicListings] = useState<Array<any>>([])
  const [privateListings, setPrivateListings] = useState<Array<any>>([])

  useEffect(() => { 
    const listPrivateResumes = async () => {
      const numNft = (await resume.balanceOf(DEMO_WALLET)).toNumber()

      console.log(numNft)

      const nftQueries = Array(numNft).fill(null).map((_, i) => {
        return resume.tokenOfOwnerByIndex(DEMO_WALLET, i).then(id => {
          const tokenId = id.toNumber()
          return Promise.all([tokenId, resume.tokenURI(tokenId)])
        })
      })

      await Promise.all(nftQueries).then(allNfts => {
        console.log('private', allNfts)
        const processedResumes = allNfts.map(([id, data]: [Number, string]) => ({ tokenId: id, ...JSON.parse(data) }))
        setPrivateListings(processedResumes)
      })
    }

    listPrivateResumes()

    const listPublicResumes = async () => {
      const numNft = (await resume.totalSupply()).toNumber()

      const nftQueries = Array(numNft).fill(null).map((_, i) => {
        return resume.tokenByIndex(i).then(id => {
          const tokenId = id.toNumber()
          return Promise.all([tokenId, resume.tokenURI(tokenId)])
        })
      })

      await Promise.all(nftQueries).then(allNfts => {
        const processedResumes = allNfts.map(([id, data]: [Number, string]) => ({ tokenId: id, ...JSON.parse(data) }))
        setPublicListings(processedResumes)
      })
    }

    listPublicResumes()
  }, [])

  return (
    <div className=''>
      <h1 className='pb-2'>My Resumes</h1>
      <EntriesHeader />
      <EntriesList 
        entries={privateListings} 
      />

      <h1 className='pb-2'>Public Resumes</h1>
      <EntriesHeader />
      <EntriesList entries={publicListings} />
    </div>
  )
}

