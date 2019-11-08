import 'react-native';
import React from 'react';
import EDDashboard from '../screens/EDDashboard';

import renderer from 'react-test-renderer';

it('Dashboards renders correctly', () => {
  const tree = renderer.create(
    <EDDashboard />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});


it('Dashboards renders without crashing', () => {
  const rendered = renderer.create(<EDDashboard />).toJSON();
  expect(rendered).toBeTruthy();
  });
  