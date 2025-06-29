// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {EventFactory} from "./EventFactory.sol";
import {EventTicket} from "./EventTicket.sol";
import {Marketplace} from "./Marketplace.sol";

/**
 * @title EventTicketingSystem
 * @dev Deployment helper contract that deploys all components
 */
contract EventTicketingSystem {
    EventFactory public immutable eventFactory;
    Marketplace public immutable marketplace;
    
    event SystemDeployed(address indexed eventFactory, address indexed marketplace);
    
    constructor(uint256 baseFee, uint256 feePerTicket) {
        eventFactory = new EventFactory(baseFee, feePerTicket);
        marketplace = new Marketplace();
        
        emit SystemDeployed(address(eventFactory), address(marketplace));
    }
}
