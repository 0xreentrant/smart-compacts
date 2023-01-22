import { useContext } from 'react'
import { EthersContext } from '../EthersContext'
import { EntriesList } from './EntriesList'

const DUMMY = [
  {
    title: 'Test Resume',
    createdOn: '01/21/23',
    hash: '',
  },
  {
    title: 'Test Resume',
    createdOn: '01/21/23',
    hash: '',
  },
  {
    title: 'Test Resume',
    createdOn: '01/21/23',
    hash: '',
  },
  {
    title: 'Test Resume',
    createdOn: '01/21/23',
    hash: '',
  },
]

export const Listings = () => {
  const ethers = useContext(EthersContext)

  return (
    <div className=''>
      <h1>My Resumes</h1>
      <EntriesList 
        entries={DUMMY} 
      />

      <h1>Public Resumes</h1>
      <EntriesList entries={DUMMY} />
    </div>
  )
}

