/* global describe, it */
'use strict';

var should = require('should');

var ValidatorError = require('../../src/error/validator-error');
var MixedType      = require('../../src/types/mixed-type');


describe('Test MixedType', function() {

    it('Check instantiation of the type', function() {
        var type = new MixedType('test');

        should(type).be.an.instanceof(MixedType);
        should(type.identifier).be.exactly('MIXED_TYPE');

        // Empty string should work
        should(type.validate('')).be.exactly(null);

        // Null value should work
        should(type.validate(null)).be.exactly(null);

        // undefined value should work
        should(type.validate()).be.exactly(null);
    });

    it('Check required validation', function() {
        var type = new MixedType('test', {
            required: true
        });

        // Empty string should work
        should(type.validate('')).be.exactly(null);

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError);

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError);

        // Deactivate the required
        type.required(false);

        // Empty string should work
        should(type.validate('')).be.exactly(null);

        // Null value should work
        should(type.validate(null)).be.exactly(null);

        // undefined value should work
        should(type.validate()).be.exactly(null);
    });

    it('Check required validation with message', function() {
        var type = new MixedType('test', {
            required: [true, 'This is a test.']
        });

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');
    });

    it('Check default value', function() {
        var type = new MixedType('test');

        // Should not have default value
        should(type.hasDefault()).be.equal(false);

        // Set default value
        type.default('This is a test!');
        
        // Should have default value
        should(type.hasDefault()).be.equal(true);

        // Should return default value
        should(type.getDefault()).be.equal('This is a test!');
    });
});
