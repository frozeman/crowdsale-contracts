var MultiSigWallet = artifacts.require("MultiSigWallet");
var LunyrToken = artifacts.require("LunyrToken");
var NewToken = artifacts.require("NewToken");
var UpgradeAgent = artifacts.require("UpgradeAgent");
var LUNVault = artifacts.require("LUNVault");

module.exports = function(deployer) {
  let lunyrMultisig;
  let upgradeMaster;
  let startBlock;
  let endBlock;
  let token;
  deployer.deploy(MultiSigWallet, web3.eth.accounts,3).then(function(){
    lunyrMultisig = MultiSigWallet.address
    upgradeMaster = web3.eth.accounts[0];
    startBlock = web3.eth.blockNumber + 10;
    endBlock = web3.eth.blockNumber + 20;
  }).then(function(){
    return deployer.deploy(LunyrToken, lunyrMultisig, upgradeMaster, startBlock, endBlock);
  }).then(function(){
    return deployer.deploy(LUNVault, LunyrToken.address);
  }).then(function(){
    return deployer.deploy(UpgradeAgent, LunyrToken.address);
  }).then(function(){
    return deployer.deploy(NewToken, UpgradeAgent.address);
  });
};
