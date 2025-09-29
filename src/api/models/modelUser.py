from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List
from api.extensions import db
from flask_bcrypt import generate_password_hash, check_password_hash

class User(db.Model):

    __tablename__ = "user"

    id_user: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    country: Mapped[str] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[str] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    games: Mapped[List["Game"]] = relationship(
        "Game",
        back_populates = "user",
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')


    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return{
            "id_user" : self.id_user ,
            "username" : self.username ,
            "email" : self.email ,
            "created_at" : self.created_at,
            "country": self.country,
            "city": self.city,
            "avatar_url": self.avatar_url,
            "games" : [game.serialize() for game in self.games],
            "description": self.description
        }