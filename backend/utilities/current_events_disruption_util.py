from dotenv import load_dotenv
import os
from newsapi.newsapi_client import NewsApiClient
from models.location import Location


def get_current_events_cyber()-> dict:

    load_dotenv()
    api_key = os.getenv("NEWS_API_KEY")

    newsapi = NewsApiClient(api_key=api_key)

    cyber_query = '"cyber attack" OR "cyber threats" OR "data breaches" OR "web attack"'

    current_dict = newsapi.get_everything(q=cyber_query, language='en', page_size = 10, sort_by= 'publishedAt')

    return current_dict


def get_current_events_location(location: Location) -> dict:

    load_dotenv()
    api_key = os.getenv("NEWS_API_KEY")

    newsapi = NewsApiClient(api_key=api_key)
    ctry = location.country
    city = location.city
    location_str = city + " " + ctry

    current_dict = newsapi.get_top_headlines(q=location_str,language='en', category = 'health')

    return current_dict

# Get API key for Gemini APi key
# load_dotenv()
# api_key = os.getenv("NEWS_API_KEY")

# newsapi = NewsApiClient(api_key=api_key)

# disease_curr = newsapi.get_top_headlines(q='disease',language='en', category = 'health')

# war_curr = newsapi.get_top_headlines(q='city', language='en', category='general')

# print(war_curr)
