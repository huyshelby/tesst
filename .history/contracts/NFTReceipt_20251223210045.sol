// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTReceipt is ERC721, ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    struct Receipt {
        bytes32 orderHash;
        string metadataUrl;
        uint256 timestamp;
    }
    
    Counters.Counter private _tokenIdCounter;
    mapping(bytes32 => uint256) public orderHashToTokenId;
    mapping(uint256 => Receipt) public receipts;
    
    event OrderReceiptMinted(bytes32 indexed orderHash, uint256 indexed tokenId, address owner);
    
    constructor() ERC721("OrderReceipt", "ORCPT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    function safeMint(
        address to,
        bytes32 orderHash,
        string memory metadataUrl
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(orderHash != bytes32(0), "Invalid order hash");
        require(orderHashToTokenId[orderHash] == 0, "Order already minted");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        
        receipts[tokenId] = Receipt({
            orderHash: orderHash,
            metadataUrl: metadataUrl,
            timestamp: block.timestamp
        });
        
        orderHashToTokenId[orderHash] = tokenId;
        
        emit OrderReceiptMinted(orderHash, tokenId, to);
        
        return tokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return receipts[tokenId].metadataUrl;
    }
    
    function getTokenIdByOrderHash(bytes32 orderHash) external view returns (uint256) {
        return orderHashToTokenId[orderHash];
    }
    
    // The following functions are overrides required by Solidity
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
