import RouteService from '../services/RouteService';


  /**
   * Retrieve routes stored in DB
   */
  export const getRoutes = (setRoutes, setLoadPage) => {
    RouteService.getRoutes().then(response => {
      setRoutes(response.data);
      setLoadPage(true);
    });
  }

  export const changeRouteName = (routes, setRoutes, name, idx) => {
    const r = routes[idx];

    r.name = name;

    const newRoutes = routes.map((ro, i) => {
      if (i === idx) {
        console.log(r);
        return r;
      } else {
        return ro;
      }
    });
    setRoutes(newRoutes);
    console.log("Changing route name");
  }

  export const deleteRoute = (routes, setRoutes, id, setIsAdding) => {
    if (id === undefined) {
      console.log("DELETING TEMP ROUTE...");
      routes.pop();
      setIsAdding(false);
    } else {
      console.log("DELETING ROUTE IN DB...");
      const rn = routes.filter(r => r._id === id);
      RouteService.deleteRoute(rn[0]);
      setRoutes(routes.filter(r => r._id !== id))
      console.log(routes);
    }
  }

  export const saveRoute = async (routes, setRoutes, id, idx, setShowSpinner, setIsAdding, setSuccess, setError) => {

    try {

      setShowSpinner(true);

      const r = routes[idx];
      if (r.name === "") {
        r.name = r.start.name + " to " + r.end.name;
        const newRoutes = routes.map((ro, i) => {
          if (i === idx) {
            console.log(r);
            return r;
          } else {
            return ro;
          }
        });
        setRoutes(newRoutes);
      }

      if (id === undefined) {
        console.log("SAVE: NEW ROUTE");
        setIsAdding(false);
        await RouteService.addRoute(routes[routes.length - 1]);
      } else {
        console.log("Save: UPDATING ROUTE");
        console.log(routes[idx]);

        await RouteService.updateRoute(routes[idx]);
      }
      setSuccess("Route saved successfully.")
      setShowSpinner(false);
      getRoutes();

    } catch (err) {
      setError("Failed to save route. Please ensure this is a valid land/sea route.");
      setShowSpinner(false);

    }
  }

  export const addRoute = (routes, setRoutes, setIsAdding) => {
    const emptyRoute = {
      start: {
        name: '',
        address: '',
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
        type: '',
        risk: 0,
        disruptions: []
      },
      end: {
        name: '',
        address: '',
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
        type: '',
        risk: 0,
        disruptions: []
      },
      locations: [],
      edges: [
        {
          from_location: {
            name: '',
            address: '',
            city: '',
            country: '',
            latitude: 0,
            longitude: 0,
            type: '',
            risk: 0,
            disruptions: []
          },
          to_location: {
            name: '',
            address: '',
            city: '',
            country: '',
            latitude: 0,
            longitude: 0,
            type: '',
            risk: 0,
            disruptions: []
          },
          distance: 0, // in miles
          risk: 0,
          disruptions: [],
          type: 'sea'
        }
      ],
      polyline: [],
      overall_risk: 0,
      disruptions: [],
      name: ''
    }
    setRoutes(prevRoute => [...prevRoute, emptyRoute]);
    setIsAdding(true);
    console.log(routes);
    console.log('Route ADDED!!!');
  }

  export const changeStartEdgeType = (routes, setRoutes, rIndex) => {
    console.log("1")
    console.log(routes[rIndex].edges[0])

    routes[rIndex].edges[0].type === "sea" ? routes[rIndex].edges[0].type = "land" : routes[rIndex].edges[0].type = "sea"
    const newRoutes = routes.map((ro, rIdx) => {
      if (rIdx === rIndex) {
        return routes[rIndex];
      } else {
        return ro;
      }

    });
    setRoutes(newRoutes);
    console.log(newRoutes)
  }

  export const changePathEdgeType = (routes, setRoutes, rIndex, edgeIndex) => {
    console.log("2")
    console.log(routes[rIndex].edges[0])

    routes[rIndex].edges[edgeIndex].type === "sea" ? routes[rIndex].edges[edgeIndex].type = "land" : routes[rIndex].edges[edgeIndex].type = "sea"
    const newRoutes = routes.map((ro, rIdx) => {
      if (rIdx === rIndex) {
        return routes[rIndex];
      } else {
        return ro;
      }

    });
    setRoutes(newRoutes);
    console.log(newRoutes)
  }

  export const changeRouteStartingLocation = (routes, setRoutes, e, id) => {

    const r = routes[id];

    let edges = r.edges;

    if (edges.length > 0) {
      edges[0].from_location = JSON.parse(e.target.value);
      r.start = JSON.parse(e.target.value);
    } else {
      const newEdge = {
        from_location: JSON.parse(e.target.value),
        to_location: {
          name: '',
          address: '',
          city: '',
          country: '',
          latitude: 0,
          longitude: 0,
          type: '',
          risk: 0,
          disruptions: []
        },
        distance: 0,
        risk: 0,
        disruptions: [],
        type: 'sea'
      }
      edges.push(newEdge);
      r.start = JSON.parse(e.target.value);
    }


    const newRoutes = routes.map((ro, idx) => {
      if (idx === id) {
        console.log(r);
        return r;
      } else {
        return ro;
      }
    });
    setRoutes(newRoutes);
    console.log("Changing starting location");
  }

    /**
   * Updates the destination of the specified route
   * @param e Event fired when location is selected from dropdown
   * @param route Which route was updated
   */
  export const changeRouteDestination = (routes, setRoutes, e, id) => {
      const r = routes[id];
      let edges = r.edges;
  
      if (edges.length > 0) {
        edges[edges.length - 1].to_location = JSON.parse(e.target.value);
        r.end = JSON.parse(e.target.value);
      } else {
        const newEdge = {
          to_location: JSON.parse(e.target.value),
          from_location: {
            name: '',
            address: '',
            city: '',
            country: '',
            latitude: 0,
            longitude: 0,
            type: '',
            risk: 0,
            disruptions: []
          },
          distance: 0,
          risk: 0,
          disruptions: [],
          type: 'sea'
        }
        edges.push(newEdge);
        r.end = JSON.parse(e.target.value);
      }
  
      const newRoutes = routes.map((ro, idx) => {
        if (idx === id) {
          console.log(r);
          return r;
        } else {
          return ro;
        }
  
      });
      setRoutes(newRoutes);
      console.log("Changing final location");
    }

      /**
   * Updates an edge within the specified route's path
   * @param e Event fired when location is selected from dropdown
   * @param route Which route was updated
   * @param edgeIndex Which path edge to update
   */
  export const changeRoutePathLocation = (routes, setRoutes, e, routeIdx, edgeIndex) => {

    //if (routeNumber === '1') {
    let edges = routes[routeIdx].edges;

    edges[edgeIndex].to_location = JSON.parse(e.target.value);
    edges[edgeIndex + 1].from_location = JSON.parse(e.target.value);

    const newRoutes = routes.map((ro, idx) => {
      if (idx === routeIdx) {
        return routes[routeIdx];
      } else {
        return ro;
      }

    });
    setRoutes(newRoutes);
    console.log(routes);
    //}
  }


  /**
   * Adds an edges to the end of the specified route
   * @param routeNumber Which route was updated
   */
  export const addPathPoint = (routes, setRoutes, id, idx) => {
    const newEdge = {
      to_location: {
        name: '',
        address: '',
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
        type: '',
        risk: 0,
        disruptions: []
      },
      from_location: {
        name: '',
        address: '',
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
        type: '',
        risk: 0,
        disruptions: []
      },
      distance: 0,
      risk: 0,
      disruptions: [],
      type: 'sea'
    }
    const newLocation = {
      name: '',
      address: '',
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
      type: '',
      risk: 0,
      disruptions: []
    }
    let edges = routes[idx].edges;
    let indexToAdd = edges.length;
    edges.push(newEdge);
    edges[indexToAdd].to_location = routes[idx].end;
    edges[indexToAdd - 1].to_location = newLocation;

    const newRoutes = routes.map((ro, rIdx) => {
      if (rIdx === idx) {
        return routes[idx];
      } else {
        return ro;
      }

    });
    setRoutes(newRoutes);
    console.log(routes);

  }

    /**
   * Deletes a specified path in the specified route
   * @param routeNumber Which route to update
   * @param edgeIndex Which path edge to update
   */
    export const deletePathPoint = (routes, setRoutes, rIndex, edgeIndex) => {
      // console.log(routeNumber, edgeIndex)
  
      console.log("Deleting PAth point...");
      let edges = routes[rIndex].edges;
  
      edges.splice(edgeIndex, 1); // Remove edge
      // Update the route connnections
      if (edgeIndex == 0) {
        edges[0].from_location = routes[rIndex].start;
      } else {
        edges[edgeIndex].from_location = edges[edgeIndex - 1].to_location;
      }
  
      const newRoutes = routes.map((ro, rIdx) => {
        if (rIdx === rIndex) {
          return routes[rIndex];
        } else {
          return ro;
        }
  
      });
      setRoutes(newRoutes);
      console.log(routes);
  
    }