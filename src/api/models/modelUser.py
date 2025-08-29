from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from modelGame import Game
from typing import List
from extensions import db


class User(db.Model):

    __tablename__ = "User"

    id_user: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=True)
    password: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    games: Mapped[List["Game"]] = relationship(
        "Game",
        back_populates = "user",
    )

    def serlialize(self):
        return{
            "id_user" : self.id_user ,
            "username" : self.username ,
            "email" : self.email ,
            "created_at" : self.created_at,
            "games" : [game.serialize() for game in self.games]
        }