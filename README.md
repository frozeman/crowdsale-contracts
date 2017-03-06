# Lunyr Contracts

This is the official repository for the crowdsale of Lunyr tokens.


We use SafeMath.sol and ERC20.sol from Zeppelin (thanks!)
NewToken.sol is an example of a new token that we might upgrade to.

We have 1200+ lines of tests. There are two test files:
1. One tests the wallet
2. The other one tests the crowd-sale token contracts.

Instructions
-------------
1. Open a terminal
2. [Install npm](http://lmgtfy.com/?q=how+to+install+npm)
3. Clone the repository "git clone https://github.com/Lunyr/crowdsale-contracts.git"
4. In the repository, run "npm install"
5. Run testrpc (see below)
6. In another terminal, run "truffle test"

The testrpc command we use is

```
testrpc --testnet --account=0x1024102410241024102410241024102410241024102410241024102410241020,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241021,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241022,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241023,10000000000000000000000000 --account=0x1024102410241024102410241024102410241024102410241024102410241024,10000000000000000000000000 --debug
```

If you don't want to run all the tests, you can just run individual ones

```
truffle test ./test/LunyrToken.js
```

If you want to test on the testnet, do the following:


1. install geth `brew install geth` or `apt-get install ethereum`
2. create at least 3 accounts `geth account new`
3. get some test ether from http://faucet.ropsten.be:3001
4. run geth in the terminal: `geth --testnet --rpc --rpcport 45585 --rpcaddr localhost console`
5. in the geth console, unlock your default account `personal.unlockAccount(web3.eth.accounts[0])`
6. in another terminal, get to the directory where you cloned the repo `cd crowdsale-contracts/`
7. run `truffle migrate --network testnet`
8. run `truffle console --network testnet`
9. interact with the contracts via [web3](https://github.com/ethereum/wiki/wiki/JavaScript-API)

