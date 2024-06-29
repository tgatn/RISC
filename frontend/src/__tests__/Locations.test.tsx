import { Button, Dialog } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { mount, shallow } from "enzyme";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Locations from "../components/Locations";
import Location from "../models/Location";
import LocationType from "../models/LocationType";
import LocationService from '../services/LocationService';

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

const mockLocationTypes: LocationType[] = [{
  _id: "111111111111",
  type: "Test Location Type"
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


test('Locations page renders and location types update', async () => {

  await act(async () => {
    let wrapper = shallow(<Locations />, { attachTo: container });

    // Test that the table is rendered
      expect(wrapper.exists(DataGrid)).toBe(true);
    
  });
});