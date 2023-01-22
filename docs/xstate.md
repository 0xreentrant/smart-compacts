# Links:
  - [XState Docs](https://xstate.js.org/docs/)
  - [React Hooks for XState](https://github.com/statelyai/xstate/tree/main/packages/xstate-react)

The point of using a state machine here is to simplify reasoning about the page state.  Most React  frontends that don't tackle state in a sane way end up with hacky solutions involving arcane logic combinations and frequent bugs and regressions.

Building went smoothly after taking time to first [diagram out the expected state](https://drive.google.com/file/d/1h4CYZMlyiMd9dfZMvM1M_BOakN-ZMfTJ/view?usp=sharing), then validate it with the [xstate visualizer tool](https://stately.ai/viz/5c89a732-fc17-4716-aaad-957d0b7487fa#)
Refactoring involved taking values created by `setState` and updated with `useEffect` and migrating them to the xstate machine, in stages:

1. Button UI
2. Initializing the editor for new documents and existing ones
3. Retrieving existing documents



