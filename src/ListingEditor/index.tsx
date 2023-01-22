import {useState, useEffect, useContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {concat, toString} from 'uint8arrays'
import {useMachine} from '@xstate/react'
import debounce from 'lodash.debounce'
import {EditableHeader} from './EditableHeader'
import {Editor} from './Editor'
import {Preview} from './Preview'
import {Button} from '../components/Button'
import {editorMachine, MachineContext} from './ListingEditorMachine'
import {usePrompt} from '../utils/useBlocker'
import {PAGES} from '../constants'
import {ResumeURI} from '../types/Resume'
import {IPFSContext} from '../IPFSContext'
import {Spinner} from '../components/Spinner'

const STATES = { EDIT: 'Edit', PREVIEW: 'Preview' }
type EditorState = typeof STATES[keyof typeof STATES] // NOTE: will naturally grow with STATES
const inverseEditorState = (cur: EditorState) => cur === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT

type Props = {
  doInitializeNew: boolean
}

export const ListingEditor = ({doInitializeNew = true}: Props) => {
  const location: any = useLocation()

  // todo: use some kind of conditional function to handle initializaing all of these
  let resumeURI: ResumeURI
  let backTo: string
  let ipfsHash: string

  if (location.state && !doInitializeNew) {
    console.log(location.state)
    backTo = location.state.backTo
    ipfsHash = location.state.resumeURI.ipfsHash

    // TODO: replace all refs to this w/ actual value
    resumeURI = location.state.resumeURI 
  } else {
    backTo = '/'
    ipfsHash = ''

    // TODO: replace all refs to this w/ actual value
    resumeURI = { title: '', createdOn: '', ipfsHash: '' } 
  }

  const [state, send, service] = useMachine(editorMachine, { 
    devTools: true,
    context: {
      isNew: true,
      ipfsHash: ipfsHash
    },
    services: {
      fetchIPFSDocument: async () => {
        const content = ipfs.cat(ipfsHash)
        const bytes = []
        for await (const chunk of content) { bytes.push(chunk) }
        const text = toString(concat(bytes))
        console.log('Got IPFS doc', text)
        return text
      }
    }
  })

  useEffect(() => {
    if (doInitializeNew) {
      console.log('initializing new')
      send('IS_NEW')
    } else {
      console.log('is existing file')
      send('IS_EXISTING')
    }
  }, [])

  const navigate = useNavigate()
  const ipfs = useContext(IPFSContext)

  const isDirty = () => state.matches({editing: 'dirty'})
  const isClean = () => state.matches({editing: 'clean'})
  const isLoading = () => state.matches('loading')

  // OLD STATE
  const [curView, setCurView] = useState(STATES.EDIT)
  const [inMemoryText] = useState(state.context.ipfsDocument)
  const [isNew, setIsNew] = useState(doInitializeNew)
  const [heading, setHeading] = useState(resumeURI?.title || 'New Resume')
  /////////////

  /// DEBUG
  useEffect(() => {
    console.log({inMemoryText, latestSavedText})
  })

  service.onTransition(debounce((state) => {
    console.log(state.value)
  }, 500))

  //////////////////


  const handleSave = () => {
    send('SAVE')

    // TODO: to remove
    setIsNew(false)
  }

  const toggleCurView = () => {
    setCurView(inverseEditorState(curView))
  }

  usePrompt('Are you sure you want to leave without saving?', isDirty()) 

  // UI State handling
  useEffect(() => { 
    if (heading !== resumeURI!.title || inMemoryText !== state.context.ipfsDocument) {
        send('UPDATE')
    }

    if (inMemoryText === state.context.ipfsDocument) {
      send('RESET')
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
              className={!state.context.isNew ? 'bg-red-400': ''} 
              disabled={state.context.isNew}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>

          {curView === STATES.EDIT
            ? <Editor 
              doc={state.context.buffer} 
              handleChange={(newText: string) => {
                send({ type: 'UPDATE', value: newText })
              }}
            />
            : <Preview document={state.context.buffer} />
          }
        </>
      )
      }
    </div>
  )
}
