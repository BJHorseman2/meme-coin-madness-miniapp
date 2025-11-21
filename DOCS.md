# Base Documentation & Resources

This document provides comprehensive documentation references for building on Base and developing with the technologies used in this mini app.

## Table of Contents
- [Getting Started with Base](#getting-started-with-base)
- [Base Network Information](#base-network-information)
- [Mini Apps Development](#mini-apps-development)
- [Base Pay Integration](#base-pay-integration)
- [Smart Contracts](#smart-contracts)
- [Development Tools](#development-tools)
- [APIs and SDKs](#apis-and-sdks)
- [Community Resources](#community-resources)

## Getting Started with Base

### What is Base?
Base is a secure, low-cost, builder-friendly Ethereum Layer 2 (L2) blockchain. Built on the OP Stack in partnership with Optimism, Base provides:
- Fast, low-cost transactions
- Full Ethereum compatibility
- Seamless integration with Coinbase products
- No additional network token (uses ETH)

**Documentation:**
- [Base Overview](https://docs.base.org/chain/) - Introduction to Base
- [Quickstart Guide](https://docs.base.org/quickstart) - Build your first onchain app
- [Why Build on Base](https://docs.base.org/building-with-base/why-base) - Benefits and features

## Base Network Information

### Mainnet
- **Network Name:** Base
- **Chain ID:** 8453
- **Currency:** ETH
- **RPC Endpoint:** `https://mainnet.base.org`
- **Block Explorer:** [BaseScan](https://basescan.org)
- **WebSocket:** `wss://mainnet.base.org`

### Testnet (Sepolia)
- **Network Name:** Base Sepolia
- **Chain ID:** 84532
- **Currency:** ETH
- **RPC Endpoint:** `https://sepolia.base.org`
- **Block Explorer:** [BaseScan Sepolia](https://sepolia.basescan.org)
- **Faucet:** [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

**Documentation:**
- [Network Information](https://docs.base.org/chain/network-information) - Complete network details
- [Contract Addresses](https://docs.base.org/chain/contract-addresses) - System contracts

## Mini Apps Development

### Base App Mini Apps
Mini apps are interactive web applications that run inside Base App, providing seamless experiences for users.

**Core Documentation:**
- [Mini Apps Introduction](https://docs.base.org/base-app/introduction/mini-apps) - Overview and concepts
- [Getting Started](https://docs.base.org/base-app/getting-started) - First mini app tutorial
- [Publishing Your Mini App](https://docs.base.org/base-app/publishing) - Deployment guide

### MiniKit SDK
MiniKit is the official SDK for building Base mini apps with React.

**Key Features:**
- User authentication with Quick Auth
- Wallet integration
- Transaction handling
- Frame actions
- Camera and media access

**Documentation:**
- [MiniKit Overview](https://docs.base.org/base-app/build-with-minikit/overview) - SDK introduction
- [Quick Auth](https://docs.base.org/base-app/build-with-minikit/quick-auth) - User authentication
- [Wallet Integration](https://docs.base.org/base-app/build-with-minikit/wallet) - Connect and interact with wallets
- [Transactions](https://docs.base.org/base-app/build-with-minikit/transactions) - Send transactions
- [Frame Actions](https://docs.base.org/base-app/build-with-minikit/frame-actions) - Interactive frames

### Farcaster Integration
This mini app is designed to work with Farcaster frames and the Base App ecosystem.

**Documentation:**
- [Farcaster Frames](https://docs.farcaster.xyz/learn/what-is-farcaster/frames) - Frame specification
- [MiniApp SDK](https://github.com/farcaster/miniapp-sdk) - Farcaster MiniApp SDK

## Base Pay Integration

### Overview
Base Pay enables one-tap USDC payments within your app, providing fast and low-cost payment experiences.

**Features:**
- Native USDC support
- Low transaction fees
- Fast settlement
- Simple integration
- Secure payments on Base

### Implementation
This app uses the `@base-org/account` and `@base-org/account-ui` packages for Base Pay integration.

**Documentation:**
- [Base Pay Documentation](https://docs.base.org/base-pay) - Complete payment guide
- [Base Account](https://docs.base.org/base-account) - Smart wallet infrastructure
- [USDC on Base](https://docs.base.org/tokens/usdc) - USDC integration guide
- [Payment Flows](https://docs.base.org/base-pay/payment-flows) - Implementation patterns

### Base Account UI Components
```typescript
import { BasePayButton } from '@base-org/account-ui/react';
import { pay, getPaymentStatus } from '@base-org/account';
```

**References:**
- [BasePay Component](./src/components/wallet/BasePay.tsx) - Implementation example
- [Base Account UI Docs](https://docs.base.org/base-account/ui-components) - UI components

## Smart Contracts

### Deploying Contracts on Base
Base is fully EVM-compatible, supporting all Ethereum development tools.

**Documentation:**
- [Deploy Your First Contract](https://docs.base.org/tutorials/deploy-smart-contract) - Step-by-step tutorial
- [Smart Contract Development](https://docs.base.org/building-with-base/smart-contracts) - Best practices
- [Verifying Contracts](https://docs.base.org/tools/block-explorers#verifying-contracts) - Contract verification

### Popular Contract Standards
- [ERC-20 Tokens](https://docs.base.org/tokens/erc20) - Fungible tokens
- [ERC-721 NFTs](https://docs.base.org/tokens/erc721) - Non-fungible tokens
- [ERC-1155](https://docs.base.org/tokens/erc1155) - Multi-token standard

### Development Tools
- **Hardhat:** [Guide](https://docs.base.org/tools/hardhat) - Contract development framework
- **Foundry:** [Guide](https://docs.base.org/tools/foundry) - Fast contract development
- **Remix:** [Guide](https://docs.base.org/tools/remix) - Browser-based IDE

## Development Tools

### OnchainKit
OnchainKit provides React components and utilities for building onchain applications.

**Features:**
- Pre-built UI components
- Wallet connection
- Transaction handling
- Identity management
- Token operations

**Documentation:**
- [OnchainKit Documentation](https://onchainkit.xyz/) - Official docs
- [Components](https://onchainkit.xyz/components) - UI component library
- [Hooks](https://onchainkit.xyz/hooks) - React hooks
- [GitHub](https://github.com/coinbase/onchainkit) - Source code

### Wagmi
Wagmi is a collection of React Hooks for Ethereum.

**Used in this project for:**
- Wallet connections
- Contract interactions
- Transaction management
- Account handling

**Documentation:**
- [Wagmi Documentation](https://wagmi.sh/) - Official docs
- [React Hooks](https://wagmi.sh/react/hooks) - Available hooks
- [Connectors](https://wagmi.sh/react/connectors) - Wallet connectors
- [Base Configuration](https://wagmi.sh/react/chains#base) - Base chain setup

### Viem
Viem is a TypeScript interface for Ethereum with first-class support for Base.

**Documentation:**
- [Viem Documentation](https://viem.sh/) - Official docs
- [Client Setup](https://viem.sh/docs/clients/intro) - Configure clients
- [Base Chain](https://viem.sh/docs/chains/base) - Base integration
- [Actions](https://viem.sh/docs/actions/public/introduction) - Available actions

## APIs and SDKs

### Base APIs
- [JSON-RPC API](https://docs.base.org/api/json-rpc) - Node API reference
- [REST API](https://docs.base.org/api/rest) - REST endpoints

### Indexing and Querying
- [The Graph](https://docs.base.org/tools/the-graph) - Index blockchain data
- [Blockscout API](https://docs.base.org/tools/blockscout) - Block explorer API
- [Alchemy](https://docs.alchemy.com/reference/base-api-quickstart) - Enhanced APIs for Base

### Price Feeds and Oracles
- [Chainlink on Base](https://docs.chain.link/data-feeds/price-feeds/addresses?network=base) - Price feeds
- [Pyth Network](https://docs.pyth.network/price-feeds/contract-addresses/evm#base) - Real-time price data

## Community Resources

### Official Channels
- **Website:** [base.org](https://base.org)
- **Documentation:** [docs.base.org](https://docs.base.org)
- **Discord:** [Join Base Discord](https://discord.gg/buildonbase)
- **Twitter/X:** [@base](https://twitter.com/base)
- **GitHub:** [base-org](https://github.com/base-org)
- **Status Page:** [status.base.org](https://status.base.org)

### Developer Resources
- [Base Blog](https://base.mirror.xyz/) - Technical updates and tutorials
- [Base Builders](https://base.org/builders) - Ecosystem showcase
- [Base Jobs](https://jobs.base.org/) - Career opportunities
- [Base Grants](https://base.org/grants) - Funding opportunities

### Learning Resources
- [Base Tutorials](https://docs.base.org/tutorials) - Step-by-step guides
- [Video Tutorials](https://www.youtube.com/@BuildOnBase) - YouTube channel
- [Sample Apps](https://github.com/base-org/examples) - Example projects
- [Ecosystem Apps](https://www.base.org/ecosystem) - Built on Base

## Package Dependencies

### This Project Uses:
- `@base-org/account`: ^2.0.2 - Base Account integration
- `@base-org/account-ui`: ^1.0.1 - Base Pay UI components
- `@coinbase/onchainkit`: ^1.0.3 - Onchain React components
- `@farcaster/miniapp-core`: ^0.3.8 - Mini app core functionality
- `@farcaster/miniapp-sdk`: ^0.1.9 - Mini app SDK
- `@farcaster/quick-auth`: ^0.0.8 - Quick authentication
- `wagmi`: ^2.16.9 - React Hooks for Ethereum
- `viem`: ^2.37.1 - TypeScript Ethereum library

**Documentation:**
- [View package.json](./package.json) - All dependencies

## Troubleshooting

### Common Issues
- [Debugging Guide](https://docs.base.org/troubleshooting/debugging) - Common problems
- [Network Issues](https://docs.base.org/troubleshooting/network) - Connectivity problems
- [Transaction Errors](https://docs.base.org/troubleshooting/transactions) - TX troubleshooting

### Support
- [Discord Support](https://discord.gg/buildonbase) - Community help
- [GitHub Issues](https://github.com/base-org/base-org.github.io/issues) - Report bugs
- [Stack Overflow](https://stackoverflow.com/questions/tagged/base-network) - Q&A

## Additional References

### Security
- [Security Best Practices](https://docs.base.org/security) - Secure development
- [Auditing Guide](https://docs.base.org/security/auditing) - Contract audits
- [Bug Bounty](https://hackerone.com/coinbase) - Report vulnerabilities

### Performance
- [Optimization Guide](https://docs.base.org/building-with-base/optimization) - Gas optimization
- [Batching Transactions](https://docs.base.org/building-with-base/batching) - Efficient transactions
- [Caching Strategies](https://docs.base.org/building-with-base/caching) - Performance tips

---

**Last Updated:** November 2025

For the most up-to-date information, always refer to [docs.base.org](https://docs.base.org).
