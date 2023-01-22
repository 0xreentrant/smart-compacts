export type ResumeURI = {
  title: string,
  createdOn: string,
  ipfsHash: string
}

export type IndexedURI = ResumeURI & {
  tokenId: number
}

