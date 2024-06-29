from models.route import Route
from models.route_edge import RouteEdge
from models.location import Location
from models.disruption import Disruption

# tests the creation of a Route Object
def test_route_construct():

    # Create Locations
    locStart= Location("id", "test route", "123 apple street", "Wilmington", "NC", 60.2, 60.5, "lab", 1.0, [] )
    locEnd= Location("id-test", "test route disrupt", "123 orange road", "Raleigh", "NC", 75.6, 60.1, "Research", 4.0, [] )

    # Create RouteEdges
    rEdge = RouteEdge(locStart, locEnd, 100.0, 1.0, [])

    polyline = [[60.2,60.5],[65.5, 60.3], [75.6 , 60.1]]

    route = Route('test-id', "shipping route", [locStart, locEnd], polyline, [rEdge], locStart, locEnd, 1.0, [])


    assert len(route.edges) == 1
    assert route.edges[0] == rEdge
    assert route.name == "shipping route"
    assert route._id == "test-id"
    assert route.end == locEnd
    assert route.start == locStart
    assert route.overall_risk == 1.0
    assert route.polyline == polyline
    assert route.locations == [locStart, locEnd]
    assert route.overall_risk == 1.0
    assert len(route.disruptions) == 0