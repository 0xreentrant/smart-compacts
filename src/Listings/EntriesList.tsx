import { useNavigate } from 'react-router-dom'
import { Listing } from './Listing'

interface EntriesListProps {
  entries: Array<any> // TODO: expand
}

export const EntriesList = ({entries}: EntriesListProps) => {
  const navigate = useNavigate()

  return (
    <div className='max-w-2xl rounded-md p-2 pb-4'>
      {entries && entries.map(({
        tokenId,
        title,
        createdOn,
      }) => { 
        return <Listing 
          key={tokenId} 
          onClick={() => navigate(`/listing/${tokenId}`)}
          title={title}
          createdOn={createdOn}
        />
      })}
    </div>
  )
}


