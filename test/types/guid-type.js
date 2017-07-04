/* global describe, it */
'use strict';

var should = require('should');

var ValidatorError = require('../../src/error/validator-error');
var GuidType       = require('../../src/types/guid-type');


describe('Test GuidType', function() {

    it('Check instantiation of the type', function() {
        var type = new GuidType('test');

        should(type).be.an.instanceof(GuidType);
        should(type.identifier).be.exactly('GUID_TYPE');

        // Empty string should work
        should(type.validate('')).be.exactly(null);

        // Null value should return a TypeError
        should(type.validate(null)).be.exactly(null);

        // undefined value should return a TypeError
        should(type.validate()).be.exactly(null);
    });

    it('Check required validation', function() {
        var type = new GuidType('test', {
            required: true,
            generate: true
        });

        // Valid GUID should work
        should(type.validate('67e78ef9-f514-46d5-8e1f-a03deaca0d20')).be.exactly(null);

        // generated GUID should work
        should(type.validate(GuidType.generate())).be.exactly(null);

        // default generated should work
        should(type.validate(type.getDefault())).be.exactly(null);

        // Empty string should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError);

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError);

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError);
    });

    it('Check required validation with message', function() {
        var type = new GuidType('test', {
            required: [true, 'This is a test.']
        });

        // Empty string should return a TypeError
        should(type.validate('')).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');

        // Null value should return a TypeError
        should(type.validate(null)).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');

        // undefined value should return a TypeError
        should(type.validate()).be.an.instanceof(ValidatorError).have.a.property('message', 'This is a test.');
    });
});
