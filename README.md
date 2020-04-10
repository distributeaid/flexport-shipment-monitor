# Distribute Flexport Shipment Monitor

![Test and Release](https://github.com/distributeaid/flexport-shipment-monitor/workflows/Test%20and%20Release/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Monitor shipments on [Flexport](https://flexport.com/)

## CLI Usage

    npm ci
    npx tsc

    export FLEXPORT_API_KEY=<your API key>

    node cli

## Deploy

Make sure your have AWS credentials in your environment.

    npm ci
    npx tsc

The Flexport API credentials need to be provided:

    aws ssm put-parameter --name /${STACK_NAME:-flexport-shipment-monitor-dev}/flexport/apiKey --type String --value <Flexport API Key>

If this is the run the first time in an account

    npx cdk bootstrap
    npx cdk -a 'node dist/aws/cloudformation-sourcecode.js' deploy

Deploy the integration:

    npx cdk deploy

## Continuous Integration

This project is continuously tested using a real instance.
