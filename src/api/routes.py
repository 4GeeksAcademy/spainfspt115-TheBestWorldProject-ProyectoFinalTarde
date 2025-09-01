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



@api.route('/user', methods =['GET'])
def get_users():
    users = User.query.all()
    result = [user.serialize() for user in users]
    return jsonify(result)

@api.route('/user/<int:user_id>', methods = ['GET'])
def get_user(user_id):
    user = user.query.get(user_id)
    if user is None:
        return jsonify({"error":"Usuario no existe"}),400
    return jsonify(user.serialize()), 200

@api.route('/game', methods = ['GET'])
def get_games():
    games = Game.query.all()
    result = [game.serialize() for game in games]
    return jsonify(result), 200

@api.route('/game/<int:id_game>', methods = ['GET'])
def get_game(id_game):
    game = game.query.get(id_game)
    if game is None:
        return jsonify({"error":"Usuario no existe"}),400
    return jsonify(game.serialize()), 200

@api.route('/game', methods = ['POST'])
def create_game():
    body = request.get_json()

    id_user =body.get("id_user")
    final_score = body.get("final_score")
    correct_words = body.get("correct_words")
    failed_words = body.get("failed_words")
    average_precision = body.get("average_precision")
    wpm_average = body.get("wpm_average")
    difficulty = body.get("difficulty")


    if not id_user:
          return jsonify({"error": "id_user es obligatorio"}), 400
    
    user = User.query.get(id_user)
    if not user:
        return jsonify({"error": "El usuario no existe"}), 400


    game = Game (
        id_user=id_user,
        final_score=final_score,
        correct_words=correct_words,
        failed_words=failed_words,
        average_precision=average_precision,
        wpm_average=wpm_average,
        difficulty=difficulty,
    )


    db.session.add(game)
    db.session.commit()

    return jsonify(game.serialize()), 201