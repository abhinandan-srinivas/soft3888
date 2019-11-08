Steps to connect to database README:

0. Ensure all of the following are installed
Flask
postgresql
flask_sqlalchemy
flask_script
flask_migrate

1. Create local server and database.

My local server was called: soft_db_test
My local database name was: WSLHD_iOSapp_Dummy_Database

commands that i used:
sudo -u antoniamijatovic createdb WSLHD_iOSapp_Dummy_Database

to access database: (don't need to run this, just used to check you created it.)
(to quit, execute command '\q')
psql -U antoniamijatovic -d WSLHD_iOSapp_Dummy_Database

2. Run commands from DummySchema.sql to create database tables

3. Run commands from DummyData_DML.sql to populate database with dummy values

4. execute command:
export APP_SETTINGS="config.DevelopmentConfig"

5. execute command:
export DATABASE_URL="postgresql://localhost/WSLHD_iOSapp_Dummy_Database"

6. execute commands: (must be in /Application/backend)
python manage.py db init
python manage.py db migrate
python manage.py db upgrade

7. run server
python manage.py runserver

you should see printed 'Data is saved in above var names.'

NB: this will execute the flask 'application', which will run and execute the queries.
NB: there are currently some problems with the Qlik integration of the SQL commands so don't be surprised if they dont work.
