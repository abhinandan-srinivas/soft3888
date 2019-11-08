// This class creates the KPI cards for both the Dashboard and Description screens
// updateDisplayData receives a data object and will update all the cards
// getCard will return a JSX for the card according to the supplied data and term ID
// getExpanded will return a JSX for extra data that will be displayed in the the description screen

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  ActionSheetIOS,
} from 'react-native';
import {
  BarChart, LineChart, Grid, YAxis, XAxis,
} from 'react-native-svg-charts';

// MIT License for react-native-svg-charts is in license-react-native-svg-charts.txt
import { Circle, Path } from 'react-native-svg';


import * as scale from 'd3-scale';
import {
  BlankCard, CardSecondarySummary, Card1TitlePrimary2Secondary, CardTitle3Secondary,
  Card1TitlePrimary1FreeContent,
} from './Cards';
import SelectChart from './SelectChart';


const styles = {
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
}

export default class CardConstructor {
  constructor() {
    this.data = [];
    this.loading = true;
    this.updateDisplayData = this.updateDisplayData.bind(this);
    this.waitingInEDCountCard = this.waitingInEDCountCard.bind(this);
  }

  updateDisplayData(jsonData, callback) {
    // console.log(this.jsonData);
    this.data = JSON.parse(JSON.stringify(jsonData));
    this.loading = false;
    callback();
  }

  /*
    Return the card according to ID
  */
  getCard(id, arg1 = null, arg2 = null) {
    switch (id) {
      case 0: // 0 - Waiting in ED
        return this.waitingInEDCountCard();
      case 1: // 1 - Waiting in ED (Hrs)
        return this.waitingInEDHoursCard();
      case 2: // 2 - Waiting to Depart
        return this.waitingToDepartCard();
      case 3: // 3 - Presentation Graph
        return this.presentationsCard();
      case 4: // 4 - In ED
        return this.inEDCard();
      case 5: // 5 - Triage
        return this.triageCard(arg1, arg2);
      case 6: // 6 - ED Admits ETP (ED Specialty)
        return this.edAdmitsETPEDSpecialtyCard();
      case 7: // 7 - ED Admits ETP (Non-ED Specialty)
        return this.edAdmitsETPNonEDSpecialtyCard();
      case 8: // 8 - ED All ETP (Non Admitted and Admitted)
        return this.edAllETPNonAdmittedAndAdmittedCard();
      case 9: // 9 - ED Admits ETP
        return this.edAdmitsETPCard();
      case 10: // 10 - ED Non Admits ETP
        return this.edNonAdmitsETPCard();
      default:
        return (
          <View>
            <Text>Incorrect card id {id}</Text>
          </View>
        );
    }
  }

  /*
    Return the exanded display according to ID
  */
  getExpanded(id) {
    switch (id) {
      case 0: // 0 - Waiting in ED
        return this.notSeenTriage();
      case 1: // 1 - Waiting in ED (Hrs)
        return this.waitingInEDHoursExpanded();
      case 2: // 2 - Waiting to Depart
        return this.waitingToDepartExpanded();
      // case 3: // 3 - Presentation Graph
      //   return presentationsExpanded();
      // case 5: // 5 - Triage
      //   return ??;
      default:
        return null;
    }
  }

/*
 ------------------ CARDS -------------------
*/
  // 0 - Waiting in ED
  waitingInEDCountCard() {
    if (this.loading) {
      return (
        <Text>
          Loading...
        </Text>
      );
    }
    return (
      <Card1TitlePrimary1FreeContent
        primary={{ title: 'Waiting in ED', number: this.data.waitingInEDCount.total }}
      >
        <CardSecondarySummary title="Not Triaged" number={this.data.waitingInEDCount.notTriaged} viewVariant={{ width: 40 }} subheadingVariant={{ width: 50 }} />
        <CardSecondarySummary title="Not Seen" number={this.data.waitingInEDCount.notSeen} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40 }} />
        <CardSecondarySummary title="Departed" number={this.data.waitingInEDCount.departed} viewVariant={{ width: 70 }} subheadingVariant={{ width: 70 }} />
      </Card1TitlePrimary1FreeContent>
    );
  }

  waitingInEDHoursCard() {
    return (
      <BlankCard title="Waiting in ED">
        <View
          accessible={true}
          accessibilityLabel="Waiting in ED Card"
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
          }}
        >
          <CardSecondarySummary title="0-2 Hours" number={this.data.waitingInEDHours.zeroToTwo} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40, color: '#09942E'}} />
          <CardSecondarySummary title="2-3 Hours" number={this.data.waitingInEDHours.twoToThree} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40, color: '#FFBE27'}} />
          <CardSecondarySummary title="3-4 Hours" number={this.data.waitingInEDHours.threeToFour} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40, color: '#FF7B7B'}} />
          <CardSecondarySummary title="4-24 Hours" number={this.data.waitingInEDHours.fourToTwentyFour} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40, color: '#FF0000' }} />
        </View>
      </BlankCard>
    );
  }

  waitingToDepartCard() {
    return (
      <BlankCard title="Waiting to Depart">
        <View
          accessible={true}
          accessibilityLabel="Waiting to Depart Card"
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
          }}
        >
          <CardSecondarySummary title="0-2 Hours" number={this.data.waitingToDepart.zeroToTwo} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40 }} />
          <CardSecondarySummary title="2-4 Hours" number={this.data.waitingToDepart.twoToFour} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40 }} />
          <CardSecondarySummary title="4-6 Hours" number={this.data.waitingToDepart.fourToSix} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40 }} />
          <CardSecondarySummary title="6-8 Hours" number={this.data.waitingToDepart.sixToEight} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40 }} />
          <CardSecondarySummary title="8+ Hours" number={this.data.waitingToDepart.eightPlus} viewVariant={{ width: 40 }} subheadingVariant={{ width: 40 }} />
        </View>
      </BlankCard>
    );
  }

  // 3 - Presentation Graph
  presentationsCard() {
    // Data for Presentations
    const presentationsData = this.data.presentationsChart.values;
    const labels = this.data.presentationsChart.dates;

    const Decorator = ({ x, y, data }) => {
      return data.map((value, index) => (
        <Circle
          key={ index }
          cx={ x(index) }
          cy={ y(value) }
          r={ 4 }
          stroke={ 'rgb(134, 65, 244)' }
          fill={ 'white' }
        />
      ))
    }

    const Line = ({ line }) => (
      <Path
        d={ line }
        stroke={ 'rgba(134, 65, 244)' }
        fill={'none'}
      />
    );

    return (
      <Card1TitlePrimary1FreeContent
        primary={{ title: 'Presentations', number: this.data.presentations }}
      >
        <View
          accessible={true}
          accessibilityLabel="Presentations Card"
          style={{flex: 1, height: 120, paddingLeft: 20, flexDirection: 'row' }}>
          <YAxis
            data={presentationsData}
            style={{ marginBottom: 30 }}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{ fontSize: 10, fill: 'grey' }}
            numberOfTicks={5}
          />
          <View style={{flex:1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={presentationsData}
              contentInset={{ top: 10, bottom: 10 }}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              numberOfTicks={5}
            >
              <Grid />
              <Decorator />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: 30 }}
              data={presentationsData}
              formatLabel={(__, index) => labels[index]}
              contentInset={{ left: 10, right: 10 }}
              svg={{ fontSize: 10, fill: 'grey', rotation: 60, y: 20, x: 20}}
            />
          </View>
        </View>
      </Card1TitlePrimary1FreeContent>
    );
  }

  // 4 - In ED
  inEDCard() {
    return (
      <Card1TitlePrimary2Secondary
        accessible={true}
        accessibilityLabel="In ED Card"
        primary={{ title: 'In ED', number: this.data.inED.number }}
        secondary1={{ title: 'Since Midnight', number: this.data.inED.sinceMidnight }}
        secondary2={{ title: 'Last 7 Days', number: this.data.inED.last7Days }}
      />
    );
  }

  // 6 - ED Admits ETP (ED Specialty)
  edAdmitsETPEDSpecialtyCard() {
    return (
      <CardTitle3Secondary
        accessible={true}
        accessibilityLabel="ED Admits ETP (ED Specialty) Card"
        title="ED Admits ETP (ED Specialty)"
        secondary1={{ title: 'All admits', number: this.data.EDAdmitsETPEDSpecialty.allAdmits }}
        secondary2={{ title: 'Transferred in 4', number: this.data.EDAdmitsETPEDSpecialty.transferredIn4 }}
        secondary3={{ title: 'Total ETP %', number: this.data.EDAdmitsETPEDSpecialty.percentage }}
      />
    );
  }

  // 7 - ED Admits ETP (Non-ED Specialty)
  edAdmitsETPNonEDSpecialtyCard() {
    return (
      <CardTitle3Secondary
        accessible={true}
        accessibilityLabel="ED Admits ETP (Non-ED Specialty) Card"
        title="ED Admits ETP (Non-ED Specialty)"
        secondary1={{ title: 'All admits', number: this.data.EDAdmitsETPNonEDSpecialty.allAdmits }}
        secondary2={{ title: 'Transferred in 4', number: this.data.EDAdmitsETPNonEDSpecialty.transferredIn4 }}
        secondary3={{ title: 'Total ETP %', number: this.data.EDAdmitsETPNonEDSpecialty.percentage }}
      />
    );
  }

  // 8 - ED All ETP (Non Admitted and Admitted)
  edAllETPNonAdmittedAndAdmittedCard() {
    return (
      <CardTitle3Secondary
        accessible={true}
        accessibilityLabel="ED All ETP (Non Admitted and Admitted) Card"
        title="ED All ETP (Non Admitted and Admitted)"
        secondary1={{ title: 'Total Discharges', number: this.data.EDAllETP.totalDischarges }}
        secondary2={{ title: 'D/C Admit in 4', number: this.data.EDAllETP.DCAdmittedIn4 }}
        secondary3={{ title: 'Total ETP %', number: this.data.EDAllETP.percentage }}
      />
    );
  }

  // 9 - ED Admits ETP
  edAdmitsETPCard() {
    return (
      <CardTitle3Secondary
        accessible={true}
        accessibilityLabel="ED Admits ETP Card"
        title="ED Admits ETP"
        secondary1={{ title: 'All admits', number: this.data.EDAdmitsETP.allAdmits }}
        secondary2={{ title: 'Transferred in 4', number: this.data.EDAdmitsETP.transferredIn4 }}
        secondary3={{ title: 'Total ETP %', number: this.data.EDAdmitsETP.percentage }}
      />
    );
  }

  // 10 - ED Non Admits ETP
  edNonAdmitsETPCard() {
    return (
      <CardTitle3Secondary
        accessible={true}
        accessibilityLabel="ED Non Admits ETP Card"
        title="ED Non Admits ETP"
        secondary1={{ title: 'All None Admits', number: this.data.EDNonAdmitsETP.allNonAdmits }}
        secondary2={{ title: 'Non Admits DC in 4', number: this.data.EDNonAdmitsETP.nonAdmitsDCin4 }}
        secondary3={{ title: 'Non Admit ETP %', number: this.data.EDNonAdmitsETP.percentage }}
      />
    );
  }

  // 5 - Triage
  triageCard(selectedTriage, callback) {
    // Data for Triage Benchmark chart
    const triageBenchmarkData = [
      {
        value: this.data.triage.cat1,
        label: 'Cat 1',
      },
      {
        value: this.data.triage.cat2,
        label: 'Cat 2',
      },
      {
        value: this.data.triage.cat3,
        label: 'Cat 3',
      },
      {
        value: this.data.triage.cat4,
        label: 'Cat 4',
      },
      {
        value: this.data.triage.cat5,
        label: 'Cat 5',
      },
    ];

    const triagePresentationsData = [
      {
        value: this.data.triage.cat1,
        label: 'Cat 1',
      },
      {
        value: this.data.triage.cat2,
        label: 'Cat 2',
      },
      {
        value: this.data.triage.cat3,
        label: 'Cat 3',
      },
      {
        value: this.data.triage.cat4,
        label: 'Cat 4',
      },
      {
        value: this.data.triage.cat5,
        label: 'Cat 5',
      },
    ];

    if (selectedTriage === null) {
      return (
        <View
          accessible={true}
          accessibilityLabel="Triage Benchmark/Presentations Card"
        >
          <BlankCard title="Triage Benchmark">
            <View
              style={{
                flexDirection: 'row', height: 150, marginBottom: 16
              }}
            >
              <YAxis
                data={triageBenchmarkData}
                yAccessor={({ index }) => index}
                scale={scale.scaleBand}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.2}
                formatLabel={(_, index) => triageBenchmarkData[index].label}
              />
              <BarChart
                style={{ flex: 1, marginLeft: 8 }}
                data={triageBenchmarkData}
                horizontal={true}
                yAccessor={({ item }) => item.value}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.VERTICAL} />
              </BarChart>
            </View>
          </BlankCard>
          <BlankCard title="Triage Presentations">
            <View
              style={{
                flexDirection: 'row', height: 150, marginBottom: 16
              }}
            >
              <YAxis
                data={triagePresentationsData}
                yAccessor={({ index }) => index}
                scale={scale.scaleBand}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.2}
                formatLabel={(_, index) => triagePresentationsData[index].label}
              />
              <BarChart
                style={{ flex: 1, marginLeft: 8 }}
                data={triagePresentationsData}
                horizontal={true}
                yAccessor={({ item }) => item.value}
                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.VERTICAL} />
              </BarChart>
            </View>
          </BlankCard>
        </View>
      );
    }

    let triageChartData;
    if (selectedTriage === 'Benchmark') {
      triageChartData = triageBenchmarkData;
    } else {
      triageChartData = triagePresentationsData;
    }

    return (
      <BlankCard title="Triage">
        <View
          style={{
            flexDirection: 'row', height: 150, marginBottom: 16
          }}
        >
          <YAxis
            data={triageChartData}
            yAccessor={({ index }) => index}
            scale={scale.scaleBand}
            contentInset={{ top: 10, bottom: 10 }}
            spacing={0.2}
            formatLabel={(_, index) => triageChartData[index].label}
          />
          <BarChart
            style={{ flex: 1, marginLeft: 8 }}
            data={triageChartData}
            horizontal={true}
            yAccessor={({ item }) => item.value}
            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
            contentInset={{ top: 10, bottom: 10 }}
            spacing={0.2}
            gridMin={0}
          >
            <Grid direction={Grid.Direction.VERTICAL} />
          </BarChart>
        </View>
        <TouchableOpacity
          style={styles.triageButton}
          onPress={() => callback()}
        >
          <Text style={styles.triageText}>
            { selectedTriage }
          </Text>
        </TouchableOpacity>
      </BlankCard>
    );
  }

/*
 ------------------ EXPANDED ITEMS -------------------
*/
  notSeenTriage() {
      const triageData = [
      {
        value: 50,
        label: 'Cat 1',
      },
      {
        value: 10,
        label: 'Cat 2',
      },
      {
        value: 40,
        label: 'Cat 3',
      },
      {
        value: 110,
        label: 'Cat 4',
      },
      {
        value: 85,
        label: 'Cat 5',
      },
    ];
    return triageBarChart(triageData);
  }

  waitingInEDHoursExpanded() {
    return (
      <View>
        <SelectChart passedData = {this.data.waitingInEDHoursExpanded}/>
      </View>
    );
  }

  waitingToDepartExpanded() {
    const data = [
      {
        value: this.data.waitingToDepart.zeroToTwo,
        label: '0-2',
      },
      {
        value: this.data.waitingToDepart.twoToFour,
        label: '2-4',
      },
      {
        value: this.data.waitingToDepart.fourToSix,
        label: '4-6',
      },
      {
        value: this.data.waitingToDepart.sixToEight,
        label: '6-8',
      },
      {
        value: this.data.waitingToDepart.eightPlus,
        label: '8+',
      },
    ];
    return (
      <View
        style={{
          flexDirection: 'row', height: 200, marginBottom: 30, marginTop: 16, marginHorizontal: 16
        }}
      >
        <YAxis
          data={data}
          yAccessor={({ index }) => index}
          scale={scale.scaleBand}
          contentInset={{ top: 10, bottom: 10 }}
          spacing={0.2}
          formatLabel={(_, index) => data[index].label}
        />
        <BarChart
          style={{ flex: 1, marginLeft: 8 }}
          data={data}
          horizontal={true}
          yAccessor={({ item }) => item.value}
          svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
          contentInset={{ top: 10, bottom: 10 }}
          spacing={0.2}
          gridMin={0}
        >
        </BarChart>
      </View>
    );
  }
}

function triageBarChart(data) {
  return (
    <View
      style={{
        flexDirection: 'row', height: 200, marginBottom: 30, marginTop: 16, marginHorizontal: 16
      }}
    >
      <YAxis
        data={data}
        yAccessor={({ index }) => index}
        scale={scale.scaleBand}
        contentInset={{ top: 10, bottom: 10 }}
        spacing={0.2}
        formatLabel={(_, index) => data[index].label}
      />
      <BarChart
        style={{ flex: 1, marginLeft: 8 }}
        data={data}
        horizontal={true}
        yAccessor={({ item }) => item.value}
        svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
        contentInset={{ top: 10, bottom: 10 }}
        spacing={0.2}
        gridMin={0}
      >
        <Grid direction={Grid.Direction.VERTICAL} />
      </BarChart>
    </View>
  );
}
