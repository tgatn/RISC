import requests
from requests.structures import CaseInsensitiveDict
from models.route_coordinate import RouteCoordinate
from models.location import Location
import searoute as sr
from typing import List
from geojson import Feature
from dotenv import load_dotenv
import os


def get_land_route_data(start: dict, destination: dict) -> dict:
    lat1 = start['latitude']
    long1 = start['longitude']

    lat2 = destination['latitude']
    long2 = destination['longitude']

    load_dotenv()
    geo_api_key = os.getenv("GEO_API_KEY")

    url = f"https://api.geoapify.com/v1/routing?waypoints={lat1},{long1}|{lat2},{long2}&mode=drive&apiKey={geo_api_key}"

    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"

    resp = requests.get(url, headers=headers)

    jsonData = resp.json()

    return jsonData


def get_water_route_data(start: dict, destination: dict) -> dict:
    lat1 = start['latitude']
    long1 = start['longitude']

    lat2 = destination['latitude']
    long2 = destination['longitude']

    #Define origin and destination points:
    origin = [long1, lat1]
    destinationEnd = [long2, lat2]

    resp = sr.searoute(origin, destinationEnd)

    dict_resp = {
        "type": "Feature",
        "geometry": resp.geometry,
        "properties": resp.properties
    }

    return dict_resp

# loc1 = Location('100', 'test', 'chekcing drive', 'NC', 'USA', 50.679023, 4.569876, 'fake', '0', [])
# loc2 = Location('101', 'te', 'double drive', 'WS', 'USA', 50.66170, 4.578667, 'qwerty', '0', [])

# dicts = get_land_route_data(loc1, loc2)
# print(dicts)

# loc1Water = Location('100', 'test', 'chekcing drive', 'NC', 'USA', 0.3515625, 50.064191736659104, 'fake', '0', [])
# loc2Water = Location('101', 'te', 'double drive', 'WS', 'USA', 117.42187500000001, 39.36827914916014, 'qwerty', '0', [])

# dictsWater = get_water_route_data(loc1Water, loc2Water)
# print(dictsWater)