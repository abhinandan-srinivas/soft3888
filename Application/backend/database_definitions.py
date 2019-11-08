from flask import Flask
from sqlalchemy import text
from datetime import datetime
import os
from flask_sqlalchemy import SQLAlchemy

# setting up app
app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:666666@127.0.0.1:5432/dummy_soft3888'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# setting up database
db = SQLAlchemy(app)

# function to get comments from the database
def sql_definitions(db, definitions_dict):
    # sql query as a sting
    sql_query = text(
    "SELECT * FROM definitions "
    )

    # executing the query in the db
    db_result = db.engine.execute(sql_query)

    defins = []

    # extracting the results from the query
    for res in db_result:
        defins.append(res)

    # inserting the results into a python dict
    for i in range(len(defins)):

        definitions_dict[str(defins[i][0])] = []

        definitions_dict[str(defins[i][0])].append({
            'term_name': defins[i][1],
            'term_definition': defins[i][2],
            'term_formula': defins[i][3]
        })

    return definitions_dict

# how to run code
definitions_dict = {}

definitions_dict = sql_definitions(db, definitions_dict)

print(definitions_dict)
