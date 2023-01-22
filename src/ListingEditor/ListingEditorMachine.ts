import {createMachine, assign} from "xstate";
import {STATES} from '../constants'

export type MachineContext = {
  doneLoading: boolean;
  ipfsHash: string;
  ipfsDocument: string;
};

export const editorMachine = createMachine<any, any>(
  {
    context: {
      isNew: true,
      doneLoading: false,
      ipfsHash: "",
      ipfsDocument: "",
      buffer: "",
      currentView: "Edit",
    },
    // allow the UI controls states and the editor states work in parallel, so I can simply 
    // track state.value for editor state while in 'preview' view. Then the 'save' button 
    // won't flip between disabled/enabled when flipping between views.  
    type: "parallel",
    states: {
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
            on: {
              UPDATE: [
                { cond: "isOriginalDoc", actions: "updateBuffer", target: "clean" },
                { actions: "updateBuffer" },
              ],
              SAVE: {
                target: "clean",
              },
              RESET: {
                target: "clean",
              },
            },
          },
        },
      },
      ui: {
        id: "ui",
        initial: "initializing",
        states: {
          initializing: {
            initial: "validating",
            states: {
              validating: {
                on: {
                  IS_NEW: "#ui.editing",
                  IS_EXISTING: [
                    { target: "fetching_ipfs_hash", cond: "withValidIPFSHash" },
                    { target: "errors.hasInvalidIPFSHash", cond: "invalid" },
                  ],
                },
              },
              fetching_ipfs_hash: {
                invoke: {
                  src: "fetchIPFSDocument",
                  onDone: {
                    target: "#ui.editing",
                    actions: [
                      "setDoneLoading",
                      assign({ ipfsDocument: (_, e) => e.data }),
                      assign({ buffer: (_, e) => e.data }),
                    ],
                  },
                  onError: {
                    target: "errors.networkError",
                  },
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
          editing: {
            on: {
              TOGGLE_VIEW: {
                target: "previewing",
                actions: "setPreviewing",
              },
            },
          },
          previewing: {
            on: {
              TOGGLE_VIEW: {
                target: "editing",
                actions: "setEditing",
              },
            },
          },
        },
      },
      save: {
        id: "save",
        initial: "idle",
        states: {
          idle: {
            on: {
              SAVE: "saving",
            },
          },
          saving: {
            invoke: {
              src: "saveResume",
              onDone: {
                target: "idle",
                actions: ["updateIPFSDocument", "setNoLongerNew"],
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      setDoneLoading: assign({ doneLoading: true }),
      setNoLongerNew: assign({ isNew: false }),
      setPreviewing: assign({ currentView: STATES.PREVIEW }),
      setEditing: assign({ currentView: STATES.EDIT }),
      updateIPFSDocument: assign({ ipfsDocument: (ctx) => ctx.buffer }),
      updateBuffer: assign({ buffer: (_, e) => e.value }),
    },
    guards: {
      isOriginalDoc: (ctx, e) => e.value === ctx.ipfsDocument,
      withValidIPFSHash: (ctx) => ctx.ipfsHash.length > 0,
      invalid: () => true,
    },
  }
);
