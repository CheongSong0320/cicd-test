# 아파트 시설 예약 서비스
  * PostgresSQL

## Installation

You must login to GitHub registry in order to install company distributed packages. See more information in this [link](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token).

```bash
$ npm login --scope=@hanwha-sbi --registry=https://npm.pkg.github.com
```

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
