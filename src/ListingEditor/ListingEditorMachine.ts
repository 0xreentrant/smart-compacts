import {createMachine, assign} from "xstate";
import {STATES} from '../constants'

export type MachineContext = {
  doneLoading: boolean,
  ipfsHash: string,
  ipfsDocument: string,
}

export const editorMachine = createMachine<any, any>(
  {
    initial: "initializing",
    context: {
      isNew: true,
      doneLoading: false,
      ipfsHash: "",
      ipfsDocument: "",
      buffer: "",
      currentView: 'Edit',
    },
    states: {
      initializing: {
        initial: "validating",
        states: {
          validating: {
            on: {
              IS_NEW: "#editing",
              IS_EXISTING: [
                {
                  target: "fetching_ipfs_hash",
                  cond: "withValidIPFSHash",
                },
                { target: "errors.hasInvalidIPFSHash", cond: "invalid" },
              ],
            },
          },
          fetching_ipfs_hash: {
            entry: () => console.log("has hash, fetching"),
            invoke: {
              src: 'fetchIPFSDocument',
              onDone: {
                target: "#editing",
                actions: [
                  "setDoneLoading",
                  assign({ ipfsDocument: (_, e) => e.data }),
                  assign({ buffer: (_, e) => e.data }),
                ],
              },
              onError: {
                target: 'errors.networkError'
              }
            },
          },
          errors: {
            initial: "none",
            states: {
              none: {},
              hasInvalidIPFSHash: {},
              networkError: {},
            },
          },
        },
      },
      saving: {
        id: "saving",
        invoke: {
          src: () => {
            // TODO: flesh out save
            return Promise.resolve("hello");
          },
          onDone: {
            target: "#editing.clean",
            actions: 'setNoLongerNew'
          },
        },
      },
      editing: {
        id: "editing",
        initial: "clean",
        states: {
          clean: {
            on: {
              UPDATE: {
                target: "dirty",
                actions: "updateBuffer",
              },
            },
          },
          dirty: {
            entry: () => console.log("setting dirty - got updates to heading/inMemoryText"),
            on: {
              UPDATE: [
                {actions: "updateBuffer", cond: 'isDirty'},
                {target: 'clean', actions: 'updateBuffer'},
              ],
              SAVE: {
                target: "#saving",
                actions: () => console.log('Saving'),
              },
              RESET: {
                target: "clean",
                actions: () => console.log("resetting dirty - inMemoryText same as latestSavedText"),
              },
            },
          },
        },
        on: {
          TOGGLE_VIEW: {
            target: 'previewing',
            actions: 'setPreviewing'
          }
        }
      },
      previewing: {
        on: {
          TOGGLE_VIEW: {
            target: 'editing',
            actions: 'setEditing'
          }
        }
      }
    },
  },
  {
    actions: {
      setDoneLoading: assign({ doneLoading: true }),
      setNoLongerNew: assign({isNew: false}),
      setPreviewing: assign({currentView: STATES.PREVIEW}),
      setEditing: assign({currentView: STATES.EDIT}),
      updateBuffer: assign({buffer: (_, e) => e.value}),
    },
    guards: {
      isDirty: (ctx, e) => {
        const out = e.value !== ctx.ipfsDocument
        return out
      },
      withValidIPFSHash: (ctx) => ctx.ipfsHash.length > 0,
      invalid: () => true,
    },
  }
);

