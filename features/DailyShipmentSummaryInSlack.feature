Feature: Daily Shipment Summary in Slack

    Every day there should be a summary of shipments in Slack

    Background:

        Given I have a Webhook Receiver
        And I have the Flexport Mock API

    Scenario: Summary is posted in Slack

        When I execute "invoke" of the AWS Lambda SDK with
            """
            {
                "FunctionName": "{slackNotificationShipmentSummaryLambdaName}"
            }
            """
        Then the Webhook Receiver "slack" should be called
        And the webhook request body should match this JSON
            """
            {
                "text": "Daily shipment update:"
            }
            """
