// Tests for LunyrToken.sol
// One contract for each state in our state machine
// At least one "it" for each function call
// States: Before Crowdsale, During Crowdsale, Successful Crowdsale, Failed Crowdsale, Update
// Functions: transfer, upgrade, setUpgradeAgent, setUpgradeMaster, create, refund, allowance, finalizeCrowdfunding, totalSupply,balanceOf, allowance, fundingNow

let utils = require("./utils/utils.js");

// contracts
let LunyrToken = artifacts.require('LunyrToken');
let LUNVault = artifacts.require('LUNVault');
let MultiSigWallet = artifacts.require('MultiSigWallet');
let UpgradeAgent = artifacts.require('UpgradeAgent');
let NewToken = artifacts.require('NewToken');



contract('Crowdsale', function(accounts){
  let prefix = 'Before Crowdsale --';
  // ---------------------------------------------
  // ------------- BEFORE CROWDSALE --------------
  // ---------------------------------------------
  it(prefix + 'getState returns PreFunding', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return token.getState();
    }).then(function(state){
      assert.equal(state, utils.crowdsaleState.PREFUNDING);
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transfer', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.assertThrows(token.transfer(accounts[0], 1), "expected transfer to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transferFrom', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.assertThrows(token.transferFrom(accounts[0], accounts[1], 1), "expected transferFrom to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows upgrade', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = web3.eth.accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.upgrade(accounts[0], 1), "expected upgrade to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = web3.eth.accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.approve(accounts[0], 1), "expected approve to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows setUpgradeAgent', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.setUpgradeAgent(accounts[0]), "expected setUpgradeAgent to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows setUpgradeMaster', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.setUpgradeMaster(accounts[1]), "expected setUpgradeMaster to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows create', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.create(), "expected create to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows refund', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.refund(), "expected refund to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows finalizeCrowdfunding', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.finalizeCrowdfunding(), "expected finalizeCrowdfunding to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows totalSupply, which is 0', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return token.totalSupply();
    }).then(function(supply){
      assert.equal(supply, 0);
    }).then(done).catch(done);
  });
  it(prefix + 'allows balanceOf, which is 0', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      for (let i = 0; i < accounts.length; i++){
        token.balanceOf(accounts[i]).then(function(balance){
          assert.equal(balance, 0);
        });
      }
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      return utils.assertThrows(token.approve(accounts[0],1), "expected approve to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows allowance, which is 0', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 10;
      const endBlock = startBlock + 1;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      for (let i = 0; i < accounts.length; i++){
        for (let j = 0; j < accounts.length; j++){
          token.allowance(accounts[i], accounts[j]).then(function(allowed){
            assert.equal(allowed, 0);
          });
        }
      }
    }).then(done).catch(done);
  });
  // // // // ---------------------------------------------
  // // // // ------------- DURING CROWDSALE --------------
  // // // // ---------------------------------------------
  prefix = 'During Crowdsale --';
  it(prefix + 'getState returns Funding', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.getState();
    }).then(function(state){
      return assert.equal(state, utils.crowdsaleState.FUNDING);
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transfer', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 2;
      const endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.transfer(accounts[0], 1), "expected transfer to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transferFrom', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 2;
      const endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.transferFrom(accounts[0], accounts[1], 1), "expected transferFrom to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows upgrade', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = web3.eth.accounts[0];
      const startBlock = web3.eth.blockNumber + 2;
      const endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.upgrade(accounts[0], 1), "expected upgrade to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = web3.eth.accounts[0];
      const startBlock = web3.eth.blockNumber + 2;
      const endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.approve(accounts[0], 1), "expected approve to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows setUpgradeAgent', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 2;
      const endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.setUpgradeAgent(accounts[0]), "expected setUpgradeAgent to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows setUpgradeMaster', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 2;
      const endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      return utils.assertThrows(token.setUpgradeMaster(accounts[1]), "expected setUpgradeMaster to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows create', function(done) {
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      const startBlock = web3.eth.blockNumber + 2;
      const endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineOneBlock();
      utils.mineOneBlock();
      token.create({ value: 1 });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows creation of too many tokens', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMax().then(function(tokenMax){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMax.div(exchangeRate);
        });
      }).then(function(maxWeiForSuccess){
        // TODO: should assert that we have this much wei too

        return utils.assertThrows(token.create({ from: accounts[0], value: maxWeiForSuccess.add(1) }), "expected create to fail");
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows refund', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return utils.assertThrows(token.refund(), "expected refund to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'disallows finalizeCrowdfunding', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      utils.assertThrows(token.finalizeCrowdfunding(), "expected finalizeCrowdfunding to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows totalSupply', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      // create some tokens
      return token.create({ value: web3.toWei(1, 'ether') }).then(function(){
        return token.totalSupply().then(function(supply){
          return token.tokensPerEther().then(function(exchangeRate){
            assert.equal(web3.fromWei(supply, 'ether'), exchangeRate.toNumber());
          });
        });
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows balanceOf', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      // create some tokens
      return token.create({ value: web3.toWei(1, 'ether') }).then(function(){
        return token.balanceOf(accounts[0]).then(function(balance){
          return token.tokensPerEther().then(function(exchangeRate){
            assert.equal(web3.fromWei(balance, 'ether'), exchangeRate.toNumber());
          });
        });
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      utils.assertThrows(token.approve(accounts[0],1), "expected approve to fail");
    }).then(done).catch(done);
  });
  it(prefix + 'allows allowance, which is 0', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 10;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      for (let i = 0; i < accounts.length; i++){
        for (let j = 0; j < accounts.length; j++){
          token.allowance(accounts[i], accounts[j]).then(function(allowed){
            assert.equal(allowed, 0);
          });
        }
      }
    }).then(done).catch(done);
  });
  // // // // ---------------------------------------------
  // // // // ------------- SUCCESSFUL CROWDSALE ----------
  // // // // ---------------------------------------------
  prefix = 'Successful Crowdsale --';
  it(prefix + 'getState returns Success after tokenCreationMax', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMax().then(function(tokenMax){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMax.div(exchangeRate);
        });
      }).then(function(maxWeiForSuccess){
        return token.create({ from: accounts[0], value: maxWeiForSuccess });
      }).then(function(){
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        return token.getState();
      }).then(function(state){
        assert.equal(state, utils.crowdsaleState.SUCCESS);
      });
    }).then(done).catch(done);
  });
  it(prefix + 'getState returns Success after fundingEndBlock', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMin.div(exchangeRate);
        });
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        return token.getState();
      }).then(function(state){
        assert.equal(state, utils.crowdsaleState.SUCCESS);
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows transfer and balanceOf', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          let minWeiForSuccess = tokenMin.div(exchangeRate);
          return token.create({ from: accounts[0], value: minWeiForSuccess });
        }).then(function(){
          utils.mineToBlockHeight(endBlock);
          // success
          return token.finalizeCrowdfunding();
        }).then(function(){
          return token.transfer(accounts[1], 1);
        }).then(function(){
          return token.balanceOf(accounts[1]);
        }).then(function(balance){
          assert.equal(balance.toNumber(), 1);
        }).then(function(){
          return token.balanceOf(accounts[0]);
        }).then(function(balance){
          assert.equal(balance.sub(tokenMin.sub(1)).toNumber(), 0);
        });
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows upgrade', function(done) {
    let startBlock;
    let endBlock;
    let upgradeMaster;
    let newToken;
    let token;
    let upgradeAgent;
    let agentOwner;
    let tokenMinimum;
    let upgradeGasEstimate;
    let finalizeGasEstimate;

    MultiSigWallet.new(accounts, 3).then(function(wallet){
      upgradeMaster = accounts[0];
      agentOwner = upgradeMaster;
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(instance){
      token = instance;
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        tokenMinimum = tokenMin;
        return token.tokensPerEther().then(function(exchangeRate){
          let minWeiForSuccess = tokenMin.div(exchangeRate);
          return token.create({ from: accounts[0], value: minWeiForSuccess });
        });
      });
    }).then(function(){
      utils.mineToBlockHeight(endBlock);
      // success
      return token.finalizeCrowdfunding();
    }).then(function(){
      // can't upgrade before we set the upgradeAgent
      utils.assertThrows(token.upgrade(1, {from: accounts[0]}), 'expected upgrade to fail')
      return token.getState();
    }).then(function(state){
      assert.equal(state, utils.crowdsaleState.SUCCESS);
      // can't finalizeUpgrade until we set upgradeAgent
      utils.assertThrows(token.finalizeUpgrade({from: upgradeMaster}), 'expected finalizeUpgrade to fail');
      return UpgradeAgent.new(token.address, {from: agentOwner});
    }).then(function(agent){
      upgradeAgent = agent;
      return token.setUpgradeAgent(upgradeAgent.address, {from: upgradeMaster});
    }).then(function(receipt){
      return upgradeAgent.owner();
    }).then(function(owner){
      // check that the owner is who we think it should be
      assert.equal(owner, agentOwner);
      return NewToken.new(upgradeAgent.address);
    }).then(function(newTok){
      newToken = newTok;
      return newToken.upgradeAgent();
    }).then(function(agent){
      // in == out
      assert.equal(agent, upgradeAgent.address);
      return newToken.balanceOf(upgradeAgent.address);
    }).then(function(balance){
      // empty before doing anything
      assert.equal(balance, 0);
      return upgradeAgent.originalSupply();
    }).then(function(originalSupply){
      return token.totalSupply().then(function(actualSupply){
        // does the original supply match our known supply? Add endowment
        assert.equal(originalSupply.toNumber(), actualSupply.toNumber());
      });
    }).then(function(){
      return upgradeAgent.oldToken();
    }).then(function(oldToken){
      // does the oldToken match the token we gave it?
      assert.equal(oldToken, token.address);
      return upgradeAgent.setNewToken(newToken.address, {from: agentOwner});
    }).then(function(receipt){
      return upgradeAgent.newToken();
    }).then(function(newTok){
      // does the newToken match the one we gave it?
      assert.equal(newTok, newToken.address);
      functionData = utils.getFunctionEncoding('upgrade(uint256)',[1]);
      return web3.eth.estimateGas({to: token.address, data:functionData});
    }).then(function(gasEstimate){
      upgradeGasEstimate = gasEstimate + utils.gasEpsilon;
      return token.upgrade(1, {from: accounts[0], gas: upgradeGasEstimate });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event,'Transfer');
      assert.equal(receipt.logs[1].event,'Upgrade');
    }).then(function(){
      // can't upgrade 0 tokens
      utils.assertThrows(token.upgrade(0, {from: accounts[0], gas: upgradeGasEstimate}), 'expected upgrade to fail because 0');
      // can't upgrade tokens you don't have
      utils.assertThrows(token.upgrade(1, {from: accounts[1], gas: upgradeGasEstimate}), 'expected upgrade to fail because too much');
      // can't finalizeUpgrade unless you are upgradeMaster
      utils.assertThrows(token.finalizeUpgrade({from: accounts[1]}), 'expected finalizeUpgrade to fail');
      functionData = utils.getFunctionEncoding('finalizeUpgrade()',[]);
      return web3.eth.estimateGas({to: token.address, data:functionData});
    }).then(function(gasEstimate){
      finalizeGasEstimate = gasEstimate + utils.gasEpsilon;
      return token.finalizeUpgrade({from: upgradeMaster, gas: finalizeGasEstimate});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1);
      assert.equal(receipt.logs[0].event,'UpgradeFinalized');
      // can't finalizeUpgrade twice
      utils.assertThrows(token.finalizeUpgrade({from: upgradeMaster}), 'expected finalizeUpgrade to fail');
      // can't upgrade after finalized
      utils.assertThrows(token.upgrade(1, {from: accounts[0], gas: finalizeGasEstimate}), 'expected upgrade to fail finalized');
    }).then(done).catch(done);
  });
  it(prefix + 'allows setUpgradeAgent', function(done) {
    let startBlock;
    let endBlock;
    let upgradeMaster;
    let token;
    let agentOwner;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      upgradeMaster = accounts[0];
      agentOwner = upgradeMaster;
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(instance){
      token = instance;
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMin.div(exchangeRate);
        });
      });
    }).then(function(minWeiForSuccess){
      return token.create({ from: accounts[0], value: minWeiForSuccess });
    }).then(function(){
      // success
      utils.mineToBlockHeight(endBlock);
      return token.finalizeCrowdfunding();
    }).then(function(){
      return UpgradeAgent.new(token.address, {from: agentOwner});
    }).then(function(agent){
      upgradeAgent = agent;
      return token.setUpgradeAgent(upgradeAgent.address, {from:upgradeMaster});
    }).then(function() {
      return token.upgradeAgent();
    }).then(function(agent){
      assert.equal(upgradeAgent.address, agent);
    }).then(function(){
      // can't do it from non-upgradeMaster
      utils.assertThrows(token.setUpgradeAgent(upgradeAgent.address, {from:accounts[3]}), 'must setUpgradeAgent from upgradeMaster');
      utils.assertThrows(token.setUpgradeAgent(accounts[3], {from:upgradeMaster}), 'must setUpgradeAgent to an actual UpgradeAgent');
      utils.assertThrows(token.setUpgradeAgent(0), 'must setUpgradeAgent to non-zero address');
    }).then(done).catch(done);
  });
  it(prefix + 'allows setUpgradeMaster', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    let upgradeMaster = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMin.div(exchangeRate);
        });
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        utils.assertThrows(token.setUpgradeMaster(accounts[2], {from:accounts[3]}), 'expected setUpgradeMaster to fail');
        utils.assertThrows(token.setUpgradeMaster(0), 'expected setUpgradeMaster to fail');
      }).then(function(){
        return token.setUpgradeMaster(accounts[1], {from:accounts[0]})
      }).then(function(){
        return token.upgradeMaster();
      }).then(function(master){
        assert.equal(master, accounts[1]);
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows create', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMin.div(exchangeRate);
        });
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        utils.assertThrows(token.create({from: accounts[0], value: 1 }), 'expected create to fail');
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows refund', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMin.div(exchangeRate);
        });
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        utils.assertThrows(token.refund(), 'expected refund to fail');
      });
    }).then(done).catch(done);
  });
  it(prefix + 'allows finalizeCrowdfunding', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMin.div(exchangeRate);
        });
      }).then(function(minWeiForSuccess){
        return token.create({ from: accounts[0], value: minWeiForSuccess });
      }).then(function(){
        utils.mineToBlockHeight(endBlock);
        // success
        return token.finalizeCrowdfunding();
      }).then(function(){
        utils.assertThrows(token.finalizeCrowdfunding(), 'expected finalizeCrowdfunding to fail');
      });
    }).then(done).catch(done);
  });
   it(prefix + 'vault works correctly', function(done){
     let startBlock;
     let endBlock;
     let upgradeMaster = accounts[0];
     let vault;
     let wallet;
     let token;
     let minWeiForSuccess;
     MultiSigWallet.new(accounts, 3).then(function(instance){
       wallet = instance;
       startBlock = web3.eth.blockNumber + 2;
       endBlock = startBlock + 4;
       return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
     }).then(function(instance){
       token = instance;
       utils.mineToBlockHeight(startBlock);
       return token.tokenCreationMin().then(function(tokenMin){
         return token.tokensPerEther().then(function(exchangeRate){
           return tokenMin.div(exchangeRate);
         });
       });
     }).then(function(minWei){
       minWeiForSuccess = minWei;
       return token.create({ from: accounts[0], value: minWeiForSuccess });
     }).then(function(receipt){
       assert.equal(receipt.logs.length, 1);
       assert.equal(receipt.logs[0].event,'Transfer');
       return token.timeVault();
     }).then(function(vaultAddress){
       return LUNVault.at(vaultAddress);
     }).then(function(v){
       vault = v;
       return web3.eth.getBalance(wallet.address);
     }).then(function(balance){
       return token.balanceOf(vault.address);
     }).then(function(lunBalance){
       assert.equal(lunBalance.toNumber(), 0);
       // success
       utils.mineToBlockHeight(endBlock);
       return token.finalizeCrowdfunding();
     }).then(function(){
       return web3.eth.getBalance(wallet.address);
     }).then(function(balance){
       assert.equal(balance.toNumber(), minWeiForSuccess.toNumber());
       return web3.eth.sendTransaction({ from:accounts[2], to:vault.address, value: web3.toWei(1, 'ether') });
     }).then(function(receipt){
       return web3.eth.getBalance(vault.address);
     }).then(function(balance){
       assert.equal(balance, web3.toWei(1, 'ether'));
       return token.balanceOf(vault.address);
     }).then(function(lunBalance){
       return token.totalSupply().then(function(supply){
          // check our 15% endowment
          assert.equal(lunBalance.toNumber(), supply.mul(0.15).toNumber());
       })
     }).then(function(){
       // can't unlock until it's time
       return utils.assertThrows(vault.unlock(), 'expected unlock to fail');
     }).then(function(){
       // mine to block height to unlock vault
       return utils.mineToBlockHeight(web3.eth.blockNumber + utils.numBlocksLocked);
     }).then(function(){
       // payment should be disabled now
       // return utils.assertThrows(web3.eth.sendTransaction({from:accounts[3], to:vault.address, value: web3.toWei(1, 'ether')}));
     }).then(function(){
       // unlock should be enabled now
       return vault.unlock();
     }).then(function(){
       return token.balanceOf(vault.address);
     }).then(function(lunBalance){
       // should be 0, we just unlocked it all
       assert.equal(lunBalance.toNumber(), 0);
       return web3.eth.getBalance(vault.address);
     }).then(function(balance){
       // no eth either, gone with the unlock
       assert.equal(balance, 0);
       return web3.eth.getBalance(wallet.address);
     }).then(function(balance){
       // we transfered our eth to the multisig wallet
       assert.equal(balance.toNumber(), minWeiForSuccess.add(web3.toWei(1, 'ether')).toNumber());
     }).then(done).catch(function(){
       console.log('Did you forget to change the lock time in LunyrToken.sol?');
       assert.fail();
     });
   });
  it(prefix + 'allows totalSupply', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMax().then(function(tokenMax){
        return token.tokensPerEther().then(function(exchangeRate){
          return tokenMax.div(exchangeRate);
        }).then(function(maxWeiForSuccess){
          return token.create({ from: accounts[0], value: maxWeiForSuccess });
        }).then(function(){
          // success, this creates a 22% endowment
          return token.finalizeCrowdfunding();
        }).then(function(){
          // totalSupply is in LUN-wei == 11 * wei
          return token.totalSupply();
        }).then(function(actualSupply){
          expectedSupply = tokenMax.div(1 - .22);
          assert.equal(actualSupply.toNumber(), expectedSupply.toNumber());
        });
      });
    }).then(done).catch(done);
  });
  it(prefix + 'approve, allowance and transferFrom enabled', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      return token.tokenCreationMin().then(function(tokenMin){
        return token.tokensPerEther().then(function(exchangeRate){
          let minWeiForSuccess = tokenMin.div(exchangeRate);
          return token.create({ from: accounts[0], value: minWeiForSuccess });
        }).then(function(){
          // success
          utils.mineToBlockHeight(endBlock);
          // let 1 spend 0's money
          return token.approve(accounts[1], 2, {from:accounts[0]});
        }).then(function(){
          return token.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
          assert.equal(allowance.toNumber(), 2);
          return token.allowance(accounts[1], accounts[0]);
        }).then(function(allowance){
          assert.equal(allowance.toNumber(), 0);
          // 1 will send 2 tokens from 0 to 2
          return token.transferFrom(accounts[0], accounts[2], 2, {from:accounts[1]});
        }).then(function(receipt){
          assert.equal(receipt.logs.length, 1);
          assert.equal(receipt.logs[0].event, 'Transfer')
          return token.transferFrom(accounts[0], accounts[2], 2, {from:accounts[1]});
        }).then(function(receipt){
          // this fails because we already depleted our allowance
          assert.equal(receipt.logs.length, 0);
          token.approve(accounts[1], 2, {from:accounts[0]});
        }).then(function(){
          return token.transferFrom(accounts[0], accounts[2], 3, {from:accounts[1]});
        }).then(function(receipt){
          assert.equal(receipt.logs.length, 0);
          token.balanceOf(accounts[2]).then(function(balance){
            assert.equal(balance.toNumber(), 2);
          });
          token.balanceOf(accounts[0]).then(function(balance){
            assert.equal(balance.sub(tokenMin.sub(2)).toNumber(), 0);
          });
        });
      });
    }).then(done).catch(done);
  });
  // // // ---------------------------------------------
  // // // ------------- FAILED CROWDSALE --------------
  // // // ---------------------------------------------
  prefix = 'Failed Crowdsale --';
  it(prefix + 'getState returns Failed after fundingEndBlock', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(endBlock + 1);
      // failure
      return token.getState();
    }).then(function(state){
      assert.equal(state, utils.crowdsaleState.FAILURE);
    }).then(done).catch(done);
  });
  it(prefix + 'allows refund', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    let initialBalance;
    let gasUsed = 0;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      initialBalance = web3.eth.getBalance(refundee);
      token.create({ from: refundee, value: 60000 }).then(function(receipt){
        gasUsed += receipt.receipt.gasUsed;
        // failure
        utils.mineToBlockHeight(endBlock + 1);
        utils.assertThrows(token.refund({ from:accounts[0] }), 'expected refund to fail');
      }).then(function(){
        return token.refund({ from: refundee });
      }).then(function(receipt){
        gasUsed += receipt.receipt.gasUsed;
        newBalance = web3.eth.getBalance(refundee);
        gasDiff = gasUsed * 1e11;
        assert.equal(initialBalance.sub(newBalance).toNumber() - gasDiff, 0);
        return token.balanceOf.call(refundee);
      }).then(function(balance){
        assert.equal(balance.toNumber(), 0);
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows transfer', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      token.create({ from:accounts[0], value: 1 }).then(function(){
        utils.mineToBlockHeight(endBlock + 1);
        utils.assertThrows(token.transfer(accounts[1], 1, { from:accounts[0] }));
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows upgrade', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      utils.mineToBlockHeight(startBlock);
      token.create({ from:accounts[0], value: 1 }).then(function(){
        utils.mineToBlockHeight(endBlock + 1);
        utils.assertThrows(token.upgrade(0, 1, { from:accounts[0] }));
      });
    }).then(done).catch(done);
  });
  it(prefix + 'disallows setUpgradeAgent', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      // failure
      utils.mineToBlockHeight(endBlock + 1);
      utils.assertThrows(token.setUpgradeAgent(accounts[1], { from:accounts[0] }));
    }).then(done).catch(done);
  });
  it(prefix + 'disallows setUpgradeMaster', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      // failure
      utils.mineToBlockHeight(endBlock + 1);
      utils.assertThrows(token.setUpgradeMaster(accounts[1], { from:accounts[0] }));
    }).then(done).catch(done);
  });
  it(prefix + 'disallows create', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      // failure
      utils.mineToBlockHeight(endBlock + 1);
      utils.assertThrows(token.create({ from:accounts[0], value: 1 }));
    }).then(done).catch(done);
  });
  it(prefix + 'disallows finalizeCrowdfunding', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      // failure
      utils.mineToBlockHeight(endBlock + 1);
      utils.assertThrows(token.finalizeCrowdfunding({ from:accounts[0]}));
    }).then(done).catch(done);
  });
  it(prefix + 'disallows approve', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(token){
      // failure
      utils.mineToBlockHeight(endBlock + 1);
      utils.assertThrows(token.approve(accounts[1], 1, { from:accounts[0]}));
    }).then(done).catch(done);
  });
  it(prefix + 'allows totalSupply', function(done) {
    let startBlock = 0;
    let endBlock = 0;
    const refundee = accounts[4];
    let token;
    let exchangeRate;
    MultiSigWallet.new(accounts, 3).then(function(wallet){
      const upgradeMaster = accounts[0];
      startBlock = web3.eth.blockNumber + 2;
      endBlock = startBlock + 4;
      return LunyrToken.new(wallet.address, upgradeMaster, startBlock, endBlock);
    }).then(function(instance){
      token = instance;
      utils.mineToBlockHeight(startBlock);
      return token.create({ from:accounts[0], value: 1 });
    }).then(function(){
      utils.mineToBlockHeight(endBlock + 1);
      return token.tokensPerEther();
    }).then(function(rate){
      exchangeRate = rate;
      return token.totalSupply.call();
    }).then(function(supply){
      assert.equal(supply.toNumber(), exchangeRate);
      return token.balanceOf.call(accounts[0]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), exchangeRate);
    }).then(done).catch(done);
  });
});
