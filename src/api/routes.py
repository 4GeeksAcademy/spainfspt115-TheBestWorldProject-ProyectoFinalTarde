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
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#Creación del usuario basado en el modelUser pa mi gente 
@api.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or not "username" in data or not "email" in data or not "password" in data:
        return jsonify({"msg": "Missing required fields"}), 400

    # Verificar si ya existe username o email
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"msg": "Usuario ya fokin existe"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email ya fokin existe"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"],
        password=data["password"]
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201

# Actualizar info del usuario
@api.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "Usuario no existe"}), 404

    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        if User.query.filter(User.email == data["email"], User.id_user != user_id).first():
            return jsonify({"msg": "Email ya está en uso"}), 400
        user.email = data["email"]
    if "password" in data:
        user.password = data["password"]

    user.last_update = datetime.now()
    db.session.commit()
    return jsonify(user.serialize()), 200
