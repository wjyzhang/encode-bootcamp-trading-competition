import {
  DAIAddress,
  EXTAddress,
  MasterChefAddress,
  OurTeamAddress,
  SushiTokenAddress,
  UniswapV2RouterAddress,
  WETHAddress,
  // eslint-disable-next-line node/no-missing-import
} from "./constants";
import { BigNumber } from "ethers";
// @ts-ignore
import MasterChefAbi from "../abis/sushiswap-masterchef-abi.json";
// @ts-ignore
import UniswapV2Router from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
// @ts-ignore
import UniswapV2Factory from "@uniswap/v2-core/build/UniswapV2Factory.json";
// @ts-ignore
import UniswapV2Pair from "@uniswap/v2-core/build/UniswapV2Pair.json";
// @ts-ignore
import Erc20 from "@uniswap/v2-core/build/ERC20.json";

const { ethers } = require("hardhat");
export const ERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");

const Teams = [
  {
    name: "Group 1",
    address: "0x81c377E02D10EDD6d99d6ED79290118ad94De588",
  },
  {
    name: "Group 2 (Dem Island Boys)",
    address: "0x368510137009AF63Af3c70e484E90EFEA0Fe63a3",
  },
  {
    name: "Group 3",
    address: "0x2e56320bc51cdbb343bea3ec9dba16b34bc718e9",
  },
  {
    name: "Group 4",
    address: "0x25c81583f9ab6DBD0C4F21B3aa1008d8a56D5830",
  },
  {
    name: "Group 5",
    address: "0xEDB4400a8b1DEccc6C62DFDDBD6F73E48537012A",
  },
  {
    name: "Group 6",
    address: "0x58b36E0eF26BF365a0F37651E1561B1340333b11",
  },
  {
    name: "Group 7 (Blackjack)",
    address: "0x235d255924645fd3979D1c231552D49FFa40eA1c",
  },
  {
    name: "Group 8",
    address: "0xd0389eae8a1524AFD64F9595172b390415eE1075",
  },
  {
    name: "new group 2 (bitdao)",
    address: "0x5670767E1F03f68C903Abb6d04DcdaA12A18e804",
  },
  {
    name: "group 5 (bitdao)",
    address: "0x030b4648a91010EbB761F2b60ed7316Ee6403ccC",
  },
  {
    name: "Londoneer",
    address: "0x2F252d191245A5D3882e35A08985EaccCfC1AD48",
  },
];

export async function getAllTeamBalances() {
  // eslint-disable-next-line camelcase
  const EXT_TokenContract = await ethers.getContractAt(ERC20.abi, EXTAddress);
  // eslint-disable-next-line camelcase
  const WETH_TokenContract = await ethers.getContractAt(ERC20.abi, WETHAddress);
  // eslint-disable-next-line camelcase
  const DAI_TokenContract = await ethers.getContractAt(ERC20.abi, DAIAddress);
  // eslint-disable-next-line camelcase
  const Sushi_TokenContract = await ethers.getContractAt(
    ERC20.abi,
    SushiTokenAddress
  );

  console.log("EXT,WETH, DAI balances from all teams");
  for (const { name, address } of Teams) {
    const extBalance = await EXT_TokenContract.balanceOf(address);
    console.log(
      `${name} EXT balance = ${ethers.utils.formatEther(extBalance)}`
    );
    const wethBalance = await WETH_TokenContract.balanceOf(address);
    console.log(
      `${name} WETH balance = ${ethers.utils.formatEther(wethBalance)}`
    );
    const daiBalance = await DAI_TokenContract.balanceOf(address);
    console.log(
      `${name} DAI balance = ${ethers.utils.formatEther(daiBalance)}`
    );
    const sushiBalance = await Sushi_TokenContract.balanceOf(address);
    console.log(
      `${name} Sushi balance = ${ethers.utils.formatEther(sushiBalance)}`
    );
  }
}

export async function showMyTeamBalances() {
  // eslint-disable-next-line camelcase
  const EXT_TokenContract = await ethers.getContractAt(ERC20.abi, EXTAddress);
  const extBalance = await EXT_TokenContract.balanceOf(OurTeamAddress);
  console.log(
    `our team's EXT balance = ${ethers.utils.formatEther(extBalance)}`
  );
  // eslint-disable-next-line camelcase
  const WETH_TokenContract = await ethers.getContractAt(ERC20.abi, WETHAddress);
  const wethBalance = await WETH_TokenContract.balanceOf(OurTeamAddress);
  console.log(
    `our team's WETH balance = ${ethers.utils.formatEther(wethBalance)}`
  );

  // eslint-disable-next-line camelcase
  const DAI_TokenContract = await ethers.getContractAt(ERC20.abi, DAIAddress);
  const daiBalance = await DAI_TokenContract.balanceOf(OurTeamAddress);
  console.log(
    `our team's DAI balance = ${ethers.utils.formatEther(daiBalance)}`
  );
}

export async function getUniswapRouterContract() {
  return ethers.getContractAt(UniswapV2Router.abi, UniswapV2RouterAddress);
}

export async function getUniswapAmountsOutInEther(
  amountInEther: string,
  addresses: string[]
) {
  const amountIn = ethers.utils.parseEther(amountInEther);
  const contract = await getUniswapRouterContract();
  const amountsOut = await contract.getAmountsOut(amountIn, addresses);
  return amountsOut.map((x: BigNumber) => ethers.utils.formatEther(x));
}

export async function getUniswapAmountsOut(
  amountInEther: string,
  addresses: string[]
) {
  const amountIn = ethers.utils.parseEther(amountInEther);
  const contract = await getUniswapRouterContract();
  const amountsOut = await contract.getAmountsOut(amountIn, addresses);
  return amountsOut;
}

export async function showUniswapInfo() {
  const router = await getUniswapRouterContract();
  const factoryAddress = await router.factory();
  console.log(`factoryAddress = ${factoryAddress}`);

  const factory = await ethers.getContractAt(
    UniswapV2Factory.abi,
    factoryAddress
  );

  await showUniswapAllPairInfo(factory);
}

export async function showUniswapAllPairInfo(factory: any) {
  const numberOfPairs = await factory.allPairsLength();
  console.log(`number of pairs = ${numberOfPairs}`);
  for (let i = 0; i < numberOfPairs; i++) {
    const pairAddress = await factory.allPairs(i);
    const pair = await ethers.getContractAt(UniswapV2Pair.abi, pairAddress);
    await showUniswapPairInfo(pair);
  }
}

export async function showUniswapPairInfo(pair: any) {
  const token0Address = await pair.token0();
  const token0 = await ethers.getContractAt(Erc20.abi, token0Address);
  const token0Symbol = await token0.symbol();
  const token1Address = await pair.token1();
  const token1 = await ethers.getContractAt(Erc20.abi, token1Address);
  const token1Symbol = await token1.symbol();
  console.log(token0Symbol, token1Symbol);
  const [reserve0, reserver1] = await pair.getReserves();
  console.log(
    ethers.utils.formatEther(reserve0),
    ethers.utils.formatEther(reserver1)
  );
}

export async function showSushiswapPoolInfo() {
  const masterChefContract = await ethers.getContractAt(
    MasterChefAbi.abi,
    MasterChefAddress
  );

  const poolLength = await masterChefContract.poolLength();
  console.log(`poolLength = ${poolLength}`);
}
