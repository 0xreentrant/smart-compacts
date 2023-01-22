import { createContext } from 'react'
import { ethers } from 'ethers'
import { ETH_NODE_URL, CONTRACT_ADDRESS } from './constants'
import resumeABI from './onchain/contracts/artifacts/Resume.json'

export const Provider = new ethers.providers.JsonRpcProvider(ETH_NODE_URL)
export const Resume = new ethers.Contract(CONTRACT_ADDRESS, resumeABI.abi, Provider)
export const EthersContext = createContext(Resume) 
