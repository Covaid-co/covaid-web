process.env.NODE_ENV = 'test';

const expect = require("chai").expect;
const request = require('supertest');
const sinon = require('sinon');
const faker = require('faker');

const app = require('../../app');
const conn = require('../../db/index');

describe("User API", function() {

    describe("Registering a new user", function() {
        this.timeout(10000);
        const user = {
            email: faker.internet.email(),
            personal_info: {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                pronouns: 'He/Him',
                phone: faker.phone.phoneNumber(),
                car: faker.random.boolean(),
                timesAvailable: ['Morning'],
                languages: ['English']
            },
            offer: {
                tasks: ['Food/Groceries'],
                availability: faker.random.boolean(),
                details: faker.lorem.sentence()
            },
            password: faker.internet.password(),
            location_info: {
                location: [faker.address.longitude(), faker.address.latitude()],
                neighborhoods: [faker.address.county()],
                state: [faker.address.state()],
                association: faker.random.uuid(),
                association_name: faker.random.words()
            },
            logistics: {
                verified: faker.random.boolean(),
                agreedToTerms: faker.random.boolean(),
                note: faker.lorem.sentence()
            },
        }
        before((done) => {
            conn.connect()
                .then(() => done())
                .catch((err) => done(err));
        })

        after((done) => {
            conn.close()
                .then(() => done())
                .catch((err) => done(err));
        })

        it('OK, creating a new user works', (done) => {           
            request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const body = res.body;
                    const code = res.status;
                    expect(code).to.equal(201);
                    expect(body).to.contain.property('_id');
                    done();
                })
            .catch((err) => done(err));
        });

    });

    describe("Unable to register using if missing information", function() {
        this.timeout(10000);
        const user = {
            email: faker.internet.email(),
            personal_info: {
                pronouns: 'He/Him',
                phone: faker.phone.phoneNumber(),
                car: faker.random.boolean(),
                timesAvailable: ['Morning'],
                languages: ['English']
            },
            offer: {
                tasks: ['Food/Groceries'],
                availability: faker.random.boolean(),
                details: faker.lorem.sentence()
            },
            password: faker.internet.password(),
            location_info: {
                location: [faker.address.longitude(), faker.address.latitude()],
                neighborhoods: [faker.address.county()],
                state: [faker.address.state()],
                association: faker.random.uuid(),
                association_name: faker.random.words()
            },
            logistics: {
                verified: faker.random.boolean(),
                agreedToTerms: faker.random.boolean(),
                note: faker.lorem.sentence()
            },
        }
        before((done) => {
            conn.connect()
                .then(() => done())
                .catch((err) => done(err));
        })

        after((done) => {
            conn.close()
                .then(() => done())
                .catch((err) => done(err));
        })

        it('Fail, users requires all personal information', (done) => {            
            request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const body = res.body;
                    const code = res.status;
                    expect(body.errors['personal_info'].name).to.equal('ValidationError');
                    expect(code).to.equal(422);
                    done();
                })
            .catch((err) => done(err));
        });
    });

    describe("Login will not work for unverified users", function() {
        this.timeout(10000);
        let email = faker.internet.email();
        let password = faker.internet.password();
        const user = {
            email: email,
            personal_info: {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                pronouns: 'He/Him',
                phone: faker.phone.phoneNumber(),
                car: faker.random.boolean(),
                timesAvailable: ['Morning'],
                languages: ['English']
            },
            offer: {
                tasks: ['Food/Groceries'],
                availability: faker.random.boolean(),
                details: faker.lorem.sentence()
            },
            password: password,
            location_info: {
                location: [faker.address.longitude(), faker.address.latitude()],
                neighborhoods: [faker.address.county()],
                state: [faker.address.state()],
                association: faker.random.uuid(),
                association_name: faker.random.words()
            },
            logistics: {
                agreedToTerms: faker.random.boolean(),
            },
        }

        before((done) => {
            conn.connect()
                .then(() => done())
                .catch((err) => done(err));
        })

        after((done) => {
            conn.close()
                .then(() => done())
                .catch((err) => done(err));
        })

        it('Fail, user is unverified', (done) => {            
            request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const user = {
                        email: email,
                        password: password
                    }
                    request(app).post('/api/users/login')
                        .send({user})
                        .then((res) => {
                            const body = res.body;
                            const code = res.status;
                            expect(body.error).to.equal('Unverified user');
                            expect(code).to.equal(422);
                            done();
                        })
                    .catch((err) => done(err));
                })
            .catch((err) => done(err));
        });
    });

    describe("Login will work for verified users", function() {
        this.timeout(10000);
        let email = faker.internet.email();
        let password = faker.internet.password();
        const user = {
            email: email,
            personal_info: {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                pronouns: 'He/Him',
                phone: faker.phone.phoneNumber(),
                car: faker.random.boolean(),
                timesAvailable: ['Morning'],
                languages: ['English']
            },
            offer: {
                tasks: ['Food/Groceries'],
                availability: faker.random.boolean(),
                details: faker.lorem.sentence()
            },
            password: password,
            location_info: {
                location: [faker.address.longitude(), faker.address.latitude()],
                neighborhoods: [faker.address.county()],
                state: [faker.address.state()],
                association: faker.random.uuid(),
                association_name: faker.random.words()
            },
            logistics: {
                agreedToTerms: faker.random.boolean(),
            },
        }

        before((done) => {
            conn.connect()
                .then(() => done())
                .catch((err) => done(err));
        })

        after((done) => {
            conn.close()
                .then(() => done())
                .catch((err) => done(err));
        })

        it('OK, user is verified', (done) => {            
            request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const _id = res.body._id;
                    request(app).put('/api/users/update')
                        .send({ 
                            _id: _id,
                            updates: {
                                "logistics.verified": true
                            }
                        })
                        .then(() => {
                            const user = {
                                email: email,
                                password: password
                            }
                            request(app).post('/api/users/login')
                                .send({user})
                                .then((res) => {
                                    const body = res.body.user;
                                    const code = res.status;
                                    expect(body).to.have.property('_id');
                                    expect(body).to.have.property('email');
                                    expect(body).to.have.property('token');
                                    expect(code).to.equal(200);
                                    done();
                                })
                            .catch((err) => done(err));
                        })
                        .catch((err) => done(err));
                })
            .catch((err) => done(err));
        });
    });

    describe("Getting user by query works", function() {
        this.timeout(10000);
        const user = {
            email: faker.internet.email(),
            personal_info: {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                pronouns: 'He/Him',
                phone: faker.phone.phoneNumber(),
                car: faker.random.boolean(),
                timesAvailable: ['Morning'],
                languages: ['English']
            },
            offer: {
                tasks: ['Food/Groceries'],
                availability: faker.random.boolean(),
                details: faker.lorem.sentence()
            },
            password: faker.internet.password(),
            location_info: {
                location: [faker.address.longitude(), faker.address.latitude()],
                neighborhoods: [faker.address.county()],
                state: [faker.address.state()],
                association: faker.random.uuid(),
                association_name: faker.random.words()
            },
            logistics: {
                agreedToTerms: faker.random.boolean(),
            },
        }

        before((done) => {
            conn.connect()
                .then(() => done())
                .catch((err) => done(err));
        })

        after((done) => {
            conn.close()
                .then(() => done())
                .catch((err) => done(err));
        })

        it('OK, finds user by _id', (done) => {            
            request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const _id = res.body._id;
                    request(app).get('/api/users/')
                        .send({
                            "query": {
                                "_id": _id
                            }
                        })
                        .then((res) => {
                            const users = res.body;
                            const code = res.status;
                            users.forEach(user => {
                                expect(user._id).to.equal(_id);
                            });
                            expect(code).to.equal(200);
                            done();
                        })
                    .catch((err) => done(err));
                })
            .catch((err) => done(err));
        });

    });

});