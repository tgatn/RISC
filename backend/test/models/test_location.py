from models.location import Location
from models.disruption import Disruption
import math

# tests the creation of a Location Object
def test_location_construct():

    # Create a Location
    loc= Location("id", "test route", "123 apple street", "Wilmington", "NC", 60.2, 60.5, "lab", 1.0, [] )

    # check each field
    assert loc.city == 'Wilmington'
    assert loc.address == '123 apple street'
    assert loc._id == 'id'
    assert loc.country == 'NC'
    assert loc.latitude == 60.2
    assert loc.longitude == 60.5
    assert loc.type == 'lab'
    assert loc.risk == 1.0
    assert len(loc.disruptions) == 0

# tests the creation of a Location object and add Disruptions, checking risks
def test_location_add_disruption():

    # create a Location and a Disruption
    loc= Location("id-test", "test route disrupt", "123 orange road", "Raleigh", "NC", 75.6, 30.1, "Research", 4.0, [] )
    disruption_1 = Disruption("Test Earthquake in Raleigh", "natural disaster", "1.1 earthquake in the area near Garner", 72.3, 28.7, 2.2)

    # assert and check each fields
    assert len(loc.disruptions) == 0

    loc.add_disruption(disruption_1)

    assert loc.risk == 2.2
    assert len(loc.disruptions) == 1
    assert loc.disruptions[0] == disruption_1

    # create and test more Disruptions added to the Location
    disruption_2 = Disruption("Test Hurricane in Chapel Hill", "natural disaster", "5.6 Hurricane in the area near Chapel Hill", 70.21, 34.7, 8.2)
    disruption_3 = Disruption("Test Wildfires in Durham", "natural disaster", "9.12 wildfires in the area near Durham", 60.3, 23.73, 7.1)

    # assert and check each fields
    loc.add_disruption(disruption_2)
    assert math.isclose(5.2, loc.risk, rel_tol= .5)
    assert len(loc.disruptions) == 2
    assert loc.disruptions[0] == disruption_1
    assert loc.disruptions[1] == disruption_2

    loc.add_disruption(disruption_3)
    assert math.isclose(5.8, loc.risk, rel_tol= .5)
    assert len(loc.disruptions) == 3
    assert loc.disruptions[0] == disruption_1
    assert loc.disruptions[1] == disruption_2
    assert loc.disruptions[2] == disruption_3

