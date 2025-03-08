#!/bin/bash
source .env

# Build contracts
forge build

# Scroll deployment
forge script script/Manager.s.sol:ManagerScript \
  --rpc-url $SCROLL_RPC_URL \
  --private-key $PRIVATE_KEY \
  --verify \
  --verifier blockscout \
  --verifier-url https://scroll-sepolia.blockscout.com/api/ \
  --broadcast 

# # Verify on etherscan the contract
# forge verify-contract \
#   --chain-id $CHAIN_ID \
#   --verifier etherscan \
#   --etherscan-api-key $ETHERSCAN_API_KEY \
#   $MANAGER_CONTRACT_ADDRESS \
#   src/Manager.sol:Manager
