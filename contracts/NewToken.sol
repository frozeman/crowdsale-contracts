pragma solidity ^0.4.8;

//import './LunyrToken.sol';
import './ERC20.sol';
import './SafeMath.sol';

contract OldToken is ERC20 {
    // flag to determine if address is for a real contract or not
    bool public isLunyrToken;
}

contract NewToken is ERC20, SafeMath {

    // flag to determine if address is for a real contract or not
    bool public isNewToken = false;

    // Token information
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;

    bool public upgradeFinalized = false;

    // Upgrade information
    address public upgradeAgent;

    function NewToken(address _upgradeAgent) public {
        isNewToken = true;
        if (_upgradeAgent == 0x0) throw;
        upgradeAgent = _upgradeAgent;
    }

    // Upgrade-related methods
    function createToken(address _target, uint256 _amount) public {
        if (msg.sender != upgradeAgent) throw;
        if (_amount == 0) throw;
        if (upgradeFinalized) throw;

        balances[_target] = safeAdd(balances[_target], _amount);
        totalSupply = safeAdd(totalSupply, _amount);
        Transfer(_target, _target, _amount);
    }

    function finalizeUpgrade() external {
        if (msg.sender != upgradeAgent) throw;
        if (upgradeFinalized) throw;
        // this prevents createToken from being called after finalized
        upgradeFinalized = true;
    }

    // ERC20 interface: transfer _value new tokens from msg.sender to _to
    function transfer(address _to, uint256 _value) returns (bool success) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] = safeSub(balances[msg.sender], _value);
            balances[_to] = safeAdd(balances[_to], _value);
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    // ERC20 interface: transfer _value new tokens from _from to _to
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && safeAdd(balances[_to], _value) > balances[_to]) {
            balances[_to] = safeAdd(balances[_to], _value);
            balances[_from] = safeSub(balances[_from], _value);
            allowed[_from][msg.sender] = safeSub(allowed[_from][msg.sender], _value);
            Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }

    // ERC20 interface: delegate transfer rights of up to _value new tokens from
    // msg.sender to _spender
    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    // ERC20 interface: returns the amount of new tokens belonging to _owner
    // that _spender can spend via transferFrom
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    // ERC20 interface: returns the wmount of new tokens belonging to _owner
    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    /// @dev Fallback function throws to avoid accidentally losing money
    function() payable { throw; }
}

//Test the whole process against this: https://www.kingoftheether.com/contract-safety-checklist.html
contract UpgradeAgent is SafeMath {

    // flag to determine if address is for a real contract or not
    bool public isUpgradeAgent = false;

    // Contract information
    address public owner;

    // Upgrade information
    bool public upgradeHasBegun = false;
    bool public upgradeFinalized = false;
    OldToken public oldToken;
    NewToken public newToken;
    uint256 public originalSupply; // the original total supply of old tokens

    event NewTokenSet(address token);
    event UpgradeHasBegun();
    event InvariantCheck(uint oldTokenSupply, uint newTokenSupply, uint originalSupply, uint value);

    function UpgradeAgent(address _oldToken) {
        if (_oldToken == 0x0) throw;
        owner = msg.sender;
        isUpgradeAgent = true;
        oldToken = OldToken(_oldToken);
        if (!oldToken.isLunyrToken()) throw;
    }

    /// @notice Check to make sure that the current sum of old and
    /// new version tokens is still equal to the original number of old version
    /// tokens
    /// @param _value The number of LUN to upgrade
    function safetyInvariantCheck(uint256 _value) public {
        if (!newToken.isNewToken()) throw; // Abort if new token contract has not been set
        uint oldSupply = oldToken.totalSupply();
        uint newSupply = newToken.totalSupply();
        InvariantCheck(oldSupply, newSupply, originalSupply, _value);
        if (safeAdd(oldSupply, newSupply) != safeSub(originalSupply, _value)) throw;
    }

    /// @notice Gets the original token supply in oldToken.
    /// Called by oldToken after reaching the success state
    function setOriginalSupply() external {
        originalSupply = oldToken.totalSupply();
    }

    /// @notice Sets the new token contract address
    /// @param _newToken The address of the new token contract
    function setNewToken(address _newToken) {
        if (msg.sender != owner) throw;
        if (_newToken == 0x0) throw;
        if (upgradeHasBegun) throw; // Cannot change token after upgrade has begun

        newToken = NewToken(_newToken);
        if (!newToken.isNewToken()) throw;
        NewTokenSet(newToken);
    }

    /// @notice Sets flag to prevent changing newToken after upgrade
    function setUpgradeHasBegun() internal {
      if (!upgradeHasBegun) {
        upgradeHasBegun = true;
        UpgradeHasBegun();
      }
    }

    /// @notice Creates new version tokens from the new token
    /// contract
    /// @param _from The address of the token upgrader
    /// @param _value The number of tokens to upgrade
    function upgradeFrom(address _from, uint256 _value) public {
        if (msg.sender != address(oldToken)) throw; // only upgrade from oldToken
        if (!newToken.isNewToken()) throw; // need a real newToken!
        if (upgradeFinalized) throw; // can't upgrade after being finalized

        setUpgradeHasBegun();
        // Right here oldToken has already been updated, but corresponding
        // LUN have not been created in the newToken contract yet
        safetyInvariantCheck(_value);

        newToken.createToken(_from, _value);

        //Right here totalSupply invariant must hold
        safetyInvariantCheck(0);
    }

    function finalizeUpgrade() public {
        if (msg.sender != address(oldToken)) throw;
        if (upgradeFinalized) throw;

        safetyInvariantCheck(0);

        upgradeFinalized = true;

        newToken.finalizeUpgrade();

    }

    /// @dev Fallback function allows to deposit ether.
    function() public
        payable
    {
      throw;
    }

}
