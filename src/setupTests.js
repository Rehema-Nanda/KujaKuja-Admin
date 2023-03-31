import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

configure({ adapter: new Adapter() });

global.fetch = require('jest-fetch-mock');
global.localstorage = require('mock-local-storage');

jest.mock('mapbox-gl/dist/mapbox-gl', () => {
    return {
        Map: jest.fn(() => {
            return {
                fitBounds: jest.fn(),
                on: jest.fn(),
                remove: jest.fn(),
                addControl: jest.fn()
            }
        })
    };
});

jest.mock('@fortawesome/react-fontawesome', () => {
    return {
       FontAwesomeIcon(props) {
            return <i className="fa" />
          }
    };
});

const reactstrap = jest.requireActual('reactstrap');
reactstrap.Popover = jest.fn(() => 'Popover');
reactstrap.Tooltip = jest.fn(() => 'Tooltip');
