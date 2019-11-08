// This screen is the Application Feedback screen. It displays feedbacks/comments
// left by users. User can also post feedbacks/comments here.
// Props:
//   navigation - navigation object to switch between pages in the application.
//   navigation carries the following parameters:
//      userid - user ID number used to login, comments posted will be under this name
//      hospital - hospital selected in the ED Dashboard page. The comments displayed
//                 will by default be comments from the hospital passed in this parameter

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Image, ActionSheetIOS,
} from 'react-native';

const chevronLeft = require('../assets/chevron-left.png');

const styles = StyleSheet.create({
  // data Select bar
  dataSelectContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 25,
  },
  headerButton: {
    height: 47,
    width: '65%',
    borderWidth: 0.5,
    borderColor: '#707070',
    paddingLeft: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterButton: {
    height: 47,
    width: '35%',
    borderWidth: 0.5,
    borderColor: '#707070',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: '#000',
    fontSize: 16,
  },

  // Displayed Messages
  messageContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 6,
    marginBottom: 6,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderWidth: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageName: {
    fontSize: 15,
  },
  messageTime: {
    fontSize: 13,
    color: '#595959',
  },
  messageText: {
    fontSize: 17,
  },

  // New Comment
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    alignSelf: 'flex-end',
  },
  commentInputBox: {
    paddingLeft: 10,
    fontSize: 20,
    height: 40,
    width: '70%',
    borderWidth: 1,
    borderColor: '#000',
  },
  commentButtonContainer: {
    borderWidth: 1,
    borderColor: '#000',
    width: '20%',
  },
  commentButtonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 3,
  },

});

function MessageBox({ name, time, message }) {
  return (
    <View style={styles.messageContainer}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageName}>{ name }</Text>
        <Text style={styles.messageTime}>{ time }</Text>
      </View>
      <Text style={styles.messageText}>{ message }</Text>
    </View>
  );
}

export default class MessageBoard extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.userid = navigation.getParam('userid', 'ERROR NAME');
    this.state = {
      loading: true,
      newCommentText: '',
      messages: [],
      selectedHospital: navigation.getParam('hospital', 'ERROR HOSPITAL'),
      timeoutID: -1,
    };
  }

  componentDidMount() {
    // update comment data

    // Sample Data
    // this.setState({
    //   messages: [ {
    //     hospital: 'Westmead',
    //      time: '22-09-2019, 09:10',
    //      message: 'We have been achieving all of our KPIs!',
    //    }, {
    //      hospital: 'Auburn',
    //      time: '01-10-2019, 10:47',
    //      message: 'We have been achieving all of our KPIs!',
    //    }, {
    //      hospital: 'Blacktown',
    //      time: '14-10-2019, 14:25',
    //      message: 'We have been achieving all of our KPIs!',
    //    },
    //  ],
    // });
    // Sample Data end

    const { navigation } = this.props;
    const timeoutID = setTimeout(() => navigation.navigate('HomeScreen'), 300000);
    this.setState({
      timeoutID: timeoutID,
    });
    this.updateCommentData();
  }

  componentWillUnmount() {
    // clearInterval(this.state.interval);
    clearTimeout(this.state.timeoutID);
    clearTimeout(this.state.refresh);
  }

  // Update displayed ED data and timer
  updateCommentData() {
    // update data from server:
    // end update from server

    fetch('http://192.168.1.101:5000/comments')
      .then((response) => response.json())
      .then((responseJson) => {
        let filteredMessages = [];
        for (var key of Object.keys(responseJson)) {
          console.log(responseJson[key][0]);
          if (this.state.selectedHospital === 'All' || responseJson[key][0].hospital === this.state.selectedHospital) {
            filteredMessages.push(responseJson[key][0]);
          }
        }
        filteredMessages.sort(function(x, y) {
          if (x.time > y.time) return 1;
          if (x.time < y.time) return -1;
          return 0;
        })
        this.setState({
          messages: filteredMessages,
          loading: false,
        });
      });
  }

  // Select hospital from hospitalButton
  pressFilter() {
    const hospitalOptions = ['Auburn', 'Blacktown', 'Mt. Druitt', 'Westmead', 'All'];
    ActionSheetIOS.showActionSheetWithOptions(
      { options: hospitalOptions },
      (buttonIndex) => {
        this.setState({ selectedHospital: hospitalOptions[buttonIndex] });
        this.updateCommentData();
      },
    );
  }

  // Press Post new comment button
  pressPostComment() {
    const d = new Date();
    const newMessage = {
      hospital: this.state.selectedHospital,
      time: `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}`,
      comment: this.state.newCommentText,
    };

    const {selectedHospital} = this.state;
    const update = this.updateCommentData;

    function handler() {
      if (this.status === 200) {
        update();
      } else {
        console.log('Error');
      }
    }

    // Send new comment to serve
    fetch('http://192.168.1.101:5000/comments', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `userid=${this.userid}&hospital=${this.state.selectedHospital}&comment=${newMessage.comment}`,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let filteredMessages = [];
        for (var key of Object.keys(responseJson)) {
          console.log(responseJson[key][0]);
          if (responseJson[key][0].hospital === this.state.selectedHospital) {
            filteredMessages.push(responseJson[key][0]);
          }
        }
        filteredMessages.sort(function(x, y) {
          if (x.time > y.time) return 1;
          if (x.time < y.time) return -1;
          return 0;
        })
        this.setState({
          messages: filteredMessages,
          loading: false,
        });
      });
    // End send to server

    // // Sample Data
    // var newArray = this.state.messages.concat(newMessage);
    // this.setState({ messages: newArray })
    // Sample Data
    //end
  }

  render() {
    // Navigation between screens
    const { navigation } = this.props;
    if (this.state.loading) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }

    // Map comments to MessageBoxes
    let originalMessages = this.state.messages;
    const displayedComments = originalMessages.map(function(item){
      return (
        <MessageBox
          name={item.hospital}
          time={item.time}
          message={item.comment}
        />
      );
    });

    return (
      <React.Fragment>
      <View style={styles.dataSelectContainer} accessible={true}>
        <TouchableOpacity accessible={true} accessibilityLabel="Tap me to go back."
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={chevronLeft}
            style={{
              height: 20, resizeMode: 'contain',
            }}
          />
          <Text style={styles.headerText}>
            Feedback
          </Text>
        </TouchableOpacity>
        <TouchableOpacity accessible={true} accessibilityLabel="Tap me to select which hospital to show feedback from."
          style={styles.filterButton}
          onPress={() => this.pressFilter()}
        >
          <Text style={styles.filterText}>
          { this.state.selectedHospital }
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {displayedComments}
      </ScrollView>
        <View
          style={styles.commentContainer}
          accessible={true}
          accessibilityLabel="Enter your new comment text here"
        >
          <TextInput
            style={styles.commentInputBox}
            onChangeText={(newCommentText) => this.setState({ newCommentText })}
          />
        <TouchableOpacity accessible={true} accessibilityLabel="Tap me to post comment!"
          style={styles.commentButtonContainer}
          onPress={() => this.pressPostComment()}
        >
        <Text style={styles.commentButtonText}>Post</Text>
        </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}
