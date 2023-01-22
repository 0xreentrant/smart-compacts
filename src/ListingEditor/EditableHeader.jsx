import React, { useState } from 'react'

export const EditableHeader = ({text, handleUpdate}) => {
  return (
    <input className='block mt-2' type="text" value={text} onChange={e => handleUpdate(e.target.value)} />
  )
}
