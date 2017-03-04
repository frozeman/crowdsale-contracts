# Lunyr Contracts

This is the official repository for the crowdsale of Lunyr tokens.


We use SafeMath.sol and ERC20.sol from Zeppelin (thanks!)<br>
NewToken.sol is an example of a new token that we might upgrade to.<br>

We have 1200+ lines of tests. There are two test files:<br>
1. One tests the wallet<br>
2. The other one tests the crowd-sale token contracts.<br>

Instructions<br>
-------------<br>
-2. Open a terminal <br>
-1. <a href="http://lmgtfy.com/?q=how+to+install+npm">Install npm</a><br>
0. Clone the repository "git clone https://github.com/Lunyr/crowdsale-contracts.git" <br>
1. In the repository, run "npm install" <br>
2. Run testrpc (see below)<br>
3. In another terminal, run "truffle test"<br>

The testrpc command we use is

testrpc --testnet --account=0x1024102410241024102410241024102410241024102410241024102410241020,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241021,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241022,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241023,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241024,10000000000000000000000000 --debug

If you don't want to run all the tests, you can just run individual ones

truffle test ./test/LunyrToken.js

If you want to test on the testnet, do the following:

<ol>
  <li> install geth "brew install geth" or "apt-get install ethereum" </li>
  <li> create at least 3 accounts "geth account new"</li>
  <li> get some test ethereum (how?)</li>
  <li> run geth in the terminal: "geth --testnet --rpc --rpcport 45585 --rpcaddr localhost console"</li>
  <li> in the geth console, unlock your default account "personal.unlockAccount(web3.eth.accounts[0])"</li>
  <li> in another terminal, get to the directory where you cloned the repo 'cd crowdsale-contracts/'</li>
  <li> run "truffle migrate --network testnet"</li>
  <li> run "truffle console --network testnet"</li>
  <li> interact with the contracts via <a href="https://github.com/ethereum/wiki/wiki/JavaScript-API">web3</a></li>
</ol>
