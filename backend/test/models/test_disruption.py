from models.disruption import Disruption
import math

# tests the creation of a Disruption Object
def test_disruption_construct():
    disruption = Disruption("Test Earthquake in New York", "natural disaster", "3.5 earthquake in the area near Rochester", 55.3, 16.7, 1.0)

    assert disruption.description == "3.5 earthquake in the area near Rochester"
    assert disruption.latitude == 55.3
    assert disruption.longitude == 16.7
    assert disruption.risk == 1.0
    assert disruption.title == "Test Earthquake in New York"
    assert disruption.type == "natural disaster"

def test_gdacs_disruption():

    json_response = {
        "title": "Green earthquake alert (Magnitude 5M, Depth:129.185km) in [unknown] 12/03/2024 05:02 UTC, No people affected in 100km.",
        "description": "On 3/12/2024 5:02:23 AM, an earthquake occurred in [unknown] potentially affecting No people affected in 100km. The earthquake had Magnitude 5M, Depth:129.185km.",
        "enclosure": {
            "@type": "image/png",
            "@length": "1",
            "@url": "https://www.gdacs.org/contentdata/resources/imgtemp/gdacs/eq/eq1558632_1.png"
        },
        "gdacs:temporary": "false",
        "link": "https://www.gdacs.org/report.aspx?eventtype=EQ&eventid=1419212",
        "pubDate": "Tue, 12 Mar 2024 05:18:39 GMT",
        "gdacs:dateadded": "Tue, 12 Mar 2024 05:18:39 GMT",
        "gdacs:datemodified": "Tue, 12 Mar 2024 05:42:43 GMT",
        "gdacs:iscurrent": "true",
        "gdacs:fromdate": "Tue, 12 Mar 2024 05:02:23 GMT",
        "gdacs:todate": "Tue, 12 Mar 2024 05:02:23 GMT",
        "gdacs:durationinweek": "0",
        "gdacs:year": "2024",
        "dc:subject": "EQ1",
        "guid": {
            "@isPermaLink": "false",
            "#text": "EQ1419212"
        },
        "geo:Point": {
            "geo:lat": "-60.0325",
            "geo:long": "-27.6893"
        },
        "gdacs:bbox": "-31.6893 -23.6893 -64.0325 -56.0325",
        "georss:point": "-60.0325 -27.6893",
        "gdacs:cap": "https://www.gdacs.org/contentdata/resources/EQ/1419212/cap_1419212.xml",
        "gdacs:icon": "https://www.gdacs.org/Images/gdacs_icons/alerts/Green/EQ.png",
        "gdacs:version": "1",
        "gdacs:eventtype": "EQ",
        "gdacs:alertlevel": "Green",
        "gdacs:alertscore": "0",
        "gdacs:episodealertlevel": "Green",
        "gdacs:episodealertscore": "1",
        "gdacs:eventname": None,
        "gdacs:eventid": "1419212",
        "gdacs:episodeid": "1558632",
        "gdacs:calculationtype": "earthquakeonly",
        "gdacs:severity": {
            "@unit": "M",
            "@value": "5",
            "#text": "Magnitude 5M, Depth:129.2km"
        },
        "gdacs:population": {
            "@unit": "in MMI -",
            "@value": "0"
        },
        "gdacs:vulnerability": {
            "@value": "1.3145341380124"
        },
        "gdacs:iso3": None,
        "gdacs:country": None,
        "gdacs:glide": None,
        "gdacs:mapimage": None,
        "gdacs:maplink": None,
        "gdacs:gtsimage": None,
        "gdacs:gtslink": None,
        "gdacs:resources": {
            "gdacs:resource": {
                "@id": "event_rss",
                "@version": "0",
                "@source": "EC-JRC",
                "@url": "https://www.gdacs.org//datareport/resources/EQ/1419212/rss_1419212.xml",
                "@type": "rss",
                "gdacs:title": "Event in rss format",
                "gdacs:description": "Joint Research Center of the European Commission",
                "gdacs:acknowledgements": "Copyright European Union. Syndication allowed, provided the source is acknowledged.",
                "gdacs:accesslevel": "Public"
            }
        }
    }

    disruption = Disruption.from_gdacs_api( json_response, 'natural disaster')

    assert disruption.title == "Green earthquake alert (Magnitude 5M, Depth:129.185km) in [unknown] 12/03/2024 05:02 UTC, No people affected in 100km."
    assert disruption.type == "natural disaster"
    assert disruption.description == 'On 3/12/2024 5:02:23 AM, an earthquake occurred in [unknown] potentially affecting No people affected in 100km. The earthquake had Magnitude 5M, Depth:129.185km.'
    assert disruption.latitude == -60.0325
    assert disruption.longitude == -27.6893
    assert disruption.risk == 0.0


    
    