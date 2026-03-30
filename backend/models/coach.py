from utils.extensions import db


class Coach(db.Model):
    __tablename__ = "coaches"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    gender = db.Column(db.String(16), default="female")
    style = db.Column(db.String(32), default="gentle")
    avatar = db.Column(db.String(255), default="")
    introduction = db.Column(db.Text, default="")
