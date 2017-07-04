'use strict';

// Define the schema class
class Schema {
    // Define allowed Types and delay requirements
    static get Types() {
        return {
            Mixed:  require('./types/mixed-type'),
            Array:  require('./types/array-type'),
            Number: require('./types/number-type'),
            Object: require('./types/object-type'),
            String: require('./types/string-type'),
            Guid:   require('./types/guid-type')
        };
    }

    // The constructor of the new model
    constructor(schema, options = {}) {
        this.$__options     = options;
        this.$__schema      = {};
        this.$__identifiers = [];
        this.$__fields      = [];
        
        if(false !== options.id)
        {
            // Initialize schema with an id
            this.add('id', {
                id:       true,
                type:     Schema.Types.Guid,
                generate: true
            });
        }

        // add each field of the schema
        for(let name in schema) {

            this.add(name, schema[name]);
        }
    }

    /**
     * This function return the identifiers of the schema
     *
     * @return Array The list of identifiers
     */
    get identifiers() {
        return this.$__identifiers || [];
    }

    /**
     * This function return the fields of the schema
     *
     * @return Array The list of fields
     */
    get fields() {
        return this.$__fields || [];
    }

    /**
     * Add a field with a definition to the schema
     *
     * @param {string} name
     * @param          definition
     *
     * @return object Self-Reference for chaining
     */
    add(name, definition) {
        if('string' !== typeof name)
        {
            throw new Error('The name of the field must be a String.');
        }

        // Encapsulate the type
        if('function' === typeof definition)
        {
            // The value is required by default
            definition = {
                type:     definition,
                required: true
            };
        }
        
        // Check for Array definition
        if(true === Array.isArray(definition))
        {
            var type = definition[0] || Schema.Types.Mixed;

            if('function' === typeof type)
            {
                type = new type(name + '[]');
            }
            else if(false === type instanceof Schema)
            {
                type = new Schema(type);
            }

            // The value is required by default
            definition = {
                type:     Schema.Types.Array,
                of:       type,
                required: true
            };
        }

        // Check the definition
        if(
            'object'   === typeof definition      &&
            'function' !== typeof definition.type
        ) {
            if(false === definition instanceof Schema)
            {
                definition = new Schema(definition);
            }

            definition = {
                type:     Schema.Types.Object,
                of:       definition,
                required: true
            };
        }

        if(
            'undefined' === typeof definition      ||
            'undefined' === typeof definition.type
        ) {
            throw new Error('The definition of "' + name + '" is invalid.');
        }

        // Load the type to the definition
        definition.type = new definition.type(name, definition);

        // Register the field
        this.$__schema[name] = definition;

        // Add the fields to the fields list
        this.$__fields.push(name);

        // Add the field to the identifier list
        if(true === definition.type.isIdentifier())
        {
            this.$__identifiers.push(name);
        }

        return this;
    }

    /**
     * Remove a field from the schema
     *
     * @param {string} name
     *
     * @return object Self-Reference for chaining
     */
    remove(name) {
        if('string' !== typeof name)
        {
            throw new Error('The name of the field must be a String.');
        }

        // Remove the field
        delete this.$__schema[name];

        // Remove the fields to the fields list
        this.$__fields = this.$__fields.filter(function(field) {
            return field !== name;
        });

        return this;
    }

    /**
     * Remove a field from the schema
     *
     * @param {string} name
     *
     * @return object The option for the given field
     */
    path(name) {
        var index = name.indexOf('.'),
            first = name.substr(0, index),
            next  = name.substr(index + 1);

        if(!first)
        {
            first = next;
            next  = '';
        }

        if(false === first in this.$__schema)
        {
            throw new Error('The given path does not exist in the schema.');
        }

        var field = this.$__schema[first];

        // Return nested schema path
        if('' !== next && true === field.of instanceof Schema)
        {
            return field.of.path(next);
        }

        return {
            default() {
                return field.type.getDefault();
            },
            
            validate(value) {

                // Validation from the type
                return field.type.validate(value);
            }
        };
    }

    /**
     * Validate values to match with the schema
     *
     * @param values An "instance" of the schema
     */
    validate(values) {
        var errors = {};

        // Check all values
        for(let name in this.$__schema)
        {
            // Load the value
            var value = (values || {})[name];

            // Validate the path
            var error = this.path(name).validate(value);

            // Save all error
            if (null !== error)
            {
                errors[name] = error;
            }
        }

        // If no errors, return null
        if(0 === Object.keys(errors).length)
        {
            return null;
        }

        return errors;
    }

    /**
     * Return a JSON representation of the schema
     *
     * @return {string} The JSON
     */
    toJSON() {
        var data = {
            schema:  this.$__schema,
            options: this.$__options
        };

        return JSON.stringify(data, function(key, value) {
            if('type' !== key || 'object' !== typeof value)
            {
                return value;
            }
            
            return value.identifier;
        });
    }

    /**
     * Generate a schema from a JSON
     *
     * @param {string} json The JSON of the Schema
     *
     * @return Schema The schema
     */
    static fromJSON(json) {
        // Try parse the JSON, or return null
        try {
            var obj = JSON.parse(json, function(key, value) {
                if('type' === key)
                {
                    for(var index in Schema.Types)
                    {
                        if(value !== Schema.Types[index].identifier)
                        {
                            continue;
                        }

                        return Schema.Types[index];
                    }
                }
                
                return value;
            });

            return new Schema(obj.schema, obj.options);
        }
        catch(error)
        {
            return null;
        }
    }
}

// Export the Model class
module.exports = Schema;
