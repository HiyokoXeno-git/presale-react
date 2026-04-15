<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">
<title>HDT Token Presale</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<script src="https://cdn.jsdelivr.net/npm/web3@1.10.4/dist/web3.min.js"></script>

<style>

    body{
        background:#0f172a;
        font-family:Arial;
        color:white;
        margin:0;
    }

    .container{
        max-width:900px;
        margin:auto;
        padding:40px;
    }

    .card{
        background:#1e293b;
        padding:25px;
        border-radius:10px;
        margin-bottom:20px;
    }

    .title{
        font-size:22px;
        margin-bottom:15px;
    }

    .stat{
        margin:6px 0;
    }

    .progress{
        width:100%;
        height:20px;
        background:#334155;
        border-radius:10px;
        overflow:hidden;
        margin-top:10px;
    }

    .progress-bar{
        height:20px;
        background:#22c55e;
        width:0%;
    }

    button{
        padding:10px 20px;
        border:none;
        border-radius:6px;
        background:#3b82f6;
        color:white;
        cursor:pointer;
    }

    input{
        padding:10px;
        border-radius:6px;
        border:none;
        width:200px;
    }

    .log{
        background:#020617;
        padding:10px;
        border-radius:6px;
        font-size:12px;
        white-space:pre-line;
    }

    .countdown{
        font-size:18px;
        color:#22c55e;
    }

</style>

</head>

<body>

<div class="container">

    <div class="card">

        <div class="title">HDT Token Presale</div>

        <button onclick="connectWallet()">Connect Wallet</button>

        <p>Wallet: <span id="wallet">-</span></p>

        <p>Network: <span id="network">-</span></p>

    </div>


<div class="card">

    <div class="title">Presale Stats</div>

    <div class="stat">Token Price : 1 USDT = 66 HDT</div>

    <div class="stat">Total Sold : <span id="totalSold">0</span> HDT</div>

    <div class="stat">Hard Cap : <span id="saleCap">0</span> HDT</div>

    <div class="stat">Remaining : <span id="remaining">0</span> HDT</div>

    <div class="progress">
        <div id="progressBar" class="progress-bar"></div>
    </div>

</div>


<div class="card">

    <div class="title">Your Wallet</div>

    <div class="stat">tUSDT Balance : <span id="usdtBalance">0</span></div>

    <div>BNB Price (USDT): <span id="bnbPrice">-</span></div>

    <div class="stat">Purchased HDT : <span id="purchased">0</span></div>

    <div class="stat">Claimable : <span id="claimable">0</span></div>

    <br>

    <div class="stat">TGE : <span id="tgeStart">-</span></div>

    <br>

    <div class="stat">Cliff End : <span id="cliffEnd">-</span></div>

    <br>

    <div class="stat">Vesting Start : <span id="vestingStart">-</span></div>

    <div class="stat">Vesting End : <span id="vestingEnd">-</span></div>

    <br>

    <div class="stat">Total Allocated : <span id="totalAllocated">0</span> HDT</div>

    <div class="stat">Already Claimed : <span id="alreadyClaimed">0</span> HDT</div>

    <div class="stat">Estimated Release Per Day : <span id="releasePerDay">0</span> HDT</div>

</div>


<div class="card">

    <style>
        .buy-tab-btn {
            padding: 10px 18px;
            border: 1px solid #444;
            background: #1e1e1e;
            color: #ccc;
            cursor: pointer;
            border-radius: 8px;
            margin-right: 8px;
            font-weight: 600;
        }

        .buy-tab-btn.active {
            background: #f5a623;
            color: #111;
            border-color: #f5a623;
        }
    </style>

    <div class="title">Buy HDT</div>

    <div style="margin-bottom:16px;">
        <button type="button" id="tabUsdt" class="buy-tab-btn" onclick="selectBuyTab('USDT')">USDT</button>
        <button type="button" id="tabBnb" class="buy-tab-btn" onclick="selectBuyTab('BNB')">BNB</button>
    </div>

    <div id="approveSection">
        <div class="stat" style="margin-bottom:12px;">
            You must approve USDT spending in MetaMask before purchasing HDT.
        </div>

        <button id="approveFirstButton" onclick="handleApproveFirst()">Approve USDT</button>
    </div>

    <div id="buySection" style="display:none;">

        <div id="usdtBuyBox">
            <div class="stat">Minimum Purchase : 10 USDT</div>

            <br>

            <input id="buyAmount" placeholder="USDT Amount">

            <div style="margin-top:10px">
                Estimated Receive : <span id="estimated">0</span> HDT
            </div>

            <br>

            <button id="buyButton" onclick="buyToken()">Buy HDT</button>
        </div>

        <div id="bnbBuyBox" style="display:none;">
            <div class="stat">Minimum Purchase : 10 USDT equivalent</div>

            <br>

            <input type="text" id="bnbAmount" placeholder="BNB Amount" oninput="updateBnbEstimate()" />

            <div style="margin-top:10px">
                Estimated USDT : <span id="bnbEstimatedUsdt">-</span>
            </div>

            <div style="margin-top:10px">
                Estimated Receive : <span id="bnbEstimatedToken">-</span> HDT
            </div>

            <br>

            <button id="buyBnbButton" onclick="buyTokenByBnb()">Buy with BNB</button>
        </div>

    </div>

</div>


<div class="card">

    <div class="title">Claim Tokens</div>

    <button id="claimButton" onclick="claimToken()">Claim</button>

</div>

<!--
<div class="card">

<div class="title">Logs</div>

<div id="log" class="log"></div>

</div>
-->

</div>

<script src="./js/config.js?v=20260317_01"></script>
<script src="./js/abi.js?v=20260317_01"></script>
<script src="./js/client.js?v=20260317_01"></script>

<div id="messageModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center;">
    <div style="background:#1e293b; color:#fff; width:90%; max-width:420px; padding:24px; border-radius:12px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.35);">
        <div id="messageModalText" style="font-size:16px; line-height:1.6; margin-bottom:20px;"></div>
        <button id="messageModalOk" style="padding:10px 24px; border:none; border-radius:8px; background:#22c55e; color:#fff; cursor:pointer;">
            OK
        </button>
    </div>
</div>

</body>

</html>