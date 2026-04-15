const PRESALE_ABI = [
    {
        "inputs": [{"internalType":"uint256","name":"usdtAmount","type":"uint256"}],
        "name":"buy",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"toggleSale",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"saleActive",
        "outputs":[{"internalType":"bool","name":"","type":"bool"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"RATE",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"MIN_PURCHASE",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"MAX_PURCHASE",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"SALE_CAP",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"totalSold",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"usdtAmount","type":"uint256"}],
        "name":"getTokenAmount",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"pure",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"userRemainingUsdt",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"userUsdtSpent",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"userTokenPurchased",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"remainingForSale",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "bnbAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "usdtAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" },
            { "internalType": "bytes", "name": "signature", "type": "bytes" }
        ],
        "name": "buyWithBnb",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "priceSigner",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "newSigner", "type": "address" }
        ],
        "name": "setPriceSigner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "bytes32", "name": "", "type": "bytes32" }
        ],
        "name": "usedDigests",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const VESTING_ABI = [
    {
        "inputs":[],
        "name":"claim",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"claimable",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"tgeTimestamp",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"}],
        "name":"setTGE",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"vestings",
        "outputs":[
            {"internalType":"uint256","name":"totalAllocated","type":"uint256"},
            {"internalType":"uint256","name":"claimed","type":"uint256"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"withdrawableExcess",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[
            {"internalType":"address","name":"to","type":"address"},
            {"internalType":"uint256","name":"amount","type":"uint256"}
        ],
        "name":"withdrawExcessTokens",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"CLIFF_DURATION",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"VESTING_DURATION",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    }
];

const ERC20_ABI = [
    {
        "inputs":[
            {"internalType":"address","name":"spender","type":"address"},
            {"internalType":"uint256","name":"amount","type":"uint256"}
        ],
        "name":"approve",
        "outputs":[{"internalType":"bool","name":"","type":"bool"}],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[
            {"internalType":"address","name":"owner","type":"address"},
            {"internalType":"address","name":"spender","type":"address"}
        ],
        "name":"allowance",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"account","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"decimals",
        "outputs":[{"internalType":"uint8","name":"","type":"uint8"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"symbol",
        "outputs":[{"internalType":"string","name":"","type":"string"}],
        "stateMutability":"view",
        "type":"function"
    }
];