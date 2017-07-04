'use strict';

// Load parent type
var MixedType = require('./mixed-type');
var Schema    = require('../');
var Messages  = require('../constants/errors');

/**
 * Represent a Type that accept array
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
class ArrayType extends MixedType {

    /**
     * @inheritDoc
     */
    static get identifier() {
        return 'ARRAY_TYPE';
    }

    /**
     * @inheritDoc
     */
    get identifier() {
        return 'ARRAY_TYPE';
    }

    /**
     * @inheritDoc
     */
    requiredValidator(value) {
        return Array.isArray(value);
    }

    /**
     * Add a schema validator to the array
     *
     * @param {object, Schema} The schema of the Object
     */
    of(schema, message) {

        if(
            false === schema instanceof MixedType &&
            false === schema instanceof Schema
        ) {
            schema = new Schema(schema);
        }

        // Add the validator of the array
        this.validator(function(values) {

            // Check each element
            for(var value of values)
            {
                // Stop on first invalid
                if(null !== schema.validate(value))
                {
                    return false;
                }
            }

            // Validate the schema
            return true;
        }, message || Messages.schema, 'schema validator');
    }
}

module.exports = ArrayType;
