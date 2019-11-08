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
def sql_comments(db, comments_dict):
    # sql query as a sting
    sql_query = text(
    "SELECT * FROM comments "
    )

    # executing the query in the db
    db_result = db.engine.execute(sql_query)

    comments = []

    # extracting the results from the query
    for res in db_result:
        comments.append(res)

    # inserting the results into a python dict
    for i in range(len(comments)):

        comments_dict['comment_' + str(i)] = []

        comments_dict['comment_' + str(i)].append({
            'hospital': comments[i][3],
            'userid': comments[i][0],
            'time': comments[i][1].strftime("%m/%d/%Y, %H:%M:%S"),
            'comment': comments[i][2]
        })

    return comments_dict

def sql_insert_comments(db, comment):

    # hospital = comment['hospital']
    # id = comment['userid']
    # time = comment['time']
    # msg = comment['comment']

    sql_insert = text(
    " INSERT INTO Comments "
    + " VALUES( "
    + "'" + str(comment['userid']) + "'" + ", "
    + "'" + str(comment['time']) + "'" + ", "
    + "'" + str(comment['comment']) + "'" + ", "
    + "'" + str(comment['hospital'])+ "'"
    + " );"
    )

    db_result = db.engine.execute(sql_insert)

    return


###### how to run code ######
comments_dict = {}

comments_dict = sql_comments(db, comments_dict)

print(comments_dict)

####### ABHI - comments will have to be in this format for insertion into the DB ######
comment = {
    'hospital': "Blacktown",
    'userid': "XXXX0001",
    'time': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    'comment': 'another comment?!'
}

sql_insert_comments(db, comment)
