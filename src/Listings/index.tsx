import {useEffect, useState} from 'react'
import {useContext} from 'react'
import {EthersContext} from '../EthersContext'
import {EntriesList} from './EntriesList'
import {EntriesHeader} from './EntriesHeader'
import {Resume} from '../onchain/typechain-types/Resume'
import {ResumeListings} from './ResumeListings'
import {Entry} from '../types/Entry'

export const Listings = () => {
  const resume = useContext(EthersContext) as Resume
  const [publicListings, setPublicListings] = useState<Array<Entry>>([])
  const [privateListings, setPrivateListings] = useState<Array<Entry>>([])

  useEffect(() => { 
    const listingsService = new ResumeListings(resume)

    const run = async () => {
      const privateResumes = await listingsService.queryPrivateResumes()

      setPrivateListings(privateResumes)
      
      const privateIds = privateResumes.map(({tokenId}) => tokenId)
      const allResumes = await listingsService.queryPublicResumes()
      const filteredResumes = allResumes.filter(entry => privateIds.includes(entry.tokenId))

      setPublicListings(filteredResumes)
    }

    run()
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

      <hr className='mt-10' />
      <h1 className='mt-3'>&copy; 2022 - __WHOAMI__</h1>
    </div>
  )
}

