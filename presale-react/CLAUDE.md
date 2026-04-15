# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Layout

The actual source lives one level deeper than the workspace root:

```
presale-react/          ← workspace root (here)
└── presale-react/      ← real project root (package.json, src/, etc.)
    └── src/
        ├── abi/        ← Smart contract ABIs (presale, vesting, token, USDT)
        ├── components/ ← Reusable UI components
        ├── config/     ← config.js: contract addresses, chain info, API base URLs
        ├── pages/      ← Route-level page components
        └── services/   ← web3.js (blockchain calls), api.js (backend calls), format.js
```

All `npm` commands must be run from `presale-react/presale-react/`.

## Commands

```bash
cd presale-react

# Development server (HMR)
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

There are no tests configured.

## Architecture

This is an HDT token presale dApp built with React 19 + Vite, targeting **BSC Testnet (chainId 97)**. It requires MetaMask in the browser.

### Routing (`App.jsx`)
- `/` → `OnePage` — wallet connect landing page; navigates to `/presale` on success
- `/presale` → `PresalePage` — redirects back to `/` if no wallet is connected

### Web3 Layer (`src/services/web3.js`)
All blockchain interactions go through here. Key functions:
- `getEthereum()` — handles multi-provider environments (e.g., MetaMask + other wallets)
- `connectWallet()` / `getCurrentAccount()` / `getCurrentChainId()` — wallet state
- `approveUsdt()` / `getUsdtAllowance()` — USDT ERC-20 approval flow
- `buyWithUsdt(account, usdtAmountRaw)` — direct USDT purchase
- `buyWithBnb(account, bnbAmountWei, usdtAmountRaw, deadline, signature)` — BNB purchase via signed quote

### Backend API Layer (`src/services/api.js`)
Two PHP endpoints on `CONFIG.presaleApiBaseUrl` / `CONFIG.adminApiBaseUrl`:
- `signBnbQuote.php` — returns a signed quote (BNB→USDT conversion + signature for the contract)
- `savePurchase.php` — records a completed purchase in the database

### Config (`src/config/config.js`)
Single `CONFIG` object holds all environment-specific values: contract addresses, chain details, API base URLs, and token decimals. **This is the only file to update when switching networks or deployments.**

### Purchase Flow
- **USDT**: Check allowance → if zero, prompt `Approve USDT` first → enter amount (min 10 USDT) → `buyWithUsdt` → `savePurchase`
- **BNB**: Enter BNB amount → debounced call to `fetchBnbQuote` (300 ms) → quote includes deadline + backend signature → `buyWithBnb` (sends `bnbAmountWei` as `msg.value`) → `savePurchase`. Quote is refreshed automatically if expired.

### Decimal conventions
- USDT: 6 decimals (`usdtDecimals: 6`)
- HDT token: 18 decimals (`tokenDecimals: 18`)
- Token rate: 1 USDT = 66 HDT (hardcoded in `PresalePage` helpers)
- Raw USDT amounts are plain strings of the integer representation (no BigNumber library — uses native `BigInt`)
