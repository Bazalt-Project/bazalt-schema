'use strict';

var ValidatorError = require('../error/validator-error');
var Messages       = require('../constants/errors');

/**
 * Represent a Type that accept any values
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
class MixedType {

    /**
     * The identifier is used to serialize and deserialize a Type
     *
     * @return string The identifier to deserialize the type
     */
    static get identifier() {
        return 'MIXED_TYPE';
    }

    /**
     * The identifier is used to serialize and deserialize a Type
     *
     * @return string The identifier to deserialize the type
     */
    get identifier() {
        return 'MIXED_TYPE';
    }
    
    /**
     * The constructor is use to define default value
     * or accept parameters
     *
     * @param {string} field   The name of the tested key
     * @param {object} options Options used in the type
     *
     * @constructor
     */
    constructor(field, options = {}) {
        this.$__identifier = false;
        this.$__field      = field;
        this.$__options    = options;
        this.$__validators = [];

        for(var i in options)
        {
            if(this[i] && 'function' === typeof this[i])
            {
                var opts = options[i];

                if(false === Array.isArray(options[i]))
                {
                    opts = [options[i]];
                }

                this[i].apply(this, opts);
            }
        }
    }

    /**
     * The function that turn value into defined type
     *
     * @param value The value
     *
     * @return {*} The result of the cast
     */
    cast(value) {
        return value;
    }

    /**
     * The validator for required
     *
     * @param value The value
     *
     * @return boolean The result of the test
     */
    requiredValidator(value) {
        return 'undefined' !== typeof value && // not undefined
            null !== value;                    // not null
    }

    /**
     * The function that set the field required or not
     *
     * @param {boolean} required Is the field required
     * @param {string}  message  Is the message for the validator
     *
     * @return object Self-Reference for chaining
     */
    required(required, message) {
        // If not required, remove the validator
        if(false === required)
        {
            this.$__required = false;

            // Clean up the validator
            this.removeValidator(this.requiredValidator);

            return this;
        }

        this.$__required = true;

        // Add the required validator
        this.validator(this.requiredValidator, message || Messages.required, 'required');

        return this;
    }


    /**
     * The function that set the field as identifier
     *
     * @param identifier Is the field an identifier
     *
     * @return object Self-Reference for chaining
     */
    id(identifier) {
        this.$__identifier = true === identifier;

        return this;
    }

    /**
     * The function that set the default value
     *
     * @return boolean If the field is an identifier
     */
    isIdentifier() {
        return this.$__identifier;
    }


    /**
     * The function that say if there is a default value
     *
     * @return boolean The default value
     */
    hasDefault() {
        return 'undefined' !== typeof this.$__default;
    }

    /**
     * The function that return the default value
     *
     * @return The default value
     */
    getDefault() {
        if('function' === typeof this.$__default)
        {
            return this.$__default.call(this);
        }

        return this.$__default;
    }

    /**
     * The function that set the default value
     *
     * @param defaultValue Is the default value
     *
     * @return object Self-Reference for chaining
     */
    default(defaultValue) {
        if(
            null        !== defaultValue        &&
            'undefined' !== typeof defaultValue &&
            'function'  !== typeof defaultValue &&
            false       === this.requiredValidator(defaultValue)
        ) {
            throw new Error(Messages.default_value_invalid);
        }

        this.$__default = defaultValue;

        return this;
    }


    /**
     * The function that add a validator to the field
     *
     * @param {function} validator The validator
     * @param {string}   message   The message on fail from the validator
     * @param {string}   kind      The kind of error
     *
     * @return object Self-Reference for chaining
     */
    validator(validator, message, kind) {

        // Check the validity of the validator
        if('function' !== typeof validator && false === validator instanceof RegExp)
        {
            throw new Error(Messages.invalid_validator);
        }

        // If this is an instance of RegExp, wrap the test in a validator function
        if(true === validator instanceof RegExp)
        {
            var regex = validator;
            
            validator = function(value) {
                return regex.test(value);
            };
        }

        // Add the required validator
        this.$__validators.push({
            validator: validator,
            message:   message || Messages.default,
            kind:      kind    || 'user defined'
        });

        return this;
    }

    /**
     * The function that add a validator to the field
     *
     * @param {function} validator The validator
     *
     * @return object Self-Reference for chaining
     */
    removeValidator(validator) {
        if('function' === typeof validator)
        {
            // Clean up the validator
            this.$__validators = this.$__validators.filter(function(v) {
                return v.validator !== validator;
            }, this);
        }

        return this;
    }

    /**
     * The function that validate the value
     *
     * @param           value  The value
     * @param {boolean} casted Is the value already casted
     *
     * @return TypeError A TypeError if something wrong and null when all goes right
     */
    validate(value, casted = false) {
        var error    = null,
            self     = this,
            field    = this.$__field,
            required = this.$__required;

        // If a cast is needed, apply it
        if(false === casted)
        {
            value = this.cast(value);
        }

        // Add bypass for not required value
        if(
            false === required &&
            false === this.requiredValidator(value)
        ) {
            return error;
        }

        // Activate all validators
        this.$__validators.forEach(function(obj) {
            if(null !== error)
            {
                return;
            }

            // Call for validation
            var result = obj.validator.call(self, value);

            // On error, generate the error
            if(true !== result)
            {
                var properties = {
                    kind:    obj.kind,
                    field:   field,
                    value:   value,
                    message: obj.message
                };

                error = new ValidatorError(properties);
            }
        });

        return error;
    }
}

module.exports = MixedType;
