import {createMachine, assign} from 'xstate'

export const editorMachine = createMachine<any,any>(
  {
    initial: "initializing",
    context: {
      doneLoading: false,
      origDoc: undefined,
    },
    states: {
      initializing: {
        on: {
          IS_NEW: "editing",
          IS_EXISTING: "loading",
        },
      },
      loading: {
        initial: 'validating_data',
        states: {
          validating_data: {
            entry: () => console.log('checking for hash'),
            on: {
              HAS_IPFS_HASH: {
                target: "fetching_ipfs_hash",
              },
            },
          },
          fetching_ipfs_hash: {
            entry: () => console.log('has hash, fetching'),
            exit: ['setDoneLoading'],
            on: {
              FETCHED_IPFS_HASH: {
                target: "#editing",
              },
            },
          },
        },
      },
      editing: {
        id: "editing",
        initial: "clean",
        states: {
          clean: {
            on: {
              UPDATED: {
                target: "dirty",
              },
            },
          },
          dirty: {
            entry: () => console.log('setting dirty - got updates to heading/inMemoryText'),
            on: {
              SAVE: {
                target: "clean",
                actions: () => {}
              },
              RESET: {
                target: "clean",
                actions: () => console.log('resetting dirty - inMemoryText same as latestSavedText'),
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      setDoneLoading: assign({ doneLoading: true })
    }
  }
);


