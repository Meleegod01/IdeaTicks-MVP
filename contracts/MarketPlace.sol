// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EventTicket} from "./EventTicket.sol";

error Marketplace__NotOwner();
error Marketplace__NotApproved();
error Marketplace__TicketNotListed();
error Marketplace__IncorrectPayment(uint256 sent, uint256 required);
error Marketplace__PriceExceedsResellLimit(uint256 price, uint256 maxPrice);
error Marketplace__PaymentFailed();
error Marketplace__AlreadyListed();
error Marketplace__NotListed();
error Marketplace__InvalidPrice();

contract Marketplace is ReentrancyGuard, Pausable, Ownable {
    struct Listing {
        address collectionAddress;
        uint256 tokenId;
        address seller;
        uint128 price;
        bool active;
    }

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => mapping(uint256 => bool)) private s_isListed;
    
    uint256 private s_marketplaceFeePercent = 250; // 2.5%
    uint256 private constant PERCENTAGE_DIVISOR = 10000;

    event TicketListed(address indexed collection, uint256 indexed tokenId, address indexed seller, uint128 price);
    event TicketSold(address indexed collection, uint256 indexed tokenId, address indexed buyer, address indexed seller, uint128 price);
    event TicketDelisted(address indexed collection, uint256 indexed tokenId, address indexed seller);
    event MarketplaceFeeUpdated(uint256 newFee);

    constructor() Ownable(msg.sender) {}

    function listTicket(address collectionAddress, uint256 tokenId, uint128 price)
        external
        nonReentrant
        whenNotPaused
    {
        if (price == 0) revert Marketplace__InvalidPrice();
        
        EventTicket collection = EventTicket(collectionAddress);
        
        if (msg.sender != collection.ownerOf(tokenId))
            revert Marketplace__NotOwner();
        
        if (collection.getApproved(tokenId) != address(this) &&
            !collection.isApprovedForAll(msg.sender, address(this)))
            revert Marketplace__NotApproved();
        
        if (s_isListed[collectionAddress][tokenId])
            revert Marketplace__AlreadyListed();

        // Check resell limit
        uint96 resellLimitBps = collection.getResellLimitBps();
        if (resellLimitBps > 0) {
            uint128 originalPrice = collection.getTokenOriginalPrice(tokenId);
            uint256 maxResellPrice = originalPrice + (originalPrice * resellLimitBps / PERCENTAGE_DIVISOR);
            if (price > maxResellPrice)
                revert Marketplace__PriceExceedsResellLimit(price, maxResellPrice);
        }

        s_listings[collectionAddress][tokenId] = Listing({
            collectionAddress: collectionAddress,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true
        });
        
        s_isListed[collectionAddress][tokenId] = true;

        emit TicketListed(collectionAddress, tokenId, msg.sender, price);
    }

    function buyTicket(address collectionAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        if (!s_isListed[collectionAddress][tokenId])
            revert Marketplace__TicketNotListed();
        
        Listing memory listing = s_listings[collectionAddress][tokenId];
        
        if (msg.value != listing.price)
            revert Marketplace__IncorrectPayment(msg.value, listing.price);

        EventTicket collection = EventTicket(collectionAddress);
        
        // Calculate fees
        uint256 marketplaceFee = (msg.value * s_marketplaceFeePercent) / PERCENTAGE_DIVISOR;
        
        // Get royalty info
        (address royaltyReceiver, uint256 royaltyAmount) = collection.royaltyInfo(tokenId, msg.value);
        
        uint256 sellerAmount = msg.value - marketplaceFee - royaltyAmount;

        // Transfer ticket to buyer
        collection.safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Pay royalties
        if (royaltyAmount > 0) {
            (bool royaltySuccess, ) = payable(royaltyReceiver).call{value: royaltyAmount}("");
            if (!royaltySuccess) revert Marketplace__PaymentFailed();
        }

        // Pay seller
        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerAmount}("");
        if (!sellerSuccess) revert Marketplace__PaymentFailed();

        // Clean up listing
        delete s_listings[collectionAddress][tokenId];
        s_isListed[collectionAddress][tokenId] = false;

        emit TicketSold(collectionAddress, tokenId, msg.sender, listing.seller, listing.price);
    }

    function delistTicket(address collectionAddress, uint256 tokenId) external {
        if (!s_isListed[collectionAddress][tokenId])
            revert Marketplace__NotListed();
        
        Listing memory listing = s_listings[collectionAddress][tokenId];
        
        if (msg.sender != listing.seller)
            revert Marketplace__NotOwner();

        delete s_listings[collectionAddress][tokenId];
        s_isListed[collectionAddress][tokenId] = false;

        emit TicketDelisted(collectionAddress, tokenId, msg.sender);
    }

    function approveMarketplaceForToken(uint256 tokenId, address collectionAddress) external {
        EventTicket collection = EventTicket(collectionAddress);
        if (msg.sender != collection.ownerOf(tokenId))
            revert Marketplace__NotOwner();
        collection.approve(address(this), tokenId);
    }

    function approveMarketplaceForAll(address collectionAddress) external {
        EventTicket collection = EventTicket(collectionAddress);
        collection.setApprovalForAll(address(this), true);
    }

    function withdrawMarketplaceFees() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert Marketplace__PaymentFailed();
    }

    function setMarketplaceFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee too high"); // Max 10%
        s_marketplaceFeePercent = _newFeePercent;
        emit MarketplaceFeeUpdated(_newFeePercent);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getListing(address collectionAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[collectionAddress][tokenId];
    }

    function isListed(address collectionAddress, uint256 tokenId) external view returns (bool) {
        return s_isListed[collectionAddress][tokenId];
    }

    function getMarketplaceFee() external view returns (uint256) {
        return s_marketplaceFeePercent;
    }

    function calculateFees(uint256 price, address collectionAddress, uint256 tokenId)
        external
        view
        returns (uint256 marketplaceFee, uint256 royaltyFee, uint256 sellerAmount)
    {
        marketplaceFee = (price * s_marketplaceFeePercent) / PERCENTAGE_DIVISOR;
        
        EventTicket collection = EventTicket(collectionAddress);
        (, royaltyFee) = collection.royaltyInfo(tokenId, price);
        
        sellerAmount = price - marketplaceFee - royaltyFee;
    }
}
