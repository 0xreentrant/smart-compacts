import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {App} from './App.jsx'
import {EthersContext, Resume} from './EthersContext'
import './App.css'

ReactDOM.render(
  <EthersContext.Provider value={Resume}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </EthersContext.Provider>,
  document.getElementById('root')
) 
