from flask import Flask
from sqlalchemy import text
from datetime import datetime

import os

from flask_sqlalchemy import SQLAlchemy

print("Setting up flask")
app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:666666@127.0.0.1:5432/dummy_soft3888'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# setting up database
print("Creating database")

db = SQLAlchemy(app)


def create_app():
    return app

def get_db():
	return db