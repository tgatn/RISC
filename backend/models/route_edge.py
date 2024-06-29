from dataclasses import dataclass, field
from typing import List
from models.disruption import Disruption
from models.location import Location


@dataclass
class RouteEdge:
  from_location: Location
  to_location: Location
  distance: float # in miles
  risk: float = 0
  disruptions: List[Disruption] = field(default_factory=lambda: [])
  type: str = ''


  # Adds disruption to edge and recalculates risk rating based on new disruption
  def add_disruption(self, disruption: Disruption):
    self.disruptions.append(disruption) # Add disruption to list of disruption

    # Recalculate edge risk score (average)
    self.risk *= (len(self.disruptions) - 1) # Undo average to get total sum
    self.risk += disruption.risk # Add new rating to total
    self.risk /= len(self.disruptions) # Divide by total number of disruptions for average
    
    return