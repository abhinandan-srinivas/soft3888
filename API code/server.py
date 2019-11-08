from flask import Flask, jsonify, request
import database_kpis as db_kpis
import database_comments as db_comments
import database_definitions as db_definitions
import server_initialization as init
import time
import atexit

from apscheduler.schedulers.background import BackgroundScheduler

'''
I will be using jsonify for output.
The login function just returns one ID for login.
The kpis function returns a json of all the key kpis.
The index function is just a simple front function with redirects to login and edstats.
I will also use apscheduler to run queries every 5 minutes.
'''

# #new functionality for commenting
comments = db_comments.execute_comment_reciever()

#load summaries of four hospitals stored as hospital_dicts[auburn_dict, blacktown_dict, mt_druitt_dict, westmead_dict]
#initialize to error

summaries = db_kpis.execute_queries()
auburn_data = {'error':'error'}
blacktown_data = {'error':'error'}
westmead_data = {'error':'error'}
mtdruitt_data = {'error':'error'}

if summaries is not None:
        auburn_data = summaries[0]
        blacktown_data = summaries[1]
        westmead_data = summaries[2]
        mtdruitt_data = summaries[3]

def update():
    global summaries
    summaries = db_kpis.execute_queries()
    global auburn_data
    global blacktown_data
    global westmead_data
    global mtdruitt_data
    if summaries is not None:
        auburn_data = summaries[0]
        blacktown_data = summaries[1]
        westmead_data = summaries[2]
        mtdruitt_data = summaries[3]
    global comments
    comments = db_comments.execute_comment_reciever()
# Code to execute queries every 300 seconds (5 minutes) that refresh the output.
scheduler = BackgroundScheduler()
scheduler.add_job(func=update, trigger="interval", seconds=300)
scheduler.start()

# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

app = init.create_app()

@app.route('/auburn')
def auburn_values():
    return jsonify(auburn_data)


@app.route('/blacktown')
def blacktown_values():
    return jsonify(blacktown_data)


@app.route('/westmead')
def westmead_values():
    return jsonify(westmead_data)


@app.route('/mtdruitt')
def mtdruitt_values():
    return jsonify(mtdruitt_data)


#return the current app for testing
def create_app():
    return app

@app.route('/comments', methods=['GET','POST'])
def comment_handler():
    global comments
    if request.method == 'POST': #this block is only entered when the form is submitted
        comments_to_insert = {}
        comments_to_insert['userid'] = request.values.get('userid')
        comments_to_insert['hospital']  = request.values.get('hospital')
        comments_to_insert['time']  = request.values.get('time')
        comments_to_insert['comment']  = request.values.get('comment')

        if comments_to_insert['time'] is None:
            print("Error")

        db_comments.execute_comment_to_database(comments_to_insert)
        comments = db_comments.execute_comment_reciever()
        return jsonify(comments)
    else:
        return jsonify(comments)

@app.route('/kpidefinitions')
def definitions():
    return jsonify(db_definitions.execute_definition_reciever())

@app.route('/login')
def login():
    credentials = {
        'username': "12345678",
    }
    creden = []
    creden.append(credentials)
    return jsonify(credentials=credentials)


@app.route('/')
def index():
    return "<p1> Hi, check out <a href='/login'> /login </a> for login and <a href = '/edstats'> /edstats </a> for edstats! <a href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'> :) </a> </p1>"



if __name__ == "__main__":
    update() # Run the sql queries to initialize values.
    app.run(host='0.0.0.0') #this runs it on a local wifi network  
