/* global describe, it */
'use strict';

var should = require('should');

var ValidatorError = require('../../src/error/validator-error');
var NumberType     = require('../../src/types/number-type');


describe('Test NumberType', function() {

    it('Check instantiation of the type', function() {
        var type = new NumberType('test');

        should(type).be.an.instanceof(NumberType);
        should(type.identifier).be.exactly('NUMBER_TYPE');

        // 0 should work
        should(type.validate(0)).be.exactly(null);

        // Empty string should return a TypeError
        should(type.validate('')).be.exactly(null);

        // Null value should return a TypeError
        should(type.validate(null)).be.exactly(null);

        // undefined value should return a TypeError
        should(type.validate()).be.exactly(null);
    });

    it('Check required validation cast', function() {
        var type = new NumberType('test', {
            required: true
        });

        // 0 should work
        should(type.validate(0)).be.exactly(null);

        // Empty string should return a TypeError
        should(type.validate('')).be.exactly(null);

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError);

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError);
    });

    it('Check required validation already casted', function() {
        var type = new NumberType('test', {
            required: true
        });

        // 0 should work
        should(type.validate(0, true)).be.exactly(null);

        // Empty string should return a TypeError
        should(type.validate('', true)).be.an.instanceof(ValidatorError);

        // Null value should return a TypeError
        should(type.validate(null, true)).be.an.instanceof(ValidatorError);

        // undefined value should return a TypeError
        should(type.validate(undefined, true)).be.an.instanceof(ValidatorError);
    });

    it('Check required validation with message', function() {
        var type = new NumberType('test', {
            required: [true, 'This is a test.']
        });

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');
    });

    it('Check min validation', function() {
        var type = new NumberType('test', {
            min: 5
        });

        // 10 should work
        should(type.validate(10)).be.exactly(null);

        // 5 should work
        should(type.validate(5)).be.exactly(null);

        // 4 should work
        should(type.validate(4)).be.an.instanceof(ValidatorError);

        // -1 should work
        should(type.validate(-1)).be.an.instanceof(ValidatorError);
    });

    it('Check max validation', function() {
        var type = new NumberType('test', {
            max: 5
        });

        // 10 should work
        should(type.validate(10)).be.an.instanceof(ValidatorError);

        // 5 should work
        should(type.validate(5)).be.exactly(null);

        // 4 should return a TypeError
        should(type.validate(4)).be.exactly(null);

        // -1 should return a TypeError
        should(type.validate(-1)).be.exactly(null);
    });

    it('Check min-max validation', function() {
        var type = new NumberType('test', {
            min: 5,
            max: 7
        });

        // 10 should return a TypeError
        should(type.validate(10)).be.an.instanceof(ValidatorError);

        // 5 should work
        should(type.validate(5)).be.exactly(null);

        // 4 should return a TypeError
        should(type.validate(4)).be.an.instanceof(ValidatorError);

        // -1 should return a TypeError
        should(type.validate(-1)).be.an.instanceof(ValidatorError);
    });
});
