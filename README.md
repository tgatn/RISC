# Merck - RISCs (Risk Informed Supply Chain System)
The problem that Merck is facing today involves maintaining the stability of the pharmaceutical supply chain life cycle from outside risk factors that occur. Risk factors such as pandemics, natural disasters, cyber events, and other current events could negatively and disrupt the supply chain for Merck. The problem is that the supply chain life cycle is vulnerable to volatile risk events, which can cause issues in production, distribution, and other operational phases for Merck, leading to a loss in profits from operational shortcomings and an inability to pursue their primary goal of providing products towards global disease prevention.

Our system is a web application that allows users to add locations and routes to an interactive map that displays up-to-date, regional risk factors that may affect the distribution of Merck products. Routes are assigned a risk score based on how much risk shipping along that route would incur. Merck employees may then use information from our system to inform their product and manufacturing distribution. Our system is named the Risk Informed Supply Chain System (RISCs).


## Docker Installation
1. Ensure Docker Desktop/Docker Engine is installed: https://www.docker.com/products/docker-desktop/
2. Navigate to the root directory "2024SpringTeam25-Merck/" where the docker-compose.yml file is located.
3. In a terminal window, type this command:

```
$ docker compose up --build
```

*NOTE*: On the first installation, it may take a few minutes to get all the dependencies installed and running, but future running of the application should only take a couple of seconds.

4. At this point, you should be able to navigate to localhost:3000 to view the frontend while the backend should be running on localhost:5000.

## Manual Installation
*NOTE*: This method of installation is better for development as the frontend has a live refresh when not dockerized. However, it may be more time consuming and require more troubleshooting to set up.

### Prerequisites
- NPM >=7.x
- python3 >= 3.6

### Frontend

1. Navigate to *frontend* directory
2. Install the necessary frontend packages:

    ```
    $ npm i
    ```

### Backend

1. Navigate to *backend* directory
2. Install the necessary backend packages:

MacOS/Linux: 
```
$ python3 -m venv venv
$ . venv/bin/activate
$ pip install -r requirements.txt
```

Windows: 
```
> py -3 -m venv venv
> venv\Scripts\activate
> pip install -r requirements.txt
```

## Reinstalling/Updating Packages

### Prerequisites
Same as 'Initial Installation' requirements

### Frontend
Follow steps for 'Initial Installation'

### Backend

1. Navigate to the *backend* directory
2. Install the necessary backend packages

```
$ pip install -r requirements.txt
```

## Running the Project (Development)

To run both the frontend and backend simultaneously, 2 terminal windows are required.

**Ensure that all environment files are in their proper directories:**

- .env --> */frontend*
- .env --> */backend*
- .flaskenv --> */backend*

Contact a team member for the environment files


### Frontend
1. Navigate to the *frontend* directory
3. Start the development server:

    ```
    $ npm start
    ```

### Backend
1. Activate the virtual environment (venv) for the python backend before starting the application: 
    
MacOS/Linux: 

```
$ . venv/bin/activate
```

Windows:
```
> env\Scripts\activate.bat
```

2. Start the backend server
```
$ flask run
```
