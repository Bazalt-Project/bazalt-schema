'use strict';

var Messages = require('../constants/errors');

/**
 * Represent an Error coming from validators of a type
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
class ValidatorError extends Error {

    /**
     * The constructor is use to define default value
     * or accept parameters
     *
     * @param properties The properties of the error
     *
     * @constructor
     */
    constructor(properties = {}) {
        var msg = properties.message;

        if(!msg)
        {
            msg = Messages.default;
        }

        // Format the message
        var message = ValidatorError.formatMessage(msg, properties);

        super(message);

        // Get the information about the StackTrace
        if(Error.captureStackTrace)
        {
            Error.captureStackTrace(this);
        }
        else
        {
            this.stack = new Error().stack;
        }

        this.properties = properties;
        this.message    = message;
        this.kind       = properties.kind;
        this.field      = properties.field;
        this.value      = properties.value;
    }

    /**
     * This function is used to
     * 
     * @param msg
     * @param properties
     *
     * @returns {*}
     */
    static formatMessage(msg, properties) {
        // Check for all properties in the message
        for(let propertyName in properties)
        {
            if('message' === propertyName)
            {
                continue;
            }

            msg = msg.replace('{' + propertyName.toLowerCase() + '}', properties[propertyName]);
        }
        
        return msg;
    }

    /**
     * Return the message of the error
     * 
     * @return string
     */
    toString() {
        return this.message;
    }
}

module.exports = ValidatorError;
