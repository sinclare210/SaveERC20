import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const SINCModule = buildModule("SINCModule", (m) => {

    const ERC20 = m.contract("SINC");

    return { ERC20 };
});

export default SINCModule;