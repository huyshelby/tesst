// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract InvoiceNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct InvoiceData {
        string orderId;
        uint256 amount;
        uint256 purchaseDate;
        uint256 warrantyMonths;
        bool warrantyUsed;
    }

    mapping(uint256 => InvoiceData) public invoiceData;
    mapping(string => uint256) public orderToTokenId;

    event InvoiceMinted(
        uint256 indexed tokenId,
        string orderId,
        address owner,
        uint256 amount,
        uint256 warrantyMonths
    );

    event WarrantyUsed(uint256 indexed tokenId, address user, uint256 timestamp);

    constructor() ERC721("EcommerceInvoice", "ECINV") {}

    function mint(
        address to,
        string memory orderId,
        uint256 amount,
        uint256 warrantyMonths
    ) external onlyOwner returns (uint256) {
        require(orderToTokenId[orderId] == 0, "Order already has NFT");
        require(bytes(orderId).length > 0, "Invalid order ID");
        require(amount > 0, "Amount must be greater than 0");
        require(warrantyMonths > 0, "Warranty period must be greater than 0");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(to, tokenId);
        
        invoiceData[tokenId] = InvoiceData({
            orderId: orderId,
            amount: amount,
            purchaseDate: block.timestamp,
            warrantyMonths: warrantyMonths,
            warrantyUsed: false
        });
        
        orderToTokenId[orderId] = tokenId;

        emit InvoiceMinted(tokenId, orderId, to, amount, warrantyMonths);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        InvoiceData memory data = invoiceData[tokenId];
        
        // Tạo metadata JSON
        string memory json = string(abi.encodePacked(
            '{"name":"Invoice #', data.orderId, '",',
            '"description":"E-commerce Invoice and Warranty Certificate",',
            '"image":"ipfs://QmSfQoeW6YvBw6X5Z5J7QXZvJ8Q9LQ8qJ8Q9LQ8qJ8Q9LQ/placeholder.png",',
            '"attributes":[',
            '{"trait_type":"Order ID","value":"', data.orderId, '"},',
            '{"trait_type":"Amount","display_type":"number","value":', Strings.toString(data.amount), '},',
            '{"trait_type":"Purchase Date","display_type":"date","value":', Strings.toString(data.purchaseDate), '},',
            '{"trait_type":"Warranty Months","display_type":"number","value":', Strings.toString(data.warrantyMonths), '},',
            '{"trait_type":"Warranty Valid Until","display_type":"date","value":', 
                Strings.toString(data.purchaseDate + (data.warrantyMonths * 30 days)), '},',
            '{"trait_type":"Warranty Status","value":"', 
                data.warrantyUsed ? 'Used' : 'Active', '"}',
            ']}'
        ));

        // Encode to base64
        string memory base64Json = Base64.encode(bytes(json));
        
        return string(abi.encodePacked('data:application/json;base64,', base64Json));
    }

    function useWarranty(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(!invoiceData[tokenId].warrantyUsed, "Warranty already used");
        require(
            block.timestamp <= invoiceData[tokenId].purchaseDate + 
            (invoiceData[tokenId].warrantyMonths * 30 days),
            "Warranty expired"
        );
        
        invoiceData[tokenId].warrantyUsed = true;
        emit WarrantyUsed(tokenId, msg.sender, block.timestamp);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
