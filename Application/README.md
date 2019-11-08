# How to run the front end
To run the front end, we will need the back end/Flask server (server.py in API Code folder) and an Expo development server running on desktop, and a phone with Expo Client App installed.

## Installing Dependencies
Make sure you have [npm](https://www.npmjs.com/get-npm) installed.
Open Terminal/Command Prompt, navigate to the Application folder, then type `npm install` and press enter.

Expo Client App is necessary to run the application on a phone. The app can be downloaded from Apple App Store and Google Play Store.

## Configuring IP Address
In order to fetch data from the API, the IP address used to send request must match the current network's IP address. The phone that will run the application and the desktop that will run the servers must be connected to the same wireless network.

To ensure the application fetches data from the correct address, you need to configure it with the application following the steps below:

### Find IP Address in Windows
On Command Prompt, type `ipconfig` and press enter. Then check the configuration under "Wireless LAN adapter Wi-Fi" -> IPv4 address.

### Find IP Address in Mac OSX
IP address can be found in System Preferences - Network.

Copy the IP Address, then replace the IP address in these lines:
1. screens/EDDashboard.js - line 221
2. screens/Description.js - line 94
3. screens/MessageBoard.js - line 183 and 238

e.g. if your IP is 192.168.1.102, then change 'http://192.168.1.101:5000/kpidefinitions' in screens/Description.js to 'http://192.168.1.102:5000/kpidefinitions'

##  Running the Application
Run the server.py in API Code folder (See this [readme file](https://bitbucket.org/antoniamijatovic/soft3888_m14b_group4/src/master/API%20code/) on how to set up and run the back end). You can check whether the server is running properly by accessing 'http://127.0.0.1:5000/' using a web browser on the desktop where the server is running. You can also check whether the IP Address you copied earlier is correct by accessing 'http://<IPAddress>:5000/kpidefinitions' using a web browser on your phone. If the server is running and the address is correct, you should be able to see 'Hi, check out /login for login and /edstats for edstats! :)'

Once the server is running, you can open a new Terminal/Command Prompt window, navigate to the Application folder, and run the command 'expo start' or 'npm start'. A development server will open in the browser.

If you are using an iOS Simulator, you can click "Run on iOS Simulator" to run the app there. If you are using an iPhone, you can click "Send link with email" to run the app. When you receive the email, you can open the link in the email and the Expo App should run and display the app. Keep the development server running while the App is running.

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

## Description
The description page displays the card and definition (if exist) of the KPI. If there are additional breakdowns, they will appear here too.

## Message Board/Application Feedback
The application feedback screen allows users to browse comments (filter by hospital) and post comments too.

### Acceesibility
All elements of the application include accessibility labels which the iOS VoiceOver feature reads from. An 'element' in this context can refer to a logo picture, graph, text input, button, KPI item card, etc.. To view this feature:
1. Turn on VoiceOver on iPhone at Settings -> Accessibility-> VoiceOver. There are instructions here on this screen under the VoiceOver enabling button and above the speech rate selector on how many taps/fingers to use when selecting or scrolling while VoiceOver is enabled. Please note you will need to double-tap all buttons now instead of single tap.
2. Run the WSLHD mobile application with VoiceOver enabled. On each screen, single-tap each element to ensure all elements will read out labels when selected.
