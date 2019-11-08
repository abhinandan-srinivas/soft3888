import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image,
} from 'react-native';

const logo = require('../assets/logo.png');

const styles = StyleSheet.create({
  container: {
    marginTop: 90,
    marginBottom: 18,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 34,
    color: '#000',
  },
  image: {
    width: 305,
    height: 86,
    marginBottom: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 42,
    marginBottom: 33,
    width: '65%',
  },
  inputLabelText: {
    textAlign: 'left',
    color: '#090909',
    fontSize: 22,
  },
  inputBox: {
    marginTop: 10,
    marginBottom: 25,
    paddingLeft: 10,
    fontSize: 20,
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonContainer: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    width: '40%',
    marginBottom: 90,
  },
  buttonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 22,
  },
  footer: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 13,
  },
});

// Log in Screen
export default class LogInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'UNCHANGED',
      password: 'UNCHANGED',
    };
  }

  // Check login credentials from server
  checkCredentials() {
    const { id, password } = this.state;

    let cred = {};
    // get data from server:
    /* fetch('http://192.168.1.101:5000/login')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        loading: false,
        cred = {
          userid: responseJson.credentials.username,
          passw: responseJson.credentials.password,
          name: 'Jane Lee',
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });*/
    // end get from server

    // check with model data:
    cred = {
      userid: 'rand1123',
      passw: '1234567',
    };

    // get data from server
    this.setState({
      username: cred.userid,
    })

    // end check with model

    if (cred.userid === id && cred.passw === password) return true;
    return false;
  }

  // Press log in button.
  // Check credentials and log in
  pressLogIn() {
    if (this.checkCredentials()) {
      // GET NAME FROM SERVER ACCORDING TO AUTHENTICATED USER
      const { navigation } = this.props;
      navigation.navigate('EDDashboardScreen',{
        username: 'rand1123',
      });
    } else {
      Alert.alert(
        'Error',
        'ID and/or password is incorrect.',
        [
          { text: 'OK' },
        ],
        { cancelable: true },
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Image
          accessible={true}
          accessibilityLabel="Western Sydney Local Health District Logo"
          style={styles.image}
          source={logo}
        />

        <Text style={styles.title}>ED Dashboards</Text>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabelText}>ID number</Text>
          <TextInput
            accessible={true}
            accessibilityLabel="Input your ID number here"
            style={styles.inputBox}
            onChangeText={(id) => this.setState({ id })}
          />

          <Text style={styles.inputLabelText}>Password</Text>
          <TextInput
            style={styles.inputBox}
            accessible={true}
            accessibilityLabel="Input your password here"
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Tap me to log in."
          style={styles.buttonContainer}
          onPress={() => this.pressLogIn()}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>University of Sydney-Westmead collaborative project</Text>
      </View>
    );
  }
}
