@techthos/web-performer
=======================

![Web-Performer Banner](./assets/banner.png)

@techthos/web-performer is a robust tool designed to perform HTTP actions based on YML definitions. Streamline your web requests and automate your workflows with ease using our intuitive YML configuration.

Features
--------

-   Perform complex HTTP and GraphQL requests with simple YML configurations.
-   Customizable and user-friendly CLI interface.
-   Efficient and streamlined for administrative and development use.

Installation
------------

Install @techthos/web-performer via npm

```bash
npm install @techthos/web-performer
```

Usage
-----

After installation, you can use the `performer` command to execute your HTTP actions. Here's a basic example:

```bash
performer run -f <path-to-your-yml-file>
```

Refer to the YML configuration guide for detailed usage.

Configuration
-------------

Define your HTTP requests and GraphQL queries in a YML file. Here's a structure example:

```yml
version: "1"
type: graphql
endpoint: <your-endpoint>
headers:
  - name: <header-name>
    value: <header-value>
...
```

For more see:

- [GraphQLPerformerFile YML API](./docs/GraphQLPerformerFile.md)

Building
--------

To build the project, run:

```bash
npm run build
```

Contributing
------------

We welcome contributions! Please submit pull requests for any enhancements, bug fixes, or features.

Author
------

Techthos L.P. Email: alexandros.fotiadis@techthos.net

License
-------

This project is licensed under the MIT License.

* * * * *

You can customize this README.md to better fit your project's specific needs and add additional sections as required.