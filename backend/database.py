from flask_pymongo import PyMongo
from json import dumps

mongo = PyMongo()

def to_json(obj):
  return dumps(obj, default=lambda obj: obj.__dict__)