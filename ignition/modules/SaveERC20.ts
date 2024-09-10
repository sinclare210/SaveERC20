// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// import { parseEther } from "viem";

// const erc20Token = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

// const SaveERC20Module = buildModule("SaveERC20", (m) => {

//   const Save = m.contract("SaveERC20", [erc20Token] );

//   return { Save };
// });

// export default SaveERC20Module;
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0xA97A884a21a0b5b414797dd3b59966dF0B6BD89D";

const SaveERC20Module = buildModule("SaveERC20Module", (m) => {

    const save = m.contract("SaveERC20", [tokenAddress]);

    return { save };
});

export default SaveERC20Module;

// Deployed SaveERC20: 0x3Fb16f4367fBfe5ED63722083AE2108Ea085B1f4
