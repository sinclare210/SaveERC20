// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./interfaces/IERC20.sol";


contract SaveERC20{

    error AddressZeroDetected();
    error CantSendZero();
    error InsufficientFunds();
    error NotOwner();
    error CantSendToZeroAddress();


    address public owner;
    address public tokenAddress;
    mapping (address => uint256) balance;

   

    constructor(address _tokenAddress){
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    event depositSuccessful(address indexed user, uint256 indexed amount);
    event withdrawSuccessful(address indexed  user, uint256 indexed amount);

    function deposit(uint256 _amount) external {
     if(msg.sender == address(0)){revert AddressZeroDetected();}
    if(_amount <= 0) {revert InsufficientFunds();}
    if(IERC20(tokenAddress).balanceOf(msg.sender) < _amount){revert  InsufficientFunds();}
        
       
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
         balance[msg.sender] += _amount;
        emit depositSuccessful(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        if(msg.sender == address(0)){revert AddressZeroDetected();}
        if(_amount <= 0) {revert InsufficientFunds();}

        require(balance[msg.sender] >= _amount);
        balance[msg.sender] -= _amount;
        IERC20(tokenAddress).transfer(msg.sender, _amount); 
        emit withdrawSuccessful(msg.sender, _amount);
    }

    function myBalance() external view returns (uint256){
        return balance[msg.sender];
    }

    function getAnyBalance(address _user) external view  returns (uint256){
        onlyOwner();
        return balance[_user];
    }

    function getContractBalance() external  view returns (uint256){
        onlyOwner();
        return (IERC20(tokenAddress).balanceOf(address(this)));
    }

    function transferFunds(uint256 _amount, address _to) external {
     if(msg.sender == address(0)){revert AddressZeroDetected();}
          if(_to == address(0)){revert CantSendToZeroAddress();}
    if(_amount <= 0) {revert InsufficientFunds();}
    if(balance[msg.sender] <= 0) {revert InsufficientFunds();}

       
        balance[msg.sender] -= _amount;
        

        IERC20(tokenAddress).transfer(_to,_amount);
        
    }

    function depositForAnotherUser (uint256 _amount, address _user) external {
     if(msg.sender == address(0)){revert AddressZeroDetected();}
          if(_user == address(0)){revert CantSendToZeroAddress();}
    if(_amount <= 0) {revert InsufficientFunds();}
        if(IERC20(tokenAddress).balanceOf(msg.sender) >= _amount) {revert InsufficientFunds();}
     

       IERC20(tokenAddress).transferFrom(msg.sender,address(this),_amount);
        balance[_user] += _amount;

        

    }

    function ownerWihdraw(uint256 _amount) external {
        if(IERC20(tokenAddress).balanceOf(address(this)) >= _amount) {revert InsufficientFunds();}

        IERC20(tokenAddress).transfer(owner,_amount);
    }

    function onlyOwner() private view{
        require(owner == msg.sender);
    }

}