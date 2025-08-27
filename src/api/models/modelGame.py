from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, func, Float, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List
from modelDictionary import Dictionary


db = SQLAlchemy()
#tabla de asociacion game-wordss

game_word =Table(
    "game_words",
    db.Model.metadata,
    Column("id_game", ForeignKey("games.id_game")),
    Column("id_word", ForeignKey("dictionary.id_word"))

)



class Game (db.Model):
    __tablename__ = 'games' #nombre de la tabla
    id_game: Mapped[int] = mapped_column(primary_key=True,)
    final_score: Mapped[int] = mapped_column(nullable=False)
    played_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    correct_words: Mapped[int] = mapped_column(nullable=False)
    failed_words: Mapped[int] = mapped_column(nullable=False)
    average_precision: Mapped[float] = mapped_column(nullable=False)
    wpm_average: Mapped[float] = mapped_column(nullable=False)
    difficulty: Mapped[int] = mapped_column(nullable=False)

    #relationships

    game_words: Mapped[List["Dictionary"]] = relationship(
        secondary="game_word",
        back_populates="game_words_by"
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
            "difficulty": self.difficulty
        }
        


