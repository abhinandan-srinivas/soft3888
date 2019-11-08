// This screen displays all the KPI items. CardConstructor is used to build the cards.
// The EDDashboard class fetches from the API and pass the data to CardConstructor.
// The class then requested cards from CardConstructor and display them.
// Props:
//   navigation - navigation object to switch between pages in the application.
//   navigation carries the following parameters:
//      username - user ID number used to login, will be passed to Application
//                 Feedback screen (Message Board)

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  ActionSheetIOS,
} from 'react-native';
import CardConstructor from '../components/CardConstructor';

const styles = StyleSheet.create({
  // data Select bar
  dataSelectContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25,
  },
  hospitalButton: {
    height: 47,
    width: '65%',
    borderWidth: 0.5,
    borderColor: '#707070',
    justifyContent: 'center',
    paddingLeft: 28,
  },
  hospitalText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  triageButton: {
    height: 36,
    width: '50%',
    borderWidth: 0.5,
    borderColor: '#707070',
    justifyContent: 'center',
    paddingLeft: 20,
    alignSelf: 'center',
  },
  triageText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'normal',
  },
  logOutButton: {
    height: 47,
    width: '35%',
    borderWidth: 0.5,
    borderColor: '#707070',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logOutText: {
    color: '#000',
    fontSize: 16,
  },
  // "Application Feedback" Button
  goToComments: {
    textAlign: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    top: -8,
  },
  goToCommentsText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 40,
  },
});


// Returns a formatted time string in the format hh:mm
// param: hours - integer from 0-23 representing the hours value
//        min - integer from 0 - 59 representing the minutes value
function parseTime(hours, min) {
  const hoursString = hours.toString().padStart(2, '0');
  const minString = min.toString().padStart(2, '0');
  return `${hoursString}:${minString}`;
}

// EDStatusBar
// Displays current time, time when data was last loaded and when data will
// next be loaded
function EDStatusBar({ currentTime, loadPrevious, loadNext, statusColour }) {
  const statusStyle = {
    // ED Status bar
    statusBarContainer: {
      width: '100%',
      backgroundColor: statusColour, // '#FFBE27',
      paddingVertical: 12,
      borderColor: '#707070',
      borderWidth: 1,
      marginBottom: 8,
    },
    statusBarText1: {
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 6,
    },
    statusBarText2: {
      textAlign: 'center',
      fontSize: 33,
      marginBottom: 6,
    },
    statusBarText3: {
      textAlign: 'center',
      fontSize: 16,
    },
  }
  return (

    <View
      style={statusStyle.statusBarContainer}
    >
      <Text style={statusStyle.statusBarText1}>
        ED Status at
      </Text>
      <Text style={statusStyle.statusBarText2}>
        { currentTime }
      </Text>
      <Text style={statusStyle.statusBarText3}>
        loaded at
        {' '}
        { loadPrevious }
        , next at
        {' '}
        { loadNext }
      </Text>
    </View>
  );
}

export default class EDDashboard extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.username = navigation.getParam('username', 'ERROR NAME');
    this.state = {
      loading: true,
      data: [],
      timer: [],
      selectedHospital: 'Auburn',
      selectedTriage: 'Benchmark',
      currentTime: '',
      statusColour: '#FFBE27',
      timeoutID: -1,
    };
    this.cardConstructor = new CardConstructor();
    this.pressTriage = this.pressTriage.bind(this);
  }

  componentDidMount() {
    // setup timeout for 5 minutes (300000s)
    const { navigation } = this.props;
    const timeoutID = setTimeout(() => navigation.navigate('HomeScreen'), 300000);
    this.setState({
      timeoutID: timeoutID,
    });

    // setup current time to update every 60 seconds
    this.state.interval = setInterval(() => {
      const d = new Date();
      this.setState({
        // currentTime: `${d.getHours()}:${d.getMinutes()}`,
        currentTime: parseTime(d.getHours(), d.getMinutes()),
      });
    }, 60000);

    // update display data
    this.updateDisplayData();
    this.state.refresh = setInterval(() => {
      this.updateDisplayData();
    }, 300000);
  }

  // Unmount screen
  componentWillUnmount() {
    // clear timeout and refresh timer
    // clearInterval(this.state.interval);
    clearTimeout(this.state.timeoutID);
    clearTimeout(this.state.refresh);
  }

  // Update displayed ED data and timer
  updateDisplayData() {
    // calculations of time to load data next
    const d = new Date();
    let min = d.getMinutes();
    let hours = d.getHours();
    min += 5;
    if (min >= 60) {
      min -= 60;
      hours += 1;
    }
    if (hours >= 24) {
      hours -= 24;
    }

    // update data from server:

    let urlParam = '';
    if (this.state.selectedHospital === 'Auburn') {
      urlParam = 'auburn'
    } else if (this.state.selectedHospital === 'Blacktown') {
      urlParam = 'blacktown'
    } else if (this.state.selectedHospital === 'Mt. Druitt') {
      urlParam = 'mtdruitt'
    } else if (this.state.selectedHospital === 'Westmead') {
      urlParam = 'westmead'
    }

    fetch(`http://192.168.1.101:5000/${urlParam}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // currentTime: `${d.getHours()}:${d.getMinutes()}`,
          currentTime: parseTime(d.getHours(), d.getMinutes()),
          timer: {
            // previous: `${d.getHours()}:${d.getMinutes()}`,
            previous: parseTime(d.getHours(), d.getMinutes()),
            // next: `${hoursString}:${minString}`,
            next: parseTime(hours, min),
          },
          data: {
            waitingInEDCount: {
              total: responseJson.waiting_in_ed_count[0].waiting_in_ed_count_total,
              notTriaged: responseJson.waiting_in_ed_count[0].not_triaged,
              notSeen: responseJson.waiting_in_ed_count[0].not_seen,
              departed: responseJson.waiting_in_ed_count[0].departed,
            },
            waitingInEDHours: {
              zeroToTwo: responseJson.waiting_in_ed_hours[0].zero_two,
              twoToThree: responseJson.waiting_in_ed_hours[0].two_three,
              threeToFour: responseJson.waiting_in_ed_hours[0].three_four,
              fourToTwentyFour: responseJson.waiting_in_ed_hours[0].four_twentyfour,
            },
            presentations: responseJson.presentations,
            EDAllETP: {
              totalDischarges: responseJson.ed_all_etp[0].all_admits,
              DCAdmittedIn4: responseJson.ed_all_etp[0].transferred,
              percentage: responseJson.ed_all_etp[0].percentage,
            },
            EDAdmitsETP: {
              allAdmits: 32,
              transferredIn4: 16,
              percentage: '50.0%',
            },
            EDAdmitsETPNonEDSpecialty: {
              allAdmits: responseJson.ed_admits_no_specialty[0].all_admits,
              transferredIn4: responseJson.ed_admits_no_specialty[0].transferred,
              percentage: responseJson.ed_admits_no_specialty[0].percentage,
            },
            EDNonAdmitsETP: {
              // allNonAdmits: responseJson.ed_non_admits_etp.all_non_admits,
              // nonAdmitsDCin4: responseJson.ed_non_admits_etp.non_admints_dc,
              // percentage: responseJson.ed_non_admits_etp.percentage,
              allNonAdmits: 41,
              nonAdmitsDCin4: 26,
              percentage: 63.4,
            },
            EDAdmitsETPEDSpecialty: {
              allAdmits: responseJson.ed_admits_specialty[0].all_admits,
              transferredIn4: responseJson.ed_admits_specialty[0].transferred,
              percentage: responseJson.ed_admits_specialty[0].percentage,
            },
            inED: {
              number: responseJson.general[0].in_ed,
              sinceMidnight: responseJson.general[0].since_midnight,
              last7Days: responseJson.general[0].last_seven_days,
            },
            presentationsChart: {
              values: [
                responseJson.presentation_chart_data[0].number,
                responseJson.presentation_chart_data[1].number,
                responseJson.presentation_chart_data[2].number,
                responseJson.presentation_chart_data[3].number,
                responseJson.presentation_chart_data[4].number,
                responseJson.presentation_chart_data[5].number,
                responseJson.presentation_chart_data[6].number
              ],
              dates: [
                responseJson.presentation_chart_data[0].date.substring(0,5),
                responseJson.presentation_chart_data[1].date.substring(0,5),
                responseJson.presentation_chart_data[2].date.substring(0,5),
                responseJson.presentation_chart_data[3].date.substring(0,5),
                responseJson.presentation_chart_data[4].date.substring(0,5),
                responseJson.presentation_chart_data[5].date.substring(0,5),
                responseJson.presentation_chart_data[6].date.substring(0,5)
              ]
            },
            waitingToDepart: {
              zeroToTwo: responseJson.ready_to_depart_to_discharged[0].zero_two,
              twoToFour: responseJson.ready_to_depart_to_discharged[0].two_four,
              fourToSix: responseJson.ready_to_depart_to_discharged[0].four_six,
              sixToEight: responseJson.ready_to_depart_to_discharged[0].six_eight,
              eightPlus: responseJson.ready_to_depart_to_discharged[0].eight_up,
            },
            triage: {
              cat1: responseJson.triage[0].one,
              cat2: responseJson.triage[0].two,
              cat3: responseJson.triage[0].three,
              cat4: responseJson.triage[0].four,
              cat5: responseJson.triage[0].five,
            },
            waitingInEDHoursExpanded: [
              {
                specialty: responseJson.expanded_zero_two_speciality,
                // specialty: [
                //   {
                //     name: 'cardio',
                //     number: 24,
                //   }
                // ],
                triage: responseJson.expanded_zero_two_triage[0],
              },
              {
                specialty: responseJson.expanded_two_three_speciality,
                triage: responseJson.expanded_two_three_triage[0],
              },
              {
                specialty: responseJson.expanded_three_four_speciality,
                triage: responseJson.expanded_three_four_triage[0],
              },
              {
                specialty: responseJson.expanded_four_twentyfour_speciality,
                triage: responseJson.expanded_four_twentyfour_triage[0],
              },
            ],
          },
        }, () => {
          // console.log(this.state.data);
          // Update EDStatus bar colour
          const last7Days = parseInt(this.state.data.inED.last7Days);
          const inED = parseInt(this.state.data.inED.number);
          const compareValue = inED + last7Days;
          if (compareValue < 35) {
            this.setState({
              statusColour: '#7BFF7E', // Green
            })
          } else if (compareValue > 70) {
            this.setState({
              statusColour: '#FF7B7B', // Red
            })
          } else {
            this.setState({
              statusColour: '#FFBE27', // Amber
            })
          }

          this.cardConstructor.updateDisplayData(this.state.data, () => {
            this.setState({
              loading: false,
            });
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });

      const { navigation } = this.props;

    // end update from server

    // update with sample data:
    // this.setState({
    //   // loading: false,
    //   currentTime: `${d.getHours()}:${d.getMinutes()}`,
    //   timer: {
    //     previous: `${d.getHours()}:${d.getMinutes()}`,
    //     next: `${hours}:${min}`,
    //   },
    //   data: {
    //     waitingInEDCount: {
    //       total: '24',
    //       notTriaged: '3',
    //       notSeen: '21',
    //       departed: '0',
    //     },
    //     waitingInEDHours: {
    //       zeroToTwo: '19',
    //       twoToThree: '8',
    //       threeToFour: '7',
    //       fourToTwentyFour: '12',
    //     },
    //     waitingToDepart: {
    //       zeroToTwo: '19',
    //       twoToFour: '9',
    //       fourToSix: '12',
    //       sixToEight: '8',
    //       eightPlus: '4',
    //     },
    //
    //     waitingInEDHoursExpanded: {
    //       zeroToTwo: {
    //         triage: [
    //           { value: 50,
    //             label: 'Cat 1', },
    //           { value: 10,
    //             label: 'Cat 2', },
    //           { value: 40,
    //             label: 'Cat 3', },
    //           { value: 110,
    //             label: 'Cat 4', },
    //           { value: 85,
    //             label: 'Cat 5', },
    //         ],
    //         specialty: [
    //           { name: 'Gastroenterology',
    //             number: 5, },
    //             { name: 'Oncology',
    //             number: 3, },
    //           ],
    //       },
    //       twoToThree: {
    //         triage: [
    //           { value: 50,
    //             label: 'Cat 1', },
    //           { value: 10,
    //             label: 'Cat 2', },
    //           { value: 40,
    //             label: 'Cat 3', },
    //           { value: 110,
    //             label: 'Cat 4', },
    //           { value: 85,
    //             label: 'Cat 5', },
    //         ],
    //         specialty: [
    //           { name: 'Gastroenterology',
    //             number: 5, },
    //             { name: 'Oncology',
    //             number: 3, },
    //           ],
    //       },
    //       threeToFour: {
    //         triage: [
    //           { value: 50,
    //             label: 'Cat 1', },
    //           { value: 10,
    //             label: 'Cat 2', },
    //           { value: 40,
    //             label: 'Cat 3', },
    //           { value: 110,
    //             label: 'Cat 4', },
    //           { value: 85,
    //             label: 'Cat 5', },
    //         ],
    //         specialty: [
    //           { name: 'Gastroenterology',
    //             number: 5, },
    //             { name: 'Oncology',
    //             number: 3, },
    //           ],
    //       },
    //       fourToTwentyFour: {
    //         triage: [
    //           { value: 50,
    //             label: 'Cat 1', },
    //           { value: 10,
    //             label: 'Cat 2', },
    //           { value: 40,
    //             label: 'Cat 3', },
    //           { value: 110,
    //             label: 'Cat 4', },
    //           { value: 85,
    //             label: 'Cat 5', },
    //         ],
    //         specialty: [
    //           { name: 'Gastroenterology',
    //             number: 5, },
    //             { name: 'Oncology',
    //             number: 3, },
    //           ],
    //       },
    //     },
    //
    //     presentations: '24',
    //     EDAllETP: {
    //       totalDischarges: '32',
    //       DCAdmittedIn4: '7',
    //       percentage: '50.0%',
    //     },
    //     EDAdmitsETP: {
    //       allAdmits: 32,
    //       transferredIn4: 16,
    //       percentage: '50.0%',
    //     },
    //     EDAdmitsETPNonEDSpecialty: {
    //       allAdmits: '20',
    //       transferredIn4: '7',
    //       percentage: '35.0%',
    //     },
    //     EDNonAdmitsETP: {
    //       allNonAdmits: '41',
    //       nonAdmitsDCin4: '26',
    //       percentage: '63.4%',
    //     },
    //     EDAdmitsETPEDSpecialty: {
    //       allAdmits: '12',
    //       transferredIn4: '9',
    //       percentage: '75.0%',
    //     },
    //     inED: {
    //       number: '52',
    //       sinceMidnight: '3',
    //       last7Days: '21',
    //     },
    //   },
    // data: responseJson,
    // }, () => {
    //   console.log(this.state.data);
    //   this.cardConstructor.updateDisplayData(this.state.data, () => {
    //     this.setState({
    //       loading: false,
    //     });
    //   });
    // });
    // end update with sample data


    // Update EDStatus bar colour
    // let compareValue = parseInt(this.state.data.inED.last7Days);
    // if (compareValue < 35) {
    //   statusColour = '#7BFF7E'; // Green
    // } else if (compareValue > 70) {
    //   statusColour = '#FF7B7B'; // Red
    // } else {
    //   statusColour = '#FFBE27'; // Amber
    // }
  }

  // Select hospital from hospitalButton
  pressHospital() {
    const hospitalOptions = ['Auburn', 'Blacktown', 'Mt. Druitt', 'Westmead'];
    ActionSheetIOS.showActionSheetWithOptions(
      { options: hospitalOptions },
      (buttonIndex) => {
        this.setState({ selectedHospital: hospitalOptions[buttonIndex] });
        this.updateDisplayData();
      },
    );
  }

  /*
    Tap a data card (or item within a card) and move to the description screen
      itemID:
        0 - Waiting in ED
        1 - Waiting in ED (Hrs)
        2 - Waiting to Depart
        3 - Presentation Graph
        4 - In ED
        5 - Triage
        6 - ED Admits ETP (ED Specialty)
        7 - ED Admits ETP (Non-ED Specialty)
        8 - ED All ETP (Non Admitted and Admitted)
        9 - ED Admits ETP
        10 - ED Non Admits ETP
  */
  pressCardItem(itemID) {
    // Navigation between screens
    const { navigation } = this.props;
    const termIDs = [
      [ 213, 222, 223, 214 ], // 0
      [ 206, 207, 208, 209 ], // 1
      [], // 2
      [ 211 ], // 3
      [ 212 ], // 4
      [ 220 ], // 5
      [ 168, 169, 170 ], // 6
      [ 171, 172, 173], // 7
      [ 159, 160, 161 ], // 8
      [ 165, 166, 167 ], // 9
      [ 162, 163, 164 ], // 10
    ];
    const headings = [
      'Waiting in ED',
      'Waiting in ED',
      'Waiting to Depart',
      'Presentation Graph',
      'In ED',
      'Triage',
      'ED Admits ETP (ED Specialty)',
      'ED Admits ETP (Non-ED Specialty)',
      'ED All ETP (Non Admitted and Admitted)',
      'ED Admits ETP',
      'ED Non Admits ETP'
    ]

    navigation.navigate('DescriptionScreen', {
      itemID: itemID,
      data: this.state.data,
      termIDs: termIDs[itemID],
      heading: headings[itemID],
      hospital: this.state.selectedHospital,
    });
  }

  pressTriage() {
    const triageOptions = ['Benchmark', 'Presentations'];
    const updateTriage = (buttonIndex) => {
      this.setState({ selectedTriage: triageOptions[buttonIndex] });
      this.updateDisplayData();
    };
    ActionSheetIOS.showActionSheetWithOptions(
      { options: triageOptions },
      (buttonIndex) => {
        updateTriage(buttonIndex);
      },
    );
  }

  render() {

    // Navigation between screens
    const { navigation } = this.props

    const data = this.state.data;
    const loading = this.state.loading;
    if (loading) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }

    return (
      <ScrollView>

        <View
          style={styles.dataSelectContainer}
        >
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Tap me to select the hospital to display Emergency Department data of."
            style={styles.hospitalButton}
            onPress={() => this.pressHospital()}
          >
            <Text style={styles.hospitalText}>
              { this.state.selectedHospital }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Tap me to log out"
            style={styles.logOutButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <EDStatusBar
          currentTime={this.state.currentTime}
          loadPrevious={this.state.timer.previous}
          loadNext={this.state.timer.next}
          statusColour={this.state.statusColour}
        />

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Tap me to view the Application Feedback screen"
          style={styles.goToComments}
          onPress={() => navigation.navigate('MessageScreen', {
            userid: this.username,
            hospital: this.state.selectedHospital,
          })}
        >
          <Text style={styles.goToCommentsText}>
            Application Feedback
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Waiting in E.D. card. Tap me to view additional information."
          onPress={() => this.pressCardItem(0)}
        >
          {this.cardConstructor.waitingInEDCountCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Waiting in E D Hours card. Tap me to view additional information."
          onPress={() => this.pressCardItem(1)}
        >
          {this.cardConstructor.waitingInEDHoursCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Waiting in Depart card. Tap me to view additional information."
          onPress={() => this.pressCardItem(2)}>
          {this.cardConstructor.waitingToDepartCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Presentations card. Tap me to view additional information."
          onPress={() => this.pressCardItem(3)}
        >
          {this.cardConstructor.presentationsCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="In E D card. Tap me to view additional information."
          onPress={() => this.pressCardItem(4)}
        >
          {this.cardConstructor.inEDCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Triage card. Tap me to view additional information."
          onPress={() => this.pressCardItem(5)}
        >
          {this.cardConstructor.triageCard(this.state.selectedTriage, this.pressTriage)}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="E D admits E T P E D Specialty card. Tap me to view additional information."
          onPress={() => this.pressCardItem(6)}
        >
          {this.cardConstructor.edAdmitsETPEDSpecialtyCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="E D admits E T P non E D specialty card. Tap me to view additional information."
          onPress={() => this.pressCardItem(7)}
        >
          {this.cardConstructor.edAdmitsETPNonEDSpecialtyCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="E D all E T P non admitted and admitted card. Tap me to view additional information."
          onPress={() => this.pressCardItem(8)}
        >
          {this.cardConstructor.edAllETPNonAdmittedAndAdmittedCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="E D admits E T P card. Tap me to view additional information."
          onPress={() => this.pressCardItem(9)}
        >
          {this.cardConstructor.edAdmitsETPCard()}
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="E D Non admits E T P card. Tap me to view additional information."
          onPress={() => this.pressCardItem(10)}
        >
          {this.cardConstructor.edNonAdmitsETPCard()}
        </TouchableOpacity>

      </ScrollView>
    );
  }
}
