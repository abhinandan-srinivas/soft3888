import server_initialization as server
from flask import Flask
from sqlalchemy import text
from datetime import datetime

import os

from flask_sqlalchemy import SQLAlchemy

#Set up connection to postgres


db = server.get_db()


print("Creating database connection for comments")

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



# function to get comments from the database
def sql_comments(db):
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
    comments_dict = {}
    for i in range(len(comments)):

        comments_dict['comment_' + str(i)] = []

        comments_dict['comment_' + str(i)].append({
            'hospital': comments[i][3],
            'userid': comments[i][0],
            'time': comments[i][1].strftime("%m/%d/%Y, %H:%M:%S"),
            'comment': comments[i][2]
        })

    return comments_dict

def execute_comment_reciever():
    print("pulling comments from database")
    return sql_comments(db)


def execute_comment_to_database(comment):
    if comment["time"] is None:
        comment["time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("Comment pushed to database")
    sql_insert_comments(db, comment)
    return 


###### how to run code #####
#Reading comments from DB

# comments_dict = sql_comments(db)

# print(comments_dict)

####### ABHI - comments will have to be in this format for insertion into the DB ######

#Writing comments to DB

# comment = {
#     'hospital': "Blacktown",
#     'userid': "XXXX0001",
#     'time': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#     'comment': 'another comment?!'
# }

# sql_insert_comments(db, comment)

# The top parts can be comented out

