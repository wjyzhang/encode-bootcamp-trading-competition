// eslint-disable-next-line node/no-missing-import
import { getUniswapAmountsOutInEther, showUniswapInfo } from "./utils";
// eslint-disable-next-line node/no-missing-import
import { DAIAddress, EXTAddress, WETHAddress } from "./constants";
import hre, { ethers } from "hardhat";

async function main() {
  const latestBlock = await hre.ethers.provider.getBlock("latest");
  const gasLimit = ethers.utils.formatEther(latestBlock.gasLimit);
  console.log(
    "gasLimit of the latest block",
    gasLimit,
    "block time unix timestamp=",
    latestBlock.timestamp
  );

  const amountsOutExt = await getUniswapAmountsOutInEther("1", [
    EXTAddress,
    DAIAddress,
  ]);
  console.log(`amountsOut EXT -> DAI = ${amountsOutExt}`);

  const amountsOutDai = await getUniswapAmountsOutInEther("1", [
    WETHAddress,
    DAIAddress,
  ]);
  console.log(`amountsOut WETH -> DAI = ${amountsOutDai}`);

  await showUniswapInfo();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
