# Travel

## Description

REST API project for travel managment.  

## Installation

Install `npm` package dependencies: 

```bash
$ npm install
```

## Development environment

For development environment you need `NodeJS` v12+ and `docker`.  
Docker is required to run `mongodb` in containers.  

To start mongodb and redis for development environment use the `docker-compose.yml` file from the root of the project:
```bash
$ docker-compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage (coverage files generated in /coverage directory)
$ npm run test:cov
```

Note that *end to end tests* run completely in docker containers which are regenerated on each start.

## API Documentation

The OpenAPI documentation is available in non-production environment on path `/docs` (as json file on `/docs-json`).  
For localhost use `http://localhost:3000/docs`

## Lint

```bash
$ npm run lint
```

## Configuration

Configurations are passed using environment variables via a `.env` file. See file `.example.env` for a list of
configurations required by the API.  
To run *end to end* tests you need a `test/.env` file similar to the `test/.example.env` file.  
