// eslint-disable-next-line node/no-missing-import
import { getUniswapAmountsOut, getUniswapRouterContract } from "./utils";
import {
  DAIAddress,
  EXTAddress,
  OurTeamAddress,
  // eslint-disable-next-line node/no-missing-import
} from "./constants";
import { ethers } from "hardhat";
// @ts-ignore
import Erc20 from "@uniswap/v2-core/build/ERC20.json";

async function swapExactTokensForTokens(
  tokenInAddress: string,
  amountInInEther: string,
  tokenOutAddress: string,
  slippage = 1
) {
  const router = await getUniswapRouterContract();
  // eslint-disable-next-line no-unused-vars
  const [_, amountOut] = await getUniswapAmountsOut(amountInInEther, [
    tokenInAddress,
    tokenOutAddress,
  ]);
  const amountOutMin = amountOut.sub(amountOut.mul(slippage).div(100));

  const tokenIn = await ethers.getContractAt(Erc20.abi, tokenInAddress);
  const tokenInSymbol = await tokenIn.symbol();
  const tokenOut = await ethers.getContractAt(Erc20.abi, tokenOutAddress);
  const tokenOutSymbol = await tokenOut.symbol();
  console.log(
    `${amountInInEther} ${tokenInSymbol} in, ${tokenOutSymbol} out=${ethers.utils.formatEther(
      amountOut
    )}, amountOutMin=${ethers.utils.formatEther(amountOutMin)}`
  );

  const tokenAddresses = [tokenInAddress, tokenOutAddress];
  const sendToAddress = OurTeamAddress;
  // const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes
  const deadline = Date.now() + 1000 * 60 * 10;
  const amountIn = ethers.utils.parseEther(amountInInEther);
  const approveTx = await tokenIn.approve(router.address, amountIn);
  await approveTx.wait();
  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    tokenAddresses,
    sendToAddress,
    deadline
  );
  const receipt = await tx.wait();
  console.log("receipt", receipt);
}

async function main() {
  await swapExactTokensForTokens(EXTAddress, "1", DAIAddress);
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
