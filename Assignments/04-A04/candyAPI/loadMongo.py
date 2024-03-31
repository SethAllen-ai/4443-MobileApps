"""
This file opens up the folder categoryJson and processes each json file
adding the category name to each candy document and posting it to mongodb
"""

from mongoManager import MongoManager
import json
import glob
from rich import print
import os

def load():

    # Get list of paths to all json files
    json_files = glob.glob("./categoryJson/*.json")

    db = MongoManager()

    db.setDb('candy_store')

    db.dropCollection('candies')

    db.dropCollection('categories')

    i = 0

    for file in json_files:
        print(file)
        parts = file.split("/")
        category = parts[-1][:-5].replace("-", " ").title()

        print(category)

        summary:dict = {}

        with open(file) as f:
            data:dict = json.load(f)

            summary["name"] = category
            summary["id"] = int(i)

            for id, item in data.items():
                item["id"] = int(id)
                item["category"] = category
                item["category_id"] = int(i)
                db.setCollection("candies")

                if not db.get({"id": item["id"]}):
                    db.post(item)
        db.setCollection("categories")
        db.post(summary)
        i += 1


if __name__ == "__main__":

    load()