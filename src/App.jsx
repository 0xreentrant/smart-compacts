import { Routes, Route } from "react-router-dom"
import { Listings } from './Listings'
import { ListingEditor } from './ListingEditor'

export const App = () => {
  return (
    <div className='p-3'>
      <Routes>
        <Route path='/' element={<Listings />} />
          <Route path='/listing/' element={<ListingEditor doInitializeNew={true} />}>
          <Route path=':hash' element={<ListingEditor />}/>
          </Route>
      </Routes>
    </div>
  )
}
