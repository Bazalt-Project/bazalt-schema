'use strict';

// Load parent type
var MixedType = require('./mixed-type');
var Messages  = require('../constants/errors');

/**
 * Represent a Type that accept number value
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
class NumberType extends MixedType {

    /**
     * @inheritDoc
     */
    static get identifier() {
        return 'NUMBER_TYPE';
    }

    /**
     * @inheritDoc
     */
    get identifier() {
        return 'NUMBER_TYPE';
    }

    /**
     * @inheritDoc
     */
    requiredValidator(value) {
        return 'undefined' !== typeof value    && // not undefined
            null  !== value                    && // not null
            false === isNaN(parseFloat(value)) && // not NaN
            true  === isFinite(value);            // not Inf
    }

    /**
     * @inheritDoc
     */
    cast(value) {
        if(
            'undefined' === typeof value || // ignore undefined
            'number'    === typeof value || // ignore native number
            null        === value           // ignore null
        ) {
            return value;
        }

        return Number(value);
    }

    /**
     * The validator for min
     *
     * @param {number} value The value
     *
     * @return boolean The result of the test
     */
    minValidator(value) {
        return value >= this.$__min;
    }

    /**
     * The validator for minimal value
     *
     * @param {number} value   The minimal value
     * @param {string} message Is the message for the validator
     *
     * @return object Self-Reference for chaining
     */
    min(value, message) {
        if(
            true  === isNaN(parseFloat(value)) || // not NaN
            false === isFinite(value)             // not Inf
        ) {
            throw new Error(Messages.min_invalid_parameter);
        }

        this.$__min = value;

        // Add extra parameter {min}
        message = message || Messages.min;
        message = message.replace('{min}', this.$__min);
        
        this.validator(this.minValidator, message, 'minimal value');

        return this;
    }


    /**
     * The validator for min
     *
     * @param {number} value The value
     *
     * @return boolean The result of the test
     */
    maxValidator(value) {
        return value <= this.$__max;
    }
    
    /**
     * The validator for maximal value
     *
     * @param {number} value   The minimal value
     * @param {string} message Is the message for the validator
     *
     * @return object Self-Reference for chaining
     */
    max(value, message) {
        if(
            true  === isNaN(parseFloat(value)) || // not NaN
            false === isFinite(value)             // not Inf
        ) {
            throw new Error(Messages.max_invalid_parameter);
        }

        this.$__max = value;

        // Add extra parameter {max}
        message = message || Messages.max;
        message = message.replace('{max}', this.$__max);

        this.validator(this.maxValidator, message, 'maximal value');

        return this;
    }
}

module.exports = NumberType;
