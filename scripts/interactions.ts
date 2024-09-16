import { ethers } from "hardhat";
import { IERC20 } from "../typechain-types/contracts/interfaces";

async function main() {
    const ERC20ContractAddy = "0xA97A884a21a0b5b414797dd3b59966dF0B6BD89D";
    const SINC = await ethers.getContractAt("IERC20", ERC20ContractAddy )
    const saveERC20ConactAddy = "0xfc2381629ebF9c121a3ad79d18e01068C328c1d9";
    const saveErc20 = await ethers.getContractAt("ISaveERC20", saveERC20ConactAddy);
        const contractBalanceBeforeDeposit = await saveErc20.getContractBalance();
    console.log("Contract Balance Before",contractBalanceBeforeDeposit);
    //approve contract
    const approvalAmount = ethers.parseUnits("1000", 18);

    const approvetx = await SINC.approve(saveErc20, approvalAmount);
    approvetx.wait();

    const depositAmount = ethers.parseUnits("150", 18);
    const deposittx = await saveErc20.deposit(depositAmount)
    deposittx.wait();
 

    const contractBalanceAfterDeposit = await saveErc20.getContractBalance();
    console.log("Contract Balance After",contractBalanceAfterDeposit);

    const withdrawAmount = ethers.parseUnits("5", 18);
    const withdrawtx = await saveErc20.withdraw(withdrawAmount);
    const contractBalanceAfterWithdraw = await saveErc20.getContractBalance();
    console.log("Contract Balance After Withdraw",contractBalanceAfterWithdraw);
    console.log(withdrawtx);



}

main().catch((error => {
    console.log(error);
    process.exitCode = 1;
}));