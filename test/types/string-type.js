/* global describe, it */
'use strict';

var should = require('should');

var ValidatorError = require('../../src/error/validator-error');
var StringType     = require('../../src/types/string-type');


describe('Test StringType', function() {

    it('Check instantiation of the type', function() {
        var type = new StringType('test');

        should(type).be.an.instanceof(StringType);
        should(type.identifier).be.exactly('STRING_TYPE');

        // Empty string should work
        should(type.validate('')).be.exactly(null);

        // Null value should return a TypeError
        should(type.validate(null)).be.exactly(null);

        // undefined value should return a TypeError
        should(type.validate()).be.exactly(null);
    });

    it('Check required validation', function() {
        var type = new StringType('test', {
            required: true
        });

        // Empty string should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError);

        // A 4 length string value should work
        should(type.validate('1234')).be.exactly(null);

        // Number value should return a TypeError if already casted
        should(type.validate(1, true)).be.an.instanceof(ValidatorError);

        // Number value should return null if not casted yet
        should(type.validate(1, false)).be.exactly(null);

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError);

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError);
    });

    it('Check required validation with message', function() {
        var type = new StringType('test', {
            required: [true, 'This is a test.']
        });

        // Empty string should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');
    });

    it('Check min validation', function() {
        var type = new StringType('test', {
            minLength: 5
        });

        // Empty String should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError);

        // A 4 length string value should return a TypeError
        should(type.validate('1234')).be.an.instanceof(ValidatorError);

        // A 5 length string value should work
        should(type.validate('12345')).be.exactly(null);

        // A 7 length string value should work
        should(type.validate('123 456')).be.exactly(null);

        // A 14 length string value should work
        should(type.validate('123 456 789 10')).be.exactly(null);
    });

    it('Check max validation', function() {
        var type = new StringType('test', {
            maxLength: 5
        });

        // Empty string should work
        should(type.validate('')).be.exactly(null);

        // A 4 length string value should work
        should(type.validate('1234')).be.exactly(null);

        // A 5 length string value should work
        should(type.validate('12345')).be.exactly(null);

        // A 7 length string value should return a TypeError
        should(type.validate('123 456')).be.an.instanceof(ValidatorError);

        // A 14 length string value should return a TypeError
        should(type.validate('123 456 789 10')).be.an.instanceof(ValidatorError);
    });

    it('Check min-max validation', function() {
        var type = new StringType('test', {
            minLength: 5,
            maxLength: 7
        });

        // Empty string should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError);

        // A 4 length string value should return a TypeError
        should(type.validate('1234')).be.an.instanceof(ValidatorError);

        // A 5 length string value should work
        should(type.validate('12345')).be.exactly(null);

        // A 7 length string value should work
        should(type.validate('123 456')).be.exactly(null);

        // A 14 length string value should return a TypeError
        should(type.validate('123 456 789 10')).be.an.instanceof(ValidatorError);
    });

    it('Check regex validation with string', function() {
        var type = new StringType('test', {
            regex: 'test'
        });

        // Empty String should return a TypeError
        should(type.validate(0)).be.an.instanceof(ValidatorError);

        // null should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError);

        // undefined should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError);

        // Empty String should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError);

        // 1234 value should return a TypeError
        should(type.validate('1234')).be.an.instanceof(ValidatorError);

        // test string value should work
        should(type.validate('test')).be.exactly(null);

        // tst value should return a TypeError
        should(type.validate('tst')).be.an.instanceof(ValidatorError);
    });

    it('Check regex validation with RegExp', function() {
        var type = new StringType('test', {
            regex: new RegExp(/^te?st$/)
        });

        // Empty String should return a TypeError
        should(type.validate(0)).be.an.instanceof(ValidatorError);

        // null should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError);

        // undefined should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError);

        // Empty String should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError);

        // 1234 value should return a TypeError
        should(type.validate('1234')).be.an.instanceof(ValidatorError);

        // test value should work
        should(type.validate('test')).be.exactly(null);

        // tst value should work
        should(type.validate('tst')).be.exactly(null);
    });
});
