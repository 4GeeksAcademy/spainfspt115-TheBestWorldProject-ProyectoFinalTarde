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
from datetime import datetime
from sqlalchemy import func

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# USER ROUTES
# ---obtener todos los usuarios

@api.route('/user', methods=['GET'])
def get_users():
    users = User.query.all()
    result = [user.serialize() for user in users]
    return jsonify(result)

# ---obtener usuario por id

@api.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = int(get_jwt_identity())
    if current_user_id != user_id:
        return jsonify({"error": "Not Authorized"}), 403
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200

# ---para la pagina de profile

@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200

# ---creacion usuario

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data.get("email") or not data.get("password") or not data.get("username"):
        return jsonify({"msg": "Email, username and password required"}), 400
    # verificar duplicados por email o username
    existing_user = User.query.filter(
        (User.email == data["email"]) | (User.username == data["username"])
    ).first()
    if existing_user:
        return jsonify({"msg": "User already exists"}), 400
    new_user = User(
        email=data["email"],
        username=data["username"],
        country=data.get("country"),
        city=data.get("city"),
        created_at=datetime.now()
    )
    new_user.set_password(data["password"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "msg": "User created successfully",
        "user": new_user.serialize()
    }), 201

# ---login usuario
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get("username") or not data.get("password"):
        return jsonify({"msg": "Username and Password are required"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if user is None or not user.check_password(data["password"]):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity=str(user.id_user))
    return jsonify({
        "msg": "Login successfully",
        "token": access_token,
        "user": user.serialize()
    }), 200

# ---Actualizar info del usuario

@api.route('/user', methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "Usuario not found"}), 404

    data = request.get_json()

    for field in ["username", "country", "city"]:
        if field in data:
            setattr(user, field, data[field])

    if "email" in data:
        if User.query.filter(User.email == data["email"], User.id_user != current_user_id).first():
            return jsonify({"error": "Email used"}), 400
        user.email = data["email"]

    if "password" in data:
        user.set_password(data["password"])

    db.session.commit()
    return jsonify(user.serialize()), 200

# GAME ROUTES
# --- Obtener todas las partidas
@api.route('/game', methods=['GET'])
def get_games():
    games = Game.query.all()
    result = [game.serialize() for game in games]
    return jsonify(result), 200

# --- Obtener partida por id

@api.route('/game/<int:id_game>', methods=['GET'])
def get_game(id_game):
    game = Game.query.get(id_game)
    if game is None:
        return jsonify({"msg": "User doesn't exists"}), 400
    return jsonify(game.serialize()), 200

# --- Crear juego

@api.route('/game', methods=['POST'])
@jwt_required()
def create_game():
    body = request.get_json()
    current_user_id = int(get_jwt_identity())  # del token
    game = Game(
        id_user=current_user_id,
        final_score=body.get("final_score", 0),
        correct_words=body.get("correct_words", 0),
        failed_words=body.get("failed_words", 0),
        average_precision=body.get("average_precision", 0.0),
        wpm_average=body.get("wpm_average", 0.0),
        difficulty=body.get("difficulty", 1),
    )
    db.session.add(game)
    db.session.commit()
    return jsonify(game.serialize()), 201

# LeaderBoard Rout --> query exclusiva para generar la tabla de score

@api.route("/leaderboard", methods=["GET"])
def leaderboard():
    top = Game.query.order_by(Game.final_score.desc()).limit(10).all()
    return jsonify([g.serialize() for g in top]), 200

# DICTIONARY ROUTES
# --- GAME WODS ROUTES ---
# Obtener X palabras aleatorias

@api.route("/words/random", methods=["GET"])
def random_words():
    amount = request.args.get("amount", default=1, type=int)
    words = Dictionary.query.order_by(func.random()).limit(amount).all()
    return jsonify([w.serialize() for w in words]), 200

# Obtener X palabras aleatorias por dificultad

@api.route("/words/random/<int:difficulty>", methods=["GET"])
def random_words_by_difficulty(difficulty):
    amount = request.args.get("amount", default=1, type=int)
    words = Dictionary.query.filter_by(difficulty=difficulty).order_by(
        func.random()).limit(amount).all()
    if not words:
        return jsonify({"error": "No words for this difficulty"}), 404
    return jsonify([w.serialize() for w in words]), 200

# Obtener palabras de un nivel
@api.route("/words/level", methods=["GET"])
def words_for_level():
    difficulty = request.args.get("difficulty", default=1, type=int)
    amount = request.args.get("amount", default=10, type=int)

    words = Dictionary.query.filter_by(difficulty=difficulty).order_by(
        func.random()).limit(amount).all()

    return jsonify({
        "difficulty": difficulty,
        "words": [w.serialize() for w in words]
    }), 200


# === ADMIN ROUTES ===
# Insertar una nueva palabra en el diccionario
@api.route("/words", methods=["POST"])
@jwt_required()
def add_word():
    data = request.get_json()

    if not data or "word" not in data:
        return jsonify({"msg": "Se necesita al menos 'word'"}), 400

    word = data["word"].strip().lower()
    length = len(word)
    points = data.get("points_per_word", length)   # default = longitud

    # Calcular dificultad en base a la longitud
    if length < 6:
        difficulty = 1   # Fácil
    elif 6 <= length <= 8:
        difficulty = 2   # Media
    else:
        difficulty = 3   # Difícil

    # Evitar duplicados
    if Dictionary.query.filter_by(word=word).first():
        return jsonify({"msg": "The Word already exists"}), 400

    new_word = Dictionary(
        word=word,
        length=length,
        points_per_word=points,
        difficulty=difficulty
    )
    db.session.add(new_word)
    db.session.commit()

    return jsonify(new_word.serialize()), 201


# Obtener todas las palabras
@api.route("/words", methods=["GET"])
@jwt_required()
def get_words():
    words = Dictionary.query.all()

    return jsonify([w.serialize() for w in words]), 200

# Obtener palabra concreta por ID


@api.route("/words/<int:word_id>", methods=["GET"])
@jwt_required()
def get_word(word_id):
    word = Dictionary.query.get(word_id)

    return jsonify(response_body), 200

    if not word:
        return jsonify({"msg": f"La palabra con id {word_id} no existe"}), 404
    return jsonify(word.serialize()), 200
