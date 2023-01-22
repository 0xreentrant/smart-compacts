import {useState, useEffect, useContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {concat, toString} from 'uint8arrays'
import {useMachine} from '@xstate/react'
import {EditableHeader} from './EditableHeader'
import {Editor} from './Editor'
import {Preview} from './Preview'
import {Button} from '../components/Button'
import {editorMachine} from './ListingEditorMachine'
import {usePrompt} from '../utils/useBlocker'
import {PAGES} from '../constants'
import {ResumeURI} from '../types/Resume'
import {IPFSContext} from '../IPFSContext'
import {Spinner} from '../components/Spinner'

type ListingEditorProps = {
  resumeURI: ResumeURI,
  backTo: string,
  doInitializeNew: boolean
}

const STATES = { EDIT: 'Edit', PREVIEW: 'Preview' }
type EditorState = typeof STATES[keyof typeof STATES] // NOTE: will naturally grow with STATES
const inverseEditorState = (cur: EditorState) => cur === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT

type Props = {
  doInitializeNew: boolean
}

export const ListingEditor = ({doInitializeNew = true}: Props) => {
  const location: any = useLocation()

  let resumeURI: ResumeURI | null
  let backTo: string

  if (location.state && !doInitializeNew) {
    console.log(location.state)
    backTo = location.state.backTo
  } else {
    resumeURI = { title: '', createdOn: '', ipfsHash: '' }
    backTo = '/'
  }

  const [state, send, service] = useMachine(editorMachine, { 
    context: {
      isNew: true
    } 
  })

  const navigate = useNavigate()
  const ipfs = useContext(IPFSContext)

  const isDirty = () => state.matches({editing: 'dirty'})
  const isClean = () => state.matches({editing: 'clean'})
  const isLoading = () => state.matches('loading')

  // OLD STATE
  const [doneLoading, setDoneLoading] = useState(false)
  const [origDoc, setOrigDoc] = useState('')
  const [curView, setCurView] = useState(STATES.EDIT)
  const [latestSavedText, setLatestSavedText] = useState<string | null>('')
  const [inMemoryText, setInMemoryText] = useState(origDoc)
  const [isNew, setIsNew] = useState(doInitializeNew)
  const [hasEdits, setHasEdits] = useState(false)
  const [heading, setHeading] = useState(resumeURI?.title || 'New Resume')
  /////////////

  const handleSave = () => {
    send('SAVE')

    // TODO: to remove
    setHasEdits(false) 
    setIsNew(false)
    setLatestSavedText(inMemoryText)
  }

  const toggleCurView = () => {
    setCurView(inverseEditorState(curView))
  }

  useEffect(() => {
    console.log({inMemoryText, latestSavedText}, state.value)
  })

  //service.onTransition((state) => {
  //})

  usePrompt('Are you sure you want to leave without saving?', hasEdits) 

  // TODO: replace with xstate machine
  // UI State handling
  useEffect(() => { 
    // enable "save"
    if (
      heading !== resumeURI!.title 
      || inMemoryText !== origDoc
    ) {
      if (doneLoading) {
        setHasEdits(true)
        send('UPDATED')

      } else {
        setDoneLoading(true)
      }
    }

    // disable "save"
    if (inMemoryText === latestSavedText || inMemoryText === origDoc) {
      setHasEdits(false)
      send('RESET')
    }
  }, [heading, inMemoryText])

  // retrieve ipfs data if we have it
  useEffect(() => {
    const getIPFSContent = async () => {
      if (!doInitializeNew && resumeURI?.ipfsHash && !doneLoading) {
        send('HAS_IPFS_HASH')

        const content = ipfs.cat(resumeURI.ipfsHash)

        const bytes = []
        for await (const chunk of content) {
          bytes.push(chunk)
        }

        const text = toString(concat(bytes))
        setInMemoryText(text)
        setOrigDoc(text)
        send('FETCHED_IPFS_HASH')
      } else {
        send('IS_NEW')
        setInMemoryText('')
        setOrigDoc('')
      }
    }

    getIPFSContent()
  }, [])

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

      {isLoading() ? (
        <Spinner />
      ) : (
        <>
          <EditableHeader text={heading} handleUpdate={(val: string) => { setHeading(val) }} />

          <div className=''>
            <Button 
              onClick={toggleCurView}
              className='mr-2'
            >
              {inverseEditorState(curView)}
            </Button>        

            <Button 
              className={'mr-2 ' + (isDirty() && 'bg-green-400')}
              disabled={isClean()}
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
        </>
      )
      }
    </div>
  )
}
