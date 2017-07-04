/* global describe, it */
'use strict';

var should = require('should');
var Schema = require('../');

describe('Test Schema class', function() {

    it('SchemaInstance.toJSON() ', function () {
        var schema = new Schema({
            name: {
                type: Schema.Types.String,
                required: false
            },
            username: Schema.Types.String
        });

        var json = schema.toJSON();
        var test = Schema.fromJSON(json);

        // Check option
        should(test).be.instanceof(Object);

        should(test.validate({
            name: 'String value',
            username: 'String value'
        })).be.exactly(null);

        should(test.validate({
            username: 'String value'
        })).be.exactly(null);

        var errors = test.validate({
            name: 'String value'
        });

        should(errors).be.instanceof(Object).and.have.property('username').and.be.an.instanceof(Error);
    });
});
