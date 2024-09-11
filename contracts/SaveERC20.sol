// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./interfaces/IERC20.sol";


contract SaveERC20{

    address public owner;
    address public tokenAddress;
    mapping (address => uint256) balance;

    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }

    constructor(address _tokenAddress){
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    event depositSuccessful(address indexed user, uint256 indexed amount);
    event withdrawSuccessful(address indexed  user, uint256 indexed amount);

    function deposit(uint256 _amount) external {
        require(msg.sender != address(0), "Zero address detected");
        require(_amount > 0,"Can't deposit zero");
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= _amount, "Insufficeint Balance");
       
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
         balance[msg.sender] += _amount;
        emit depositSuccessful(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender != address(0), "Zero address detected");
        require(_amount > 0,"Can't deposit zero");
        require(balance[msg.sender] >= _amount);
        balance[msg.sender] -= _amount;
        IERC20(tokenAddress).transfer(msg.sender, _amount); 
        emit withdrawSuccessful(msg.sender, _amount);
    }

    function myBalance() external view returns (uint256){
        return balance[msg.sender];
    }

    function getAnyBalance(address _user) external view onlyOwner returns (uint256){

        return balance[_user];
    }

    function getContractBalance() external  view onlyOwner returns (uint256){

        return (IERC20(tokenAddress).balanceOf(address(this)));
    }

    function transferFunds(uint256 _amount, address _to) external {
        require(msg.sender != address(0), "Zero address detected");
        require(_to != address(0), "Zero address detected");
        require(_amount > 0,"Can't transfer zero");
        require(balance[msg.sender] >= _amount);
        balance[msg.sender] -= _amount;
        

        IERC20(tokenAddress).transfer(_to,_amount);
        
    }

    function depositForAnotherUser (uint256 _amount, address _user) external {
        require(msg.sender != address(0), "Zero address detected");
        require(_user != address(0), "Zero address detected");
        require(_amount > 0,"Can't transfer zero");
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= _amount);

       IERC20(tokenAddress).transferFrom(msg.sender,address(this),_amount);
        balance[_user] += _amount;

        

    }

    function ownerWihdraw(uint256 _amount) external {
        require(IERC20(tokenAddress).balanceOf(address(this)) >= _amount, "InsuffientFunds");
        IERC20(tokenAddress).transfer(owner,_amount);
    }

}