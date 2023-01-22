import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditableHeader } from './EditableHeader'
import { Editor } from './Editor'
import { usePrompt } from '../utils/useBlocker'

const STATES = { EDIT: 'Edit', PREVIEW: 'Preview' }
const PAGES = { LISTINGS: '/' }

const Button = ({to='', children, className='', disabled, onClick, ...props}) => {
  const withDisabledBg = disabled ? 'bg-gray-400' : ''
  const clickHandler = e => {
    if (to) {
      return;
    }

    e.preventDefault()

    if (disabled) {
      return 
    }

    onClick && onClick(e)
  }

  return (
    <a href={to} onClick={clickHandler} className={`btn ${className} ${withDisabledBg}`} {...props}>
      {children}
    </a>
  )
}

const PreviewListing = () => {
  return (
    <div>
      Showing Preview
    </div>
  ) 
}

export const ListingEditor = ({
  meta = { title: 'New Resume' },
  backTo = PAGES.LISTINGS,
  doInitializeNew = true, // handle setting up for adding a listing
}) => {
  const [curView, setCurView] = useState(STATES.EDIT)
  const [inMemoryDoc, setInMemoryDoc] = useState(meta?.origDoc)
  const [isNew, setIsNew] = useState(doInitializeNew)
  const [hasEdits, setHasEdits] = useState(false)
  const [heading, setHeading] = useState(meta.title)

  const showEdit = curView === STATES.PREVIEW 
  const isSaveable = hasEdits
  const shouldDisableSave = !isSaveable

  const handleSave = () => {
    setHasEdits(false) 
    setIsNew(false)
  }

  const toggleCurView = () => {
    setCurView(curView === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT)
  }

  useEffect(() => { 
    if (heading !== meta.title) {
      setHasEdits(true)
    }
  }, [heading])

  usePrompt('Are you sure you want to leave without saving?', hasEdits) 

  const navigate = useNavigate()
  const handleDelete = () => {
    const res = window.confirm('Are you sure? You\'ll no longer be able to assign this resume to an engagement!')
    
    if (res) {
      // TODO: handle deletion
      navigate(PAGES.LISTINGS)
    }
  }

  return (
    <div className=''>
      <Button to={backTo}>Back</Button>

      <EditableHeader text={heading} handleUpdate={(val) => { setHeading(val) }} />

      <div className=''>
        <Button 
          onClick={toggleCurView}
          className='mr-2'
        >
          {curView}
        </Button>        

        <Button 
          className='mr-2 bg-green-400' 
          disabled={shouldDisableSave}
          onClick={handleSave}
        >
          Save
        </Button>

        <Button 
          className='bg-red-400' 
          disabled={isNew}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>

      {curView === STATES.EDIT
        ? <Editor doc={inMemoryDoc} />
        : <PreviewListing document={inMemoryDoc} />
      }
    </div>
  )
}
