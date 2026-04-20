# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `presale-react/presale-react/` (where `package.json` lives).

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

There are no tests configured.

## Architecture

THK/HYK token presale dApp — React 19 + Vite targeting **BSC Testnet (chainId 97)**. Requires MetaMask or WalletConnect in the browser.

### Routing (`src/App.jsx`)
- `/` → `OnePage` — wallet connect landing; navigates to `/presale` on success
- `/presale` → `PresalePage` — the main purchase UI; redirects to `/` if no wallet connected
- Page transitions use a custom `usePageTransition()` hook (340 ms exit animation)

### Config (`src/config/config.js`)
Single `CONFIG` export holds all environment-specific values: contract addresses, chain info, API base URLs, token decimals. **This is the only file to edit when switching networks or deployments.**

### Web3 Layer (`src/services/web3.js`)
All blockchain calls go here. Key patterns:
- `getEthereum()` — resolves the right provider (WalletConnect `_wcProvider` > MetaMask > `window.ethereum`)
- `buyWithUsdt` / `buyWithBnb` — two-phase timeout: 10-min MetaMask confirmation window (phase 1), then 10-min receipt wait after broadcast (phase 2). `err.isMetaMaskTimeout` and `err.txHash` flags are set on failure so callers can show the right modal.
- All contract calls use `Promise.allSettled` for batch fetching (`getPresaleStats`, `getUserStats`)
- `extractRevertReason()` — translates raw Solidity/web3 v4 errors into user-friendly strings

### Wallet Connection (`src/config/appkit.js`)
Uses **Reown AppKit** (WalletConnect v3) via `@reown/appkit` + `@reown/appkit-adapter-ethers`. The `modal` singleton is imported by `web3.js`. `connectWithWalletConnect()` opens the modal and resolves when the user connects or rejects.

### Backend API Layer (`src/services/api.js`)
Two base URLs from `CONFIG`: `presaleApiBaseUrl` and `adminApiBaseUrl`. Key endpoints:
- `session.php` — create/validate/destroy server-side sessions (30-min TTL). Token stored in `localStorage` as `hyk_token`.
- `signBnbQuote.php` — returns signed BNB→USDT quote (price + deadline + signature for contract)
- `savePurchase.php` — records completed purchase in DB
- `getbnbprice.php` — BNB/USD price from CoinMarketCap (server-proxied)
- `getAnnouncements.php`, `getRoadmap.php`, `getStats.php`, `getUsers.php` — read-only data
- `getPresaleTxFromBscscan()` — fetches TX history directly from BSCScan API as fallback

### Purchase Rescue Queue (`src/services/rescueQueue.js`)
Stores confirmed purchase payloads to `localStorage` (`hyk_rescue_queue`) **before** calling `savePurchase`, so records survive browser close / network errors during TX mining. `PresalePage` calls `flushQueue()` on mount to retry any pending saves. Deduplicates by `txHash`.

### Internationalization (`src/i18n/translations.js` + `src/hooks/useLanguage.js`)
All UI strings live in `translations.js`. `useLanguage()` returns `{ t, lang, setLang }`. Language preference is persisted in `localStorage`.

### Decimal Conventions
- USDT: 6 decimals — raw amounts are `BigInt` strings (no BigNumber library)
- THK token: 18 decimals
- Token rate: 1 USDT = 66 THK (contract-driven via `RATE`)
- `getUsdtDecimals()` calls the chain once per session and caches the result; falls back to `CONFIG.usdtDecimals`

## Behavioral Rules

- ALWAYS read a file before editing it
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing an existing file to creating a new one
- NEVER save working files or docs to the root folder
- NEVER commit secrets, credentials, or `.env` files
