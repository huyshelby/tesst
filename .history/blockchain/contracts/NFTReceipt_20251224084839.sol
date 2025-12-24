// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
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
    ReentrancyGuard,
    Pausable
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
    string private _baseTokenURI;

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

    event Received(address sender, uint amount);

    constructor(string memory baseURI) ERC721("OrderReceipt", "ORCPT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _baseTokenURI = baseURI;
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
        whenNotPaused
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

    /**
     * @dev Cập nhật metadata URL cho NFT
     * @param tokenId ID của token cần cập nhật
     * @param newMetadataUrl URL mới của metadata
     */
    function updateMetadata(
        uint256 tokenId,
        string memory newMetadataUrl
    )
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        require(_exists(tokenId), "Token does not exist");
        require(bytes(newMetadataUrl).length > 0, "Invalid metadata URL");

        string memory oldUrl = tokenURI(tokenId);
        _setTokenURI(tokenId, newMetadataUrl);
        receipts[tokenId].metadataUrl = newMetadataUrl;

        emit ReceiptMetadataUpdated(tokenId, oldUrl, newMetadataUrl);
    }

    /**
     * @dev Thu hồi NFT (chỉ admin)
     * @param tokenId ID của token cần thu hồi
     * @param reason Lý do thu hồi
     */
    function revokeReceipt(
        uint256 tokenId,
        string memory reason
    )
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        require(_exists(tokenId), "Token does not exist");
        require(receipts[tokenId].isActive, "Token already revoked");

        address owner = ownerOf(tokenId);
        receipts[tokenId].isActive = false;
        _burn(tokenId);

        emit ReceiptRevoked(tokenId, owner, reason);
    }

    /**
     * @dev Khôi phục NFT đã bị thu hồi
     * @param to Địa chỉ nhận lại NFT
     * @param orderHash Hash của đơn hàng
     * @param metadataUrl URL metadata
     */
    function restoreReceipt(
        address to,
        bytes32 orderHash,
        string memory metadataUrl
    )
        external
        onlyRole(ADMIN_ROLE)
        whenNotPaused
        returns (uint256)
    {
        require(to != address(0), "Invalid recipient");
        require(orderHash != bytes32(0), "Invalid order hash");
        require(bytes(metadataUrl).length > 0, "Metadata URL required");

        uint256 tokenId = orderHashToTokenId[orderHash];
        require(tokenId != 0, "No token for this order");
        require(!receipts[tokenId].isActive, "Token is already active");

        receipts[tokenId].metadataUrl = metadataUrl;
        receipts[tokenId].isActive = true;
        receipts[tokenId].minter = msg.sender;
        receipts[tokenId].timestamp = block.timestamp;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataUrl);

        emit ReceiptRestored(tokenId, to);
        return tokenId;
    }

    /**
     * @dev Tạm dừng contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Tiếp tục hoạt động contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Thiết lập base URI
     * @param baseURI URI cơ sở mới
     */
    function setBaseURI(string memory baseURI) external onlyRole(ADMIN_ROLE) {
        _baseTokenURI = baseURI;
    }

    // Override required by Solidity
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    // Override required by Solidity
    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }

    // Override required by Solidity
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Override required by Solidity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}