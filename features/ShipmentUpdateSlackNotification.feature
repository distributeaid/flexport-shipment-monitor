Feature: Shipment Update Slack notifications

    A webhook request from Flexport
    should trigger a Slack notification

    Background:

        Given I have a Webhook Receiver
        And the endpoint is "{flexportWebhookReceiverURL}"

    Scenario: Flexport sends a webhook notification

        Given I have a random ShipmentID in "shipmentID"
        Given I POST to / with this JSON
            """
            {
            "_object": "/event",
            "created_at": "2020-05-12T14:31:57.148Z",
            "data": {
            "_object": "/shipment_event_data",
            "containers": [],
            "location": {
            "_object": "/shipment_node",
            "place": {
            "_object": "/place",
            "address": {
            "_object": "/address",
            "city": "Ipswich",
            "country": "United Kingdom",
            "country_code": "GB",
            "ref": "id-146146",
            "state": null,
            "street_address": "Units 5 and 6 Lovetofts Drive",
            "street_address2": null,
            "timezone": "Europe/London",
            "unlocode": null,
            "zip": "IP1 5SF"
            },
            "details": [],
            "name": "Lombard Warehouse - Felixstowe"
            },
            "tags": [
            "deconsolidation",
            "consolidation"
            ],
            "terminal": null
            },
            "resource": {
            "_object": "/shipment_leg",
            "actual_arrival_date": "2020-05-11T12:00:00.000+01:00",
            "actual_departure_date": "2020-05-11T12:00:00.000+01:00",
            "additional_dates": {
            "cargo_ready_date": "2020-05-01",
            "delivery_appointment_scheduled_for_date": "2020-05-11T12:00:00.000+01:00"
            },
            "air_leg": null,
            "cargo_ready_date": "2020-05-01",
            "carrier_name": "Lombard",
            "destination": {
            "_object": "/shipment_node",
            "place": {
            "_object": "/place",
            "address": {
            "_object": "/address",
            "city": "Ipswich",
            "country": "United Kingdom",
            "country_code": "GB",
            "ref": "id-146146",
            "state": null,
            "street_address": "Units 5 and 6 Lovetofts Drive",
            "street_address2": null,
            "timezone": "Europe/London",
            "unlocode": null,
            "zip": "IP1 5SF"
            },
            "details": [],
            "name": "Lombard Warehouse - Felixstowe"
            },
            "tags": [
            "deconsolidation",
            "consolidation"
            ],
            "terminal": null
            },
            "estimated_arrival_date": "2020-05-11T12:00:00.000+01:00",
            "estimated_departure_date": "2020-05-11T12:00:00.000+01:00",
            "id": 7104426,
            "ocean_leg": null,
            "origin": {
            "_object": "/shipment_node",
            "place": {
            "_object": "/place",
            "address": {
            "_object": "/address",
            "city": "Chester",
            "country": "United Kingdom",
            "country_code": "GB",
            "ref": "id-315398",
            "state": null,
            "street_address": "Sealand Rd",
            "street_address2": null,
            "timezone": "Europe/London",
            "unlocode": null,
            "zip": "CH1 6BS"
            },
            "details": [],
            "name": "Dandy's"
            },
            "tags": [
            "origin_address"
            ],
            "terminal": null
            },
            "rail_leg": null,
            "shipment": {
            "_object": "/api/refs/object",
            "id": {shipmentID},
            "link": "https://api.flexport.com/shipments/{shipmentID}",
            "ref_type": "/shipment"
            },
            "transportation_mode": "truck",
            "trucking_leg": {
            "_object": "/trucking/shipment_leg",
            "container_legs": null,
            "pieces": 13,
            "service_type": "ltl",
            "tracking_number": null
            }
            },
            "shipment": {
            "_object": "/shipment",
            "actual_arrival_date": null,
            "actual_delivered_in_full_date": null,
            "actual_departure_date": null,
            "actual_picked_up_in_full_date": null,
            "air_shipment": null,
            "archived_at": null,
            "arrival_date": null,
            "booking": null,
            "buyers": [],
            "calculated_volume": {
            "_object": "/quantity/volume",
            "unit": "cbm",
            "value": 42.4
            },
            "calculated_weight": {
            "_object": "/quantity/weight",
            "unit": "kg",
            "value": 17638
            },
            "cargo_ready_date": "2020-05-01",
            "commercial_invoices": {
            "_object": "/api/refs/collection",
            "link": "https://api.flexport.com/commercial_invoices?f.shipment.id={shipmentID}",
            "ref_type": "/commercial_invoice"
            },
            "consignees": [],
            "created_date": "2020-05-08T10:52:26.019Z",
            "customs_entries": {
            "_object": "/api/refs/collection",
            "link": "https://api.flexport.com/customs_entries?f.shipment.id={shipmentID}",
            "ref_type": "/customs_entry"
            },
            "delivered_in_full_date": null,
            "departure_date": null,
            "documents": {
            "_object": "/api/refs/collection",
            "link": "https://api.flexport.com/documents?f.shipment.id={shipmentID}",
            "ref_type": "/document"
            },
            "estimated_arrival_date": null,
            "estimated_delivered_in_full_date": null,
            "estimated_departure_date": null,
            "estimated_picked_up_in_full_date": "2020-05-15T12:00:00.000+01:00",
            "freight_type": "door_to_door",
            "id": {shipmentID},
            "importers_of_record": [],
            "incoterm": "EXW",
            "it_number": null,
            "items": [],
            "legs": {
            "_object": "/api/refs/collection",
            "link": "https://api.flexport.com/shipment_legs?f.shipment.id={shipmentID}",
            "ref_type": "/shipment_leg"
            },
            "metadata": {},
            "name": "Calais < UK // May 2020: FTL // Part #03",
            "ocean_shipment": null,
            "picked_up_in_full_date": "2020-05-15T12:00:00.000+01:00",
            "pieces": 0,
            "priority": "standard",
            "sellers": [],
            "shippers": [],
            "status": "in_transit_to_final_destination",
            "transportation_mode": "truck_intl",
            "updated_at": "2020-05-12T14:31:56.032Z"
            }
            },
            "id": 1831596,
            "occurred_at": "2020-05-11T11:00:00.000Z",
            "type": "/shipment_leg#arrived",
            "version": 2
            }
            """
        Then the response status code should be 202

    Scenario: Receive the Slack notification

        Then the Webhook Receiver "slack" should be called
        And the webhook request body should match this JSON
            """
            {
                "text": "Shipment update received:",
                "attachments": [
                    {
                        "fallback": "Shipment {shipmentID} was updated: Actual Time of Arrival (ATA)",
                        "fields": [
                            {
                                "title": "Name",
                                "value": "<https://app.flexport.com/shipments/{shipmentID}|Calais &lt; UK // May 2020: FTL // Part #03>",
                                "short": true
                            },
                            {
                                "title": "ID",
                                "value": "<https://app.flexport.com/shipments/{shipmentID}|{shipmentID}>",
                                "short": true
                            },
                            {
                                "title": "Actual Time of Arrival (ATA)",
                                "value": "Shipment arrived at specified location.",
                                "short": false
                            }
                        ],
                        "footer": "<https://github.com/distributeaid/flexport-shipment-monitor|Flexport Shipment Monitor>",
                        "ts": 1589194800
                    }
                ]
            }
            """
