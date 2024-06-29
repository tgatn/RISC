import json 
import requests
from models.location import Location
from models.disruption import Disruption
import datetime
from dotenv import load_dotenv
import os
import datetime

def switch_date_format(date_str):
    date = datetime.datetime.strptime(date_str, '%Y-%m-%d')
    
    new_format = date.strftime('%m/%d/%Y')
    
    return new_format

def get_violence_events_country(locations: list) -> list:

    country_list = []

    for location in locations:
        country_list.append(location.country)


    countries_string = '|'.join(country_list)
    curr_date = datetime.datetime.now()
    date_threshold = str(curr_date - datetime.timedelta(days=14))

    load_dotenv()
    email = os.getenv("ACLED_EMAIL")
    key = os.getenv("ACLED_API_KEY")

    
    data = requests.get(f"https://api.acleddata.com/acled/read?key={key}&email={email}&country={countries_string}&event_date={date_threshold}&event_date_where=>&fields=event_date|event_type|country|actor1|fatalities|latitude|longitude|notes|population_best&population=true")


    json_data = data.json()

    events = json_data["data"]

    disrupt_list = []
    for event in events:
        lat = float(event["latitude"])
        long = float(event["longitude"])
        notes = event["notes"]
        title = event['actor1'] + ":" + event['event_type'] + ' in ' + event['country'] + ' ' + switch_date_format(event['event_date'])
        risk = 0.5
        # if event['population_best'] == '':
        #     risk = 0.0
        # elif float(event['population_best']) >= 0 and float(event['population_best']) < 100 :
        #     risk = 0.0
        # elif float(event['population_best']) >= 100 and float(event['population_best']) < 1000:
        #     risk = 0.5
        # elif float(event['population_best']) >= 1000:
        #     risk = 1

        

        # Skip protests
        if event['event_type'] == 'Protests':
            continue

        disruption = Disruption(title, "unrest", notes, lat, long, risk)
        if disruption.risk != 0.0 :
            disrupt_list.append(disruption)


    return disrupt_list


# load_dotenv()
# email = os.getenv("ACLED_EMAIL")
# key = os.getenv("ACLED_API_KEY")
# response_full_url = requests.get(f"https://api.acleddata.com/acled/read?key={key}&email={email}&country=France&fields=actor1|event_date|latitude|longitude|fatalities|notes|population_best&population=true")

# print(response_full_url.json())









    