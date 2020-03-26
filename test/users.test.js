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
const User = require('../lib/models/user');
var users = rewire('../lib/users');
const mongoose = require('mongoose');
const mailer = require('../lib/mailer');

const sandbox = sinon.createSandbox();

describe('users', () => {
	let sampleUser, mailerStub, findStub, sampleArgs, deleteStub;
	beforeEach(() => {
		sampleUser = {
			id: 123,
			name: 'foo',
			email: 'foobar@gmail.com',
			save: sandbox.stub().resolves(),
		};
		findStub = sandbox
			.stub(mongoose.Model, 'findById')
			.resolves(sampleUser);
		deleteStub = sandbox
			.stub(mongoose.Model, 'remove')
			.resolves('fake_remove_result');
		mailerStub = sandbox
			.stub(mailer, 'sendWelcomeEmail')
			.resolves('fake_email');
	});
	afterEach(() => {
		sandbox.restore();
		users = rewire('../lib/users');
	});
	context('get', () => {
		it('should check for an /id', done => {
			users.get(null, (error, results) => {
				expect(error).to.exist;
				expect(error.message).to.equal('Invalid user id');
				done();
			});
		});
		it('should call findUserById with Id and return result', done => {
			sandbox.restore();
			let stub = sandbox
				.stub(mongoose.Model, 'findById')
				.yields(null, { name: 'foo' });
			users.get(123, (err, result) => {
				expect(err).to.not.exist;
				expect(stub).to.have.been.calledOnce;
				expect(stub).to.have.been.calledWith(123);
				expect(result).to.be.a('object');
				expect(result)
					.to.have.property('name')
					.to.equal('foo');
				done();
			});
		});
		it('should catch error if there is one', done => {
			sandbox.restore();
			let stub = sandbox
				.stub(mongoose.Model, 'findById')
				.yields(new Error('fake'));
			users.get(123, (error, result) => {
				expect(result).to.not.exist;
				expect(error).to.exist;
				expect(error).to.be.instanceOf(Error);
				expect(stub).to.have.been.calledWith(123);
				expect(error.message).to.equal('fake');
				done();
			});
		});
	});
	context('delete', () => {
		it('shoudl check for an id using return', () => {
			return users
				.delete()
				.then(result => {})
				.catch(err => {
					expect(err).to.be.instanceOf(Error);
					expect(err.message).to.equal('Invalid id');
				});
		});
		it('should check for error using eventually', () => {
			return expect(users.delete()).to.eventually.be.rejectedWith(
				'Invalid id'
			);
		});
		it('shoudl call User.remove', async () => {
			let result = await users.delete(123);
			expect(result).to.equal('fake_remove_result');
			expect(deleteStub).to.have.been.calledWith({ _id: 123 });
		});
	});
	context('create', () => {
		let FakeUserClass, saveStub, result;
		beforeEach(async () => {
			saveStub = sandbox.stub().resolves(sampleUser);
			FakeUserClass = sandbox.stub().returns({ save: saveStub });
			users.__set__('User', FakeUserClass);
			result = await users.create(sampleUser);
		});
		it(' should reject invalid args', async () => {
			await expect(users.create()).to.eventually.be.rejectedWith(
				'Invalid arguments'
			);
			await expect(
				users.create({ name: 'foo' })
			).to.eventually.be.rejectedWith('Invalid arguments');
			await expect(
				users.create({ email: 'boo' })
			).to.be.eventually.rejectedWith('Invalid arguments');
		});
		it('should call User with new', () => {
			expect(FakeUserClass).to.have.been.calledWithNew;
			expect(FakeUserClass).to.have.been.calledWith(sampleUser);
		});

		it('should save the user', () => {
			expect(saveStub).to.have.been.called;
		});

		it('should call mailer with email and name', () => {
			expect(mailerStub).to.have.been.calledWith(
				sampleUser.email,
				sampleUser.name
			);
		});

		it('should reject errors', async () => {
			saveStub.rejects(new Error('fake'));

			await expect(
				users.create(sampleUser)
			).to.eventually.be.rejectedWith('fake');
		});
	});
	context('update user', () => {
		it('should find user by id', async () => {
			await users.update(123, { age: 35 });

			expect(findStub).to.have.been.calledWith(123);
		});

		it('should call user.save', async () => {
			await users.update(123, { age: 35 });

			expect(sampleUser.save).to.have.been.calledOnce;
		});

		it('should reject if there is an error', async () => {
			findStub.throws(new Error('fake'));

			await expect(
				users.update(123, { age: 35 })
			).to.eventually.be.rejectedWith('fake');
		});
	});
	context('reset password', () => {
		let resetStub;

		beforeEach(() => {
			resetStub = sandbox
				.stub(mailer, 'sendPasswordResetEmail')
				.resolves('reset');
		});

		it('should check for email', async () => {
			await expect(users.resetPassword()).to.eventually.be.rejectedWith(
				'Invalid email'
			);
		});

		it('should call sendPasswordResetEmail', async () => {
			await users.resetPassword('foo@bar.com');

			expect(resetStub).to.have.been.calledWith('foo@bar.com');
		});
	});
});
