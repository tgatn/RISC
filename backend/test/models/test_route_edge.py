from models.route_edge import RouteEdge
from models.location import Location
from models.disruption import Disruption
import math


def test_route_edge_construct():

    # Create Locations
    locStart= Location("id", "test route", "123 apple street", "Wilmington", "NC", 60.2, 60.5, "lab", 1.0, [] )
    locEnd= Location("id-test", "test route disrupt", "123 orange road", "Raleigh", "NC", 75.6, 30.1, "Research", 4.0, [] )


    r_edge = RouteEdge(locStart, locEnd, 100.2, 1.2, [], 'test')

    assert r_edge.distance == 100.2
    assert r_edge.from_location == locStart
    assert r_edge.to_location == locEnd
    assert r_edge.risk == 1.2
    assert r_edge.type == 'test'

def test_route_edge_disruption():

    # Create Locations
    locStart= Location("id", "test route", "123 apple street", "Wilmington", "NC", 60.2, 60.5, "lab", 1.0, [] )
    locEnd= Location("id-test", "test route disrupt", "123 orange road", "Raleigh", "NC", 75.6, 30.1, "Research", 4.0, [] )


    r_edge = RouteEdge(locStart, locEnd, 100.2, 1.2, [], 'test')

    assert len(r_edge.disruptions) == 0

    disruption_1 = Disruption("Test Earthquake in Raleigh", "natural disaster", "1.1 earthquake in the area near Garner", 72.3, 28.7, 2.0)


    r_edge.add_disruption(disruption_1)

    assert len(r_edge.disruptions) == 1
    assert r_edge.disruptions[0] == disruption_1
    assert r_edge.risk == 2.0

    # create and test more Disruptions added to the Location
    disruption_2 = Disruption("Test Hurricane in Chapel Hill", "natural disaster", "5.6 Hurricane in the area near Chapel Hill", 70.21, 34.7, 8.0)
    disruption_3 = Disruption("Test Wildfires in Durham", "natural disaster", "9.12 wildfires in the area near Durham", 60.3, 23.73, 9.0)

    r_edge.add_disruption(disruption_2)
    r_edge.add_disruption(disruption_3)

    assert len(r_edge.disruptions) == 3
    assert r_edge.disruptions[0] == disruption_1
    assert r_edge.disruptions[1] == disruption_2
    assert r_edge.disruptions[2] == disruption_3
    assert math.isclose(r_edge.risk, 6, rel_tol=.5)