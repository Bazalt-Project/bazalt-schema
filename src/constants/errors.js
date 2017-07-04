'use strict';

/**
 * Define all messages used in the application
 *
 * @author Tacyniak Boris
 * @version 0.0.0
 * @since 0.0.0
 */
const Messages = {
    'invalid_validator': 'The given validator is invalid.',
    'default': 'The field `{field}` could not be validate value `{value}`.',
    'required': 'The field `{field}` is required.',

    // Default value
    'default_value_invalid': 'The default value is invalid.',

    // Min validator
    'min_invalid_parameter': 'The value for minimal validator is invalid.',
    'min': 'The minimal value ({min}) of `{field}` has been exceed.',
    'min_length': 'The minimal length ({min}) of `{field}` has been exceed.',

    // Max validator
    'max_invalid_parameter': 'The value for maximal validator is invalid.',
    'max': 'The maximal value ({max}) of `{field}` has been exceed.',
    'max_length': 'The maximal length ({max}) of `{field}` has been exceed.',
    
    // Regexp validator
    'regex_invalid_parameter': 'The value for regex validator is invalid.',
    'regex': 'The value does not match with the pattern.',

    // Schema validator
    'schema': 'The value could not be validated with the given schema.',
    
    // Generated value
    'generated_invalid_parameter': 'The value to generate is invalid.',
};

module.exports = Messages;
