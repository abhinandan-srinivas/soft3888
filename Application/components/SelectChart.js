// This class is a component used in the expanded data of Waiting in ED (hours) card.
// Thic component allows users to select which hour range they want  to display the
// triage breakdown for. It also displays the breakdown by soecialty.

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
} from 'react-native';

// MIT License for react-native-svg-charts is in license-react-native-svg-charts.txt
import {
  BarChart, LineChart, Grid, YAxis, XAxis,
} from 'react-native-svg-charts';

import * as scale from 'd3-scale';

const styles = {
  specialtyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  specialtyText: {
    fontSize: 16,
    fontWeight: 'normal',
    marginHorizontal: 16,
  },
};

function triageBarChart(data) {
  const chartData = [
    {
      value: data.cat1,
      label: "Cat 1"
    },
    {
      value: data.cat2,
      label: "Cat 2"
    },
    {
      value: data.cat3,
      label: "Cat 3"
    },
    {
      value: data.cat4,
      label: "Cat 4"
    },
    {
      value: data.cat5,
      label: "Cat 5"
    },
  ];
  return (
    <View
      style={{
        flexDirection: 'row', height: 150, marginBottom: 30, marginTop: 16, marginHorizontal: 16
      }}
    >
      <YAxis
        data={chartData}
        yAccessor={({ index }) => index}
        scale={scale.scaleBand}
        contentInset={{ top: 10, bottom: 10 }}
        spacing={0.2}
        formatLabel={(_, index) => chartData[index].label}
      />
      <BarChart
        style={{ flex: 1, marginLeft: 8 }}
        data={chartData}
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

export default class SelectChart extends Component {
  constructor(props) {
    super(props);
    const { passedData } = this.props;
    this.state = {
      selectedData: 0,
      data: passedData,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(choice) {
    this.setState({
      selectedData: choice,
    })
  }

  render() {
    let graph = triageBarChart(this.state.data[this.state.selectedData].triage);
    let specialtyData = this.state.data[this.state.selectedData].specialty;
    const specialtyList = specialtyData.map(function(item){
      return (
        <Text style={styles.specialtyText}>{item.name} : {item.number}</Text>
      );
    });
    return (
      <View>
        <View style = {{flexDirection: 'row', height: 80, marginBottom: 8, marginTop: 16, marginHorizontal: 16 }}>
          <TouchableOpacity style = {{flex: 1}} onPress={() => this.handleChange(0)}>
            <Text style = {{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              0-2 Hours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style = {{flex: 1}} onPress={() => this.handleChange(1)}>
            <Text style = {{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              2-3 Hours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style = {{flex: 1}} onPress={() => this.handleChange(2)}>
            <Text style = {{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              3-4 Hours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style = {{flex: 1}} onPress={() => this.handleChange(3)}>
            <Text style = {{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>
              3-24 Hours
            </Text>
          </TouchableOpacity>
        </View>
        {graph}
        <View>
          <Text style={styles.specialtyTitle}>Specialty:</Text>
          {specialtyList}
        </View>
      </View>
    );
  }
}
