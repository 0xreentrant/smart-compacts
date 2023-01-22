import React, { useState, useEffect } from 'react'
import { EditableHeader } from './EditableHeader'
import { Editor } from './Editor'
import { usePrompt } from '../utils/useBlocker'

const STATES = { EDIT: 'edit', PREVIEW: 'preview' }

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

    onClick(e)
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
  backTo = '/',
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

  const handleDelete = () => {
    const res = window.confirm('Are you sure? You\'ll no longer be able to assign this resume to an engagement!')
    
    if (res) {
      // TODO: handle deletion
    }
  }

  //usePrompt('Are you sure you want to leave without saving?', true)

  useEffect(() => { 
    if (heading !== meta.title) {
      setHasEdits(true)
    }
  }, [heading])

  return (
    <div className=''>
      <Button to={backTo}>Back</Button>

      <EditableHeader text={heading} handleUpdate={(val) => { setHeading(val) }} />

      <div className=''>
        {showEdit 
          ? <Button className='mr-2'>Edit</Button>
          : <Button className='mr-2'>Preview</Button>
        }

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
