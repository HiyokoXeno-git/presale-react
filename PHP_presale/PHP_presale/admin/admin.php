<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">
<title>HDT Presale Admin</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<script src="https://cdn.jsdelivr.net/npm/web3@1.10.4/dist/web3.min.js"></script>

<style>

    body{
    background:#f5f6fa;
    font-family:Arial;
    color:#111;
    margin:0;
    }

    .container{
    max-width:900px;
    margin:auto;
    padding:40px;
    }

    .card{
    background:white;
    padding:25px;
    border-radius:8px;
    margin-bottom:20px;
    border:1px solid #e5e7eb;
    }

    .title{
    font-size:22px;
    margin-bottom:15px;
    }

    .stat{
    margin:8px 0;
    }

    button{
    padding:10px 20px;
    border:none;
    border-radius:6px;
    background:#2563eb;
    color:white;
    cursor:pointer;
    margin-right:10px;
    }

    button:hover{
    background:#1d4ed8;
    }

    .badge{
    background:#ef4444;
    color:white;
    padding:3px 8px;
    border-radius:4px;
    font-size:12px;
    margin-left:10px;
    }

    input{
    padding:10px;
    border:1px solid #ddd;
    border-radius:6px;
    width:250px;
    margin-right:10px;
    }

</style>

</head>

<body>

<div class="container">

    <div class="card">

        <div class="title">
        HDT Presale Admin
        <span class="badge">ADMIN</span>
        </div>

        <button onclick="connectWallet()">Connect Admin Wallet</button>

        <p>Wallet: <span id="wallet">-</span></p>
        <p>Network: <span id="network">-</span></p>

    </div>

    <div class="card">

        <div class="title">Presale Status( Contract Value )</div>

        <div class="stat">
        Sale Active: <span id="saleActive">-</span>
        </div>

        <div class="stat">
        Total Sold: <span id="totalSold">-</span> HDT
        </div>

        <div class="stat">
        Hard Cap: <span id="saleCap">-</span> HDT
        </div>

        <div class="stat">
        Remaining: <span id="remaining">-</span> HDT
        </div>

        <br>

        <button onclick="refreshStatus()">Refresh Status</button>

    </div>

    <div class="card">
        <div class="title">Vesting Status</div>

        <div class="stat">TGE: <span id="vestingTge">-</span></div>
        <div class="stat">Current Vesting Wallet Balance: <span id="vestingBalance">-</span></div>

        <br>

        <input id="claimableWalletInput" placeholder="Wallet address">
        <button onclick="checkClaimable()">Check Claimable</button>

        <div class="stat" style="margin-top:15px;">
            Claimable: <span id="claimableResult">-</span>
        </div>

        <div class="stat" style="margin-top:10px;">
            Total Allocated: <span id="allocatedResult">-</span>
        </div>

        <div class="stat" style="margin-top:10px;">
            Already Claimed: <span id="claimedResult">-</span>
        </div>

    </div>

    <div class="card">
        <style>
            .stats-wrap {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                margin-bottom: 24px;
            }

            .stat-card {
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            }

            .stat-title {
                font-size: 14px;
                color: #666;
                margin-bottom: 8px;
            }

            .stat-value {
                font-size: 28px;
                font-weight: 700;
                color: #111;
            }

            @media (max-width: 900px) {
                .stats-wrap {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>

        <div class="stats-wrap">
            <div class="stat-card">
                <div class="stat-title">Total Purchases</div>
                <div class="stat-value" id="statTotalPurchases">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-title">Total Users</div>
                <div class="stat-value" id="statTotalUsers">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-title">Total USDT</div>
                <div class="stat-value" id="statTotalUsdt">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-title">Total HDT</div>
                <div class="stat-value" id="statTotalToken">0</div>
            </div>
        </div>
    </div>

    <div class="card">

        <style>
            .users-table{
            width:100%;
            border-collapse:collapse;
            font-size:14px;
            background:#fff;
            }

            .users-table th,
            .users-table td{
            border:1px solid #e5e7eb;
            padding:10px;
            text-align:left;
            vertical-align:top;
            }

            .users-table th{
            background:#f3f4f6;
            font-weight:bold;
            }

            .users-table td{
            word-break:break-all;
            }
        </style>

        <div class="title">Purchase History</div>

        <div style="overflow-x:auto;">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Wallet Address</th>
                        <th>TX Hash</th>
                        <th>USDT</th>
                        <th>HDT</th>
                        <th>Block</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                    <tr>
                        <td colspan="7" style="text-align:center;">No data</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <br>
        <button onclick="loadUsers()">Refresh Users</button>

    </div>

    <div class="card">

        <div class="title">Admin Controls</div>

        <button onclick="toggleSale()">Start / Stop Sale</button>
        <span id="saleStatusText" style="margin-left:10px; font-weight:bold;">
            -
        </span>

        <br><br>

        <input id="tgeInput" placeholder="TGE Timestamp (unix)">
        <button onclick="setTGE()">Set TGE</button>

        <a
            href="https://www.epochconverter.com/"
            target="_blank"
            rel="noopener noreferrer"
            style="margin-left:10px; color:#2563eb; text-decoration:none; font-weight:bold;"
        >
            Timestamp Converter
        </a>

    </div>

    <div class="card">

        <div class="title">Excess Token Withdraw</div>

        <div class="stat">
            Withdrawable Excess: <span id="withdrawableExcess">-</span>
        </div>

        <br>

        <button onclick="loadWithdrawableExcess()">Refresh Excess</button>

        <br><br>

        <input id="withdrawTo" placeholder="Recipient wallet address">
        <input id="withdrawAmount" placeholder="Amount (HDT)">
        <button onclick="withdrawExcessTokens()">Withdraw Excess Tokens</button>

    </div>

</div>

<script src="../presale/js/config.js"></script>
<script src="../presale/js/abi.js"></script>
<script src="./admin.js"></script>

</body>
</html>