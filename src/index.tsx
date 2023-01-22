import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import { App } from './App.jsx'
import { EthersContext } from './EthersContext'
import './App.css'

ReactDOM.render(
  <EthersContext.Provider value={ethers}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </EthersContext.Provider>,
  document.getElementById('root')
) 
