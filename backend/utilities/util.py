from math import radians, cos, sin, asin, sqrt

# Distance between two lat/lng coordinates in km using the Haversine formula
# Copyright 2016, Chris Youderian, SimpleMaps, http://simplemaps.com/resources/location-distance
# Released under MIT license - https://opensource.org/licenses/MIT
def get_distance_from_latlng(lat1, lng1, lat2, lng2):
  r = 6371 # radius of the earth in km
  lat1 = radians(lat1)
  lat2 = radians(lat2)
  lat_dif = lat2 - lat1
  lng_dif = radians(lng2 - lng1)
  a = sin(lat_dif / 2.0)**2 + cos(lat1) * cos(lat2) * sin(lng_dif / 2.0)**2
  d = 2 * r * asin(sqrt(a))
  return d * 0.621371 # return miles


# Checks if a list contains a value based on a provided condition
def contains(list, filter):
  for x in list:
    if filter(x):
      return True
  return False