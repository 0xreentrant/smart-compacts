import {useState, useEffect, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {EditableHeader} from './EditableHeader'
import {Editor} from './Editor'
import {Preview} from './Preview'
import {Button} from './Button'
import {usePrompt} from '../utils/useBlocker'
import {PAGES} from '../constants'
import {ResumeURI} from 'types/Resume'
import {IPFSContext} from '../IPFSContext'

const STATES = { EDIT: 'Edit', PREVIEW: 'Preview' }

type EditorState = typeof STATES[keyof typeof STATES] // NOTE: will naturally grow with STATES

type ListingEditorProps = {
  resumeURI: ResumeURI,
  backTo: string,
  doInitializeNew: boolean
}

export const ListingEditor = ({
  resumeURI,
  backTo = PAGES.LISTINGS,
  doInitializeNew = false, // not existing listing: make page show preview mode, etc. 
}: ListingEditorProps) => {
  const navigate = useNavigate()
  const ipfs = useContext(IPFSContext)

  const [origDoc] = useState('')
  const [curView, setCurView] = useState(STATES.PREVIEW)
  const [latestSavedText, setLatestSavedText] = useState<string | null>('')
  const [inMemoryText, setInMemoryText] = useState(origDoc)
  const [isNew, setIsNew] = useState(doInitializeNew)
  const [hasEdits, setHasEdits] = useState(false)
  const [heading, setHeading] = useState(resumeURI.title ?? 'New Resume')

  const isSaveable = hasEdits
  const shouldDisableSave = !isSaveable

  const handleSave = () => {
    setHasEdits(false) 
    setIsNew(false)
    setLatestSavedText(inMemoryText)
  }

  const inverseEditorState = (cur: EditorState) => cur === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT

  const toggleCurView = () => {
    setCurView(inverseEditorState(curView))
  }

  usePrompt('Are you sure you want to leave without saving?', hasEdits) 

  // State handling
  useEffect(() => { 
    // enable "save"
    if (
      heading !== resumeURI.title 
      || inMemoryText !== origDoc
    ) {
      setHasEdits(true)
    }

    // disable "save"
    if (inMemoryText === latestSavedText) {
      setHasEdits(false)
    }
  }, [heading, inMemoryText])

  const handleDelete = () => {
    const res = window.confirm('Are you sure? You\'ll no longer be able to assign this resume to an engagement!')
    
    if (res) {
      // TODO: handle deletion/burning
      navigate(PAGES.LISTINGS)
    }
  }

  return (
    <div className=''>
      <Button to={backTo}>Back</Button>

      <EditableHeader text={heading} handleUpdate={(val: string) => { setHeading(val) }} />

      <div className=''>
        <Button 
          onClick={toggleCurView}
          className='mr-2'
        >
          {inverseEditorState(curView)}
        </Button>        

        <Button 
          className={'mr-2 ' + (!shouldDisableSave && 'bg-green-400')}
          disabled={shouldDisableSave}
          onClick={handleSave}
        >
          Save
        </Button>

        <Button 
          className={!isNew ? 'bg-red-400': ''} 
          disabled={isNew}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>

      {curView === STATES.EDIT
        ? <Editor 
            doc={inMemoryText} 
            handleChange={(newText: string) => setInMemoryText(newText)}
          />
        : <Preview document={inMemoryText} />
      }
    </div>
  )
}
