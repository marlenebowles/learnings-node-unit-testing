const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');

var demo = rewire('../lib/demo');

describe('demo', () => {
	context('add function', () => {
		it('should test add function', () => {
			expect(demo.add(2, 3)).to.equal(5);
		});
	});
	context('test call function', () => {
		it('should test callback function', done => {
			demo.addCallback(2, 3, (err, result) => {
				expect(err).to.not.exist;
				expect(result).to.equal(5);
				done();
			});
		});
	});
	context('should test asynchronous code', () => {
		it('should add with a promise cb', done => {
			demo.addPromise(2, 3)
				.then(result => {
					expect(result).to.equal(5);
					done();
				})
				.catch(err => {
					done(err);
				});
		});
		it('should test ASYNC await', async () => {
			let result = await demo.addPromise(1, 2);
			expect(result).to.equal(3);
		});
		it('should test async with chai-as-promised', async () => {
			await expect(demo.addPromise(1, 2)).to.eventually.equal(3);
		});

		it('should return a promise', () => {
			return demo.addPromise(1, 2).then(result => {
				expect(result).to.equal(3);
			});
		});
	});
	context('test doubles/spy/stub', () => {
		it('should only be called once', () => {
			let spy = sinon.spy(console, 'log');
			demo.foo();
			expect(spy.calledOnce).to.be.true;
			expect(spy).to.be.calledOnce;
			spy.restore();
		});
		it('should stub console warn', () => {
			let stub = sinon.stub(console, 'warn').callsFake(() => {
				// using callsFake and stubbing to make sure the function is invoked but not actually doing anything
				console.log('message from stub');
			});
			demo.foo();
			expect(stub).to.have.been.calledOnce;
			stub.restore();
		});
	});
	context('test private code', () => {
		// this example uses demo.bar which calls createFile(a promise) and callDB
		it('should stub createFile', async () => {
			let createStub = sinon
				.stub(demo, 'createFile')
				.resolves('create_stub');
			let callStub = sinon.stub().resolves('calldb_stub');

			demo.__set__('callDB', callStub);

			let result = await demo.bar('test.txt');

			expect(result).to.equal('calldb_stub');
			expect(createStub).to.have.been.calledOnce;
			expect(createStub).to.have.been.calledWith('test.txt');
			expect(callStub).to.have.been.calledOnce;
		});
	});
});
