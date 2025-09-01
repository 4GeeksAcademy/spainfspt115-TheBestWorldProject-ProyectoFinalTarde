"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models.modelGame import Game
from api.models.modelDictionary import Dictionary
from api.models.modelUser import User
from api.extensions import db
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/user', methods =['GET'])
def get_users():
    users = User.query.all()
    result = [user.serialize() for user in users]
    print(result)
    return jsonify(result)

@api.route('/user/<int:user_id>', methods = ['GET'])
def get_user(user_id):
    user = user.query.get(user_id)
    if user is None:
        return jsonify({"error":"Usuario no existe"}),400
    return jsonify(user.serialize()), 200
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
