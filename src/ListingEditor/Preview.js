import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export const Preview = ({document}) => {
  return (
    <div className='mt-5'>
      <ReactMarkdown>{document}</ReactMarkdown>
    </div>
  ) 
}

