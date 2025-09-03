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
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

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

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data["email"] or not data["password"] or not data["username"]:
        return jsonify({"msg" : "Email, username and password required"}), 400
    
    existing_user = db.session.execute(db.select(User).where(
        User.email == data["email"],
        User.username == data["username"]
    )).scalar_one_or_none()

    if existing_user:
        return jsonify({"msg": "user already exist"}), 400
    
    new_user = User(email = data["email"],
                     username = data["username"])
    new_user.set_password(data["password"])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "user created succesfully"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data["username"] or not data["password"]:
        return jsonify({"msg" : "Username and Password are required"}), 400
    
    user = db.session.execute(db.select(User).where(
        User.username == data["username"],
    )).scalar_one_or_none()

    if user is None:
        return jsonify({"msg": "Invalid username or password"}), 401
    
    if user.check_password(data["password"]):
        access_token = create_access_token(identity=str(user.id_user))
        return jsonify({"msg": "login Succesfully", "token": access_token})
    else:
        return jsonify({"msg": "Invalid username or password"}), 401
    
# @api.route("/profile", methods=['GET'])
# @jwt_required()
# def profile():
#     user_id = get_jwt_identity()
#     user = db.session.get(User, int(user_id))
#     if not user:
#         return jsonify({"msg": "user not found"}), 404
#     return jsonify(user.serialize()), 200



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
        user.password = user.set_password(data["password"])

    user.last_update = datetime.now()
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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