import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EditableHeader } from './EditableHeader'
import { Editor } from './Editor'
import { Preview } from './Preview'
import { usePrompt } from '../utils/useBlocker'
import { PAGES } from '../constants'

const DUMMY = "*React-Markdown* is **Awesome**"

const STATES = { EDIT: 'Edit', PREVIEW: 'Preview' }

const Button = ({to='', children, className='', disabled, onClick, ...props}) => {
  const navigate = useNavigate()
  const withDisabledBg = disabled ? 'bg-gray-400' : ''
  const clickHandler = e => {
    e.preventDefault()

    if (to) {
      navigate(to)
      return;
    }

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

export const ListingEditor = ({
  meta = { title: 'New Resume', origDoc: DUMMY },
  backTo = PAGES.LISTINGS,
  doInitializeNew = false, // handle setting up for adding a listing
}) => {
  const [curView, setCurView] = useState(STATES.PREVIEW)
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

  const inverseEditorState = (cur) => cur === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT

  const toggleCurView = () => {
    setCurView(inverseEditorState(curView))
  }

  // dEBUG
  const params = useParams()
  useEffect(() => {console.log(params)}, [])
  ////////////////

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
          {inverseEditorState(curView)}
        </Button>        

        <Button 
          className={/* todo: clean */'mr-2 ' + (!shouldDisableSave && 'bg-green-400')}
          disabled={shouldDisableSave}
          onClick={handleSave}
        >
          Save
        </Button>

        <Button 
          className={/* todo: clean */!isNew && 'bg-red-400'} 
          disabled={isNew}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>

      {curView === STATES.EDIT
        ? <Editor doc={inMemoryDoc} />
        : <Preview document={inMemoryDoc} />
      }
    </div>
  )
}
