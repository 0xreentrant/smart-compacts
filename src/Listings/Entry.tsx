import { MouseEventHandler } from 'react'

export interface EntryProps {
  title: string,
  createdOn: number,
  onClick: MouseEventHandler
}

export const Entry = ({title, createdOn, onClick}: EntryProps) => { 
  return (
    <div 
      className='flex justify-between max-w-2xl rounded-md mt-2 p-2 bg-gray-200 shadow'
      onClick={onClick}
    >
      <span className=''>{title}</span>
      <span className=''>{new Date(createdOn * 1000).toDateString()}</span>
    </div>
  )
}


