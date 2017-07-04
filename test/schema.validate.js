/* global describe, it */
'use strict';

var should = require('should');
var Schema = require('../');

describe('Test Schema class', function() {

    it('SchemaInstance.validate() of Schema.Types.Mixed', function() {

        var schema = new Schema({
            extra: Schema.Types.Mixed
        });

        var truey  = [1, 2.1, 1e3, -1, NaN, [], new Array(), '', 'A string', {}];

        // True values
        truey.forEach(function(value) {

            // Test the value
            should(schema.path('extra').validate(value))
                .be.exactly(null);
        });
    });

    it('SchemaInstance.validate() of Schema.Types.Array', function() {

        var schema = new Schema({
            friends: Schema.Types.Array
        });

        var truey  = [[], new Array()];
        var falsey = [NaN, 1, 2.1, 1e3, -1, '', 'A string', {}];

        // True values
        truey.forEach(function(value) {

            // Test the value
            should(schema.path('friends').validate(value))
                .be.exactly(null);
        });

        // False values
        falsey.forEach(function(value) {

            // Test the value
            should(schema.path('friends').validate(value))
                .be.an.instanceOf(Error);
        });
    });

    it('SchemaInstance.validate() of Schema.Types.Number without validation', function() {

        var schema = new Schema({
            age: Schema.Types.Number
        });

        var truey  = [1, 2.1, 1e3, -1, '', [], new Array()]; // Values are casted
        var falsey = [NaN, 'A string', {}];

        // True values
        truey.forEach(function(value) {

            // Test the value
            should(schema.path('age').validate(value))
                .be.exactly(null);
        });

        // False values
        falsey.forEach(function(value) {

            // Test the value
            should(schema.path('age').validate(value))
                .be.an.instanceOf(Error);
        });
    });

    it('SchemaInstance.validate() of Schema.Types.Number with validation', function() {

        var schema = new Schema({
            age: {
                type:     Schema.Types.Number,
                required: true,
                min:      0,
                max:      90
            }
        });

        var truey  = [1, 2.1, [], new Array(), ''];; // Values are casted
        var falsey = [-1, 1e3, NaN, 'A string', {}];

        // True values
        truey.forEach(function(value) {

            // Test the value
            should(schema.path('age').validate(value))
                .be.exactly(null);
        });

        // False values
        falsey.forEach(function(value) {

            // Test the value
            should(schema.path('age').validate(value))
                .be.an.instanceOf(Error);
        });
    });

    it('SchemaInstance.validate() of Schema.Types.Object', function() {

        var schema = new Schema({
            friend: Schema.Types.Object
        });

        var truey  = [{}, [], new Array()];
        var falsey = [NaN, 1, 2.1, 1e3, -1, '', 'A string'];

        // True values
        truey.forEach(function(value) {

            // Test the value
            should(schema.path('friend').validate(value))
                .be.exactly(null);
        });

        // False values
        falsey.forEach(function(value) {

            // Test the value
            should(schema.path('friend').validate(value))
                .be.an.instanceOf(Error);
        });
    });

    it('SchemaInstance.validate() of Schema.Types.String without validation', function() {

        var schema = new Schema({
            name: Schema.Types.String
        });

        var truey  = ['A string', NaN, 1, 2.1, 1e3, -1, {}]; // Values are casted
        var falsey = ['', [], new Array()]; // Empty string are false

        // True values
        truey.forEach(function(value) {

            // Test the value
            should(schema.path('name').validate(value))
                .be.exactly(null);
        });

        // False values
        falsey.forEach(function(value) {

            // Test the value
            should(schema.path('name').validate(value))
                .be.an.instanceOf(Error);
        });
    });

    it('SchemaInstance.validate() of Schema.Types.String with validation', function() {

        var schema = new Schema({
            name: {
                type:     Schema.Types.String,
                required: true,
                regex:    /^bazalt/
            }
        });

        var truey  = ['bazalt', 'bazalt-model'];
        var falsey = ['', 'A string', 'Bazalt', NaN, [], new Array(), 1, 2.1, 1e3, -1, {}];

        // True values
        truey.forEach(function(value) {

            // Test the value
            should(schema.path('name').validate(value))
                .be.exactly(null);
        });

        // False values
        falsey.forEach(function(value) {

            // Test the value
            should(schema.path('name').validate(value))
                .be.an.instanceOf(Error);
        });
    });

    it('SchemaInstance.validate() multiple path', function() {

        var schema = new Schema({
            extra: Schema.Types.Mixed,
            name:  Schema.Types.String,
            age:   Schema.Types.Number,
            information: {
                location: Schema.Types.String,
                lobbies:  [Schema.Types.String],
                profiles: [{
                    name: Schema.Types.String
                }]
            },
            friends: []
        });

        var truey = {
            'extra': {},
            'name': 'A String',
            'age': 18,
            'information.location': 'A String',
            'information.lobbies': ['A String'],
            'information.profiles': [{
                name: 'A String'
            }],
            'friends': []
        };

        // True values
        for(let key in truey) {
            let value = truey[key];

            // Test the value
            should(schema.path(key).validate(value))
                .be.exactly(null);
        }
    });

    it('SchemaInstance.validate() of explicit definition and check fields', function() {

        var schema = new Schema({
            firstname: Schema.Types.String,
            lastname: {
                type: Schema.Types.String
            },
            age: {
                type: Schema.Types.Number
            }
        });

        should(schema.path('firstname').validate('String value'))
            .be.exactly(null);

        should(schema.path('lastname').validate('String value'))
            .be.exactly(null);

        should(schema.path('age').validate(18))
            .be.exactly(null);

        should(schema.fields)
            .eql(['id', 'firstname', 'lastname', 'age']);
    });

    it('SchemaInstance.validate() of required field', function() {

        var schema = new Schema({
            name: {
                type:     Schema.Types.String,
                required: false
            },
            username: Schema.Types.String
        });

        should(schema.validate({
            name:     'String value',
            username: 'String value'
        })).be.exactly(null);

        should(schema.validate({
            username: 'String value'
        })).be.exactly(null);
        
        var errors = schema.validate({
            name: 'String value'
        });

        should(errors).be.instanceof(Object).and.have.property('username').and.be.an.instanceof(Error);
    });
});
