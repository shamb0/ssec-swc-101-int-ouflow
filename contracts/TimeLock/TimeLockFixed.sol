// SPDX-License-Identifier: MIT
// pragma solidity ^0.5.1;
pragma solidity ^0.6.0;

import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract TimeLockFixed {

    using SafeMath for uint;

    mapping(address => uint) public balances;
    mapping(address => uint) public lockTime;

    function deposit() public payable {
        balances[msg.sender].add( msg.value );
        lockTime[msg.sender] = now + 1 weeks;
    }

    function increaseLockTime(uint _secondsToIncrease) public {

        lockTime[msg.sender] = lockTime[msg.sender].add( _secondsToIncrease );

    }

    receive() external payable {

        require(msg.data.length == 0);

        console.log("Info@TimeLock.sol::receive ContBal(%s)", address(this).balance );
    }

    function remittBalance() public {

        require(balances[msg.sender] > 0);
        require(now > lockTime[msg.sender]);
        msg.sender.transfer(balances[msg.sender]);
        balances[msg.sender] = 0;

    }

    function withdrawEth() public {
        msg.sender.transfer( address(this).balance );
    }

}