import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {App} from './App.jsx'
import {EthersContext, Resume} from './EthersContext'
import {IPFSContext, ipfs} from './IPFSContext'
import './App.css'

ReactDOM.render(
  <IPFSContext.Provider value={ipfs}>
    <EthersContext.Provider value={Resume}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </EthersContext.Provider>
  </IPFSContext.Provider>,
  document.getElementById('root')
) 
