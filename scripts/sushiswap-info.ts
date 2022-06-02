// eslint-disable-next-line node/no-missing-import
import { showSushiswapPoolInfo } from "./utils";

async function main() {
  await showSushiswapPoolInfo();
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
