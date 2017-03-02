let TestContract = artifacts.require('TestContract');
let TestContract2 = artifacts.require('TestContract2');


contract('example', function(accounts){

  it('fails', function(done) {
    let test;
    let test2;
    TestContract.new().then(function(instance){
      test = instance;
      return TestContract2.new();
    }).then(function(instance){
      test2 = instance;
      return test.setIt(test2.address);
    }).then(function(){
      return test.callIt(4);
    }).then(function(){
      return test2.aa();
    }).then(function(aa){
      assert.equal(aa.toNumber(), 4);
    }).then(done);
  });
});
