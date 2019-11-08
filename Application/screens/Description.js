// Description screen displays a detailed view of a KPI item. This includes KPI term
// definitions and further breakdowns if available. Description screen gets card from
// CardConstructor.
// Props:
//   navigation - navigation object to switch between pages in the application.
//   navigation carries the following parameters:
//      itemID - ID number of the card, used to fetch data from CardConstructor
//      data - KPI data from the API, will be passed to CardConstructor
//      termIDs - ID numbers of the KPI terms, used to fetch the definitions of those terms

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, ScrollView, TouchableOpacity
} from 'react-native';
import {
  CardPrimarySummary, CardSecondarySummary, Card1TitlePrimary2Secondary, CardTitle3Secondary,
  Card1TitlePrimary1FreeContent
} from '../components/Cards';
// Dummy data for KPI definitions
import dummyDescription from '../components/DummyDescription';
import CardConstructor from '../components/CardConstructor';

const chevronLeft = require('../assets/chevron-left.png');

const styles = StyleSheet.create({
  // data Select bar
  header: {
    height: 47,
    borderWidth: 0.5,
    borderColor: '#707070',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 25,
  },
  headerText: {
    fontSize: 20,
    lineHeight: 47,
    textAlign: 'center',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'normal',
    marginHorizontal: 16,
  },
  horizontalLine: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    alignSelf: 'center',
    width: '90%',
    marginTop: 16,
  },
});

export default class Description extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.itemID = navigation.getParam('itemID', 0);
    this.data = navigation.getParam('data', null);
    this.termIDs = navigation.getParam('termIDs', []);
    this.cardConstructor = new CardConstructor();
    this.state = {
      loading: true,
      kpiDefinitions: [],
      timeoutID: -1,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const timeoutID = setTimeout(() => navigation.navigate('HomeScreen'), 300000);
    this.setState({
      timeoutID: timeoutID,
    });
    this.updateDisplayData();
    this.cardConstructor.updateDisplayData(this.data, () => {});
  }

  componentWillUnmount() {
    // clearInterval(this.state.interval);
    clearTimeout(this.state.timeoutID);
    clearTimeout(this.state.refresh);
  }

  updateDisplayData() {
    fetch('http://192.168.1.101:5000/kpidefinitions')
      .then((response) => response.json())
      .then((responseJson) => {
        let tempKPIDefinitions = [];
        for (let i = 0; i < this.termIDs.length; i++) {
          if (typeof responseJson[this.termIDs[i].toString()] !== 'undefined') {
            tempKPIDefinitions.push(responseJson[this.termIDs[i].toString()][0]);
            //console.log(responseJson[this.termIDs[i].toString()]);
          }
        }
        // for (term of this.termIDs) {
        //   // tempKPIDefinitions.push(dummyDescription[term]);
        // }
        this.setState({
          kpiDefinitions: tempKPIDefinitions,
          loading: false,
        });
      })
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <Text> Loading... </Text>
        </View>
      );
    }

    // console.log(this.state.kpiDefinitions);

    const { navigation } = this.props;

    return (
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.header}>
            <Image
              source={chevronLeft}
              style={{
                height: 20, resizeMode: 'contain', marginTop: 12,
              }}
            />
            <Text style={styles.headerText}>
              {navigation.getParam('hospital', null)} - {navigation.getParam('heading', null)}
            </Text>
          </View>
        </TouchableOpacity>
        <ScrollView style={{paddingBottom: 100, marginBottom: 100}}>
          {this.cardConstructor.getCard(this.itemID)}
          {this.cardConstructor.getExpanded(this.itemID)}
          <View style={styles.horizontalLine} />
          {this.state.kpiDefinitions.map((item) => (
            <View>
              <Text style={styles.descriptionTitle}>
                {item.term_name}
              </Text>
              <Text style={styles.descriptionText}>
                {item.term_definition}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
