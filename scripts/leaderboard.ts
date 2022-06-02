// eslint-disable-next-line node/no-missing-import
import { getAllTeamBalances, showMyTeamBalances } from "./utils";
import { ethers } from "hardhat";

async function showRemainingEth() {
  const [wallet] = await ethers.getSigners();
  const balance = await wallet.getBalance();
  console.log(
    "remaining ETH balance in our team account",
    ethers.utils.formatEther(balance)
  );
}

async function main() {
  await showMyTeamBalances();
  await showRemainingEth();
  await getAllTeamBalances();
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
