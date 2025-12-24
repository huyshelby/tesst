// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PaymentContract
 * @dev Smart contract for handling e-commerce payments via blockchain
 * @author E-Commerce Blockchain Team
 */
contract PaymentContract is ReentrancyGuard, Ownable {
    
    // Events
    event OrderPaid(
        string indexed orderId,
        address indexed payer,
        uint256 amount,
        address indexed token,
        string paymentMethod,
        uint256 timestamp
    );
    
    event PaymentFailed(
        string indexed orderId,
        address indexed payer,
        string reason,
        uint256 timestamp
    );
    
    event EmergencyPause(address indexed caller, uint256 timestamp);
    event EmergencyUnpause(address indexed caller, uint256 timestamp);
    
    // State variables
    mapping(address => bool) public authorizedTokens;
    mapping(string => bool) public processedOrders;

    bool public paused = false;
    address public recipientWallet;
    
    // Local test tokens (deployed on Hardhat local network)
    address public USDT_TOKEN;
    address public USDC_TOKEN;
    address public constant NATIVE_TOKEN = 0x0000000000000000000000000000000000000000; // ETH
    
    // Exchange rates (mock - for local testing)
    uint256 public USDT_RATE = 25000; // 1 USDT = 25,000 VND
    uint256 public USDC_RATE = 25000; // 1 USDC = 25,000 VND
    uint256 public ETH_RATE = 850000000; // 1 ETH = 850,000,000 VND (mock)
    
    // Modifiers
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier onlyValidToken(address token) {
        require(
            token == USDT_TOKEN || 
            token == USDC_TOKEN || 
            token == NATIVE_TOKEN,
            "Unsupported token"
        );
        _;
    }
    
    modifier onlyValidOrder(string memory orderId) {
        require(bytes(orderId).length > 0, "Invalid order ID");
        require(!processedOrders[orderId], "Order already processed");
        _;
    }
    
    // Constructor
    constructor(address _recipientWallet) {
        require(_recipientWallet != address(0), "Invalid recipient wallet");
        recipientWallet = _recipientWallet;

        // Authorize default tokens
        authorizedTokens[USDT_TOKEN] = true;
        authorizedTokens[USDC_TOKEN] = true;
        authorizedTokens[NATIVE_TOKEN] = true;
    }
    
    /**
     * @dev Pay for order using ERC20 token (USDT/USDC)
     * @param orderId Unique order identifier
     * @param token Token address (USDT or USDC)
     * @param amount Amount in token units (with decimals)
     */
    function payOrderWithToken(
        string memory orderId,
        address token,
        uint256 amount
    ) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyValidToken(token) 
        onlyValidOrder(orderId)
    {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer token from payer to recipient wallet
        bool success = IERC20(token).transferFrom(msg.sender, recipientWallet, amount);

        if (!success) {
            emit PaymentFailed(orderId, msg.sender, "Token transfer failed", block.timestamp);
            revert("Token transfer failed");
        }
        
        // Mark order as processed
        processedOrders[orderId] = true;
        
        // Emit success event
        emit OrderPaid(
            orderId,
            msg.sender,
            amount,
            token,
            "ERC20_TOKEN",
            block.timestamp
        );
    }
    
    /**
     * @dev Pay for order using native coin (ETH)
     * @param orderId Unique order identifier
     */
    function payOrderWithNative(
        string memory orderId
    )
        external
        payable
        nonReentrant
        whenNotPaused
        onlyValidOrder(orderId)
    {
        require(msg.value > 0, "Amount must be greater than 0");

        // Transfer native coin to recipient wallet
        (bool success, ) = recipientWallet.call{value: msg.value}("");
        require(success, "Native coin transfer failed");

        // Mark order as processed
        processedOrders[orderId] = true;

        // Emit success event
        emit OrderPaid(
            orderId,
            msg.sender,
            msg.value,
            NATIVE_TOKEN,
            "NATIVE_COIN",
            block.timestamp
        );
    }
    
    /**
     * @dev Withdraw funds (only owner)
     * @param token Token address (use NATIVE_TOKEN for BNB)
     * @param amount Amount to withdraw
     */
    function withdraw(
        address token,
        uint256 amount
    ) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        
        if (token == NATIVE_TOKEN) {
            require(address(this).balance >= amount, "Insufficient balance");
            payable(owner()).transfer(amount);
        } else {
            require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient balance");
            IERC20(token).transfer(owner(), amount);
        }
    }
    
    /**
     * @dev Emergency pause/unpause functions
     */
    function pause() external onlyOwner {
        require(!paused, "Contract already paused");
        paused = true;
        emit EmergencyPause(msg.sender, block.timestamp);
    }
    
    function unpause() external onlyOwner {
        require(paused, "Contract not paused");
        paused = false;
        emit EmergencyUnpause(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Add/remove authorized token
     */
    function setTokenAuthorization(
        address token,
        bool authorized
    ) external onlyOwner {
        authorizedTokens[token] = authorized;
    }

    /**
     * @dev Update recipient wallet address
     */
    function setRecipientWallet(address _recipientWallet) external onlyOwner {
        require(_recipientWallet != address(0), "Invalid recipient wallet");
        recipientWallet = _recipientWallet;
    }
    
    /**
     * @dev Get contract balance for a specific token
     */
    function getBalance(address token) external view returns (uint256) {
        if (token == NATIVE_TOKEN) {
            return address(this).balance;
        }
        return IERC20(token).balanceOf(address(this));
    }
    
    /**
     * @dev Check if order was already processed
     */
    function isOrderProcessed(string memory orderId) external view returns (bool) {
        return processedOrders[orderId];
    }
    
    /**
     * @dev Get supported tokens
     */
    function getSupportedTokens() external view returns (address[] memory) {
        address[] memory tokens = new address[](3);
        tokens[0] = USDT_TOKEN;
        tokens[1] = USDC_TOKEN;
        tokens[2] = NATIVE_TOKEN;
        return tokens;
    }
    
    /**
     * @dev Get exchange rate for a token (VND per token)
     */
    function getExchangeRate(address token) external view returns (uint256) {
        if (token == USDT_TOKEN) return USDT_RATE;
        if (token == USDC_TOKEN) return USDC_RATE;
        if (token == NATIVE_TOKEN) return ETH_RATE;
        return 0;
    }
    
    /**
     * @dev Fallback function to receive native coins
     */
    receive() external payable {
        // Accept native coin payments
    }
}
