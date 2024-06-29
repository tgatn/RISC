from flask import Flask
from flask_cors import CORS
from controllers.location_controller import locations
from controllers.route_controller import routes
from controllers.gen_ai_controller import generative_ai
from controllers.sim_disruption_controller import disruption
from database import mongo
import os

app = Flask(__name__)
app.register_blueprint(locations)
app.register_blueprint(routes)
app.register_blueprint(disruption)
app.register_blueprint(generative_ai)
mongo.init_app(app, os.getenv('DB_URI'))
print('Connection successful: \n', mongo)
CORS(app, origins="*")

