//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Resume is ERC721 {
  string public metadata;
  string public ipfsHash;

  constructor(
    string memory _metadata, 
    string memory _ipfsHash
  ) ERC721("Tokenised Resume", "tres") {
    metadata = _metadata;
    ipfsHash = _ipfsHash;
  }
}
