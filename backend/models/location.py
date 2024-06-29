from dataclasses import dataclass, field
from models.disruption import Disruption
from typing import List

@dataclass
class Location:

  _id: str
  name: str
  address: str
  city: str
  country: str
  latitude: float
  longitude: float
  type: str
  risk: float = 0
  disruptions: List[Disruption] = field(default_factory=lambda: [])


  # Create Location object from DB location document
  @classmethod
  def from_db_object(cls, location):
    return cls(str(location['_id']), location['name'], location['address'], location['city'], location['country'], location['latitude'], location['longitude'], location['type'])


  # Adds disruption to location and recalculates risk rating based on new disruption
  def add_disruption(self, disruption: Disruption):
    self.disruptions.append(disruption) # Add disruption to list of disruption

    # Recalculate location risk score (average)
    self.risk *= (len(self.disruptions) - 1) # Undo average to get total sum
    self.risk += disruption.risk # Add new rating to total
    self.risk /= len(self.disruptions) # Divide by total number of disruptions for average
    
    return
