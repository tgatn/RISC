from flask import Blueprint, jsonify, request, Response
from database import mongo, to_json
from models.location import Location
from models.location_type import LocationType
import json
from bson import ObjectId
from bson.errors import InvalidId
from models.disruption import Disruption

disruption = Blueprint('disruption', __name__, url_prefix='/api/disruption')

# Operations to post a simulated/test disruption to frontend for new utility --> POST
@disruption.route('', methods=['POST'])
def create_disruption():
    try:
        # get the json dictionary in request body
        json_dict = request.get_json()

        # get the disruption's list and the needed added disruption
        disrupt_list = json_dict["disruption_list"]
        sim_disrupt = json_dict["disruption"]

        # add the new disruption to the list
        disrupt_list.append(sim_disrupt)

        #return json version of the entire disruption list with the now added disruption
        return jsonify(disrupt_list)
    
    # If there is a error output this
    except Exception as e:
        print(e)
        return Response('Error with adding simulated disruption', status=500)