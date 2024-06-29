import LocationService from '../services/LocationService';
import Location from "../models/Location";


const mockLocations: Location[] = [{
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


test('Adding Location', async () => {
    // Adding location
    //const addL = jest.spyOn(LocationService, 'addLocation');
    const result = await LocationService.addLocation(mockLocations[0]);
    //expect(addL).toHaveBeenCalled();
    //expect(typeof addL).toBe('function');
    expect(result.status).toEqual(200);
    expect(JSON.parse(result.config.data).name).toBe('Test location');




});


test('Getting All Location', async () => {
    // Getting all locations
    //const getAllL = jest.spyOn(LocationService, 'getAllLocations');
    const resultGetAll = await LocationService.getAllLocations();
    //expect(getAllL).toHaveBeenCalled();
    //expect(typeof getAllL).toBe('function');
    expect(resultGetAll.status).toEqual(200);
    expect(resultGetAll.data.length).toBeGreaterThanOrEqual(1);
});


test('Getting specific Location', async () => {
    // Getting all locations
    const locations = await LocationService.getAllLocations();
    locations.data.map(async l => {
        if (l.name === mockLocations[0].name) {
            // get location
            const result = await LocationService.getLocation(l);
            expect(result.status).toEqual(200);
            expect(result.data.name).toBe("Test location");
            expect(result.data.address).toBe("123 Test Dr");


        }
    })
});


test('Updating mock Location name', async () => {
    // Getting all locations
    const locations = await LocationService.getAllLocations();
    locations.data.map(async l => {
        if (l.name === mockLocations[0].name) {
            // get location
            const result = await LocationService.getLocation(l);
            result.data.name = "New Location Name";
            await LocationService.updateLocation(result.data);
            const newLocation = await LocationService.getLocation(l);
            expect(newLocation.data.name).toBe("New Location Name");
        }
    })
});


test('Delete Location', async () => {
    // get current location
    const locations = await LocationService.getAllLocations();
    locations.data.map(async l => {
        if (l.address === '123 Test Dr') {
            // Delete location
            const result = await LocationService.deleteLocation(l);
            expect(result.status).toEqual(200);


        }
    })


    // confirm location deleted
    const all = await LocationService.getAllLocations();
    expect(all.data).not.toContain("123 Test Dr");
});