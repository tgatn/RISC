import pathlib
import textwrap
from models.route import Route
import google.generativeai as genai
from utilities.weather_api_util import get_weather
from dotenv import load_dotenv
import os

# output the gemini response from a string option and the Route given
def get_gemini_response(option: str, route: Route)-> str:

    # Get API key for Gemini APi key
    load_dotenv()
    google_api_key = os.getenv("GOOGLE_API_KEY")

    # configure gemini model to use
    genai.configure(api_key=google_api_key)
    gemini_ai = genai.GenerativeModel('gemini-pro')

    # option 1
    if option == "historical supply risk factors of locations":
        input = f"tell me historical supply risk factors of {route.start.country} and {route.end.country} in the last 5 years. please list the title of the message as 'Historical risk of {route.start.country} and {route.end.country} in the last 5 years.' please keep it brief"
        
        response = gemini_ai.generate_content(input)
        return response.text

    # option 2
    elif option == "most recent risk factors associated to locations":
        input = f"tell me most recent supply risk factors associated of locations {route.start.country} and {route.end.country}. state the month/year associated with each item. please keep it brief"

        response = gemini_ai.generate_content(input)
        return response.text
    
    # option 3
    elif option == "tell me about the weather in the locations":
        start_loc = ""
        end_loc = ""
        if route.start.city is None:
            start_loc = route.start.country
        else:
            start_loc = route.start.city

        if route.end.city is None:
            end_loc = route.end.country
        else:
            end_loc = route.end.city

        start_str = get_weather(route.start.latitude, route.start.longitude)
        end_str = get_weather(route.end.latitude, route.end.longitude)

        
        input = f"This data is from open weather API, please write clearly and in a paragraph that the start location, {start_loc}, has weather of {start_str} and the end location, {end_loc}, has weather of {end_str}"

        response = gemini_ai.generate_content(input)
        return response.text

    # option 4
    elif option == "tell me about current events in the locations":
        start_loc = ""
        end_loc = ""
        if route.start.city is None:
            start_loc = route.start.country
        else:
            start_loc = route.start.city

        if route.end.city is None:
            end_loc = route.end.country
        else:
            end_loc = route.end.city

        input = f"tell the user that current events for {start_loc} and {end_loc} are currently not available, but will be provided by external APIs soon. please keep it brief"


        response = gemini_ai.generate_content(input)
        return response.text

    # option 5
    elif option == "tell me more about start location":
        
        loc = ""
        if route.start.city is None:
            loc = route.start.country
        else:
            loc = route.start.city

        input = f"tell me about location {loc} in terms of supply risks and just general info that may be related to supply chain (popular ports, routes, etc). Make the title `Info about {loc}`.please keep it brief"

        response = gemini_ai.generate_content(input)
        return response.text

    # option 6
    elif option == "tell me more about end location":

        loc = ""
        if route.end.city is None:
            loc = route.end.country
        else:
            loc = route.end.city

        input = f"tell me about location {loc} in terms of supply risks and just general info that may be related to supply chain (popular ports, routes, etc). Make the title `Info about {loc}`.please keep it brief"

        response = gemini_ai.generate_content(input)
        return response.text

    # option 7
    elif option == "tell me location near and between the route that have risk":
        start_loc = ""
        end_loc = ""
        if route.start.city is None:
            start_loc = route.start.country
        else:
            start_loc = route.start.city

        if route.end.city is None:
            end_loc = route.end.country
        else:
            end_loc = route.end.city
        input = f"tell me locations near {start_loc} and {end_loc} as well as locations around them that have supply chain risks. please keep it brief"

        response = gemini_ai.generate_content(input)
        return response.text

    # option 8
    elif option == "tell me about the route":
        input = f"{route.polyline}, with these latitude and longitude points tell me the locations that this route passes through and give information about the route. please keep it brief"

        response = gemini_ai.generate_content(input)
        return response.text
        
    # error statement return    
    else:
        return "ERROR"

