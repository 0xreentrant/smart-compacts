import {useEffect, useContext} from 'react'
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
import {IPFSContext} from '../IPFSContext'
import {Spinner} from '../components/Spinner'

// NOTE: will naturally grow with STATES
type EditorState = typeof STATES[keyof typeof STATES] 
const inverseEditorState = (cur: EditorState) => {
  return cur === STATES.EDIT ? STATES.PREVIEW : STATES.EDIT
}

type ListingEditorProps = {
  backTo: string
  doInitializeNew: boolean
}

export const ListingEditor = ({backTo, doInitializeNew = true}: ListingEditorProps) => {
  const location: any = useLocation()
  let ipfsHash: string
  let heading: string

  if (location.state && !doInitializeNew) {
    ipfsHash = location.state.resumeURI.ipfsHash
    heading = location.state.resumeURI.title
  } else {
    ipfsHash = ''
    heading = 'New Resume'
  }

  const navigate = useNavigate()
  const ipfs = useContext(IPFSContext)

  const [state, send] = useMachine(editorMachine, { 
    devTools: true,
    context: {
      isNew: true,
      ipfsHash,
      heading,
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

  const isDirty = () => state.matches({editing: 'dirty'})
  const isClean = () => state.matches({editing: 'clean'})
  const isLoading = () => state.matches('loading')
  const isEditView = state.context.currentView === STATES.EDIT

  useEffect(() => {
    if (doInitializeNew) {
      send('IS_NEW')
    } else {
      send('IS_EXISTING')
    }
  }, [])

  usePrompt('Are you sure you want to leave without saving?', isDirty()) 

  const handleToggleView = () => {
    send('TOGGLE_VIEW')
  }

  const handleUpdateHeading = (newString: string) => { 
    console.log(newString)
    send({type: 'UPDATE_HEADING', value: newString})
  }

  const handleEditorChange = (newText: string) => {
    send({ type: 'UPDATE_EDITOR', value: newText })
  }

  const handleSave = () => {
    send('SAVE')
  }

  // TODO: handle deletion/burning
  // move to state machine
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
          <EditableHeader text={state.context.heading} handleUpdate={handleUpdateHeading} />

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

          {isEditView
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
