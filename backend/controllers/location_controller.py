from flask import Blueprint, json, jsonify, request, Response
from database import mongo, to_json
from models.location import Location
from models.location_type import LocationType
from json import loads, dumps
from bson import ObjectId
from bson.errors import InvalidId
from models.route import Route
from utilities.routes_api_util import get_water_route_data, get_land_route_data




locations = Blueprint('locations', __name__, url_prefix='/api/locations')


# Operations done on the whole location DB to post a Location --> POST
@locations.route('', methods=['POST'])
def post_location():
  # Inserts new location into DB and returns the ID of the inserted location
  try:
    post_result = mongo.db.location.insert_one(loads(request.data))
    return jsonify({
      'message': 'Post operation successful',
      'id': str(post_result.inserted_id)
    })
  except Exception as e:
    print(e)
    return Response('Error adding location', status=500)
 


# Operations done on the whole location DB to get a Location --> GET
@locations.route('', methods=['GET'])
def get_all_locations():
   # Retrieves all locations in DB and converts ObjectId types to string
  try:
    all_locations = [Location.from_db_object(l) for l in mongo.db.location.find()]
    return Response(to_json(all_locations), status=200, headers={'Content-Type': 'application/json'})
  except Exception as e:
    print(e)
    return Response('Error retrieving all locations', status=500)




# get a specific location --> GET
@locations.route('/<string:location_id>', methods=['GET'])
def get_location_by_id(location_id):
  try:
    id = ObjectId(location_id) # Converts string ID to ObjectId type
  except InvalidId as e:
    print(e)
    return Response('Invalid ID', status=400)


  # Retrieves Location with the matching ID from the DB
  try:
    location  = mongo.db.location.find_one({"_id": id}) # Return matching document or return None
    if location is None:
      return Response(f'No location with id {location_id}', status=404)
    else:
      location = Location.from_db_object(location)
      return Response(to_json(location), status=200, headers={'Content-Type': 'application/json'})
  except Exception as e:
    print(e)
    return Response(f'Error retrieving the location with id {location_id}', status=500)


# edit a specific location --> PUT
@locations.route('', methods=['PUT'])
def edit_location_by_id():


 
  # Finds Location with the matching ID and updates its fields to the information in the request body
  try:
    location: Location = json.loads(request.data)
    update_query = {key: value for key, value in location.items() if key != '_id'}
    update_result = mongo.db.location.update_one({"_id": ObjectId(location['_id'])}, {'$set': update_query })
    print('000000')
    print(update_result)
    if update_result.matched_count == 0:
      id = location['_id']
      return Response(f'No location found with id {id}', status=404)
    else:
      return jsonify({
        'message': 'Put operation successful',
        'modifiedCount': update_result.modified_count,
        'id': location['_id']
      })
  except Exception as e:
    print(e)
    id = location['_id']
    return Response(f'Error updating the location with id {id}', status=500)






# delete a specific location --> DELETE
@locations.route('/<string:location_id>', methods=['DELETE'])
def del_location_by_id(location_id):
  try:
    id = ObjectId(location_id) # Converts string ID to ObjectId type
  except InvalidId as e:
    print(e)
    return Response('Invalid ID', status=400)
 
  # Finds Location with the matching ID and deletes it from the DB
  try:
    delete_result = mongo.db.location.delete_one({'_id': id})
    if delete_result.deleted_count == 0:
      return Response(f'No location found with id {location_id}', status=404)
    else:


      # get all routes in DB
      for r in mongo.db.route.find():
        # if route contains location to delete, delete route
        for e in r['path']:
          if location_id in e:
            mongo.db.route.delete_one({'_id': r['_id']})
            break


      return jsonify({
        'message': 'Delete operation successful',
        'deletedCount': delete_result.deleted_count,
        'id': location_id
      })
  except Exception as e:
    print(e)
    return Response(f'Error deleting the location with id {location_id}', status=500)  
 


@locations.route('/types', methods=['GET'])
def get_location_types():
  try:
    all_location_types = [LocationType.from_db_object(lt) for lt in mongo.db['location_type'].find()]
    print(all_location_types)
    return Response(to_json(all_location_types), status=200, headers={'Content-Type': 'application/json'})
  except TypeError as e:
    print(e)
    return Response('Incorrect parameter types', status=400)
  except Exception as e:
    print(e)
    return Response('Error retrieving location types', status=500)