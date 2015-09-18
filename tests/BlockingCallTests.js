var assert = require("assert");
var Thoth = require("../Thoth");

describe('Thoth', function() {
  describe('during blocking call', function() {
    beforeEach(function(done) {
	  Thoth.stopTime();
	  done();
	});
	
	afterEach(function(done) {
	  Thoth.startTime().then(done, done);
	});

    it('expires all timeouts at once in proper order', function(done) {
	  var calls = [];
	  setTimeout(function() {
	    assert.equal(process.uptime(), 5);
		calls.push(1);
	  }, 1000);
	  
	  setTimeout(function() {
	    assert.equal(process.uptime(), 5);
	    calls.push(2);
	  }, 2000);
	
	  Thoth.blockSystem(5000).then(function() {
	    assert.deepEqual([1,2], calls);
	  }).then(done, done);
	});
	
	it('calls intervals only once if system is blocked', function(done) {
	  var calls = [];
	  setTimeout(function() {
	    calls.push(1);
	  }, 100);
	  
	  setInterval(function() {
	    calls.push(2);  
	  }, 100);
	  
	  setTimeout(function() {
	    calls.push(0);
	  }, 50);
	  
	  setInterval(function() {
	    calls.push(3);
	  }, 200);
	  
	  Thoth.blockSystem(1000)
	    .then(function() {
		  assert.deepEqual([0,1,2,3], calls);
		}).then(done, done);
	});
	
	it('does not give precedence to setImmediates', function(done) {
	  var calls = [];
	  setImmediate(function() {
	    calls.push(1);
	    setImmediate(function() {
		  calls.push(2);
		});
	  });
	  
	  setTimeout(function() {
	    calls.push(3);
	  }, 40);
	  
	  Thoth.blockSystem(1000).then(function() {
	    assert.deepEqual([1,3,2], calls);
	  }).then(done, done);
	});

    it('rejects negative time', function(done) {
      Thoth.blockSystem(-1).then(function() {
	    assert(false);
  	  }, function() {
	    done();
	  });
    });
  });
});