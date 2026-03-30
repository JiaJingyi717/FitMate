from utils.extensions import db


class Knowledge(db.Model):
    __tablename__ = "knowledge"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(64), nullable=False)
    content = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(255), default="")
