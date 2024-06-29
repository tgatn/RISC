from utilities.util import get_distance_from_latlng, contains
import math 
def test_contains():

    # Test empty list
    assert not contains([], lambda x: x % 2 == 0)


    # Test with a list contains matching the filter
    assert contains([1, 2, 3, 4, 5], lambda x: x % 2 == 0)

    # Test with a list of strings(where the string contains aps substring)
    assert contains(['apple', 'grapes', 'pineapple'], lambda x: 'ap' in x)

def test_get_distance_from_latlng():

    dist = get_distance_from_latlng(20.0, 20.0, 30.0, 30.0)

    assert math.isclose(dist, 930, abs_tol= 5)

    dist = get_distance_from_latlng(-40.0, 20.0, -40.0, 30.0)

    assert math.isclose(dist, 530, abs_tol= 5)