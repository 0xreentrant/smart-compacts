import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

const Entry = ({title, createdOn, onClick}) => { 
  return (
    <div 
      className='flex justify-between max-w-2xl rounded-md mt-2 p-2 bg-gray-200 shadow'
      onClick={onClick}
    >
      <span className=''>{title}</span>
      <span className=''>{createdOn}</span>
    </div>
  )
}

const EntriesList = ({entries}) => {
  const navigate = useNavigate()

  return (
    <div className='max-w-2xl rounded-md p-2 pb-4'>
      {entries.map(({
        hash,
        title,
        createdOn,
      }, i) => { 
        return <Entry 
          key={hash} 
          onClick={() => navigate(`/listing/${i}`)}
          title={title}
        />
      })}
    </div>
  )
}

export const Listings = () => {

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

