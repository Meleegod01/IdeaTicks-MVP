// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {EventTicket} from "./EventTicket.sol";

error EventFactory__Unauthorized_NotAnOrganizer(address unauthorizedAddress);
error EventFactory__FeeNotMatched(uint256 feeSent, uint256 requiredFee);
error EventFactory__SupplyNotMatched(uint256 tiersSupply, uint256 totalNumberOfTickets);
error EventFactory__NothingToWithdraw();
error EventFactory__WithdrawalFailed();

contract EventFactory is Ownable, ReentrancyGuard {
    struct Tier {
        uint32 tierId;
        uint128 price;
        uint32 maxSupply;
        uint32 mintedAmount;
        string ipfsHash;
    }

    struct EventMetadata {
        uint96 royaltyBps;
        uint32 purchaseLimit;
        uint96 resellLimitBps;
        uint32 bookingStartTimestamp;
        uint32 bookingEndTimestamp;
    }

    uint256 private s_baseFee;
    uint256 private s_feePerTicket;
    uint256 private s_eventCounter;

    mapping(address => bool) private s_isOrganizer;
    mapping(address => uint256[]) private s_eventsOfOrganizer;
    mapping(uint256 => address) private s_eventAddress;

    event OrganizerAdded(address indexed organizerAddress);
    event OrganizerRemoved(address indexed organizerAddress);
    event EventCreated(uint256 indexed eventId, address indexed organizerAddress, address indexed eventContract);
    event PlatformFeesWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOrganizer() {
        if (!isOrganizer(msg.sender))
            revert EventFactory__Unauthorized_NotAnOrganizer(msg.sender);
        _;
    }

    modifier supplyMatched(uint256 _numberOfTickets, Tier[] memory _tiers) {
        uint256 totalMaxSupply;
        for (uint256 i = 0; i < _tiers.length; i++) {
            totalMaxSupply += _tiers[i].maxSupply;
        }
        if (totalMaxSupply != _numberOfTickets)
            revert EventFactory__SupplyNotMatched(totalMaxSupply, _numberOfTickets);
        _;
    }

    modifier feeMatched(uint256 _feeSent, uint256 _numberOfTickets) {
        uint256 platformFee = _feeCalculation(_numberOfTickets);
        if (platformFee != _feeSent)
            revert EventFactory__FeeNotMatched(_feeSent, platformFee);
        _;
    }

    constructor(uint256 _baseFee, uint256 _feePerTicket) Ownable(msg.sender) {
        s_baseFee = _baseFee;
        s_feePerTicket = _feePerTicket;
    }

    function createEvent(
        string memory _collectionName,
        string memory _collectionSymbol,
        uint256 _totalNumberOfTickets,
        Tier[] memory tiers,
        EventMetadata memory eventMetadata,
        address royaltyReceiver
    )
        public
        payable
        onlyOrganizer
        nonReentrant
        feeMatched(msg.value, _totalNumberOfTickets)
        supplyMatched(_totalNumberOfTickets, tiers)
    {
        address eventOrganizer = msg.sender;
        uint256 newEventId = s_eventCounter;
        
        EventTicket newEventTicket = new EventTicket(
            _collectionName,
            _collectionSymbol,
            tiers,
            eventMetadata,
            royaltyReceiver,
            msg.sender,
            owner()
        );
        
        s_eventCounter++;
        s_eventAddress[newEventId] = address(newEventTicket);
        s_eventsOfOrganizer[eventOrganizer].push(newEventId);
        
        emit EventCreated(newEventId, eventOrganizer, address(newEventTicket));
    }

    function withdrawPlatformFees() external onlyOwner nonReentrant {
        if (address(this).balance == 0) revert EventFactory__NothingToWithdraw();
        
        uint256 amount = address(this).balance;
        (bool success, ) = payable(owner()).call{value: amount}("");
        if (!success) revert EventFactory__WithdrawalFailed();
        
        emit PlatformFeesWithdrawn(owner(), amount);
    }

    function addOrganizer(address _organizerAddress) external onlyOwner {
        s_isOrganizer[_organizerAddress] = true;
        emit OrganizerAdded(_organizerAddress);
    }

    function removeOrganizer(address _organizerAddress) external onlyOwner {
        s_isOrganizer[_organizerAddress] = false;
        emit OrganizerRemoved(_organizerAddress);
    }

    function setBaseFee(uint256 _newBaseFee) external onlyOwner {
        s_baseFee = _newBaseFee;
    }

    function setFeePerTicket(uint256 _newFeePerTicket) external onlyOwner {
        s_feePerTicket = _newFeePerTicket;
    }

    // View functions
    function getBaseFee() external view returns (uint256) {
        return s_baseFee;
    }

    function getFeePerTicket() external view returns (uint256) {
        return s_feePerTicket;
    }

    function getEventCounter() external view returns (uint256) {
        return s_eventCounter;
    }

    function getEventAddressFromId(uint256 _id) external view returns (address) {
        return s_eventAddress[_id];
    }

    function getEventsOfOrganizer(address _address) external view returns (uint256[] memory) {
        return s_eventsOfOrganizer[_address];
    }

    function isOrganizer(address _address) public view returns (bool) {
        return s_isOrganizer[_address];
    }

    function calculatePlatformFee(uint256 _numberOfTickets) external view returns (uint256) {
        return _feeCalculation(_numberOfTickets);
    }

    function _feeCalculation(uint256 _numberOfTickets) internal view returns (uint256) {
        return s_baseFee + s_feePerTicket * _numberOfTickets;
    }
}
