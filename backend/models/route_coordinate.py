from dataclasses import dataclass, field
from models.disruption import Disruption
from typing import List

@dataclass
class RouteCoordinate:

  latitude: float
  longitude: float
  closest_disruption: Disruption = None
  distance_to_dis: float = 0.0
  risk_score: float = 0.0
