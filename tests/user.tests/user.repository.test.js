const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");

const User = require('../../models/user.model'); 
const UserRepository = require('../../repositories/user.repository')

describe("UserRepository", function() {
    const stubUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
    };


    describe("createUser", function() {
        it("Creating new user in DB", async function() {
            const save = sinon.stub(User.prototype, 'save')
            const user = await UserRepository.createUser(stubUser)
            expect(save.calledOnce).to.be.true;
            expect(user.email).to.equal(stubUser.email);
        });
    });
});