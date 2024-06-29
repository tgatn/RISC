import pytest as pt

from models.route import *

def testRoute():
    r = Route()
    r.__init__("id", "r", [], [], [], )
    assert True