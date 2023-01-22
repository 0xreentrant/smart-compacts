import { createMachine, assign } from "xstate";

export type MachineContext = {
  doneLoading: boolean,
  ipfsHash: string,
  ipfsDocument: string,
}

export const editorMachine = createMachine<any, any>(
  {
    initial: "initializing",
    context: {
      doneLoading: false,
      ipfsHash: "",
      ipfsDocument: "",
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
            entry: () => console.log("setting dirty - got updates to heading/inMemoryText"),
            on: {
              SAVE: {
                target: "clean",
                actions: () => console.log('Saving'),
              },
              RESET: {
                target: "clean",
                actions: () => console.log("resetting dirty - inMemoryText same as latestSavedText"),
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
    },
    guards: {
      withValidIPFSHash: (ctx) => ctx.ipfsHash.length > 0,
      invalid: () => true,
    },
  }
);

