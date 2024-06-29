import requests
from dotenv import load_dotenv
import os

def get_weather(lat:float, lon:float) -> str:

    load_dotenv()
    key = os.getenv("WEATHER_API_KEY")

    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={key}&units=imperial"

    resp = requests.get(url)
    weather = resp.json()['list'][0]['weather'][0]['description']
    temperature = resp.json()['list'][0]['main']['temp']

    weather_string = str(temperature) + 'F ' + weather

    return weather_string