# Lunyr Contracts

This is the official repository for the crowdsale of Lunyr tokens.


We use SafeMath.sol and ERC20.sol from Zeppelin (thanks!)<br>
NewToken.sol is an example of a new token that we might upgrade to.<br>

We have 1200+ lines of tests. There are two test files:<br>
1. One tests the wallet<br>
2. The other one tests the crowd-sale token contracts.<br>

Instructions<br>
-------------<br>
1. Run npm install<br>
1. Run testrpc<br>
2. Run truffle test<br>

If you don't want to run all the tests, you can do

truffle test ./test/LunyrToken.js
