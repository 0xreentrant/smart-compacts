import React from 'react'
import { SubmissionForm } from './SubmissionForm/index.jsx'
import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001')
//const client = {};

export const App = () => {
  return (
    <div className="flex items-center justify-center flex-col pt-3">
      <div>Resume Submission</div>
      <SubmissionForm ipfs={client} />
    </div>
  )
}
