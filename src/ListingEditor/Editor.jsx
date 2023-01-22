import React, { useState } from 'react'

export const Editor = ({doc, handleChange}) => {
  return (
    <textarea name="text" className="my-3 block h-96 border w-full" value={doc} onChange={handleChange}></textarea>
  )
}

