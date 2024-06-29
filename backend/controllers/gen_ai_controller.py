from flask import Blueprint, jsonify, request, Response
from database import mongo, to_json
from models.location import Location
from models.location_type import LocationType
import json
from bson import ObjectId
from bson.errors import InvalidId
from models.route import Route
from utilities.gemini_api_util import get_gemini_response

generative_ai = Blueprint('generative_ai', __name__, url_prefix='/api/generative_ai')

# Operations done to post the gemini response from a python API library --> POST
@generative_ai.route('', methods=['POST'])
def send_gemini_ai():
    try:

        # get the request body in json format
        json_dict = request.get_json()

        # get the id for the route
        id = json_dict['_id']

        # get the text option selected by user to feed into gemini
        option = json_dict['option']

        # Get all locations that we have to work with
        all_locations = [Location.from_db_object(l) for l in mongo.db.location.find()]
        
        # find the route in the db: if their is not one return a error
        found  = mongo.db.route.find_one({"_id": ObjectId(id)})
        if found is None:
            return Response("id not found", status=404)

        # convert Route json to the Route Object
        route = Route.from_db_object(found, all_locations)
        
        # get the gemini response through this utility api function: if 
        # outputs the string 'ERROR' return a error
        output = get_gemini_response(option, route)
        if output == 'ERROR':
            return Response("option not found", status=404)

        # Output to the frontend the Gemini generative AI response from get_gemini_response function
        return Response(output, mimetype='application/json', status=200)
    
        # Check for exception: if there is one return a error
    except Exception as e:
        print(e)
        return Response('Error setting up Gemini', status=500)

