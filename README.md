# WSLHD Emergency Data iOS application

This project is a prototype iOS application that displays Emergency Department data from hospitals in Western Sydney Local Health District. With this application, users can check the status of the ED and check their KPIs. They can also see further details about the data item, including term definitions and further breakdown if available. Users can also see feedbacks regarding the application and leave some themselves.

This project is composed of an iOS application at the front end, a Flask API, and a PostgreSQL database that acts as a dummy version of the database used by the hospitals.

This project is developed in collaboration between the University of Sydney and Westmead.

## Dependencies
### Back end
PostgreSQL is used for the database. You can download PostgreSQL from [PostgreSQL's website](https://www.postgresql.org/download/).

Python is used for the API. You can see [this page](https://wiki.python.org/moin/BeginnersGuide/Download) for how to install Python.

The rest of the dependencies can be installed with pip. To install pip, see [this page](https://pip.pypa.io/en/stable/installing/).

Before you install them, you can set up a Python virtual environment. If you don’t have virtual environment installed, you can install it with the command `pip install virtualenv` on Terminal/Command Prompt. Below are the steps for setting up a virtual environment:

1.	Use the command `virtualenv env_name` to create a virtual environment. Replace env_name with the name you want for your virtual environment.
2.	Activate the virtual environment by executing `source env_name/bin/activate` on Terminal or `env_name\Scripts\activate.bat` on Command Prompt in the directory where the environment was created.
3.	If you want to deactivate the virtual environment, you can use the command `deactivate`.

Below are the dependencies for the API and the commands to install them using pip:

1.	Flask - `pip install Flask`
2.	SQLAlchemy - `pip install SQLAlchemy`
3.	Flask-SQLAlchemy - `pip install Flask-SQLAlchemy`
4.	Flask-Script - `pip install Flask-Script`
5.	Flask_Migrate - `pip install Flask-Migrate`
6.	Psycopg2 - `pip install psycopg2`
7.	APScheduler - `pip install APScheduler`

Note: If you want to use Python virtual environment, activate the virtual environment before installing these dependencies.

### Front end
All dependencies on the frontend are listed in package.json in the Application folder and can be installed all at once with npm. Listed below are the major dependencies:

1.	Npm
2.	Expo
3.	React Native
4.	React Native Navigation
5.	React Native SVG Charts

#### Installing dependencies
First, install npm using the instructions on [npm's website](https://www.npmjs.com/get-npm).

Next, open Terminal/Command Prompt, navigate to the Application folder, then type `npm install` and press enter. This will automatically install all project dependencies.

Expo Client App is necessary to run the application on a phone. The app can be downloaded from Apple App Store for iPhone and Google Play Store for Android.

## How to set up the project

In order to run this project, you need to run the back-end server, front-end development server, and front-end application at the same time.

### 1.	Clone this project.
Clone this project from the repository using Git.
### 2.	Install dependencies
Install project dependencies as outlined in the previous section.
### 3.	Set up the back-end server
To set up the back-end server, you need to first create a database. Let’s say the database is called WSLHD_iOSapp_Dummy_Database. To create a database:

#### On Mac OSX
Run the command `psql`. In the psql shell, run the command `create database WSLHD_iOSapp_Dummy_Database;`
#### On Windows
Open SQL Shell (psql), run the command `create database WSLHD_iOSapp_Dummy_Database;`.
#### Using pgAdmin 4
On Servers > PostgreSQL 12 > Databases, right click and select Create > Database. Enter the database name and click Save.


Once the database is created, run commands from DummySchema.sql to create database tables, then run commands from DummyData_DML.sql to populate database with dummy values.

Once it’s done, replace the config query value in line 13 of API Code/server_initialization.py with `postgresql://username:password@hostaddress:port/database`. For example, if your username is `postgres`, your password is `mypassword`, and you’re using localhost, port 5432, and the database name is WSLHD_iOSapp_Dummy_Database, replace the value with `postgresql://postgres:mypassword@127.0.0.1:5432/ WSLHD_iOSapp_Dummy_Database`.

Then, run server.py using the command `python3 server.py` on Terminal or `python server.py` on Command Prompt. If you are successful, you should be able to see a message indicating that the server is running on port 5000.

The next time you want to run the back end server, just use the command `python3 server.py` on Terminal or `python server.py` on Command Prompt. Press Ctrl+C to stop the server.

### 4.	Set up the front end
#### Configuring IP Address
In order to fetch data from the API, the IP address used to send request must match the current network's IP address. The phone that will run the application and the desktop that will run the servers must be connected to the same wireless network.

To ensure the application fetches data from the correct address, you need to configure it with the application following the steps below:

##### Find IP Address in Windows
On Command Prompt, type `ipconfig` and press enter. Then check the configuration under `Wireless LAN adapter Wi-Fi` -> IPv4 address.

##### Find IP Address in Mac OSX
IP address can be found in System Preferences - Network.

Once you find your IP Address, copy the IP Address, then replace the IP address in these lines:

1. screens/EDDashboard.js - line 221
2. screens/Description.js - line 94
3. screens/MessageBoard.js - line 183 and 238

e.g. if your IP is 192.168.1.102, then change `http://192.168.1.101:5000/kpidefinitions` in screens/Description.js to `http://192.168.1.102:5000/kpidefinitions`
Make sure you save the file after making these changes.

## Running the Application
To run the front end, you will need the back end/Flask server (server.py in API Code folder) and an Expo development server running on desktop, and a phone with Expo Client App installed.

Run the server.py in API Code folder. You can check whether the server is running properly by accessing [http://127.0.0.1:5000/](http://127.0.0.1:5000/) using a web browser on the desktop where the server is running. You can also check whether the IP Address you used to configure the front end earlier is correct by accessing 'http://<IPAddress>:5000/' using a web browser on your phone. If the server is running and the address is correct, you should be able to see 'Hi, check out /login for login and /edstats for edstats! :)'

Once the server is running, you can open a new Terminal/Command Prompt window, navigate to the Application folder, and run the command 'expo start' or 'npm start'. A development server will open in the browser.

If you are using an iOS Simulator, you can click "Run on iOS Simulator" to run the app there. If you are using an iPhone, you can click "Send link with email" to run the app. Note that for this to work, you may need to sign in with an expo account. You can sign in/sign up by typing `s` in the Terminal/Command Prompt window that's running the development server. When you receive the email, you can open the link in the email and the Expo App should run and display the app.

Keep the development server running while the App is running.

## The Application Interface
### Log in
The log in credentials are:
ID Number: rand1123
Password: 1234567

Tapping the log in button will display an error if incorrect credentials are entered.
Tapping the log in button will direct the user to the ED Dashboard page if correct credentials are entered.
Once logged in, after 5 minutes of staying in the same page, the user will "time out" and get logged out.

### ED Dashboard
The ED Dashboard contains a status bar that changes colour accordingly and displays the current time, as well as KPI item cards.
Clicking into each card will direct the user to the Description page specific to the selected card.
Clicking the Application Feedback button will direct user to the Application Feedback page.

### Description
The description page displays the card and definition (if exist) of the KPI. If there are additional breakdowns, they will appear here too.

### Message Board/Application Feedback
The application feedback screen allows users to browse comments (filter by hospital) and post comments too.

### Accessibility
All elements of the application include accessibility labels which the iOS VoiceOver feature reads from. An 'element' in this context can refer to a logo picture, graph, text input, button, KPI item card, etc. To view this feature:

1. Turn on VoiceOver on iPhone at Settings -> Accessibility-> VoiceOver. There are instructions here on this screen under the VoiceOver enabling button and above the speech rate selector on how many taps/fingers to use when selecting or scrolling while VoiceOver is enabled. Please note you will need to double-tap all buttons now instead of single tap.
2. Run the WSLHD mobile application with VoiceOver enabled. On each screen, single-tap each element to ensure all elements will read out labels when selected.

