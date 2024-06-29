from dataclasses import dataclass


@dataclass
class Disruption:
  title: str
  type: str
  description: str
  latitude: float
  longitude: float
  risk: float

  # Converts JSONs in API requests to Disruption objects
  @classmethod
  def from_api_request(cls, disruption):
    return cls(disruption['title'], disruption['type'], disruption['description'], disruption['latitude'], disruption['longitude'], disruption['risk'])


  # Converts DB objects to Disruption objects (Currently only war disruptions)
  @classmethod
  def from_db_object(cls, disruption, type: str):
    return cls(
      disruption['title'],
      type,
      disruption['description'], 
      float(disruption['latitude']), 
      float(disruption['longitude']),
      float(disruption['risk'])
    )

  
  # Convert earthquake JSON response from GDACS to Disruption objects
  @classmethod
  def from_gdacs_api(cls, disruption, type: str):
    return cls(
      disruption['title'], 
      type, 
      disruption['description'], 
      float(disruption['geo:Point']['geo:lat']), 
      float(disruption['geo:Point']['geo:long']),
      # float(disruption['gdacs:severity']['@value'])
      float(disruption['gdacs:alertscore'])
    )
