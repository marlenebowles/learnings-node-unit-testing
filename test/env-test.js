const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

require('dotenv').config();

describe('env modes', () => {
	it('should be dev mode', () => {
		expect(process.env.NODE_ENV).to.equal('development');
	});
});
