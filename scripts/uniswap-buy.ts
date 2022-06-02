// eslint-disable-next-line node/no-missing-import
import { getUniswapAmountsOutInEther, getUniswapRouterContract } from "./utils";
import {
  DAIAddress,
  EXTAddress,
  OurTeamAddress,
  // eslint-disable-next-line node/no-missing-import
} from "./constants";
import { ethers } from "hardhat";
// @ts-ignore
import Erc20 from "@uniswap/v2-core/build/ERC20.json";

async function buyTokenWithEst(
  tokenAddress: string,
  amountIn: string,
  slippage = 0.5
) {
  const router = await getUniswapRouterContract();
  // eslint-disable-next-line no-unused-vars
  const [_, amountOutWeth] = await getUniswapAmountsOutInEther(amountIn, [
    EXTAddress,
    tokenAddress,
  ]);
  const amountOutMin = `${amountOutWeth * (1 - slippage / 100)}`;

  const token0 = await ethers.getContractAt(Erc20.abi, tokenAddress);
  const tokenSymbol = await token0.symbol();
  console.log(
    `${amountIn} est in, ${tokenSymbol} out=${amountOutWeth}, amountOutMin=${amountOutMin}`
  );

  const tokenAddresses = [EXTAddress, tokenAddress];
  const sendToAddress = OurTeamAddress;
  // const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes
  const deadline = Date.now() + 1000 * 60 * 10;
  const approveTx = await (
    await ethers.getContractAt(
      ["function approve(address, uint256) public returns (bool)"],
      EXTAddress
    )
  ).approve(router.address, ethers.utils.parseEther(amountIn));
  await approveTx.wait();
  const tx = await router.swapExactTokensForTokens(
    ethers.utils.parseEther(amountIn),
    ethers.utils.parseEther(amountOutMin),
    tokenAddresses,
    sendToAddress,
    deadline,
    {
      gasLimit: ethers.utils.parseEther("0.000000000006721975"),
    }
  );
  const receipt = await tx.wait();
  console.log("receipt", receipt);
}

async function main() {
  await buyTokenWithEst(DAIAddress, "50", 1);
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
