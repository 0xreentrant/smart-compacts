import {createContext} from 'react'
import {create} from 'ipfs-http-client'
import {IPFS_GATEWAY} from './constants'

export const ipfs = create({url: IPFS_GATEWAY})
export const IPFSContext = createContext(ipfs)

