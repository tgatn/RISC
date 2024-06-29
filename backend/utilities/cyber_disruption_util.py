import pandas as pd
import os
import requests
from dotenv import load_dotenv
from models.disruption import Disruption 
import traceback

def get_cyber_disruption() -> list:
    url = 'https://raw.githubusercontent.com/DrSufi/CyberData/main/cyber_data.csv'

    df = pd.read_csv(url, index_col = 0)

    df = df.fillna(0)
    df = df[::-1]

    atk_count_series = df['Country'].value_counts()
    df.reset_index(inplace=True)

    df = df.drop_duplicates(subset=['Country'])
    serie = df.index
    df = df.set_index('Country', drop=False)

    df['Attack Count'] = atk_count_series
    df = df.set_index(serie)


    df['Country'] = df['Country'].astype(str)

    disrupt_list = []
    try: 
        for idx, row in df.iterrows():
            if idx > 10:
                break

            date = row['AttackDate']
            country = row['Country']
            title = 'Cyber Attack in ' + country + ' ' + date
            body = 'Total Cyber Attack Count: ' + str(row['Attack Count']) + '\n'
            body = body + 'Spam Attack Ratio: ' + str(row['Spam']) + '\n'
            body = body + "Ransomware Attack Ratio: " + str(row['Ransomware']) + '\n'
            body = body + "Local Infection Ratio: " + str(row['Local Infection']) + '\n'
            body = body + "Exploit Ratio: " + str(row['Exploit']) + '\n'
            body = body + "Malicious Mail Ratio: " + str(row['Malicious Mail']) + '\n'
            body = body + "Network Attack Ratio: " + str(row['Network Attack']) + '\n'
            body = body + "On-Demand Scan Ratio: " + str(row['On Demand Scan']) + '\n'
            body = body + "Web Threat Ratio: " + str(row['Web Threat']) + '\n'
            body = body + "Rank Spam: " + str(row['Rank Spam']) + '\n'
            body = body + "Rank Local Infection: " + str(row['Rank Local Infection']) + '\n'
            body = body + "Rank Exploit: " + str(row['Rank Exploit']) + '\n'
            body = body + "Rank Malicious Mail: " + str(row['Rank Malicious Mail']) + '\n'
            body = body + "Rank Network Attack: " + str(row['Rank Network Attack']) + '\n'
            body = body + "Rank On Demand Scan: " + str(row['Rank On Demand Scan']) + '\n'
            body = body + "Rank Web Threat: " + str(row['Rank Web Threat']) + '\n'

            geocode_url = f'https://nominatim.openstreetmap.org/search?country={country}&format=jsonv2&limit=1'

            coord_response = requests.get(geocode_url)
            jsonData = coord_response.json()
            if not jsonData:
                continue

            long = float(jsonData[0]['lon'])
            lat = float(jsonData[0]['lat'])

            rankings_row = row.iloc[-9:-1]

            min_rank = rankings_row.min()

            if min_rank <= 5:
                risk = 1.0
            elif min_rank > 5 and min_rank <= 20:
                risk = 0.5
            elif min_rank > 20 and min_rank <= 100:
                risk = 0.0
            elif min_rank > 100:
                risk = 0.0

            if title is None or body is None or lat is None or long is None or risk is None:
                continue
            if risk == 0.0:
                continue
            disruption = Disruption(title, "cyber", body, lat, long, risk)
            disrupt_list.append(disruption)
        
        return disrupt_list
    except Exception as e :
        traceback.print_exc()
        return []
    

