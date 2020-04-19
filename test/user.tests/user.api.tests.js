process.env.NODE_ENV = 'test';

const expect = require("chai").expect;
const request = require('supertest');
const sinon = require('sinon');
const faker = require('faker');

const app = require('../../app');
const conn = require('../../db/index');

const EmailService = require('../../services/email.service');

// const loginUser(auth) {
//     return function(done) {
//         request
//             .post('/auth/local')
//             .send({
//                 email: 'test@test.com',
//                 password: 'test'
//             })
//             .expect(200)
//             .end(onResponse);

//         function onResponse(err, res) {
//             auth.token = res.body.token;
//             return done();
//         }
//     };
// }


describe("/api/users", function() {
    this.timeout(10000);
    describe("POST /register", function() {
        const stubEmailService = sinon.stub(EmailService, "sendWelcomeEmail");
        describe("Status Code 201", function() {
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
                    location: {
                        type: "Point",
                        coordinates: [faker.address.longitude(), faker.address.latitude()]
                    }
                },
                logistics: {
                    agreedToTerms: true
                }
            }

            beforeEach((done) => {
                conn.connect()
                    .then(() => done())
                    .catch((err) => done(err));
            })

            afterEach((done) => {
                conn.close()
                    .then(() => done())
                    .catch((err) => done(err));
            })

            it("Registering a new user saves in DB", function(done) {
                request(app).post('/api/users/register')
                    .send({ user })
                    .then((res) => {
                        const body = res.body;
                        const code = res.status;
                        expect(code).to.equal(201);
                        expect(body).to.contain.property('_id');
                        const _id = res.body._id;
                        request(app).get('/api/users/')
                            .send(
                                {
                                    query: {
                                        "_id": _id
                                    }
                                })
                            .then((res) => {
                                const found_user = res.body[0];
                                console.log(found_user)
                                expect(found_user._id).to.equal(_id);
                                done();
                            })
                    }) 
                    .catch((err) => done(err));
            });

            it("Registering a new user sends an email", function(done) {
                request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    expect(stubEmailService.calledOnce).to.be.true;
                    var emailArgument = stubEmailService.getCall(0).args[0];
                    expect(emailArgument.email).to.equal(user.email.toLowerCase());
                    done();
                }) 
                .catch((err) => done(err));
            })
        });

        describe("Status Code 422", function() {
            beforeEach((done) => {
                conn.connect()
                    .then(() => done())
                    .catch((err) => done(err));
            })

            afterEach((done) => {
                conn.close()
                    .then(() => done())
                    .catch((err) => done(err));
            })

            it("Can't register if missing email", function(done) {
                const user = {
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
                        location: {
                            type: "Point",
                            coordinates: [faker.address.longitude(), faker.address.latitude()]
                        }
                    },
                    logistics: {
                        agreedToTerms: true
                    }
                }
                request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const body = res.body;
                    const code = res.status;
                    expect(code).to.equal(422);
                    done();
                })
                .catch((err) => done(err));
            });

            it("Can't register if missing password", function(done) {
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
                    location_info: {
                        location: {
                            type: "Point",
                            coordinates: [faker.address.longitude(), faker.address.latitude()]
                        }
                    },
                    logistics: {
                        agreedToTerms: true
                    }
                }
                request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const code = res.status;
                    expect(code).to.equal(422);
                    done();
                })
                .catch((err) => done(err));
            });

            it("Can't register if malformed user", function(done) {
                const user = {
                    email: faker.internet.email(),
                    malformedData: "malformed"
                }
                request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const code = res.status;
                    expect(code).to.equal(422);
                    done();
                })
                .catch((err) => done(err));
            });

            it("Can't register with existing email", function(done) {
                const firstRegistrationEmail = faker.internet.email();
                const user = {
                    email: firstRegistrationEmail,
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
                        location: {
                            type: "Point",
                            coordinates: [faker.address.longitude(), faker.address.latitude()]
                        }
                    },
                    logistics: {
                        agreedToTerms: true
                    }
                }
                request(app).post('/api/users/register')
                .send({ user })
                .then((res) => {
                    const user = {
                        email: firstRegistrationEmail,
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
                            location: {
                                type: "Point",
                                coordinates: [faker.address.longitude(), faker.address.latitude()]
                            }
                        },
                        logistics: {
                            agreedToTerms: true
                        }
                    };
                    request(app).post('/api/users/register')
                        .send({ user })
                        .then((res) => {
                            console.log(res.status);
                            done();
                        })
                }) 
                .catch((err) => done(err));
            });

        });
    });

    describe("POST /login", function() {

    });

    describe("GET /current", function() {

    });


    describe("GET /", function() {

    });

    describe("PUT /update", function() {

    });


    
    // describe("Registering a new user", function() {
    //     const email = sinon.stub(EmailService, "sendWelcomeEmail");
    //     this.timeout(10000);
    //     const user = {
    //         email: faker.internet.email(),
    //         personal_info: {
    //             first_name: faker.name.firstName(),
    //             last_name: faker.name.lastName(),
    //             pronouns: 'He/Him',
    //             phone: faker.phone.phoneNumber(),
    //             car: faker.random.boolean(),
    //             timesAvailable: ['Morning'],
    //             languages: ['English']
    //         },
    //         offer: {
    //             tasks: ['Food/Groceries'],
    //             availability: faker.random.boolean(),
    //             details: faker.lorem.sentence()
    //         },
    //         password: faker.internet.password(),
    //         location_info: {
    //             location: {
    //                 type: "Point",
    //                 coordinates: [faker.address.longitude(), faker.address.latitude()]
    //             },
    //             neighborhoods: [faker.address.county()],
    //             state: [faker.address.state()],
    //             association: faker.random.uuid(),
    //             association_name: faker.random.words()
    //         },
    //         logistics: {
    //             verified: faker.random.boolean(),
    //             agreedToTerms: faker.random.boolean(),
    //             note: faker.lorem.sentence()
    //         },
    //     }
    //     before((done) => {
    //         conn.connect()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     after((done) => {
    //         conn.close()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     it('OK, creating a new user works', (done) => {           
    //         request(app).post('/api/users/register')
    //             .send({ user })
    //             .then((res) => {
    //                 const body = res.body;
    //                 const code = res.status;
    //                 expect(code).to.equal(201);
    //                 expect(body).to.contain.property('_id');
    //                 // expect(email.calledOnce).to.be.true;
    //                 // var firstArgument = email.getCall(0).args[0];
    //                 // console.log(firstArgument);
    //                 done();
    //             })
    //         .catch((err) => done(err));
    //     });

    // });

    // describe("Unable to register user if missing information", function() {
    //     this.timeout(10000);
    //     const user = {
    //         email: faker.internet.email(),
    //         personal_info: {
    //             pronouns: 'He/Him',
    //             phone: faker.phone.phoneNumber(),
    //             car: faker.random.boolean(),
    //             timesAvailable: ['Morning'],
    //             languages: ['English']
    //         },
    //         offer: {
    //             tasks: ['Food/Groceries'],
    //             availability: faker.random.boolean(),
    //             details: faker.lorem.sentence()
    //         },
    //         password: faker.internet.password(),
    //         location_info: {
    //             location: {
    //                 type: "Point",
    //                 coordinates: [faker.address.longitude(), faker.address.latitude()]
    //             },
    //             neighborhoods: [faker.address.county()],
    //             state: [faker.address.state()],
    //             association: faker.random.uuid(),
    //             association_name: faker.random.words()
    //         },
    //         logistics: {
    //             verified: faker.random.boolean(),
    //             agreedToTerms: faker.random.boolean(),
    //             note: faker.lorem.sentence()
    //         },
    //     }
    //     before((done) => {
    //         conn.connect()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     after((done) => {
    //         conn.close()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     it('Fail, users requires all personal information', (done) => {            
    //         request(app).post('/api/users/register')
    //             .send({ user })
    //             .then((res) => {
    //                 const body = res.body;
    //                 const code = res.status;
    //                 expect(body.errors['personal_info'].name).to.equal('ValidationError');
    //                 expect(code).to.equal(422);
    //                 done();
    //             })
    //         .catch((err) => done(err));
    //     });
    // });

    // describe("Login will not work for unverified users", function() {
    //     this.timeout(10000);
    //     let email = faker.internet.email();
    //     let password = faker.internet.password();
    //     const user = {
    //         email: email,
    //         personal_info: {
    //             first_name: faker.name.firstName(),
    //             last_name: faker.name.lastName(),
    //             pronouns: 'He/Him',
    //             phone: faker.phone.phoneNumber(),
    //             car: faker.random.boolean(),
    //             timesAvailable: ['Morning'],
    //             languages: ['English']
    //         },
    //         offer: {
    //             tasks: ['Food/Groceries'],
    //             availability: faker.random.boolean(),
    //             details: faker.lorem.sentence()
    //         },
    //         password: password,
    //         location_info: {
    //             location: {
    //                 type: "Point",
    //                 coordinates: [faker.address.longitude(), faker.address.latitude()]
    //             },
    //             neighborhoods: [faker.address.county()],
    //             state: [faker.address.state()],
    //             association: faker.random.uuid(),
    //             association_name: faker.random.words()
    //         },
    //         logistics: {
    //             agreedToTerms: faker.random.boolean(),
    //         },
    //     }

    //     before((done) => {
    //         conn.connect()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     after((done) => {
    //         conn.close()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     it('Fail, user is unverified', (done) => {            
    //         request(app).post('/api/users/register')
    //             .send({ user })
    //             .then((res) => {
    //                 const user = {
    //                     email: email,
    //                     password: password
    //                 }
    //                 request(app).post('/api/users/login')
    //                     .send({user})
    //                     .then((res) => {
    //                         const body = res.body;
    //                         const code = res.status;
    //                         expect(body.error).to.equal('Unverified user');
    //                         expect(code).to.equal(422);
    //                         done();
    //                     })
    //                 .catch((err) => done(err));
    //             })
    //         .catch((err) => done(err));
    //     });
    // });

    // describe("Login will work for verified users", function() {
    //     this.timeout(10000);
    //     let email = faker.internet.email();
    //     let password = faker.internet.password();
    //     const user = {
    //         email: email,
    //         personal_info: {
    //             first_name: faker.name.firstName(),
    //             last_name: faker.name.lastName(),
    //             pronouns: 'He/Him',
    //             phone: faker.phone.phoneNumber(),
    //             car: faker.random.boolean(),
    //             timesAvailable: ['Morning'],
    //             languages: ['English']
    //         },
    //         offer: {
    //             tasks: ['Food/Groceries'],
    //             availability: faker.random.boolean(),
    //             details: faker.lorem.sentence()
    //         },
    //         password: password,
    //         location_info: {
    //             location: {
    //                 type: "Point",
    //                 coordinates: [faker.address.longitude(), faker.address.latitude()]
    //             },
    //             neighborhoods: [faker.address.county()],
    //             state: [faker.address.state()],
    //             association: faker.random.uuid(),
    //             association_name: faker.random.words()
    //         },
    //         logistics: {
    //             agreedToTerms: faker.random.boolean(),
    //         },
    //     }

    //     before((done) => {
    //         conn.connect()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     after((done) => {
    //         conn.close()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     it('OK, user is verified', (done) => {            
    //         request(app).post('/api/users/register')
    //             .send({ user })
    //             .then((res) => {
    //                 const _id = res.body._id;
    //                 request(app).put('/api/users/update')
    //                     .send({ 
    //                         _id: _id,
    //                         updates: {
    //                             "logistics.verified": true
    //                         }
    //                     })
    //                     .then(() => {
    //                         const user = {
    //                             email: email,
    //                             password: password
    //                         }
    //                         request(app).post('/api/users/login')
    //                             .send({user})
    //                             .then((res) => {
    //                                 const body = res.body.user;
    //                                 const code = res.status;
    //                                 expect(body).to.have.property('_id');
    //                                 expect(body).to.have.property('email');
    //                                 expect(body).to.have.property('token');
    //                                 expect(code).to.equal(200);
    //                                 done();
    //                             })
    //                         .catch((err) => done(err));
    //                     })
    //                     .catch((err) => done(err));
    //             })
    //         .catch((err) => done(err));
    //     });
    // });

    // describe("Getting user by query works (individual id)", function() {
    //     this.timeout(10000);
    //     const user = {
    //         email: faker.internet.email(),
    //         personal_info: {
    //             first_name: faker.name.firstName(),
    //             last_name: faker.name.lastName(),
    //             pronouns: 'He/Him',
    //             phone: faker.phone.phoneNumber(),
    //             car: faker.random.boolean(),
    //             timesAvailable: ['Morning'],
    //             languages: ['English']
    //         },
    //         offer: {
    //             tasks: ['Food/Groceries'],
    //             availability: faker.random.boolean(),
    //             details: faker.lorem.sentence()
    //         },
    //         password: faker.internet.password(),
    //         location_info: {
    //             location: {
    //                 type: "Point",
    //                 coordinates: [faker.address.longitude(), faker.address.latitude()]
    //             },
    //             neighborhoods: [faker.address.county()],
    //             state: [faker.address.state()],
    //             association: faker.random.uuid(),
    //             association_name: faker.random.words()
    //         },
    //         logistics: {
    //             agreedToTerms: faker.random.boolean(),
    //         },
    //     }

    //     before((done) => {
    //         conn.connect()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     after((done) => {
    //         conn.close()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     it('OK, finds user by _id', (done) => {            
    //         request(app).post('/api/users/register')
    //             .send({ user })
    //             .then((res) => {
    //                 const _id = res.body._id;
    //                 request(app).get('/api/users/')
    //                     .send({
    //                         "query": {
    //                             "_id": _id
    //                         }
    //                     })
    //                     .then((res) => {
    //                         const users = res.body;
    //                         const code = res.status;
    //                         users.forEach(user => {
    //                             expect(user._id).to.equal(_id);
    //                         });
    //                         expect(code).to.equal(200);
    //                         done();
    //                     })
    //                 .catch((err) => done(err));
    //             })
    //         .catch((err) => done(err));
    //     });
    // });

    // describe("Updating user fields work", function() {
    //     this.timeout(10000);
    //     const user = {
    //         email: faker.internet.email(),
    //         personal_info: {
    //             first_name: faker.name.firstName(),
    //             last_name: faker.name.lastName(),
    //             pronouns: 'He/Him',
    //             phone: faker.phone.phoneNumber(),
    //             car: faker.random.boolean(),
    //             timesAvailable: ['Morning'],
    //             languages: ['English']
    //         },
    //         offer: {
    //             tasks: ['Food/Groceries'],
    //             availability: true,
    //             details: faker.lorem.sentence()
    //         },
    //         password: faker.internet.password(),
    //         location_info: {
    //             location: {
    //                 type: "Point",
    //                 coordinates: [faker.address.longitude(), faker.address.latitude()]
    //             },
    //             neighborhoods: [faker.address.county()],
    //             state: [faker.address.state()],
    //             association: faker.random.uuid(),
    //             association_name: faker.random.words()
    //         },
    //         logistics: {
    //             agreedToTerms: faker.random.boolean(),
    //         },
    //     }

    //     before((done) => {
    //         conn.connect()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     after((done) => {
    //         conn.close()
    //             .then(() => done())
    //             .catch((err) => done(err));
    //     })

    //     it('OK, finds user by _id', (done) => {            
    //         request(app).post('/api/users/register')
    //             .send({ user })
    //             .then((res) => {
    //                 const _id = res.body._id;
    //                 request(app).put('/api/users/update')
    //                     .send({ 
    //                         _id: _id,
    //                         updates: {
    //                             "logistics.verified": true,
    //                             "personal_info.first_name": "TESTNAME",
    //                             "offer.availability": false
    //                         }
    //                     })
    //                     .then(() => {

    //                         request(app).get('/api/users/')
    //                             .send({
    //                                 "query": {
    //                                     "_id": _id
    //                                 }
    //                             })
    //                             .then((res) => {
    //                                 const users = res.body;
    //                                 const code = res.status;
    //                                 users.forEach(user => {
    //                                     expect(user._id).to.equal(_id);
    //                                     expect(user.logistics.verified).to.equal(true);
    //                                     expect(user.offer.availability).to.equal(false);

    //                                 });
    //                                 expect(code).to.equal(200);
    //                                 done();
    //                             })
    //                             .catch((err) => done(err));
    //                     })
    //                 .catch((err) => done(err));
    //             })
    //         .catch((err) => done(err));
    //     });
    // });

    // describe("Logging in provides a token which allows you to find the current user", function() {
    //     it('incomplete', (done) => {     
    //         expect(true).to.be.true;
    //         done();
    //     });
    // });

    // describe("Can't create multiple accounts with the same email", function() {
    //     it('incomplete', (done) => {     
    //         expect(true).to.be.true;
    //         done();
    //     });
    // });

    // describe("Resetting password works fails for emails not in system", function() {
    //     it('incomplete', (done) => {     
    //         expect(true).to.be.true;
    //         done();
    //     });
    // });

});