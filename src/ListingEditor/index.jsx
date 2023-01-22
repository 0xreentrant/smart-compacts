import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditableHeader } from './EditableHeader'
import { Editor } from './Editor'
import { Preview } from './Preview'
import { Button } from './Button'

import { usePrompt } from '../utils/useBlocker'
import { PAGES } from '../constants'

const DUMMY = "*React-Markdown* is **Awesome**"

const STATES = { EDIT: 'Edit', PREVIEW: 'Preview' }

export const ListingEditor = ({
  meta = { title: 'New Resume', origDoc: DUMMY },
  backTo = PAGES.LISTINGS,
  doInitializeNew = false, // handle setting up for adding a listing
}) => {
  const [curView, setCurView] = useState(STATES.PREVIEW)
  const [lastSaved, setLastSaved] = useState(meta?.origDoc)
  const [inMemoryDoc, setInMemoryDoc] = useState(meta?.origDoc)
  const [isNew, setIsNew] = useState(doInitializeNew)
  const [hasEdits, setHasEdits] = useState(false)
  const [heading, setHeading] = useState(meta.title)

  const isSaveable = hasEdits
  const shouldDisableSave = !isSaveable

  const handleSave = () => {
    setHasEdits(false) 
    setIsNew(false)
    setLastSaved(inMemoryDoc)
  }

  const inverseEditorState = (cur) => cur === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT

  const toggleCurView = () => {
    setCurView(inverseEditorState(curView))
  }

  useEffect(() => { 
    // enable "save"
    if (
      heading !== meta.title 
      || inMemoryDoc !== meta?.origDoc
    ) {
      setHasEdits(true)
    }

    // disable "save"
    if (inMemoryDoc === lastSaved) {
      setHasEdits(false)
    }
  }, [heading, inMemoryDoc])

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
        ? <Editor 
            doc={inMemoryDoc} 
            handleChange={(e) => setInMemoryDoc(e.target.value)}
          />
        : <Preview document={inMemoryDoc} />
      }
    </div>
  )
}
