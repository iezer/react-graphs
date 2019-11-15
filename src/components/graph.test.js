import React from 'react';
import Graph from './graph';
import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('graph has title', () => {
  const graph = shallow(
    <Graph />,
  );

  expect(graph.find('h2').text()).toEqual('Graph');
});
