# Distribute Aid Flexport Shipment Monitor

![Test and Release](https://github.com/distributeaid/flexport-shipment-monitor/workflows/Test%20and%20Release/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Monitor shipments on [Flexport](https://flexport.com/).

> _Note:_ This project is **not feature complete**, until then 1.x releases may
> contain breaking changes. Development is managed in
> [this project](https://github.com/orgs/distributeaid/projects/2).

This project provides

- a GraphQL API using AWS AppSync to query Flexport's
  [API v2](https://apibeta.flexport.com/), which simplifies the resolving of
  links and pagination.
- a webhook receiver to receive shipment event notifications
- a Slack notifier which posts an update to a channel when a shipment event is
  received

## Development

> ℹ️ These instructions apply to Unix-based development environments; Linux and
> Mac users should be fine. Windows users could look into setting up their
> development environment using
> [WSL2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-index).

### CLI Usage

    npm ci
    npx tsc

    export FLEXPORT_API_KEY=<your API key>

    node cli

### Deploy

Make sure your have AWS credentials in your environment.

    npm ci
    npx tsc

The Flexport API credentials need to be provided:

    aws ssm put-parameter --name /${STACK_NAME:-flexport-shipment-monitor-dev}/flexport/apiKey --type String --value <Flexport API Key>

The Slack webhook endpoint needs to be provided:

    # disable URL resolution in the AWS CLI: aws configure set cli_follow_urlparam false
    aws ssm put-parameter --name /${STACK_NAME:-flexport-shipment-monitor-dev}/slack/webhook --type String --value <Slack Webhook URL>

If this is the run the first time in an account

    npx cdk bootstrap
    npx cdk -a 'node dist/aws/cloudformation-sourcecode.js' deploy

Deploy the integration:

    npx cdk deploy

## Continuous Integration

This project is continuously tested using a real instance.

## Architecture decision records (ADRs)

see [./adr](./adr).
