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
from sqlalchemy import func, select
import os, json
import requests

api = Blueprint('api', __name__)


# === CARGAR DATA DE PAISES Y CIUDADES ===
base_path = os.path.join(os.path.dirname(__file__), "data")
with open(os.path.join(base_path, "countries+cities.json"), "r", encoding="utf-8") as f:
    countries_cities_data = json.load(f)

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
        return jsonify({"error": "No Authorizado"}), 403
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usario no encontrado"}), 404
    return jsonify(user.serialize()), 200

# ---para la pagina de profile
@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "Usario no encontrado"}), 404
    return jsonify(user.serialize()), 200

# --- para perfiles de otros jugadores publicos
@api.route("/public-profile/<int:user_id>", methods=["GET"])
def public_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuraio no encontrado"}), 404
    
    data = user.serialize()

    if "email" in data:
        del data["email"]

    return jsonify(data), 200

# ---creacion usuario
@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data.get("email") or not data.get("password") or not data.get("username"):
        return jsonify({"msg": "Email, nombre de usuario y contraseña son requeridos"}), 400
    # verificar duplicados por email o username
    existing_user = User.query.filter(
        (User.email == data["email"]) | (User.username == data["username"])
    ).first()
    if existing_user:
        return jsonify({"msg": "Usuario o email ya registrados"}), 400
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
        "msg": "Usuario creado satisfactoriamente",
        "user": new_user.serialize()
    }), 201

# ---login usuario
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get("username") or not data.get("password"):
        return jsonify({"msg": "Usuario y contraseña son obligatorios"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if user is None or not user.check_password(data["password"]):
        return jsonify({"msg": "Usuario o contraseña inválidos"}), 401

    access_token = create_access_token(identity=str(user.id_user))
    return jsonify({
        "msg": "Estás dentro",
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
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    for field in ["username", "country", "city"]:
        if field in data:
            setattr(user, field, data[field])

    if "email" in data:
        if User.query.filter(User.email == data["email"], User.id_user != current_user_id).first():
            return jsonify({"error": "Email ya en uso"}), 400
        user.email = data["email"]

    if "password" in data:
        user.set_password(data["password"])

    if "avatar_url" in data:
        user.avatar_url = data["avatar_url"]

    if "description" in data:
        user.description = data["description"]

    db.session.commit()
    return jsonify(user.serialize()), 200

# GAME ROUTES
# --- Obtener palabras para gigas ---
@api.route("/words/gigas", methods=["GET"])
def words_for_gigas():
    result = {}

    # giga_slime: length == 14
    words14 = Dictionary.query.filter(Dictionary.length == 14).order_by(func.random()).limit(3).all()
    result["giga_slime"] = [w.serialize() for w in words14]

    # giga_orc: length == 15
    words15 = Dictionary.query.filter(Dictionary.length == 15).order_by(func.random()).limit(3).all()
    result["giga_orc"] = [w.serialize() for w in words15]

    # giga_vampire: length >= 16
    words16 = Dictionary.query.filter(Dictionary.length >= 16).order_by(func.random()).limit(3).all()
    result["giga_vampire"] = [w.serialize() for w in words16]

    return jsonify(result), 200

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
        return jsonify({"msg": "Usuario no existe"}), 400
    return jsonify(game.serialize()), 200


#--- Crear juego
@api.route('/game', methods = ['POST'])
def create_game():
    body = request.get_json()
    
    game = Game(
        id_user=body.get("id_user"),
        final_score=body.get("final_score", 0),
        correct_words=body.get("correct_words", 0),
        failed_words=body.get("failed_words", 0),
        average_precision=body.get("average_precision", 0.0),
        wpm_average=body.get("wpm_average", 0.0),
        difficulty=body.get("difficulty", 1),
        played_at=body.get("played_at")
    )
    db.session.add(game)
    db.session.commit()
    return jsonify(game.serialize()), 201

# LeaderBoard Rout --> query exclusiva para generar la tabla de score
@api.route("/leaderboard", methods=["GET"])
def leaderboard():
    limit = request.args.get("limit", default=10, type=int)

    subq = (
        db.session.query(
            Game.id_user,
            func.max(Game.final_score).label("best_score")
        )
        .group_by(Game.id_user)
        .subquery()
    )

    results = (
        db.session.query(Game)
        .join(
            subq,
            (Game.id_user == subq.c.id_user) & (Game.final_score == subq.c.best_score)
        )
        .order_by(Game.final_score.desc())
        .limit(limit)   # ✅ ahora usa el parámetro
        .all()
    )

    return jsonify([g.serialize() for g in results]), 200

# DICTIONARY ROUTES
# --- GAME WORDS ROUTES ---
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
        return jsonify({"error": "No hay palabras para esta dificultad"}), 404
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
#Funcion para quitar los acentos de las palabras, para poder utilizarlas en el juego
def delete_accents(text):
    table = str.maketrans(
        "áéíóúüÁÉÍÓÚÜ",
        "aeiouuAEIOUU"
    )
    clearText = text.translate(table)
    if clearText.isalpha() and clearText.isascii():

        return clearText
    
    return None

# Insertar una nueva palabra en el diccionario
@api.route("/words", methods=["POST"])
def add_word():
    data = request.get_json()

    word_ = data.get('word')
    word = delete_accents(str(word_))
    
    if not word:
        return jsonify({"msg": "no hay palabra"}), 400

    length = len(word)

    if length < 4:
        return jsonify({"msg": "la palabra tiene menos de 4 letras"}), 400

    if length >= 4 and length < 6:
        difficulty = 1 
    elif length >= 6 and length < 9:
        difficulty = 2
    else:
        difficulty = 3

    points = length * 10

    if not Dictionary.query.filter_by(word=word).first():
        new_word = Dictionary(
            word=word,
            length=length,
            points_per_word=points,
            difficulty=difficulty
        )
        db.session.add(new_word)
        db.session.commit()
        return jsonify(new_word.serialize()), 201
    else:
        return jsonify({"msg": "palabra ya existe","palabra": word}), 200

# Obtener todas las palabras
@api.route("/words", methods=["GET"])
def get_words():
    words = Dictionary.query.all()
    return jsonify([w.serialize() for w in words]), 200

# Obtener palabra concreta por ID
@api.route("/words/<int:word_id>", methods=["GET"])
@jwt_required()
def get_word(word_id):
    word = Dictionary.query.get(word_id)
    if not word:
        return jsonify({"msg": f"La palabra con id {word_id} no existe"}), 404

    return jsonify(word.serialize()), 200

# === COUNTRY & CITY ROUTES ===
@api.route("/countries", methods=["GET"])
def get_countries():
    """Devuelve la lista de países"""
    countries = [c["name"] for c in countries_cities_data]
    return jsonify(countries), 200

@api.route("/cities/<string:country_name>", methods=["GET"])
def get_cities(country_name):
    """Devuelve las ciudades de un país dado"""
    country = next((c for c in countries_cities_data if c["name"].lower() == country_name.lower()), None)
    if not country:
        return jsonify({"error": "País no encontrado"}), 404
    return jsonify(country["cities"]), 200

    
    return jsonify(word.serialize()), 200

# PEDIR PALABRAS A LA API DE LA RAE (RANDOM WORDS)
@api.route('/words/get-random', methods=['GET'])
def get_random_word():

    response = requests.get(
        'https://rae-api.com/api/random/',
        headers= {"Accept": "application/json"},
    )

    data = response.json()

    # calcular datos derivados
    word_ = data.get("data").get('word')
    word = delete_accents(str(word_))
    if word == None:
        return jsonify({"msg": "cadena no válida", "word": str(word_)})
    length = len(str(word))
    if length < 4:
        return jsonify({"msg": "la palabra tiene menos de 4 letras"})
    points = length * 10
    if length >= 4 and length < 6:
        difficulty = 1 
    elif length >= 6 and length < 9:
        difficulty = 2
    else:
        difficulty = 3

    if word and not Dictionary.query.filter_by(word=word).first():
        new_word = Dictionary(
            word=word,
            length=length,
            points_per_word=points,
            difficulty=difficulty
        )
        db.session.add(new_word)
        db.session.commit()
    else:
        return jsonify({"msg": "la palabra ya existe","palabra": word})
    
    return jsonify(new_word.serialize()), 200
