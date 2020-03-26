const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

// describe a function or state
describe('Array', function() {
	// describe a function or state
	describe('#indexOf()', function() {
		// It should do something
		it('should return -1 when the value is not present', function() {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
	context('this is a pending test', () => {
		it('this has one argument');
	});
});
