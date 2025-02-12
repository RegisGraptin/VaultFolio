source .env


# Scroll deployment
forge script script/Manager.s.sol:ManagerScript \
  --rpc-url $SCROLL_RPC_URL \
  --private-key $PRIVATE_KEY \
  --verify \
  --verifier blockscout \
  --verifier-url https://scroll-sepolia.blockscout.com/api/ \
  --broadcast
