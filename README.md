# Starter Backend

This repository is a template to start a new backend (or any other backend with few tweaks)

This document describes how to set up your development environment to build and test the app.
It also explains the basic mechanics of using `git`, `node`.

- [Quick Start](#quick-start)
- [DDD and Clean Architecture](#ddd-and-clean-architecture)
- [Prerequisite Software](#prerequisite-software)
- [Getting the Sources](#getting-the-sources)
- [Installing NPM Modules](#installing-npm-modules)
- [Setup](#setup)
- [Building](#building)
- [Running Tests Locally](#running-tests-locally)
- [Formatting your Source Code](#formatting-your-source-code)
- [Linting/verifying your Source Code](#lintingverifying-your-source-code)
- [Publishing Snapshot Builds](#publishing-snapshot-builds)

See the [contribution guidelines](<>
if you'd like to contribute to the project.

## Quick Start

```sh
npm run setup
npm run local
```

## DDD and Clean Architecture

The application follows the Uncle Bob "[Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)" principles and project structure :

### Clean Architecture layers

![Schema of flow of Clean Architecture](.github/docs/assets/Uncle_Bob_Clean_Architecture.jpg)

### Project anatomy

```txt
lib                                 → Application sources
  └ README.md                       → Component documentation.
  └ application_business_rules      → Application services layer
      └ repositories                → Data access objects interfaces
      └ security                    → Security tools interfaces
      └ use_cases                   → Application business rules
  └ enterprise_business_rules       → Enterprise core business layer
      └ models                      → Domain model objects such as Entities, Aggregates, Value Objects, Business Events, etc.
      └ services                    → Domain services, e.g. business objects that manipulate multiple and different Domain Models
  └ frameworks_drivers              → Frameworks, drivers and tools such as Database, the Web Framework, mailing/logging/glue code etc.
      └ database                    → ORM and database connection objects
      └ webserver                   → Express.js Web server configuration (server, routes, plugins, etc.)
        └ server.js                 → Express.js server definition
  └ interface_adapters              → Adapters and formatters for use cases and entities to external agency such as Database or the Web
      └ controllers                 → Express.js/Serverless route handlers
      └ security                    → Security tools implementations (ex: JwtAccessTokenManager)
      └ serializers                 → Converter objects that transform outside objects (ex: HTTP request payload) to inside objects (ex: Use Case request object)
      └ storage                     → Repository implementations
 webpack
    └ webpack.common.js             → Webpack base configuration file
    └ webpack.dev.js                → Webpack development configuration file
    └ webpack.prod.js               → Webpack production configuration file
 └ node_modules (generated)         → NPM dependencies
 └ postman                          → Postman collection & env
 └ test                             → Source folder for unit or functional tests
 └ .editorconfig                     → EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs
 └ .env.sample                      → Sample of for the .env file
 └ .gitignore                       → Files and folders to ignore by git
 └ .gitmessage                      → Git commit message guidelines
 └ .npmrc                           → Npm configuration file
 └ .prettierrc                      → Code formatter configuration
 └ jest.config.js                    → Jest configuration file
 └ package.json                     → NPM definition
 └ serverless.yml                   → Serverless Framework configuration file
 └ stacks-map.js                    → Serverless Split Stacks Plugin configuration file
 └ tsconfig.json                     → Typescript configuration file
 └ tslint.js                        → Typescript linter
```

### Flow of Control

![Schema of flow of Control](.github/docs/assets/clean_architecture.svg)

### The Dependency Rule

> The overriding rule that makes this architecture work is The Dependency Rule. This rule says that source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. That includes, functions, classes. variables, or any other named software entity.

src. https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html#the-dependency-rule

### Server, Routes and Plugins

Server, routes and plugins can be considered as "plumbery-code" that exposes the API to the external world, via an instance of Express.js server.

The role of the server is to intercept the HTTP request and match the corresponding route.

Routes are configuration objects whose responsibilities are to check the request format and params, and then to call the good controller (with the received request). They are registered as Plugins.

Plugins are configuration object that package an assembly of features (ex: authentication & security concerns, routes, pre-handlers, etc.) and are registered at the server startup.

### Controllers

Controllers are the entry points to the application context.

They have 3 main responsibilities :

1. Extract the parameters (query or body) from the request
2. Call the good Use Case (application layer)
3. Return an HTTP response (with status code and serialized data)

## Prerequisite Software

Before you can build and test Super App, you must install and configure the
following products on your development machine:

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) on Mac computers, it's easier to install it using Homebrew: `brew install awscli`
- [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)); [GitHub's Guide to Installing
  Git](https://help.github.com/articles/set-up-git) is a good source of information.

- [Node.js](http://nodejs.org), (version specified in the engines field of [`package.json`](../package.json)) which is used to run a development web server,
  run tests, and generate distributable files.
  It is recomendable to install node via [NVM](https://github.com/nvm-sh/nvm)

- [Serverless](https://www.npmjs.com/package/serverless) It is necessary to configure the IAM user required for using admin cognito functions in your local machine as well as simulating the serverless offline. To configure your IAM user ask the admin for it and then follow the instructions in [Setup your AWS Credentials](#setup-your-aws-credentials) section.

## Installing NPM Modules

Next, install the JavaScript modules needed to build and test the app:

```shell
# Install project dependencies (package.json)
npm install
```

## Setup

To setup the project run

```shell
npm run setup
```

## Setup your AWS Credentials

Contact your OMNi devops administrator so they can create you an AWS SSO account.

Once logged into your SSO account, export the AWS credentials into your terminal session
to run your API.

> Important: Those credentials last for 60 minutes.

## Setup your VPN connection

All of our services runs in a private network, things like redis, SQL, etc are not accesible through the internet.
In order for you to access those resources you need to connect to the VPN.

1. Contact your OMNi devops to create a user for you :)
2. Go to <https://openvpn-dev.superapphub.com/?src=connect> and log in with your new credentials.
3. Download the certificate and download OpenVPN app.
4. Open the certificate with OpenVPN and enjoy :D

## Running

To run the project in your local machine:

```sh
npm run local
```

Once your server is up, you can use the postman collection to do requests :)
Make sure to have selected `local` as your environment in postman. Otherwise will connect to the server.

## Running Tests Locally

We use [Jest](https://jestjs.io/) for unit testing if you want to run them you can:

`npm t`
or
`npm run test`

I would suggest you do tdd for development, if so please use
`npm run tdd` this will start the jest suite in watch mode

## Formatting your source code

Super App backend uses [prettier](https://prettier.io/) to format the source code.

A better way is to set up your IDE to format the changed files on each file save, it also runs automatically on commit.

### VS Code

1. Install [Prettier-vscode](https://github.com/prettier/prettier-vscode) extension for VS Code.
2. It will automatically pick up the settings from `.prettier`.
   Follow instructions in link to configure

### WebStorm / IntelliJ

1. Install the [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier) plugin

## Linting/verifying your Source Code

You can check that your code is properly formatted and adheres to coding style by running:

```shell
$ npm run lint
```

## Attribution

This project is adapted from [jbuget@`nodejs-clean-architecture-app`](https://github.com/jbuget/nodejs-clean-architecture-app)
