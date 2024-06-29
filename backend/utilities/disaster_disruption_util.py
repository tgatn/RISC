from gdacs.api import GDACSAPIReader
from database import mongo
from typing import List
from models.disruption import Disruption

disaster_client = GDACSAPIReader() # Uses GDACS API to retrieve disaster information


# Get Earthquake disruptions
def get_earthquakes() -> List[Disruption]: 
  
  # TEMP: Retreive earthquakes stored in DB
  # db_earthquakes = mongo.db.earthquake.find_one()['data']
  # earthquakes = [Disruption.from_gdacs_api(e, 'earthquake') for e in db_earthquakes]

  # Live data retrieval
  response = disaster_client.latest_events('EQ', '24h', 10)
  print(response)
  earthquakes = [Disruption.from_gdacs_api(e, 'earthquake') for e in response]
  # earthquakes = list(filter(lambda e: e.risk > 5, earthquakes))
  
  return earthquakes


# Get Wildfire disruptions
def get_wildfires() -> List[Disruption]:

  # TEMP: Retreive wildfires stored in DB
  # db_wildfires = mongo.db.wildfire.find_one()['data']
  # wildfires = [Disruption.from_gdacs_api(wf, 'wildfire') for wf in db_wildfires]

  # Live data retrieval
  response = disaster_client.latest_events('WF', '7d', 10)
  wildfires = [Disruption.from_gdacs_api(wf, 'wildfire') for wf in response]

  return wildfires


# Get Flood disruptions
def get_floods() -> List[Disruption]:

  # TEMP: Retreive floods stored in DB
  # db_floods = mongo.db.flood.find_one()['data']
  # floods = [Disruption.from_gdacs_api(f, 'flood') for f in db_floods]

  # Live data retrieval
  response = disaster_client.latest_events('FL', '7d', 10)
  floods = [Disruption.from_gdacs_api(f, 'flood') for f in response]

  return floods


# Get Drought disruptions
def get_droughts() -> List[Disruption]:

  # TEMP: Retreive droughts stored in DB
  # db_droughts = mongo.db.drought.find_one()['data']
  # droughts = [Disruption.from_gdacs_api(d, 'drought') for d in db_droughts]

  # Live data retrieval
  response = disaster_client.latest_events('DR', '7d', 10)
  droughts = [Disruption.from_gdacs_api(d, 'drought') for d in response]

  return droughts


# Get Cyclone disruptions
def get_cyclones() -> List[Disruption]:

  # TEMP: Retreive cyclones stored in DB
  # db_cyclones = mongo.db.cyclone.find_one()['data']
  # cyclones = [Disruption.from_gdacs_api(c, 'cyclone') for c in db_cyclones]

  # Live data retrieval
  response = disaster_client.latest_events('TC', '7d', 10)
  cyclones = [Disruption.from_gdacs_api(c, 'cyclone') for c in response]

  return cyclones


# Get Volcano disruptions
def get_volcanoes() -> List[Disruption]:

  # TEMP: Retreive volcanoes stored in DB
  # db_volcanoes = mongo.db.volcano.find_one()['data']
  # volcanoes = [Disruption.from_gdacs_api(v, 'volcano') for v in db_volcanoes]

  # Live data retrieval
  response = disaster_client.latest_events('VO', '7d', 10)
  volcanoes = [Disruption.from_gdacs_api(v, 'volcano') for v in response]

  return volcanoes


# Get War disruptions
def get_wars() -> List[Disruption]:
  
  # Mock War data in DB
  wars = [Disruption.from_db_object(w, 'war') for w in mongo.db.war.find()]

  return wars