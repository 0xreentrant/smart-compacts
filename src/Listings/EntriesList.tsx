import {Link} from 'react-router-dom'
//import {Listing} from './Listing'
import {IndexedURI} from '../types/Resume'

interface EntriesListProps {
  entries: Array<any> // TODO: expand
}

export const EntriesList = ({entries}: EntriesListProps) => {
  //const navigate = useNavigate()

  return (
    <div className='max-w-2xl rounded-md p-2 pb-4'>
      {entries && entries.map(({
        tokenId,
        ipfsHash,
        title,
        createdOn,
      }: IndexedURI) => { 
        return (
          <Link 
            key={tokenId}
            to={`/listing/${tokenId}`}
            state={{resumeURI: {title, createdOn, ipfsHash}, backTo: '/'}}
          >
            {title}
            {createdOn}
          </Link>
        )
/*
  *
  *        return <Listing 
  *          key={tokenId} 
  *          onClick={() => navigate(`/listing/${tokenId}`)}
  *          title={title}
  *          createdOn={createdOn}
  *        />
  *
  */
      })}
    </div>
  )
}


