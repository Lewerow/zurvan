var Zurvan = require("../Zurvan");
var FieldOverrider = require("../detail/FieldOverrider");
var assert = require("assert");

describe('Zurvan', function() {
  describe('by default', function() {
    beforeEach(function(done) {
	  Zurvan.stopTime().then(done, done);
	});
	afterEach(function(done) {
	  Zurvan.startTime().then(done);
	});
	
    it('denies timers that use eval (they do not work in nodejs)', function(done) {
      try {	  
	    setTimeout("global.timeoutCalled = true", 75);
        done(new Error("Shouldn't accept timer with eval call!"));
	  }
	  catch(err) {
	    done();
	  }
    });

	it('executes immediately when setting timer without time', function(done) {
	  var called;
	  setTimeout(function() {called = true;}, {invalid:"type",of:"dueTime"});
	  assert.equal(0, process.uptime());
	  
      Zurvan.expireAllTimeouts().then(function() {
	    assert(called === true);
      }).then(done, done);
	});
  });
  
  describe('under special configuration', function() { 
    var timeoutCalledOverrider;
    var intervalCalledOverrider;
    beforeEach(function() {
	  timeoutCalledOverrider = new FieldOverrider(global, "timeoutCalled", false);
      intervalCalledOverrider = new FieldOverrider(global, "intervalCalled", 0);
    });
	
	afterEach(function() {
	  timeoutCalledOverrider.restore();
	  intervalCalledOverrider.restore();
	});
	
    it('timer or interval set with string will be evaluated if configured to', function(done) {
      Zurvan.stopTime({acceptEvalTimers: true}).then(function() {
	    setTimeout("global.timeoutCalled = true", 75);
	    setInterval("global.intervalCalled = global.intervalCalled || 0; ++global.intervalCalled;", 50);
        return Zurvan.advanceTime(100);
	  }).then(function() {
	      assert(global.intervalCalled === 2);
	      assert(global.timeoutCalled === true);
    	  return Zurvan.startTime();
	  }).then(done, done);
	});
	
	it('', function(done) {
	  var called;
	  Zurvan.stopTime({denyImplicitTimer: true}).then(function() {
	    setTimeout(function(){called = true;}, function(){});
	  }).then(function() {
	    return done(new Error("Implicit timer shall be denied and setting timer shall throw"));
	  }, function() {
     	return Zurvan.startTime().then(done, done);
	  });
	});
  });
});