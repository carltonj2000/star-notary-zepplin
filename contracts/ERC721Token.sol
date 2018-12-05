pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract ERC721Token is ERC721 {
    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }
}