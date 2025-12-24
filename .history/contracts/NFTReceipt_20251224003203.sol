// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFTReceipt
 * @dev Smart contract để mint NFT receipts cho đơn hàng
 * @author E-Commerce Blockchain Team
 */
contract NFTReceipt is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    AccessControl,
    ReentrancyGuard
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Receipt {
        bytes32 orderHash;
        string metadataUrl;
        uint256 timestamp;
        address minter;
        bool isActive;
    }

    Counters.Counter private _tokenIdCounter;
    mapping(bytes32 => uint256) public orderHashToTokenId;
    mapping(uint256 => Receipt) public receipts;
    mapping(address => uint256[]) public ownerTokens;

    // Events
    event OrderReceiptMinted(
        bytes32 indexed orderHash,
        uint256 indexed tokenId,
        address indexed owner,
        address minter,
        string metadataUrl
    );

    event ReceiptMetadataUpdated(
        uint256 indexed tokenId,
        string oldMetadataUrl,
        string newMetadataUrl
    );

    event ReceiptRevoked(
        uint256 indexed tokenId,
        address indexed owner,
        string reason
    );

    event ReceiptRestored(
        uint256 indexed tokenId,
        address indexed owner
    );

    constructor() ERC721("OrderReceipt", "ORCPT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Mint NFT receipt cho đơn hàng
     * @param to Địa chỉ nhận NFT
     * @param orderHash Hash của đơn hàng
     * @param metadataUrl URL của metadata
     * @return tokenId ID của NFT được mint
     */
    function safeMint(
        address to,
        bytes32 orderHash,
        string memory metadataUrl
    )
        external
        onlyRole(MINTER_ROLE)
        nonReentrant
        returns (uint256)
    {
        require(to != address(0), "Invalid recipient address");
        require(orderHash != bytes32(0), "Invalid order hash");
        require(bytes(metadataUrl).length > 0, "Metadata URL required");
        require(orderHashToTokenId[orderHash] == 0, "Order already minted");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataUrl);

        receipts[tokenId] = Receipt({
            orderHash: orderHash,
            metadataUrl: metadataUrl,
            timestamp: block.timestamp,
            minter: msg.sender,
            isActive: true
        });

        orderHashToTokenId[orderHash] = tokenId;
        ownerTokens[to].push(tokenId);

        emit OrderReceiptMinted(orderHash, tokenId, to, msg.sender, metadataUrl);

        return tokenId;
    }
