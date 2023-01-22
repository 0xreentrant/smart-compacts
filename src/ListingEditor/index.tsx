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
import {PAGES, STATES} from '../constants'
import {ResumeURI} from '../types/Resume'
import {IPFSContext} from '../IPFSContext'
import {Spinner} from '../components/Spinner'

// NOTE: will naturally grow with STATES
type EditorState = typeof STATES[keyof typeof STATES] 
const inverseEditorState = (cur: EditorState) => {
  return cur === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT
}

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
    backTo = location.state.backTo
    ipfsHash = location.state.resumeURI.ipfsHash

    // TODO: replace all refs to this w/ actual value
    resumeURI = location.state.resumeURI 
  } else {
    backTo = '/'
    ipfsHash = ''

    // TODO: replace all refs to this w/ actual value
    resumeURI = {title: '', createdOn: '', ipfsHash: ''} 
  }

  const [state, send] = useMachine(editorMachine, { 
    devTools: true,
    context: {
      isNew: true,
      ipfsHash: ipfsHash
    },
    services: {
      fetchIPFSDocument: async () => {
        const bytes = []

        for await (const chunk of ipfs.cat(ipfsHash)) { 
          bytes.push(chunk) 
        }

        return toString(concat(bytes))
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
  const [heading, setHeading] = useState(resumeURI?.title || 'New Resume')
  /////////////

  usePrompt('Are you sure you want to leave without saving?', isDirty()) 

  const handleToggleView = () => {
    send('TOGGLE_VIEW')
  }

  const handleEditorChange = (newText: string) => {
    send({ type: 'UPDATE', value: newText })
  }

  const handleSave = () => {
    send('SAVE')
  }

  // TODO: update state machine
  // TODO: handle deletion/burning
  const handleDelete = () => {
    const res = window.confirm('Are you sure? You\'ll no longer be able to assign this resume to an engagement!')

    if (res) {
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
              onClick={handleToggleView}
              className='mr-2'
            >
              {inverseEditorState(state.context.currentView)}
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

          {state.context.currentView === STATES.EDIT
            ? <Editor 
              doc={state.context.buffer} 
              handleChange={handleEditorChange}
            />
            : <Preview document={state.context.buffer} />
          }
        </>
      )
      }
    </div>
  )
}
