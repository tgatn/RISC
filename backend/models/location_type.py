from dataclasses import dataclass

# Location Type object 
@dataclass
class LocationType:

  _id: str
  type: str

  # Create Location object from DB location_type document
  @classmethod
  def from_db_object(cls, location_type):
    return cls(str(location_type['_id']), location_type['type'])
