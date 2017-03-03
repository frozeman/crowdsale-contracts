pragma solidity ^0.4.8;

import './ERC20.sol';
import './SafeMath.sol';
import './MultiSigWallet.sol';

contract UpgradeAgent is SafeMath {
  address public owner;
  bool public isUpgradeAgent;
  function upgradeFrom(address _from, uint256 _value) public;
  function finalizeUpgrade() public;
  function setOriginalSupply() public;
}

/// @title Time-locked vault of tokens allocated to Lunyr after 180 days
contract LUNVault is SafeMath {

    // flag to determine if address is for a real contract or not
    bool public isLUNVault = false;

    LunyrToken lunyrToken;
    address lunyrMultisig;
    uint256 unlockedAtBlockNumber;
    // 1296000 blocks = 6 months * 30 days / month * 24 hours / day * 60 minutes / hour * 60 seconds / minute / 12 seconds per block
    //uint256 public constant numBlocksLocked = 1296000;
    // smaller lock for testing
    uint256 public constant numBlocksLocked = 12;

    /// @notice Constructor function sets the Lunyr Multisig address and
    /// total number of locked tokens to transfer
    function LUNVault(address _lunyrMultisig) internal {
        if (_lunyrMultisig == 0x0) throw;
        lunyrToken = LunyrToken(msg.sender);
        lunyrMultisig = _lunyrMultisig;
        isLUNVault = true;
        unlockedAtBlockNumber = safeAdd(block.number, numBlocksLocked); // 180 days of blocks later
    }

    /// @notice Transfer locked tokens to Lunyr's multisig wallet
    function unlock() external {
        // Wait your turn!
        if (block.number < unlockedAtBlockNumber) throw;
        // Will fail if allocation (and therefore toTransfer) is 0.
        if (!lunyrToken.transfer(lunyrMultisig, lunyrToken.balanceOf(this))) throw;
        // Otherwise ether are trapped here, we could disallow payable instead...
        if (!lunyrMultisig.send(this.balance)) throw;
    }

    // disallow payment after unlock block
    function () payable {
        if (block.number >= unlockedAtBlockNumber) throw;
    }

}

/// @title Lunyr crowdsale contract
contract LunyrToken is SafeMath, ERC20 {

    // flag to determine if address is for a real contract or not
    bool public isLunyrToken = false;

    // State machine
    enum State{PreFunding, Funding, Success, Failure}

    // Token information
    string public constant name = "Lunyr Token";
    string public constant symbol = "LUN";
    uint256 public constant decimals = 18;  // decimal places
    uint256 public constant endowmentPercentOfTotal = 22;
    uint256 public constant vaultPercentOfTotal = 15;
    uint256 public constant lunyrPercentOfTotal = 7;
    uint256 public constant hundredPercent = 100;

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

    // Upgrade information
    bool public finalizedUpgrade = false;
    address public upgradeMaster;
    UpgradeAgent public upgradeAgent;
    uint256 public totalUpgraded;

    // Crowdsale information
    bool public finalizedCrowdfunding = false;
    uint256 public fundingStartBlock; // crowdsale start block
    uint256 public fundingEndBlock; // crowdsale end block
    uint256 public constant tokensPerEther = 10; // LUN:ETH exchange rate
    uint256 public constant tokenCreationMax = safeMul(800000 ether, tokensPerEther);
    uint256 public constant tokenCreationMin = safeMul(30000 ether, tokensPerEther);
    // for testing on testnet
    //uint256 public constant tokenCreationMax = safeMul(10 ether, tokensPerEther);
    //uint256 public constant tokenCreationMin = safeMul(3 ether, tokensPerEther);

    address public lunyrMultisig;
    LUNVault public timeVault; // Lunyr's time-locked vault

    event Upgrade(address indexed _from, address indexed _to, uint256 _value);
    event Refund(address indexed _from, uint256 _value);
    event UpgradeFinalized(address sender, address upgradeAgent);
    event UpgradeAgentSet(address agent);

    // For mainnet, startBlock = 3445888, endBlock = 3618688
    function LunyrToken(address _lunyrMultisig,
                        address _upgradeMaster,
                        uint256 _fundingStartBlock,
                        uint256 _fundingEndBlock) {

        if (_lunyrMultisig == 0) throw;
        if (_upgradeMaster == 0) throw;
        if (_fundingStartBlock <= block.number) throw;
        if (_fundingEndBlock   <= _fundingStartBlock) throw;
        isLunyrToken = true;
        upgradeMaster = _upgradeMaster;
        fundingStartBlock = _fundingStartBlock;
        fundingEndBlock = _fundingEndBlock;
        timeVault = new LUNVault(_lunyrMultisig);
        if (!timeVault.isLUNVault()) throw;
        lunyrMultisig = _lunyrMultisig;
        if (!MultiSigWallet(lunyrMultisig).isMultiSigWallet()) throw;
    }

    function balanceOf(address who) constant returns (uint) {
        return balances[who];
    }

    /// @notice Transfer `value` LUN tokens from sender's account
    /// `msg.sender` to provided account address `to`.
    /// @notice This function is disabled during the funding.
    /// @dev Required state: Success
    /// @param to The address of the recipient
    /// @param value The number of LUN to transfer
    /// @return Whether the transfer was successful or not
    function transfer(address to, uint256 value) returns (bool ok) {
        if (getState() != State.Success) throw; // Abort if crowdfunding was not a success.
        uint256 senderBalance = balances[msg.sender];
        if (senderBalance >= value && value > 0) {
            senderBalance = safeSub(senderBalance, value);
            balances[msg.sender] = senderBalance;
            balances[to] = safeAdd(balances[to], value);
            Transfer(msg.sender, to, value);
            return true;
        }
        return false;
    }

    /// @notice Transfer `value` LUN tokens from sender 'from'
    /// to provided account address `to`.
    /// @notice This function is disabled during the funding.
    /// @dev Required state: Success
    /// @param from The address of the sender
    /// @param to The address of the recipient
    /// @param value The number of LUN to transfer
    /// @return Whether the transfer was successful or not
    function transferFrom(address from, address to, uint value) returns (bool ok) {
        if (getState() != State.Success) throw; // Abort if not in Success state.
        // protect against wrapping uints
        if (balances[from] >= value &&
            allowed[from][msg.sender] >= value &&
            safeAdd(balances[to], value) > balances[to])
        {
            balances[to] = safeAdd(balances[to], value);
            balances[from] = safeSub(balances[from], value);
            allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], value);
            Transfer(from, to, value);
            return true;
        } else { return false; }
    }

    /// @notice `msg.sender` approves `spender` to spend `value` tokens
    /// @param spender The address of the account able to transfer the tokens
    /// @param value The amount of wei to be approved for transfer
    /// @return Whether the approval was successful or not
    function approve(address spender, uint256 value) returns (bool ok) {
        if (getState() != State.Success) throw; // Abort if not in Success state.
        allowed[msg.sender][spender] = value;
        Approval(msg.sender, spender, value);
        return true;
    }

    /// @param owner The address of the account owning tokens
    /// @param spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens allowed to spent
    function allowance(address owner, address spender) constant returns (uint) {
        return allowed[owner][spender];
    }

    // Token upgrade functionality

    /// @notice Upgrade tokens to the new token contract.
    /// @dev Required state: Success
    /// @param value The number of tokens to upgrade
    function upgrade(uint256 value) external {
        if (getState() != State.Success) throw; // Abort if not in Success state.
        if (upgradeAgent.owner() == 0x0) throw; // need a real upgradeAgent address
        if (finalizedUpgrade) throw; // cannot upgrade if finalized

        // Validate input value.
        if (value == 0) throw;
        if (value > balances[msg.sender]) throw;

        // update the balances here first before calling out (reentrancy)
        balances[msg.sender] = safeSub(balances[msg.sender], value);
        totalSupply = safeSub(totalSupply, value);
        totalUpgraded = safeAdd(totalUpgraded, value);
        upgradeAgent.upgradeFrom(msg.sender, value);
        Upgrade(msg.sender, upgradeAgent, value);
    }

    /// @notice Set address of upgrade target contract and enable upgrade
    /// process.
    /// @dev Required state: Success
    /// @param agent The address of the UpgradeAgent contract
    function setUpgradeAgent(address agent) external {
        if (getState() != State.Success) throw; // Abort if not in Success state.
        if (agent == 0x0) throw; // don't set agent to nothing
        if (msg.sender != upgradeMaster) throw; // Only a master can designate the next agent
        upgradeAgent = UpgradeAgent(agent);
        if (!upgradeAgent.isUpgradeAgent()) throw;
        // this needs to be called in success condition to guarantee the invariant is true
        upgradeAgent.setOriginalSupply();
        UpgradeAgentSet(upgradeAgent);
    }

    /// @notice Set address of upgrade target contract and enable upgrade
    /// process.
    /// @dev Required state: Success
    /// @param master The address that will manage upgrades, not the upgradeAgent contract address
    function setUpgradeMaster(address master) external {
        if (getState() != State.Success) throw; // Abort if not in Success state.
        if (master == 0x0) throw;
        if (msg.sender != upgradeMaster) throw; // Only a master can designate the next master
        upgradeMaster = master;
    }

    /// @notice finalize the upgrade
    /// @dev Required state: Success
    function finalizeUpgrade() external {
        if (getState() != State.Success) throw; // Abort if not in Success state.
        if (upgradeAgent.owner() == 0x0) throw; // we need a valid upgrade agent
        if (msg.sender != upgradeMaster) throw; // only upgradeMaster can finalize
        if (finalizedUpgrade) throw; // can't finalize twice

        finalizedUpgrade = true; // prevent future upgrades

        upgradeAgent.finalizeUpgrade(); // call finalize upgrade on new contract
        UpgradeFinalized(msg.sender, upgradeAgent);
    }

    // Crowdfunding:

    // don't just send ether to the contract expecting to get tokens
    function() payable { throw; }


    /// @notice Create tokens when funding is active.
    /// @dev Required state: Funding
    /// @dev State transition: -> Funding Success (only if cap reached)
    function create() payable external {
        // Abort if not in Funding Active state.
        // The checks are split (instead of using or operator) because it is
        // cheaper this way.
        if (getState() != State.Funding) throw;

        // Do not allow creating 0 or more than the cap tokens.
        if (msg.value == 0) throw;

        // multiply by exchange rate to get newly created token amount
        uint256 createdTokens = safeMul(msg.value, tokensPerEther);

        // don't go over the limit!
        if (safeAdd(createdTokens, totalSupply) > tokenCreationMax) throw;

        // we are creating tokens, so increase the totalSupply
        totalSupply = safeAdd(totalSupply, createdTokens);

        // Assign new tokens to the sender
        balances[msg.sender] = safeAdd(balances[msg.sender], createdTokens);

        // Log token creation event
        Transfer(0, msg.sender, createdTokens);
    }

    /// @notice Finalize crowdfunding
    /// @dev If cap was reached or crowdfunding has ended then:
    /// create LUN for the Lunyr Multisig and developer,
    /// transfer ETH to the Lunyr Multisig address.
    /// @dev Required state: Success
    function finalizeCrowdfunding() external {
        // Abort if not in Funding Success state.
        if (getState() != State.Success) throw; // don't finalize unless we won
        if (finalizedCrowdfunding) throw; // can't finalize twice (so sneaky!)

        // prevent more creation of tokens
        finalizedCrowdfunding = true;

        // Add endowment tokens
        // totalSupply = totalSupply + endowmentTokens
        totalSupply = safeDiv(safeMul(totalSupply, hundredPercent), safeSub(hundredPercent, endowmentPercentOfTotal));

        // Now that endowment is added, just take percentages from totalSupply
        // Endowment: 15% of total goes to vault, timelocked for 6 months
        uint256 vaultTokens = safeDiv(safeMul(totalSupply, vaultPercentOfTotal), hundredPercent);
        balances[timeVault] = safeAdd(balances[timeVault], vaultTokens);
        Transfer(0, timeVault, vaultTokens);

        // Endowment: 7% of total goes to lunyr for marketing and bug bounty
        uint256 lunyrTokens = safeDiv(safeMul(totalSupply, lunyrPercentOfTotal), hundredPercent);
        balances[lunyrMultisig] = safeAdd(balances[lunyrMultisig], lunyrTokens);
        Transfer(0, lunyrMultisig, lunyrTokens);

        // Transfer ETH to the Lunyr Multisig address.
        if (!lunyrMultisig.send(this.balance)) throw;
    }

    /// @notice Get back the ether sent during the funding in case the funding
    /// has not reached the minimum level.
    /// @dev Required state: Failure
    function refund() external {
        // Abort if not in Funding Failure state.
        if (getState() != State.Failure) throw;

        uint256 lunValue = balances[msg.sender];
        if (lunValue == 0) throw;
        balances[msg.sender] = 0;
        totalSupply = safeSub(totalSupply, lunValue);

        uint256 ethValue = safeDiv(lunValue, tokensPerEther); // lunValue % tokensPerEther == 0
        Refund(msg.sender, ethValue);
        if (!msg.sender.send(ethValue)) throw;
    }

    /// @notice This manages the crowdfunding state machine
    /// We make it a function and do not assign the result to a variable
    /// So there is no chance of the variable being stale
    function getState() public constant returns (State){
      if (block.number < fundingStartBlock) return State.PreFunding;
      else if (block.number <= fundingEndBlock && totalSupply < tokenCreationMax) return State.Funding;
      else if (totalSupply >= tokenCreationMin) return State.Success;
      else return State.Failure;
    }
}
