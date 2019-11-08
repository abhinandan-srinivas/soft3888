// import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import EDDashboard from './screens/EDDashboard';
import LogInScreen from './screens/LogInScreen';
import Description from './screens/Description';
import MessageBoard from './screens/MessageBoard';

const MainNavigator = createStackNavigator({
  HomeScreen: { screen: LogInScreen },
  EDDashboardScreen: { screen: EDDashboard },
  DescriptionScreen: { screen: Description },
  MessageScreen: { screen: MessageBoard },
}, {
  // remove top navigation header
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
});

const App = createAppContainer(MainNavigator);

// export default App;
export default App;
