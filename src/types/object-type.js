'use strict';

// Load parent type
var MixedType = require('./mixed-type');
var Schema    = require('../');
var Messages  = require('../constants/errors');

/**
 * Represent a Type that accept object
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
class ObjectType extends MixedType {

    /**
     * @inheritDoc
     */
    static get identifier() {
        return 'OBJECT_TYPE';
    }

    /**
     * @inheritDoc
     */
    get identifier() {
        return 'OBJECT_TYPE';
    }

    /**
     * @inheritDoc
     */
    requiredValidator(value) {
        return 'object' === typeof value;
    }

    /**
     * Add a schema validator to the object
     *
     * @param {object, Schema} The schema of the Object
     */
    of(schema, message) {
        if(false === schema instanceof Schema)
        {
            schema = new Schema(schema);
        }

        // Add the validator of the object
        this.validator(function(value) {
            // Validate the schema
            return !!schema.validate(value);
        }, message || Messages.schema, 'schema validator');
    }
}

module.exports = ObjectType;
