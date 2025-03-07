#!/bin/bash
source .env

# Build contracts
forge build

# Scroll deployment
MANAGER_CONTRACT_ADDRESS=$(forge script script/Manager.s.sol:ManagerScript \
  --rpc-url $SCROLL_RPC_URL \
  --private-key $PRIVATE_KEY \
  --verify \
  --verifier blockscout \
  --verifier-url https://scroll-sepolia.blockscout.com/api/ \
  --broadcast \
  --json \
  | sed -n '/^{/,/^}/p' \
  | jq -r '.returns[].value')

echo "Contract deployed at: `$MANAGER_CONTRACT_ADDRESS`"

# Verify on etherscan the contract
forge verify-contract \
  --chain-id $CHAIN_ID \
  --verifier etherscan \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  $MANAGER_CONTRACT_ADDRESS \
  src/Manager.sol:Manager
