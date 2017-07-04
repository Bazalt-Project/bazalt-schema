'use strict';

// Load parent type
var MixedType = require('./mixed-type');
var Messages  = require('../constants/errors');

// The constant for GUID pattern
const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Represent a Type that accept string value
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
class GuidType extends MixedType {

    /**
     * Le pattern de validation d'un GUID from RFC4122
     *
     * @type {RegExp}
     */
    static get GUID_PATTERN() {
        return GUID_PATTERN;
    }

    /**
     * @inheritDoc
     */
    static get identifier() {
        return 'GUID_TYPE';
    }

    /**
     * @inheritDoc
     */
    get identifier() {
        return 'GUID_TYPE';
    }

    /**
     * @inheritDoc
     */
    requiredValidator(value) {
        return 'string' === typeof value && // is a string
            GuidType.GUID_PATTERN.test(value);  // match with the pattern
    }
    
    /**
     * The validator for regex pattern
     *
     * @param generated Set the auto-generation of the GUID
     *
     * @return object Self-Reference for chaining
     */
    generate(generated) {
        if(false !== generated && true !== generated)
        {
            throw new Error(Messages.generated_invalid_parameter);
        }

        // Set the generator as default
        if(true === generated)
        {
            this.$__default = GuidType.generate;
        }
        else if(GuidType.generate === this.$__default)
        {
            delete this.$__default;
        }

        return this;
    }

    /**
     * Generate a GUID version 4
     *
     * @return string Self-Reference for chaining
     */
    static generate() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);

            return v.toString(16);
        });
    }
}

module.exports = GuidType;
