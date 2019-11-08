import server_initialization as server
from flask import Flask
from sqlalchemy import text
from datetime import datetime

import os

from flask_sqlalchemy import SQLAlchemy



db = server.get_db()

print("Creating database connection to definitions")

# function to get comments from the database
def sql_definitions(db):
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
    definitions_dict = {}
    for i in range(len(defins)):

        definitions_dict[str(defins[i][0])] = []

        definitions_dict[str(defins[i][0])].append({
            'term_name': defins[i][1],
            'term_definition': defins[i][2],
            'term_formula': defins[i][3]
        })

    return definitions_dict

# how to run code

# definitions_dict = sql_definitions(db)

# print(definitions_dict)

def execute_definition_reciever():
    print("Pulling definitions from database")
    return sql_definitions(db)
