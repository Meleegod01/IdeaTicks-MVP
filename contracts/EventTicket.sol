// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721Royalty, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {EventFactory} from "./EventFactory.sol";

error EventTicket__AdminRoleGrantingFailed(bytes32 adminRole, address account);
error EventTicket__BookingPeriodNotOngoing(uint256 startingTimestamp, uint256 endingTimestamp);
error EventTicket__AmountExceedsMaxSupply(uint256 totalSupply, uint256 maxSupply);
error EventTicket__PurchaseLimitExceeds(uint256 purchasingAmount, uint256 purchaseLimit);
error EventTicket__ValueSentNotMatched(uint256 valueSent, uint256 valueRequired);
error EventTicket__NothingToWithdraw();
error EventTicket__WithdrawlFailed();
error EventTicket__InvalidTier(uint256 tierId);

contract EventTicket is ERC721Royalty, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");

    uint256 private s_ticketCounter;
    uint96 private s_resellLimitBps;
    address private s_organizerAddress;
    uint32 private s_bookingStartTimestamp;
    uint32 private s_bookingEndTimestamp;
    uint32 private s_purchaseLimit;
    
    mapping(uint32 => EventFactory.Tier) private s_tiers;
    mapping(uint256 => uint32) private s_tokenToTierId;
    mapping(address => uint256) private s_userMintedAmount;
    mapping(uint256 => uint128) private s_tokenOriginalPrice;

    event TicketsMinted(address indexed buyer, uint32 indexed tierId, uint256 quantity, uint256 totalPrice);
    event PrimarySalesWithdrawn(address indexed organizer, uint256 amount);

    modifier validTier(uint32 _tierId) {
        if (s_tiers[_tierId].maxSupply == 0) revert EventTicket__InvalidTier(_tierId);
        _;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Royalty, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    constructor(
        string memory _name,
        string memory _symbol,
        EventFactory.Tier[] memory _tiers,
        EventFactory.EventMetadata memory _eventMetadata,
        address _royaltyReceiver,
        address _organizer,
        address _owner
    ) ERC721(_name, _symbol) {
        s_resellLimitBps = _eventMetadata.resellLimitBps;
        s_purchaseLimit = _eventMetadata.purchaseLimit;
        s_bookingStartTimestamp = _eventMetadata.bookingStartTimestamp;
        s_bookingEndTimestamp = _eventMetadata.bookingEndTimestamp;
        s_organizerAddress = _organizer;
        _setDefaultRoyalty(_royaltyReceiver, _eventMetadata.royaltyBps);

        for (uint256 i = 0; i < _tiers.length; i++) {
            s_tiers[_tiers[i].tierId] = _tiers[i];
        }

        _grantRole(DEFAULT_ADMIN_ROLE, _owner);
        _grantRole(ORGANIZER_ROLE, _organizer);
        _setRoleAdmin(ORGANIZER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    function mintTickets(uint32 _tierId, uint256 _quantity)
        external
        payable
        nonReentrant
        whenNotPaused
        validTier(_tierId)
    {
        EventFactory.Tier storage tier = s_tiers[_tierId];
        
        if (block.timestamp < s_bookingStartTimestamp || block.timestamp > s_bookingEndTimestamp)
            revert EventTicket__BookingPeriodNotOngoing(s_bookingStartTimestamp, s_bookingEndTimestamp);
        
        if (tier.mintedAmount + _quantity > tier.maxSupply)
            revert EventTicket__AmountExceedsMaxSupply(tier.mintedAmount + _quantity, tier.maxSupply);
        
        if (s_userMintedAmount[msg.sender] + _quantity > s_purchaseLimit)
            revert EventTicket__PurchaseLimitExceeds(s_userMintedAmount[msg.sender] + _quantity, s_purchaseLimit);
        
        uint256 totalPrice = _quantity * tier.price;
        if (msg.value != totalPrice)
            revert EventTicket__ValueSentNotMatched(msg.value, totalPrice);

        tier.mintedAmount += uint32(_quantity);
        s_userMintedAmount[msg.sender] += _quantity;

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 newTicketId = s_ticketCounter;
            s_ticketCounter++;
            _safeMint(msg.sender, newTicketId);
            s_tokenToTierId[newTicketId] = _tierId;
            s_tokenOriginalPrice[newTicketId] = tier.price;
        }

        emit TicketsMinted(msg.sender, _tierId, _quantity, totalPrice);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        string memory baseURI = _baseURI();
        return string.concat(baseURI, s_tiers[s_tokenToTierId[tokenId]].ipfsHash);
    }

    function withdrawPrimarySales() external nonReentrant onlyRole(ORGANIZER_ROLE) {
        if (address(this).balance == 0) revert EventTicket__NothingToWithdraw();
        
        uint256 amount = address(this).balance;
        (bool success, ) = s_organizerAddress.call{value: amount}("");
        if (!success) revert EventTicket__WithdrawlFailed();
        
        emit PrimarySalesWithdrawn(s_organizerAddress, amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // View functions
    function getTierInfo(uint32 _tierId) external view returns (EventFactory.Tier memory) {
        return s_tiers[_tierId];
    }

    function getBookingPeriod() external view returns (uint32 startTime, uint32 endTime) {
        return (s_bookingStartTimestamp, s_bookingEndTimestamp);
    }

    function getPurchaseLimit() external view returns (uint32) {
        return s_purchaseLimit;
    }

    function getUserMintedAmount(address user) external view returns (uint256) {
        return s_userMintedAmount[user];
    }

    function getResellLimitBps() external view returns (uint96) {
        return s_resellLimitBps;
    }

    function getTokenOriginalPrice(uint256 tokenId) external view returns (uint128) {
        return s_tokenOriginalPrice[tokenId];
    }

    function getTokenTierId(uint256 tokenId) external view returns (uint32) {
        return s_tokenToTierId[tokenId];
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "ipfs://";
    }
}
