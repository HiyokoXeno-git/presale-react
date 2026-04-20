let web3;
let account = null;
let presaleContract;
let vestingContract;

function logMessage(msg) {
    const el = document.getElementById("log");
    el.innerText = `[${new Date().toLocaleTimeString()}] ${msg}\n` + el.innerText;
}

function formatUnits(value, decimals = 18) {
    value = value.toString();
    const divisor = BigInt(10) ** BigInt(decimals);
    const bigintValue = BigInt(value);

    const integerPart = bigintValue / divisor;
    const fractionalPart = bigintValue % divisor;

    let fraction = fractionalPart.toString().padStart(decimals, "0");
    fraction = fraction.replace(/0+$/, "");
    return fraction ? `${integerPart}.${fraction}` : `${integerPart}`;
}

async function ensureBscTestnet() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== CONFIG.chainHex) {
        throw new Error("MetaMask를 BSC Testnet(ChainId 97)으로 변경해주세요.");
    }
    document.getElementById("network").innerText = "BSC Testnet";
}

async function connectAdmin() {
    try {
        if (!window.ethereum) {
            alert("MetaMask is required.");
            return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        await ensureBscTestnet();

        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];

        presaleContract = new web3.eth.Contract(PRESALE_ABI, CONFIG.presaleAddress);
        vestingContract = new web3.eth.Contract(VESTING_ABI, CONFIG.vestingAddress);

        document.getElementById("wallet").innerText = account;
        logMessage("Admin wallet connected");

        await loadAdminData();
    } catch (err) {
        logMessage("Wallet connection failed: " + err.message);
    }
}

async function loadAdminData() {
    try {
        if (!account) {
            logMessage("먼저 지갑을 연결해주세요.");
            return;
        }

        const [
            saleActive,
            totalSold,
            saleCap,
            remainingSale,
            tgeTimestamp
        ] = await Promise.all([
            presaleContract.methods.saleActive().call(),
            presaleContract.methods.totalSold().call(),
            presaleContract.methods.SALE_CAP().call(),
            presaleContract.methods.remainingForSale().call(),
            vestingContract.methods.tgeTimestamp().call()
        ]);

        const text =
`Sale Active: ${saleActive}
Total Sold: ${formatUnits(totalSold, 18)} THK
Sale Cap: ${formatUnits(saleCap, 18)} THK
Remaining For Sale: ${formatUnits(remainingSale, 18)} THK
TGE Timestamp: ${tgeTimestamp}`;

        document.getElementById("adminStatus").innerText = text;
        logMessage("관리자 상태 조회 완료");
    } catch (err) {
        logMessage("상태 조회 실패: " + err.message);
    }
}

async function toggleSale() {
    try {
        if (!account) {
            logMessage("먼저 지갑을 연결해주세요.");
            return;
        }

        logMessage("toggleSale executed");
        await presaleContract.methods
            .toggleSale()
            .send({ from: account });

        logMessage("toggleSale completed");
        await loadAdminData();
    } catch (err) {
        logMessage("toggleSale failed: " + err.message);
    }
}

async function setTGE() {
    try {
        if (!account) {
            logMessage("먼저 지갑을 연결해주세요.");
            return;
        }

        const timestamp = document.getElementById("tgeTimestamp").value.trim();
        if (!timestamp) {
            alert("Please enter timestamp.");
            return;
        }

        logMessage(`setTGE 실행: ${timestamp}`);
        await vestingContract.methods
            .setTGE(timestamp)
            .send({ from: account });

        logMessage("setTGE completed");
        await loadAdminData();
    } catch (err) {
        logMessage("setTGE failed: " + err.message);
    }
}

if (window.ethereum) {
    window.ethereum.on("accountsChanged", function (accounts) {
        account = accounts[0] || null;
        document.getElementById("wallet").innerText = account || "-";
        if (account) loadAdminData();
    });

    window.ethereum.on("chainChanged", function () {
        location.reload();
    });
}