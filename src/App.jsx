import { Routes, Route } from "react-router-dom"
import { Listings } from './Listings'
import { ListingEditor } from './ListingEditor'

export const App = () => {
  return (
    <div className='p-3'>
      <Routes>
        <Route path='/' element={<Listings />} />
        <Route path='/listing/:tokenId' element={<ListingEditor backTo="/" doInitializeNew={false} />}>
          <Route path='new' element={<ListingEditor backTo="/" doInitializeNew={true} />}/>
        </Route>
      </Routes>
    </div>
  )
}
