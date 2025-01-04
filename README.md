first dev cert practice

- made simple counter solidity contract
- deployed on base sepolia
- install rainbowkit w/ wagmi
- made frontend, no styling tho


NOTES:
- compile code on remix, then grab ABI
- readContract wagmi hook is weird
- did not mess with test file

TODO:
- to it with shadcn next time
- get good at readContract hook
- maybe learn how to make a test file

PROCESS:
1) npx hardhat init (typescript with viem)
2) write contract
3) add baseSepolia network to hardhat config
4) create .env with private key
5) npx hardhat compile
6) npx hardhat ignition deploy ./ignition/modules/<file>.ts --network baseSepolia --> copy address
7) compile code in remix --> copy ABI
8) npm init @rainbow-me/rainbowkit@latest
9) add address and ABI to src/constants.ts
10) make frontend
