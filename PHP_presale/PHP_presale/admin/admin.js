let web3;
let account = null;

let presaleContract;
let vestingContract;

let tokenContract;

function formatUnits(value, decimals = 18) {
    const divisor = BigInt(10) ** BigInt(decimals);
    const v = BigInt(value);
    const integer = v / divisor;
    const fraction = v % divisor;

    let f = fraction.toString().padStart(decimals, "0");
    f = f.replace(/0+$/, "");

    return f ? `${integer}.${f}` : `${integer}`;
}

function formatNumber(value) {
    return Number(value).toLocaleString();
}

async function ensureBsc() {
    const chainId = await window.ethereum.request({
        method: "eth_chainId"
    });

    if (chainId !== CONFIG.chainHex) {
        throw new Error("Please switch MetaMask to BSC Testnet");
    }

    document.getElementById("network").innerText = "BSC Testnet";
}

async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("MetaMask required");
            return;
        }

        await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        await ensureBsc();

        web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();
        account = accounts[0];

        document.getElementById("wallet").innerText = account;

        presaleContract = new web3.eth.Contract(
            PRESALE_ABI,
            CONFIG.presaleAddress
        );

        vestingContract = new web3.eth.Contract(
            VESTING_ABI,
            CONFIG.vestingAddress
        );

        tokenContract = new web3.eth.Contract(
            ERC20_ABI,
            CONFIG.tokenAddress
        );

        await loadPresaleStatus();
        await loadStats();
        await loadUsers();
        await loadVestingStatus();
        await loadWithdrawableExcess();

    } catch (err) {
        alert(err.message);
    }
}

async function loadPresaleStatus() {
    if (!presaleContract) return;

    const [
        saleActive,
        totalSold,
        saleCap,
        remaining
    ] = await Promise.all([
        presaleContract.methods.saleActive().call(),
        presaleContract.methods.totalSold().call(),
        presaleContract.methods.SALE_CAP().call(),
        presaleContract.methods.remainingForSale().call()
    ]);

    document.getElementById("saleActive").innerText =
        saleActive ? "YES" : "NO";

    const saleStatusText = document.getElementById("saleStatusText");
    if (saleStatusText) {
        saleStatusText.innerText = saleActive ? "Current Status: OPEN" : "Current Status: CLOSED";
        saleStatusText.style.color = saleActive ? "#16a34a" : "#dc2626";
    }

    document.getElementById("totalSold").innerText =
        formatUnits(totalSold, 18);

    document.getElementById("saleCap").innerText =
        formatUnits(saleCap, 18);

    document.getElementById("remaining").innerText =
        formatUnits(remaining, 18);
}

async function loadVestingStatus() {
    try {
        if (!vestingContract) return;

        const vestingTgeEl = document.getElementById("vestingTge");
        const vestingBalanceEl = document.getElementById("vestingBalance");

        const tge = await vestingContract.methods
            .tgeTimestamp()
            .call();

        if (vestingTgeEl) {
            vestingTgeEl.innerText = formatTimestampToDateTime(tge);
        }

        if (tokenContract && vestingBalanceEl) {
            const vestingBalance = await tokenContract.methods
                .balanceOf(CONFIG.vestingAddress)
                .call();

            vestingBalanceEl.innerText = `${formatUnits(vestingBalance, 18)} HDT`;
        }
    } catch (err) {
        console.error("loadVestingStatus error:", err);
    }
}

function formatTimestampToDateTime(timestamp) {
    const ts = Number(timestamp);

    if (!ts || ts <= 0) {
        return 'Not set';
    }

    const date = new Date(ts * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function checkClaimable() {
    try {
        if (!vestingContract) {
            alert("Connect admin wallet first");
            return;
        }

        const wallet = document.getElementById("claimableWalletInput").value.trim();
        if (!wallet) {
            alert("Enter wallet address");
            return;
        }

        const [claimable, vestingInfo] = await Promise.all([
            vestingContract.methods.claimable(wallet).call(),
            vestingContract.methods.vestings(wallet).call()
        ]);

        const claimableEl = document.getElementById("claimableResult");
        const allocatedEl = document.getElementById("allocatedResult");
        const claimedEl = document.getElementById("claimedResult");

        if (claimableEl) {
            claimableEl.innerText = `${formatUnits(claimable, 18)} HDT`;
        }

        if (allocatedEl) {
            allocatedEl.innerText = `${formatUnits(vestingInfo.totalAllocated, 18)} HDT`;
        }

        if (claimedEl) {
            claimedEl.innerText = `${formatUnits(vestingInfo.claimed, 18)} HDT`;
        }
        
    } catch (err) {
        console.error("checkClaimable error:", err);
        alert(err.message);
    }
}

async function loadStats() {
    try {
        const response = await fetch('./api/getStats.php');
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to load stats');
        }

        const data = result.data;

        const totalPurchasesEl = document.getElementById('statTotalPurchases');
        const totalUsersEl = document.getElementById('statTotalUsers');
        const totalUsdtEl = document.getElementById('statTotalUsdt');
        const totalTokenEl = document.getElementById('statTotalToken');

        if (totalPurchasesEl) {
            totalPurchasesEl.innerText = formatNumber(data.totalPurchases);
        }

        if (totalUsersEl) {
            totalUsersEl.innerText = formatNumber(data.totalUsers);
        }

        if (totalUsdtEl) {
            totalUsdtEl.innerText = formatNumber(data.totalUsdt);
        }

        if (totalTokenEl) {
            totalTokenEl.innerText = formatNumber(data.totalToken);
        }
    } catch (err) {
        console.error("loadStats error:", err);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('./api/getUsers.php');
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to load users');
        }

        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        const rows = result.data || [];

        if (rows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">No data</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = rows.map(row => `
            <tr>
                <td>${row.id}</td>
                <td>${row.wallet_address}</td>
                <td>${row.tx_hash}</td>
                <td>${Number(row.usdt_amount).toLocaleString()}</td>
                <td>${Number(row.token_amount).toLocaleString()}</td>
                <td>${row.block_number}</td>
                <td>${row.created_at}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('loadUsers error:', err);
    }
}

async function refreshStatus() {
    await loadPresaleStatus();
    await loadStats();
    await loadUsers();
    await loadVestingStatus();
}

async function toggleSale() {
    try {
        if (!presaleContract) return;

        await presaleContract.methods
            .toggleSale()
            .send({ from: account });

        await loadPresaleStatus();
        await loadStats();

    } catch (err) {
        alert(err.message);
    }
}

async function setTGE() {
    try {
        if (!vestingContract) return;

        const tge = document.getElementById("tgeInput").value;

        if (!tge) {
            alert("Enter TGE timestamp");
            return;
        }

        await vestingContract.methods
            .setTGE(tge)
            .send({ from: account });
        
        await loadVestingStatus();

        alert("TGE set");

    } catch (err) {
        alert(err.message);
    }
}

async function loadWithdrawableExcess() {
    try {
        if (!vestingContract) return;

        const amount = await vestingContract.methods
            .withdrawableExcess()
            .call();

        const el = document.getElementById("withdrawableExcess");
        if (el) {
            el.innerText = `${formatUnits(amount, 18)} HDT`;
        }
    } catch (err) {
        console.error("loadWithdrawableExcess error:", err);
    }
}

async function withdrawExcessTokens() {
    try {
        if (!vestingContract) {
            alert("Connect admin wallet first");
            return;
        }

        const to = document.getElementById("withdrawTo").value.trim();
        const amountInput = document.getElementById("withdrawAmount").value.trim();

        if (!to) {
            alert("Enter recipient wallet address");
            return;
        }

        if (!amountInput) {
            alert("Enter withdraw amount");
            return;
        }

        const amountWei = web3.utils.toWei(amountInput, "ether");

        await vestingContract.methods
            .withdrawExcessTokens(to, amountWei)
            .send({ from: account });

        await loadVestingStatus();
        await loadWithdrawableExcess();

        alert("Excess token withdrawal completed");
    } catch (err) {
        console.error("withdrawExcessTokens error:", err);
        alert(err.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadStats();
    loadUsers();
});

if (window.ethereum) {
    window.ethereum.on("accountsChanged", function (accounts) {
        account = accounts[0] || null;

        document.getElementById("wallet").innerText =
            account || "-";

        if (account) {
            loadPresaleStatus();
        }
    });

    window.ethereum.on("chainChanged", function () {
        location.reload();
    });
}