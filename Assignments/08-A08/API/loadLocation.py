"""
This file opens up the folder categoryJson and processes each json file
adding the category name to each candy document and posting it to mongodb
"""

from mongoManager import MongoManager
import json
import glob
from rich import print
import base64
from PIL import Image
import sys
import io

def load():
  # Load the JSON data from location.json
  with open("location.json", "r") as file:
    data = json.load(file)

  # Connect to MongoDB
  db = MongoManager()
  db.setDb("candy_store")

  # Drop existing collections if needed
  db.dropCollection('location')

  # Insert data into the 'location' collection
  db.setCollection("location")
  for item in data:
    db.post(item)

  print("Data loaded successfully!")
    

if __name__ == "__main__":

    load()