GraphQLPerformerFile YML API Documentation
==========================================

Overview
--------

`GraphQLPerformerFile` is designed to configure and perform GraphQL queries based on YML file definitions. It supports dynamic input, headers, and variable configuration.

YML Structure
-------------

### Root Elements

-   type: `string` - Type of the runner (Currently supports "graphql").
-   endpoint: `string` - The URL endpoint for the GraphQL query. Must be a valid URL.
-   query: `string` - The GraphQL query string.

### Headers (Optional)

List of headers to be sent with the request.

-   name: `string` - Name of the header.
-   value: `string` - Value of the header.

### Variables (Optional)

List of variables for the GraphQL query.

-   name: `string` - The name of the variable.
-   value: `any` - The value of the variable.

### Input (Optional)

List of input entries for dynamic input during execution.

-   name: `string` - The name of the input field.
-   type: `string` - Type of the input (e.g., "input", "password", "checkbox").
-   context: `string` - The context where the input is used ("headers" or "variables").
-   choices: `array` (optional) - List of choices for list-type inputs.
-   message: `string` (optional) - Message prompt for the input.

Example YML File
----------------

```yml
type: "graphql"
endpoint: "https://your-graphql-endpoint.com"
query: |
  query {
    yourQuery {
      field1
      field2
    }
  } headers:
  - name: "Authorization"
    value: "Bearer your_token"
variables:
  - name: "var1"
    value: "value1"
input:
  - name: "dynamicVar"
    type: "input"
    context: "variables"
    message: "Enter the value for dynamicVar"
```

Notes
-----

-   Ensure that all mandatory fields are provided in the YML file.
-   The `validate` method in the class checks for the correctness of the provided data.
-   The `perform` method executes the GraphQL query with the specified configuration.