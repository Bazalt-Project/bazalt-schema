'use strict';

// Load parent type
var MixedType = require('./mixed-type');
var Messages  = require('../constants/errors');

/**
 * Represent a Type that accept string value
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
class StringType extends MixedType {

    /**
     * @inheritDoc
     */
    static get identifier() {
        return 'STRING_TYPE';
    }

    /**
     * @inheritDoc
     */
    get identifier() {
        return 'STRING_TYPE';
    }

    /**
     * @inheritDoc
     */
    cast(value) {
        if(
            'undefined' === typeof value || // ignore undefined
            'string'    === typeof value || // ignore native string
            null        === value           // ignore null
        ) {
            return value;
        }

        // If there is a .toString() method
        if('function' === typeof value.toString)
        {
            return value.toString();
        }

        return String(value);
    }

    /**
     * @inheritDoc
     */
    requiredValidator(value) {
        return 'string' === typeof value && // is a string
            '' !== value;                   // not empty
    }

    /**
     * The validator for min length
     *
     * @param {string} value The value
     *
     * @return boolean The result of the test
     */
    minLengthValidator(value) {
        return value.length >= this.$__minLength;
    }

    /**
     * The validator for minimal length
     *
     * @param {number} value   The minimal value
     * @param {string} message Is the message for the validator
     *
     * @return object Self-Reference for chaining
     */
    minLength(value, message) {
        if(
            true  === isNaN(parseFloat(value)) || // not NaN
            false === isFinite(value)             // not Inf
        ) {
            throw new Error(Messages.min_invalid_parameter);
        }

        this.$__minLength = value;

        // Add extra parameter {min}
        message = message || Messages.min_length;
        message = message.replace('{min}', this.$__minLength);

        this.validator(this.minLengthValidator, message, 'minimal length');

        return this;
    }


    /**
     * The validator for min
     *
     * @param {string} value The value
     *
     * @return boolean The result of the test
     */
    maxLengthValidator(value) {
        return value.length <= this.$__maxLength;
    }

    /**
     * The validator for maximal length
     *
     * @param {number} value   The minimal value
     * @param {string} message Is the message for the validator
     *
     * @return object Self-Reference for chaining
     */
    maxLength(value, message) {
        if(
            true  === isNaN(parseFloat(value)) || // not NaN
            false === isFinite(value)             // not Inf
        ) {
            throw new Error(Messages.max_invalid_parameter);
        }

        this.$__maxLength = value;

        // Add extra parameter {min}
        message = message || Messages.max_length;
        message = message.replace('{min}', this.$__maxLength);

        this.validator(this.maxLengthValidator, message, 'maximal length');

        return this;
    }


    /**
     * The validator for regex pattern
     *
     * @param {string|RegExp} value   The regex value
     * @param {string}        message Is the message for the validator
     *
     * @return object Self-Reference for chaining
     */
    regex(value, message) {
        if('string' !== typeof value && false === value instanceof RegExp)
        {
            throw new Error(Messages.regex_invalid_parameter);
        }

        // Cast to RexExp if it's a string
        if('string' === typeof value)
        {
            this.$__regex = new RegExp(value);
        }
        else
        {
            this.$__regex = value;
        }

        this.validator(this.$__regex, message || Messages.regex, 'regular expression');

        return this;
    }
}

module.exports = StringType;
