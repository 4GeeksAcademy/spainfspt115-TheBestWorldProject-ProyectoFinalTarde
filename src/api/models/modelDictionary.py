import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from modelGame import Game

db = SQLAlchemy()

class DifficultyEnum(enum.IntEnum):
    EASY = 1
    MEDIUM = 2
    HARD = 3

class Dictionary(db.Model):
    __tablename__ = "dictionary"

    id_word: Mapped[int] = mapped_column(primary_key=True)
    word: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    length: Mapped[int] = mapped_column(nullable=False)
    points_per_word: Mapped[int] = mapped_column(nullable=False)

    difficulty: Mapped[DifficultyEnum] = mapped_column(
        Enum(DifficultyEnum, name="difficulty_enum"),
        nullable=False
    )

    game_words_by: Mapped[List["Game"]] = relationship(
        "Game",
        secondary="game_words",
        back_populates="game_words"
    )

    def serialize(self):
        return {
            "id": self.id_word,
            "word": self.word,
            "length": self.length,
            "points_per_word": self.points_per_word,
            "difficulty": self.difficulty
            # do not serialize the password, its a security breach
        }