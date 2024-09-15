import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("SINC", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployToken() {
  

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const  erc20Token = await hre.ethers.getContractFactory("SINC");
    const token = await erc20Token.deploy();

    return {token, owner, otherAccount };
  }

   async function deploySaveERC20() {
  

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const { token } = await loadFixture(deployToken);

    const  SaveERC20 = await hre.ethers.getContractFactory("SaveERC20");
    const saveErc20 = await SaveERC20.deploy(token);

    return {saveErc20, owner, otherAccount,token };
  }

  describe("Deployment", function () {
    it("Check if owner is correct", async function () {
      const {saveErc20, owner } = await loadFixture(deploySaveERC20);

      expect(await saveErc20.owner()).to.equal(owner);
    });

     it("Check if the tokenaddress is correct", async function () {
      const {saveErc20, owner,token } = await loadFixture(deploySaveERC20);

      expect(await saveErc20.tokenAddress()).to.equal(token);
    });

 
  });

    describe("Deposit", function () {
    it("Should deposit correctly", async function () {
      const {saveErc20, owner, token, otherAccount } = await loadFixture(deploySaveERC20);

      const trfAmount = ethers.parseUnits("100",18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      await token.connect(otherAccount).approve(saveErc20, trfAmount);
      const otherAccountBalBefore = await token.balanceOf(otherAccount);
      const depositAmount = ethers.parseUnits("10", 18);
      await saveErc20.connect(otherAccount).deposit(depositAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(otherAccountBalBefore - depositAmount);

      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount);
      expect(await saveErc20.getContractBalance()).to.equal(depositAmount);

      
        
    });
     it("Withdraw sucessful should work", async function () {
      const {saveErc20, owner, token, otherAccount } = await loadFixture(deploySaveERC20);

      const trfAmount = ethers.parseUnits("100",18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      await token.connect(otherAccount).approve(saveErc20, trfAmount);
      const depositAmount = ethers.parseUnits("10", 18);
    

      

       await expect(saveErc20.connect(otherAccount).deposit(depositAmount))
        .to.emit(saveErc20, "depositSuccessful")
        .withArgs(otherAccount.address,depositAmount);


    });

     it("Can't deposit zero", async function () {
      const {saveErc20, owner, token, otherAccount } = await loadFixture(deploySaveERC20);

      const trfAmount = ethers.parseUnits("100",18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      await token.connect(otherAccount).approve(saveErc20, trfAmount);
      const depositAmount = ethers.parseUnits("0");
    

      
    await expect(
        saveErc20.connect(otherAccount).deposit(depositAmount)
      ).to.be.revertedWith("Can't deposit zero");



    });

   




 
  });

  describe("Withdrawals", function () {
    it("Should deposit correctly", async function () {
      const {saveErc20, owner, token, otherAccount } = await loadFixture(deploySaveERC20);

      const trfAmount = ethers.parseUnits("100",18);
      await token.transfer(otherAccount, trfAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(trfAmount);

      await token.connect(otherAccount).approve(saveErc20, trfAmount);
      const otherAccountBalBefore = await token.balanceOf(otherAccount);
      const depositAmount = ethers.parseUnits("10", 18);
      await saveErc20.connect(otherAccount).deposit(depositAmount);
      expect(await token.balanceOf(otherAccount)).to.equal(otherAccountBalBefore - depositAmount);

      expect(await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount);
      expect(await saveErc20.getContractBalance()).to.equal(depositAmount);

      
        const initalBalBeforWihdrawal = await token.balanceOf(otherAccount);

        const WithdrawAmount = ethers.parseUnits("5", 18);

        await saveErc20.connect(otherAccount).withdraw(WithdrawAmount);

        const balanceafterwithdrawal = await token.balanceOf(otherAccount);

        expect (await saveErc20.getContractBalance()).to.equal(depositAmount - WithdrawAmount);

        expect (await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount - WithdrawAmount);
                expect (await saveErc20.connect(otherAccount).myBalance()).to.equal(depositAmount - WithdrawAmount);
                expect ( await token.balanceOf(otherAccount)).to.equal(initalBalBeforWihdrawal + WithdrawAmount);
    });
    
    });

   
 
});
