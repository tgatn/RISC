import { Button, Card, Select } from "@mui/material";
import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { mount, shallow } from "enzyme";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import RoutesPage from "../components/RoutesPage";
import Location from "../models/Location";
import Route from "../models/Route";
import LocationService from '../services/LocationService';
import RouteService from "../services/RouteService";

const mockLocations: Location[] = [{
  _id: "123456789098",
  name: "Test location",
  address: "123 Test Dr",
  city: "Test City",
  country: "Test Country",
  latitude: 1,
  longitude: 1,
  type: "111111111111",
  risk: 0,
  disruptions: []
}];

const mockRoutes: Route[] = [{
  _id: '111111111111',
  locations: mockLocations,
  edges: [],
  start: mockLocations[0],
  end: mockLocations[0],
  overall_risk: 0,
  disruptions: []
}];



let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


test('Routes page renders', async () => {

  await act(async () => {
    let wrapper = shallow(<RoutesPage />, { attachTo: container });

    // Test that the table is rendered
      expect(wrapper.exists(Card)).toBe(true);
    
  });
});