from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, func, Float, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List
from api.extensions import db

game_word =Table(
    "game_words",
    db.Model.metadata,
    Column("id_game", ForeignKey("game.id_game"), primary_key=True),
    Column("id_word", ForeignKey("dictionary.id_word"), primary_key=True)

)

class Game (db.Model):

    __tablename__ = 'game' #nombre de la tabla

    id_game: Mapped[int] = mapped_column(primary_key=True,)
    id_user: Mapped[int] = mapped_column(ForeignKey("user.id_user"), nullable=False)
    final_score: Mapped[int] = mapped_column(nullable=False)
    played_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    correct_words: Mapped[int] = mapped_column(nullable=False)
    failed_words: Mapped[int] = mapped_column(nullable=False)
    average_precision: Mapped[float] = mapped_column(nullable=False)
    wpm_average: Mapped[float] = mapped_column(nullable=False)
    difficulty: Mapped[int] = mapped_column(nullable=False)

    #relationships

    game_words: Mapped[List["Dictionary"]] = relationship(
        "Dictionary",
        secondary=game_word,
        back_populates="game_words_by"
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates= "games"
    )

    def serialize(self):
        return{
            "id_game": self.id_game,
            "final_score": self.final_score,
            "played_at": self.played_at,
            "correct_words": self.correct_words,
            "failed_words": self.failed_words,
            "average_precision": self.average_precision,
            "wpm_average": self.wpm_average,
            "difficulty": self.difficulty,
            "game_words": [word.serialize() for word in self.game_words],
            "id_user": self.id_user
        }