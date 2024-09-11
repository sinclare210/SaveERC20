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

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
