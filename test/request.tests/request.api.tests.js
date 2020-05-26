process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");
const sinon = require("sinon");
const faker = require("faker");

describe("Request API POST", function () {
  describe("Creating a general request works", function () {
    it("incomplete", (done) => {
      expect(true).to.be.true;
      done();
    });
  });

  describe("Creating a direct match request works", function () {
    it("incomplete", (done) => {
      expect(true).to.be.true;
      done();
    });
  });
});

describe("Request API PUT", function () {
  describe("Matching volunteers", function () {
    it("incomplete", (done) => {
      expect(true).to.be.true;
      done();
    });
  });

  describe("Unmatching volunteers", function () {
    it("incomplete", (done) => {
      expect(true).to.be.true;
      done();
    });
  });
});
