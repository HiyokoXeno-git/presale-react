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
        throw new Error("Please switch MetaMask to BSC Mainnet");
    }

    document.getElementById("network").innerText = "BSC Mainnet";
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
        await loadContractConfig();

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

        const [tge, cliffSec, vestingSec] = await Promise.all([
            vestingContract.methods.tgeTimestamp().call(),
            vestingContract.methods.CLIFF_DURATION().call(),
            vestingContract.methods.VESTING_DURATION().call()
        ]);

        if (vestingTgeEl) {
            vestingTgeEl.innerText = formatTimestampToDateTime(tge);
        }

        const cliffEl = document.getElementById("vestingCliff");
        const durationEl = document.getElementById("vestingDuration");

        if (cliffEl) {
            cliffEl.innerText = formatDuration(Number(cliffSec));
        }

        if (durationEl) {
            durationEl.innerText = formatDuration(Number(vestingSec));
        }

        if (tokenContract && vestingBalanceEl) {
            const vestingBalance = await tokenContract.methods
                .balanceOf(CONFIG.vestingAddress)
                .call();

            vestingBalanceEl.innerText = `${formatUnits(vestingBalance, 18)} THK`;
        }
    } catch (err) {
        console.error("loadVestingStatus error:", err);
    }
}

function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return 'Not set';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minute(s)`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hour(s)`;
    return `${Math.round(seconds / 86400)} day(s)`;
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
            claimableEl.innerText = `${formatUnits(claimable, 18)} THK`;
        }

        if (allocatedEl) {
            allocatedEl.innerText = `${formatUnits(vestingInfo.totalAllocated, 18)} THK`;
        }

        if (claimedEl) {
            claimedEl.innerText = `${formatUnits(vestingInfo.claimed, 18)} THK`;
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

async function loadContractConfig() {
    try {
        if (!presaleContract) {
            alert("Connect admin wallet first");
            return;
        }

        const [vestingAddr, signer, treasury, usdtAddr] = await Promise.all([
            presaleContract.methods.vesting().call(),
            presaleContract.methods.priceSigner().call(),
            presaleContract.methods.treasuryWallet().call(),
            presaleContract.methods.usdt().call()
        ]);

        const vestingEl  = document.getElementById("onchainVesting");
        const signerEl   = document.getElementById("onchainSigner");
        const treasuryEl = document.getElementById("onchainTreasury");
        const usdtEl     = document.getElementById("onchainUsdt");

        const expectedVesting = CONFIG.vestingAddress.toLowerCase();

        if (vestingEl) {
            vestingEl.innerText = vestingAddr || "(not set)";
            const match = vestingAddr && vestingAddr.toLowerCase() === expectedVesting;
            vestingEl.style.color = match ? "#16a34a" : "#dc2626";
            vestingEl.title = match ? "Matches config" : "MISMATCH — config expects " + CONFIG.vestingAddress;
        }

        if (signerEl) {
            signerEl.innerText = signer || "(not set)";
            const isZero = !signer || signer === "0x0000000000000000000000000000000000000000";
            signerEl.style.color = isZero ? "#dc2626" : "#16a34a";
        }

        if (treasuryEl) treasuryEl.innerText = treasury || "(not set)";

        if (usdtEl) {
            usdtEl.innerText = usdtAddr || "(not set)";
            const matchUsdt = usdtAddr && usdtAddr.toLowerCase() === CONFIG.usdtAddress.toLowerCase();
            usdtEl.style.color = matchUsdt ? "#16a34a" : "#dc2626";
            usdtEl.title = matchUsdt ? "Matches config" : "MISMATCH — config expects " + CONFIG.usdtAddress;
        }

    } catch (err) {
        console.error("loadContractConfig error:", err);
        alert(err.message);
    }
}

async function setVesting() {
    try {
        if (!presaleContract) {
            alert("Connect admin wallet first");
            return;
        }

        const addr = document.getElementById("vestingAddressInput").value.trim();
        if (!addr) {
            alert("Enter vesting address");
            return;
        }

        const statusEl = document.getElementById("vestingSetStatus");
        if (statusEl) statusEl.innerText = "Sending transaction...";

        await presaleContract.methods
            .setVesting(addr)
            .send({ from: account });

        if (statusEl) {
            statusEl.innerText = "Done! Vesting set to: " + addr;
            statusEl.style.color = "#16a34a";
        }

        await loadContractConfig();

    } catch (err) {
        const statusEl = document.getElementById("vestingSetStatus");
        if (statusEl) {
            statusEl.innerText = "Error: " + err.message;
            statusEl.style.color = "#dc2626";
        }
        console.error("setVesting error:", err);
    }
}

async function loadServerSigner() {
    const serverEl = document.getElementById("serverSigner");
    const matchEl  = document.getElementById("signerMatchStatus");
    const inputEl  = document.getElementById("signerAddressInput");

    if (serverEl) serverEl.innerText = "Checking...";
    if (matchEl)  matchEl.innerText  = "";

    try {
        const res  = await fetch('./api/checkSigner.php');
        const data = await res.json();

        if (!data.success) {
            if (serverEl) serverEl.innerText = "Error: " + data.message;
            return;
        }

        // Recover signer address in-browser using web3 ecrecover
        const recovered = web3.eth.accounts.recover(data.testMsg, data.signature);
        const recoveredLow = recovered.toLowerCase();

        if (serverEl) {
            serverEl.innerText = recovered;
            serverEl.style.color = "#16a34a";
        }

        // Auto-fill the input field for convenience
        if (inputEl && !inputEl.value) {
            inputEl.value = recovered;
        }

        // Compare with on-chain signer
        const onchainEl = document.getElementById("onchainSigner");
        const onchainVal = onchainEl ? onchainEl.innerText.toLowerCase() : "";

        if (onchainVal && onchainVal !== "-" && onchainVal !== "(not set)") {
            const match = onchainVal === recoveredLow;
            if (matchEl) {
                matchEl.innerText  = match
                    ? "✅ priceSigner matches — BNB purchase signatures will be valid."
                    : "❌ MISMATCH — On-chain priceSigner does not match the server key. BNB purchases will fail. Call Set Price Signer with the address above.";
                matchEl.style.color = match ? "#16a34a" : "#dc2626";
            }
        } else {
            if (matchEl) {
                matchEl.innerText  = "⚠️ On-chain priceSigner not loaded yet. Click Refresh Contract Config first.";
                matchEl.style.color = "#d97706";
            }
        }

    } catch (err) {
        if (serverEl) serverEl.innerText = "Error: " + err.message;
        console.error("loadServerSigner error:", err);
    }
}

async function setPriceSigner() {
    try {
        if (!presaleContract) {
            alert("Connect admin wallet first");
            return;
        }

        const addr = document.getElementById("signerAddressInput").value.trim();
        if (!addr) {
            alert("Enter price signer address");
            return;
        }

        const statusEl = document.getElementById("signerSetStatus");
        if (statusEl) statusEl.innerText = "Sending transaction...";

        await presaleContract.methods
            .setPriceSigner(addr)
            .send({ from: account });

        if (statusEl) {
            statusEl.innerText = "Done! Price signer set to: " + addr;
            statusEl.style.color = "#16a34a";
        }

        await loadContractConfig();

    } catch (err) {
        const statusEl = document.getElementById("signerSetStatus");
        if (statusEl) {
            statusEl.innerText = "Error: " + err.message;
            statusEl.style.color = "#dc2626";
        }
        console.error("setPriceSigner error:", err);
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
            el.innerText = `${formatUnits(amount, 18)} THK`;
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

// ── Auth ──────────────────────────────────────────────────────
const TOKEN_KEY = 'admin_token';

async function checkSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { showLogin(); return; }
    try {
        const res = await fetch('./api/adminsession.php?token=' + encodeURIComponent(token));
        const json = await res.json();
        if (json.valid) {
            showDashboard(json.username);
        } else {
            localStorage.removeItem(TOKEN_KEY);
            showLogin();
        }
    } catch(e) { showLogin(); }
}

function showLogin() {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.querySelector('.container').style.display = 'none';
    document.getElementById('logoutBar').style.display = 'none';
}

function showDashboard(username) {
    document.getElementById('loginOverlay').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    const bar = document.getElementById('logoutBar');
    if (bar) bar.style.display = 'flex';
    const el = document.getElementById('loggedInUser');
    if (el) el.textContent = username;
    loadStats();
    loadUsers();
    loadAnnouncements();
    if (typeof loadRoadmap === 'function') loadRoadmap();
}

async function submitLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');
    errEl.style.display = 'none';
    if (!username || !password) { errEl.textContent = 'Enter username and password'; errEl.style.display = 'block'; return; }
    try {
        const res = await fetch('./api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const json = await res.json();
        if (json.success) {
            localStorage.setItem(TOKEN_KEY, json.token);
            showDashboard(json.username);
        } else {
            errEl.textContent = json.message || 'Login failed';
            errEl.style.display = 'block';
        }
    } catch(e) {
        errEl.textContent = 'Network error';
        errEl.style.display = 'block';
    }
}

async function logout() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        fetch('./api/adminsession.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        localStorage.removeItem(TOKEN_KEY);
    }
    showLogin();
}

// ── Announcements ─────────────────────────────────────────────
let editingAnnId = null;

async function loadAnnouncements() {
    const listEl = document.getElementById('annList');
    if (!listEl) return;
    try {
        const res = await fetch('./api/getAnnouncements.php');
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        if (!json.data.length) { listEl.innerHTML = '<p style="color:#888;">No announcements yet.</p>'; return; }
        listEl.innerHTML = json.data.map(a => `
            <div class="ann-item">
                <div>
                    <div class="ann-item-title">${escAnn(a.title)}<span class="ann-badge-${a.is_active ? 'active' : 'inactive'}">${a.is_active ? 'Active' : 'Inactive'}</span></div>
                    <div class="ann-item-body">${escAnn(a.body)}</div>
                    <div class="ann-item-meta">${escAnn(a.time_label || '')} &nbsp;|&nbsp; lang: ${escAnn(a.lang || 'en')}</div>
                </div>
                <div class="ann-item-actions">
                    <button onclick="editAnnouncement(${a.id})">Edit</button>
                    <button style="background:#ef4444;" onclick="deleteAnnouncement(${a.id})">Delete</button>
                </div>
            </div>`).join('');
    } catch(e) {
        if (listEl) listEl.innerHTML = '<p style="color:red;">Error: ' + e.message + '</p>';
    }
}

function editAnnouncement(id) {
    fetch('./api/getAnnouncements.php')
        .then(r => r.json())
        .then(json => {
            const a = json.data.find(x => x.id == id);
            if (!a) return;
            document.getElementById('annEditId').value = a.id;
            document.getElementById('annIcon').value = a.icon || '';
            document.getElementById('annIconBg').value = a.icon_bg || '';
            document.getElementById('annTime').value = a.time_label || '';
            document.getElementById('annTitle').value = a.title || '';
            document.getElementById('annBody').value = a.body || '';
            document.getElementById('annActive').checked = !!a.is_active;
            document.getElementById('annFormTitle').textContent = 'Edit Announcement';
            document.getElementById('annCancelBtn').style.display = '';
            editingAnnId = a.id;
            document.querySelector('.ann-form').scrollIntoView({ behavior: 'smooth' });
        });
}

async function saveAnnouncement() {
    const id = editingAnnId;
    const title = document.getElementById('annTitle').value.trim();
    const body = document.getElementById('annBody').value.trim();
    if (!title || !body) { alert('Title and body are required'); return; }
    const payload = {
        id: id || 0,
        icon: document.getElementById('annIcon').value.trim(),
        icon_bg: document.getElementById('annIconBg').value.trim(),
        time_label: document.getElementById('annTime').value.trim(),
        title, body,
        is_active: document.getElementById('annActive').checked
    };
    try {
        const res = await fetch('./api/saveAnnouncement.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        cancelAnnEdit();
        loadAnnouncements();
    } catch(e) { alert('Error: ' + e.message); }
}

async function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return;
    try {
        const res = await fetch('./api/deleteAnnouncement.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        loadAnnouncements();
    } catch(e) { alert('Error: ' + e.message); }
}

function cancelAnnEdit() {
    editingAnnId = null;
    document.getElementById('annEditId').value = '';
    document.getElementById('annIcon').value = '';
    document.getElementById('annIconBg').value = '';
    document.getElementById('annTime').value = '';
    document.getElementById('annTitle').value = '';
    document.getElementById('annBody').value = '';
    document.getElementById('annActive').checked = true;
    document.getElementById('annFormTitle').textContent = 'Add New Announcement';
    document.getElementById('annCancelBtn').style.display = 'none';
}

function escAnn(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.addEventListener('DOMContentLoaded', checkSession);

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