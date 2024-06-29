import math
import numpy as np
import os

from flask import Blueprint, Response, jsonify, request, json
from typing import List
from bson import ObjectId
from bson.errors import InvalidId

from database import mongo, to_json
from utilities.disaster_disruption_util import get_earthquakes, get_wildfires, get_floods, get_droughts, get_cyclones, get_volcanoes, get_wars
from utilities.violence_disruptions_util import get_violence_events_country
from utilities.cyber_disruption_util import get_cyber_disruption
from utilities.util import contains, get_distance_from_latlng
from models.disruption import Disruption
from models.route import Route
from models.route_edge import RouteEdge
from models.location import Location
from utilities.routes_api_util import get_water_route_data, get_land_route_data
from collections import namedtuple

# import time

routes = Blueprint('routes', __name__, url_prefix='/api/routes')

# get all the routes in the DB --> GET
@routes.route('', methods=['GET'])
def get_all_routes():
  try: 

    # Get all locations that we have to work with
    all_locations = [Location.from_db_object(l) for l in mongo.db.location.find()]
    
    # Get all routes from the DB
    all_routes = [Route.from_db_object(r, all_locations) for r in mongo.db.route.find()]

    for r in all_routes:
      r.calculate_risk()

    all_routes.sort(key=lambda x: x.overall_risk) # Sort by route risk (lowest first)

    return Response(to_json(all_routes), status=200, headers={'Content-Type': 'application/json'})

  except Exception as e:
    print(e)
    return Response('Error retrieving routes', status=500)
  
# add a route in the DB --> POST
@routes.route('', methods=['POST'])
def post_route():
  try:
    # load the route from json
    r: Route = json.loads(request.data)
    
    # make sure route info is valid
    if r['start'] != '' and r['end'] != '' and len(r['edges']) > 0: # All necessary information present
      # Check if any edges are incomplete
      incomplete_edge: bool = False
      # create a list of edge ids for db
      edgesList = list()
      for edge in r['edges']:
        print(edge)
        if edge['from_location'] == '' or edge['to_location'] == '' or edge['type'] == '':
          incomplete_edge = True
          break
        # store the ids of the two points in the list
        edgesList.append([edge['from_location']['_id'], edge['to_location']['_id'], edge['type']])
      
      
      if not incomplete_edge: # All paths are complete without missing nodes
        # if r['_id'] == '': # Create new route
          
        responseList = list()
    
        for edge in r['edges']:

          from_id = ObjectId(edge['from_location']['_id'])
          from_location  = mongo.db.location.find_one({"_id": from_id})
          to_id = ObjectId(edge['to_location']['_id'])
          to_location  = mongo.db.location.find_one({"_id": to_id})


          if to_location is None or from_location is None:
            print(from_id)
            print(from_location)
            print(to_location)
            return Response(f'No location with id', status=404)
          
          edge_type = edge['type']

          if edge_type == 'land':
            features = get_land_route_data(from_location, to_location)
            feature = features['features'][0]
            route_coordinates = feature['geometry']['coordinates'][0]

            responseList.extend(route_coordinates)
            # for coordinate in route_coordinates:
            #   responseList.append(coordinate)

          elif edge_type == 'sea':
            feature = get_water_route_data(from_location, to_location)
            route_coordinates = feature['geometry']['coordinates']
            responseList.extend(route_coordinates)
            # for coordinate in route_coordinates:
            #   responseList.append(coordinate)
      
        jsonList = json.dumps(responseList)

        post_result = mongo.db.route.insert_one({ 'start': r['start']['_id'], 'end': r['end']['_id'], 'path': edgesList, 'name': r['name'], 'polyline': responseList})
          # return jsonify({
          #   'message': 'Post operation successful',
          #   'inserted_id': str(post_result.inserted_id)
          # })
      
      

      return Response(jsonList, mimetype='application/json', status=200)

  except Exception as e:
    print(e)
    return Response('Error adding route', status=500)
  
# edit a route in the DB --> PUT  
@routes.route('', methods=['PUT'])  
def edit_route():
  try:
    
    r: Route = json.loads(request.data)
    # Get the route from the JSON dictionary loaded
    r = r['route']
    print(r)
    if r['start'] != '' and r['end'] != '' and len(r['edges']) > 0: # All necessary information present
      # Check if any edges are incomplete
      incomplete_edge: bool = False
      edgesList = list()
      for edge in r['edges']:
        if edge['from_location'] == '' or edge['to_location'] == '' or edge['type'] == '':
          incomplete_edge = True
          break
        # add only the ids to the list that will be posted to DB
        edgesList.append([edge['from_location']['_id'], edge['to_location']['_id'], edge['type']])
      
      if not incomplete_edge: # All paths are complete without missing nodes
        try:
          id = ObjectId(r['_id']) # Converts string ID to ObjectId type
        except InvalidId as e:
          print(e)
          return Response('Invalid Route ID', status=400)

        responseList = list()
        for edge in r['edges']:

          from_id = ObjectId(edge['from_location']['_id'])
          from_location  = mongo.db.location.find_one({"_id": from_id})
          to_id = ObjectId(edge['to_location']['_id'])
          to_location  = mongo.db.location.find_one({"_id": to_id})

          if to_location is None or from_location is None:
            print(from_id)
            print(from_location)
            print(to_location)
            return Response(f'No location with id', status=404)
          
          edge_type = edge['type']


          if edge_type == 'land':
            features = get_land_route_data(from_location, to_location)
            feature = features['features'][0]
            
            
            route_coordinates = feature['geometry']['coordinates'][0]

            responseList.extend(route_coordinates)

            # responseList += route_coordinates

            # for coordinate in route_coordinates:
            #   responseList.append(coordinate)

          elif edge_type == 'sea':
            feature = get_water_route_data(from_location, to_location)
            route_coordinates = feature['geometry']['coordinates']

            responseList.extend(route_coordinates)

            # responseList += route_coordinates

            # for coordinate in route_coordinates:
            #   responseList.append(coordinate)
      
        jsonList = json.dumps(responseList)

        # update the stored route in the DB
        update_result = mongo.db.route.find_one_and_update({'_id': id}, { '$set': { 'start': r['start']['_id'], 'end': r['end']['_id'], 'path': edgesList, 'name': r['name'], 'polyline':responseList }})
        return jsonify({
          'message': 'Put operation successful',
          'updated_id': str(update_result['_id']),
          'coordinates': jsonList
        })

    return Response('No update necessary', status=200)

  except Exception as e:
    print(e)
    return Response('Error updating route', status=500)

# delete a route in the DB --> DELETE
@routes.route('/<string:route_id>', methods=['DELETE'])
def delete_route(route_id):

  try:
    id = ObjectId(route_id) # Converts string ID to ObjectId type
  except InvalidId as e:
    print(e)
    return Response('Invalid ID', status=400)

  try:
    delete_result = mongo.db.route.delete_one({'_id': id})
    if delete_result.deleted_count == 0:
      return Response(f'No route found with id {route_id}', status=404)
    else:
      return jsonify({
        'message': 'Delete operation successful',
        'deletedCount': delete_result.deleted_count,
        'id': route_id
      })
  except Exception as e:
    print(e)
    return Response('Error deleting route', status=500)


@routes.route('/disruption', methods=['POST'])
def toggle_disruption():
  try: 
    form = json.loads(request.data)
    disruption_type: str = form['disruption_type']
    disruption_type = disruption_type.strip().lower()
    existing_disruptions: List[Disruption] = [Disruption.from_api_request(d) for d in form['existing_disruptions']]
    add_disruption: bool = form['add']



    # If adding disruptions to map
    if add_disruption:
      disruptions_to_add: List[Disruption] = []
      if disruption_type == 'earthquake':
        disruptions_to_add = get_earthquakes()
      elif disruption_type == 'wildfire':
        disruptions_to_add = get_wildfires()
      elif disruption_type == 'flood':
        disruptions_to_add = get_floods()
      elif disruption_type == 'drought':
        disruptions_to_add = get_droughts()
      elif disruption_type == 'volcano':
        disruptions_to_add = get_volcanoes()
      elif disruption_type == 'cyclone':
        disruptions_to_add = get_cyclones()
      elif disruption_type == 'war':
        disruptions_to_add = get_wars()
      elif disruption_type == 'cyber':
        disruptions_to_add.extend(get_cyber_disruption())
      elif disruption_type == 'unrest':
        # Get all locations that we have to work with
        all_locations = [Location.from_db_object(l) for l in mongo.db.location.find()]
        disruptions_to_add.extend(get_violence_events_country(all_locations))
        
      
      existing_disruptions.extend(disruptions_to_add) # Add new disruptions to list of existing ones

    # Removing disruptions from map
    else:
      existing_disruptions = list(filter(lambda d: d.type != disruption_type, existing_disruptions))


    # Get all locations that we have to work with
    all_locations = [Location.from_db_object(l) for l in mongo.db.location.find()]
    
    # Get all routes from the DB
    all_routes = [Route.from_db_object(r, all_locations) for r in mongo.db.route.find()]


    # Predictive analysis on routes --> calculate risk rating of locations, edges, and overall route and add disruptions to model
    if len(existing_disruptions) != 0:
      calculate_route_risk(all_routes, existing_disruptions) # Figures out which disruptions will affect certain routes
    else:
      for route in all_routes:
        route.overall_risk = 0
    all_routes.sort(key=lambda x: x.overall_risk) # Sort by route risk (lowest first)


    return Response(
      to_json({
        'disruptions': existing_disruptions,
        'routes': all_routes
      }),
      status=200, 
      headers={'Content-Type': 'application/json'}
    )

  except Exception as e:
    print(e)
    return Response('Error while retrieving and analyzing disruptions', status=500)

def calculate_route_risk(routes: List[Route], disruptions: List[Disruption]):
  DISTANCE_THRESHOLD = 2000  # NOTE: Change distance based on how sensitive we want our appplication to be
  DISTANCE_RISK_SCALAR = 2000 # scalar that determines the sensitivity of our risk score to distance
  MAX_GDACS_RISK = 2.5      # max GDACS risk score. used in rescaling a route risk to align with GDACS conventions

  route_coord = namedtuple('route_coord', ['local_risk', 'closest_dis', 'dist_to_closest_dis'])

  # CALCULATE DISTANCE
  # before_dist_calc = time.time() # Record these results somewhere
  for route in routes:
    route_coords = []
    for i in range(0, len(route.polyline)):
      this_coord = route_coord(-1, None, 100000000)

      for disruption in disruptions:
        distance = get_distance_from_latlng(route.polyline[i][1], route.polyline[i][0], disruption.latitude, disruption.longitude) # Find distance between location and disruption

        if distance < this_coord.dist_to_closest_dis: 
          this_coord = route_coord(disruption.risk, disruption, distance)

        if distance <= DISTANCE_THRESHOLD: # If distance is below the threshold, add disruption to route
          # Add disruption to route if it isn't already added
          if not contains(route.disruptions, lambda d: d.latitude == disruption.latitude and d.longitude == disruption.longitude):
            route.disruptions.append(disruption)

      route_coords.append(this_coord)

    # Now, we have the closest disruption to every polyline point in route_coords
    # Next, we need to:
    #   1. Determine Raw Risk Score:
    #       Translate the risk from each route point into an overall route risk score
    #   2. Normalize Risk Score:
    #       Assign a metric to compare different whole routes, on the scale from 0 (no risk) to 1 (max risk)
    #       This step is important because it allows users to import common scipy functions that are normalized
    #   3. Scale Risk Score:
    #       Scale the 0-1 risk score to be from 0-100

    # Step 1: Determine Raw Risk Score
      # This is a combination of distance and risk severity 
      # (determined by external API, contained in the disruption objects)

    raw_route_risks = []
    raw_route_risk = None
    for node in route_coords:
      # distance/scaling factor
      # outputs an array to then use according to .env file specifications
      raw_node_risk = weigh_distance_with_risk(node.dist_to_closest_dis, node.local_risk)
      raw_route_risks.append(raw_node_risk)

    # gets array comparison technique from .env file      
    array_comparison_technique_str = os.getenv("RISK_DETERMINE_RAW_SCORE", "AVERAGE")

    
    # validates .env file string. This approach is very modular and more options can easily be added by developers.
    if array_comparison_technique_str == "AVERAGE":
      array_comparison_technique = np.average
    elif array_comparison_technique_str == "MIN":
      array_comparison_technique = min
    elif array_comparison_technique_str == "MAX":
      array_comparison_technique = max
    else:
      array_comparison_technique = np.average # This is the default option

    # assigns the route a raw risk score according to the given preferred way of comparing array elements
    raw_route_risk = array_comparison_technique(raw_route_risks)

    # Step 2: Normalize Risk Score
    #   First, scale input so that the input corresponds to the "interesting" parts of the selected function
    #   Next, apply the function, this doesn't necessarily reduce in nice numbers from 0 to 1 though
    #   Then, scale the output, so that we're left only with numbers between 0 and 1 (though not necessarily
    #     spanning that whole range, say, if we don't have any high-risk routes at the moment)
    
    # take max risk score we're allowing, and min, then find the range (maybe within 5 miles of a disruption?)
    # then, do a fit so that the user's function can evaluate the max to be 1, and the lowest to be 0
    # max risk: score of 2.5, less than 5 miles away: that's 2.5/10 = .5

    max_possible_risk = .5 # perhaps have this as a modifiable sensitivity in the .env file?
    min_possible_risk = 0
    
    med_possible_risk = .005
    st_dev_possible_risk = .0025
    
    # scale the input
    pre_norm_scaled_risk = pre_norm_scaling(raw_route_risk, min_possible_risk, max_possible_risk)

    # gets route risk comparison technique from .env file

    custom_risk_stretching_str = os.getenv("RISK_BTWN_ROUTES_COMPARISON", "NOT_A_NUMPY_FUNCTION")

    
    # validates .env file string
    if is_valid_numpy_function(custom_risk_stretching_str) is not False or is_valid_math_function(custom_risk_stretching_str) is not False:
      custom_risk_stretching = is_valid_math_function(custom_risk_stretching_str)
    else:
      custom_risk_stretching = lambda x: math.erfc((med_possible_risk - x) / (math.sqrt(2) * st_dev_possible_risk))

    # finds where the scaled risk fits on the dev input function
    x = pre_norm_scaled_risk
    norm_scaled_risk = custom_risk_stretching(x)
    
    # squashes the new scaled risk into somewhere on the range from 0 to 1
    new_min = 0
    new_max = custom_risk_stretching(max_possible_risk)
    normalized_risk_score = post_norm_scaling(norm_scaled_risk, new_min, new_max)
    
    # Step 3: Scale Risk Score
    risk_score_one_to_hundred = round(normalized_risk_score * 100)

    # assign risk
    route.overall_risk = risk_score_one_to_hundred


def is_valid_math_function(function_name):
  try:
    # Attempt to fetch the function dynamically
    func = getattr(math, function_name)
    # Check if the fetched attribute is callable
    return func
  except AttributeError:
    # If the attribute doesn't exist in Math
    return False

def is_valid_numpy_function(function_name):
  try:
    # Attempt to fetch the function dynamically
    func = getattr(np, function_name)
    # Check if the fetched attribute is callable
    return func
  except AttributeError:
    # If the attribute doesn't exist in NumPy
    return False

def weigh_distance_with_risk(distance, risk):
  return risk / distance

def pre_norm_scaling(vector, min_val, max_val):
  scaled_vector = (vector - min_val) / (max_val - min_val)
  return scaled_vector

def post_norm_scaling(vector, min_val, max_val):
  return pre_norm_scaling(vector, min_val, max_val)
