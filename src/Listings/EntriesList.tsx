import { useNavigate } from 'react-router-dom'
import { Entry } from './Entry'

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
        return <Entry 
          key={tokenId} 
          onClick={() => navigate(`/listing/${tokenId}`)}
          title={title}
          createdOn={createdOn}
        />
      })}
    </div>
  )
}


