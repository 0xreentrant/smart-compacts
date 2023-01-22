import {useEffect, useState} from 'react'
import {useContext} from 'react'
import {EthersContext} from '../EthersContext'
import {EntriesList} from './EntriesList'
import {EntriesHeader} from './EntriesHeader'
import {Resume} from '../onchain/typechain-types/Resume'
import {ResumeListings} from './ResumeListings'
import {ResumeURI} from 'types/Resume'

export const Listings = () => {
  const resume = useContext(EthersContext) as Resume
  const [publicListings, setPublicListings] = useState<Array<ResumeURI>>([])
  const [privateListings, setPrivateListings] = useState<Array<ResumeURI>>([])

  useEffect(() => { 
    const listingsService = new ResumeListings(resume)

    const run = async () => {
      const privateResumes = await listingsService.queryPrivateResumes()
      const privateIds = privateResumes.map(({tokenId}) => tokenId)
      const allResumes = await listingsService.queryPublicResumes()
      const filteredResumes = allResumes.filter(entry => !privateIds.includes(entry.tokenId))

      setPrivateListings(privateResumes)
      setPublicListings(filteredResumes)
    }

    run()
  }, [])

  return (
    <div className=''>
      <h1 className='pb-2'>My Resumes</h1>
      <EntriesHeader />
      <EntriesList entries={privateListings} />

      <h1 className='pb-2'>Public Resumes</h1>
      <EntriesHeader />
      <EntriesList entries={publicListings} />

      <hr className='mt-10' />
      <h1 className='mt-3'>&copy; 2022 - __WHOAMI__</h1>
    </div>
  )
}

