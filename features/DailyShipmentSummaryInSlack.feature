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
                "text": "Daily shipment update:",
                "blocks": [
                    {
                    "type": "section",
                    "text": { "type": "mrkdwn", "text": "Daily shipment update:" }
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "742030: <https://app.flexport.com/shipments/742030|Test LCL Shipment Flow with Queues and Collaboration  >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "685551: <https://app.flexport.com/shipments/685551|Ron-Quote_2 >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "650363: <https://app.flexport.com/shipments/650363|Oct 24 testing booking 111>"
                        },
                        { "type": "mrkdwn", "text": "*final_destination* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "752834: <https://app.flexport.com/shipments/752834|Test lw2>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_departure_port* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "502232: <https://app.flexport.com/shipments/502232|API TEST 3 AWB#12345>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "693814: <https://app.flexport.com/shipments/693814|Collaboration Testing!!17>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "35217: <https://app.flexport.com/shipments/35217|Testing Carrier Booking Hong October 2019>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "742047: <https://app.flexport.com/shipments/742047|Testing LCL (shipco style) >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "693835: <https://app.flexport.com/shipments/693835|Test shipment - B1!!!6>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "697130: <https://app.flexport.com/shipments/697130|Test shipment 12 3>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "693840: <https://app.flexport.com/shipments/693840|Shipper Shenzhen Factory 3>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "709156: <https://app.flexport.com/shipments/709156|Test Queue XiangYu>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "699101: <https://app.flexport.com/shipments/699101|Test LCL by Victor 22 >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "747755: <https://app.flexport.com/shipments/747755|333 yao test quote collaboration>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "737687: <https://app.flexport.com/shipments/737687|LCL Shipment Plans>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "645805: <https://app.flexport.com/shipments/645805|test booking>"
                        },
                        { "type": "mrkdwn", "text": "*arrival_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "650608: <https://app.flexport.com/shipments/650608|Create Booking>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "703026: <https://app.flexport.com/shipments/703026|Victor LCL Test 20200102_1>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_departure_port* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "561255: <https://app.flexport.com/shipments/561255|Demo Booking - SO Release 1>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_departure_port* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "740104: <https://app.flexport.com/shipments/740104|test network issue>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "678697: <https://app.flexport.com/shipments/678697|Ron-first-shipment - 985!>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "490736: <https://app.flexport.com/shipments/490736|1234>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "738018: <https://app.flexport.com/shipments/738018|Quote Collaboration Test>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493291: <https://app.flexport.com/shipments/493291|PO123 CRD Feb 21>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "422042: <https://app.flexport.com/shipments/422042|Online SI - FCL Test , PO# 1234>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "114900: <https://app.flexport.com/shipments/114900|TEST Multiparty>"
                        },
                        { "type": "mrkdwn", "text": "*arrival_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "508266: <https://app.flexport.com/shipments/508266|PO 1880, CRD 3/21, 1x20GP>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493053: <https://app.flexport.com/shipments/493053|VGM/HBL Demo 4>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "502163: <https://app.flexport.com/shipments/502163|API test 2 AWB#12345>"
                        },
                        { "type": "mrkdwn", "text": "*final_destination* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "508284: <https://app.flexport.com/shipments/508284|TEST PO 1990, CRD 3/21>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "293442: <https://app.flexport.com/shipments/293442|ONLINE SI TEST >"
                        },
                        { "type": "mrkdwn", "text": "*arrival_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "494795: <https://app.flexport.com/shipments/494795|HK to LA WH, PO 3001, CRD  3/1>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493052: <https://app.flexport.com/shipments/493052|VGM/HBL Demo 3>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "508272: <https://app.flexport.com/shipments/508272|TEST 2 CRD 3/21 >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493143: <https://app.flexport.com/shipments/493143|HBL 3 fdfd>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493347: <https://app.flexport.com/shipments/493347|PO1234, CRD FEB 21  >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "508275: <https://app.flexport.com/shipments/508275|TEST 3 CRD 3/21>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_final_destination* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "508281: <https://app.flexport.com/shipments/508281|TEST 4 CRD 3/21>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "508282: <https://app.flexport.com/shipments/508282|TEST 5 CRD 3/21>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493295: <https://app.flexport.com/shipments/493295|Flexport Seller to LA, PO 1315, CRD 2/26>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "253590: <https://app.flexport.com/shipments/253590|LCL Test Shipment>"
                        },
                        { "type": "mrkdwn", "text": "*final_destination* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493050: <https://app.flexport.com/shipments/493050|VGM/HBL Demo 1>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_arrival_port* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "504720: <https://app.flexport.com/shipments/504720|HBL task manual booking>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493297: <https://app.flexport.com/shipments/493297|Flexport Seller to LA, PO1234, CRD FEB 27  >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493142: <https://app.flexport.com/shipments/493142|HBL VGM>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493349: <https://app.flexport.com/shipments/493349|PO1234, CRD FEB 21  >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493298: <https://app.flexport.com/shipments/493298|Flexport Seller to LA, PO1234, CRD FEB 21  >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493350: <https://app.flexport.com/shipments/493350|PO1234, CRD FEB 21  >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493352: <https://app.flexport.com/shipments/493352|PO1234, CRD FEB 21    >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493293: <https://app.flexport.com/shipments/493293|Flexport Seller to LA, PO 1314, CRD 2/25>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493850: <https://app.flexport.com/shipments/493850|test shipment, PO 13579, CRD 3/15, 1x40HC>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493294: <https://app.flexport.com/shipments/493294|Flexport Seller to LA, PO1234, CRD FEB 26>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "548651: <https://app.flexport.com/shipments/548651|MAGIC LINK TEST   >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493051: <https://app.flexport.com/shipments/493051|VGM/HBL Demo 2>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "621460: <https://app.flexport.com/shipments/621460|TEST SI - HK BOOTCAMP PO# 0916>"
                        },
                        { "type": "mrkdwn", "text": "*arrival_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "542526: <https://app.flexport.com/shipments/542526|TEST COLLAB >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "509913: <https://app.flexport.com/shipments/509913|DEMO DT>"
                        },
                        { "type": "mrkdwn", "text": "*departure_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "519013: <https://app.flexport.com/shipments/519013|OFO demo 2>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "502170: <https://app.flexport.com/shipments/502170|LCL API TEST AWB#12345>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_arrival_port* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "627429: <https://app.flexport.com/shipments/627429|0925 Core Guided Assignment - TEST >"
                        },
                        { "type": "mrkdwn", "text": "*arrival_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "497706: <https://app.flexport.com/shipments/497706|API Test AWB#123TEST>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_departure_port* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "569364: <https://app.flexport.com/shipments/569364|test 6>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "165001: <https://app.flexport.com/shipments/165001|SI SI SI>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "519012: <https://app.flexport.com/shipments/519012|OFO demo 1, test>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "523493: <https://app.flexport.com/shipments/523493|OFO 3   >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493348: <https://app.flexport.com/shipments/493348|PO1234, CRD FEB 21  >"
                        },
                        { "type": "mrkdwn", "text": "*departure_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "561785: <https://app.flexport.com/shipments/561785|ISF LAUNCH>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "492680: <https://app.flexport.com/shipments/492680|TEST VGM/HBL>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "502164: <https://app.flexport.com/shipments/502164|API test 2 AWB#12345>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "647084: <https://app.flexport.com/shipments/647084|wp test booking>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "576511: <https://app.flexport.com/shipments/576511|test quote bug >"
                        },
                        { "type": "mrkdwn", "text": "*arrival_port* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "663832: <https://app.flexport.com/shipments/663832|CFS-CY Flexport Demo Shipper LCL FLEX ID>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "627213: <https://app.flexport.com/shipments/627213|Air Schedule TEST>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "670593: <https://app.flexport.com/shipments/670593|Testing demo>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "708335: <https://app.flexport.com/shipments/708335|OriginOps Plan Queue Test>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "502173: <https://app.flexport.com/shipments/502173|API LCL DEMO AWB#888>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "694931: <https://app.flexport.com/shipments/694931|Yao test shipment 12-1>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "569335: <https://app.flexport.com/shipments/569335|TEST>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "659879: <https://app.flexport.com/shipments/659879|fsfsdfds>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "737080: <https://app.flexport.com/shipments/737080|Quote Collaboration>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (3 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "719185: <https://app.flexport.com/shipments/719185|Shipper review 1052>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_arrival_port* (3 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "693798: <https://app.flexport.com/shipments/693798|PO123 Urgent product launch shipment LA>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "646568: <https://app.flexport.com/shipments/646568|Test Annie 1019_01  !>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "509792: <https://app.flexport.com/shipments/509792|S. China Catchment Area Test>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "646584: <https://app.flexport.com/shipments/646584|Test Annie 1019_02>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "699066: <https://app.flexport.com/shipments/699066|Test by Victor>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "710401: <https://app.flexport.com/shipments/710401|PO2019SC1 Stuffed Toys>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "680836: <https://app.flexport.com/shipments/680836|lcltest1>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "647300: <https://app.flexport.com/shipments/647300|BEARS!>"
                        },
                        { "type": "mrkdwn", "text": "*final_destination* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "585525: <https://app.flexport.com/shipments/585525|Purchase Order>"
                        },
                        { "type": "mrkdwn", "text": "*arrival_port* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "662738: <https://app.flexport.com/shipments/662738|demo shipper PO666 CRD 1111>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (4 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "698285: <https://app.flexport.com/shipments/698285|lcl shipment>"
                        },
                        { "type": "mrkdwn", "text": "*departure_port* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "699750: <https://app.flexport.com/shipments/699750|Victor LCL Test 20191226_1>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "699752: <https://app.flexport.com/shipments/699752|Victor LCL Test 20191226_2>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "653678: <https://app.flexport.com/shipments/653678|CRD test 2 - no origin leg>"
                        },
                        { "type": "mrkdwn", "text": "*departure_port* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "638131: <https://app.flexport.com/shipments/638131|DZ1 consol box - Week 50 // ETD: 12-Dec // ETA: 10-Jan>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "630507: <https://app.flexport.com/shipments/630507|Test DZ 3>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "625375: <https://app.flexport.com/shipments/625375|PO2019SC1 Grey Bear>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "615927: <https://app.flexport.com/shipments/615927|TEST BOOKING>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "566020: <https://app.flexport.com/shipments/566020|Trial of UNIS Demo >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "566014: <https://app.flexport.com/shipments/566014|UNIS Demo >"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "527638: <https://app.flexport.com/shipments/527638|Demo with Hilltop>"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "*in_transit_to_arrival_port* (5 months ago)"
                        }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "534738: <https://app.flexport.com/shipments/534738|try booking air>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "707481: <https://app.flexport.com/shipments/707481|joey_isf_test>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "637102: <https://app.flexport.com/shipments/637102|DZ consol box - Week 49 // ETD: 05-Dec // ETA: 03-Jan>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "702977: <https://app.flexport.com/shipments/702977|testststs>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "693843: <https://app.flexport.com/shipments/693843|Shipper Tasks:  Login as demo shipper: https://core.flexport.com/clients/14820/company FLEX-ID: 693798>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "693846: <https://app.flexport.com/shipments/693846|Demo Testing PO123 Collaboration Flow>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "693824: <https://app.flexport.com/shipments/693824|PO123 Collaboration shipment>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "683210: <https://app.flexport.com/shipments/683210|sky test workflow68>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "680833: <https://app.flexport.com/shipments/680833|test crd>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "649380: <https://app.flexport.com/shipments/649380|test strategy goods>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "659869: <https://app.flexport.com/shipments/659869|test chinese description>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "638247: <https://app.flexport.com/shipments/638247|test>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "653585: <https://app.flexport.com/shipments/653585|CRD change behavior test>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "494543: <https://app.flexport.com/shipments/494543|ABC Shipper, PO 1331, CRD 2/28>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "494819: <https://app.flexport.com/shipments/494819|PO 1999, CRD 3/1, 1x40HQ, to LA Warehouse>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "493173: <https://app.flexport.com/shipments/493173|MegaMeng shipment>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (5 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "617249: <https://app.flexport.com/shipments/617249|PO 123 CRD 9/11 Ocean ASN#>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (7 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "474722: <https://app.flexport.com/shipments/474722|Dummy Booking for PRE booking tool NGB>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (8 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "474723: <https://app.flexport.com/shipments/474723|Dummy Booking for PRE booking tool SHA>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (8 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "476205: <https://app.flexport.com/shipments/476205|Dummy Booking for PRE booking tool XMN>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (8 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "476207: <https://app.flexport.com/shipments/476207|Dummy Booking for PRE booking tool SHA>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (8 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "476206: <https://app.flexport.com/shipments/476206|Dummy Booking for PRE booking tool NGB>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (8 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "474721: <https://app.flexport.com/shipments/474721|Dummy Booking for PRE booking tool XMN>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (8 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "section",
                    "fields": [
                        {
                        "type": "mrkdwn",
                        "text": "494803: <https://app.flexport.com/shipments/494803|HK to LA WH, PO 3002, CRD 3/1>"
                        },
                        { "type": "mrkdwn", "text": "*seller_location* (8 months ago)" }
                    ]
                    },
                    { "type": "divider" },
                    {
                    "type": "context",
                    "elements": [
                        {
                        "type": "image",
                        "image_url": "https://avatars.slack-edge.com/2020-04-12/1056354706722_95e3fe4fe56c78325e48_512.png",
                        "alt_text": "Flexport Shipment Monitor"
                        },
                        {
                        "type": "mrkdwn",
                        "text": "<https://github.com/distributeaid/flexport-shipment-monitor|Flexport Shipment Monitor>"
                        }
                    ]
                    }
                ]
                }
            """
