import React from 'react'
import { Routes, Route, Link } from "react-router-dom"
import { create } from 'ipfs-http-client'
import { ListingEditor } from './ListingEditor'

const client = create('https://ipfs.infura.io:5001')

export const App = () => {
  return (
    <div className='p-3'>
      <Routes>
        <Route path='/' element={<ListingEditor />} />
        <Route path='/listing/' element={<ListingEditor doInitializeNew={true} />}>
          <Route path=':addr' element={<ListingEditor />}/>
        </Route>
      </Routes>
    </div>
  )
}
