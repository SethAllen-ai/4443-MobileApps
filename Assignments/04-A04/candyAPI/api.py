# Libraries for FastAPI
from fastapi import FastAPI, Query, Path, Body
from fastapi.responses import RedirectResponse, FileResponse, Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from mongoManager import MongoManager
from contextlib import asynccontextmanager
import uvicorn
import json
import os
from rich import print
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import requests

# Builtin libraries
import os

from random import shuffle

"""
           _____ _____   _____ _   _ ______ ____
     /\   |  __ \_   _| |_   _| \ | |  ____/ __ \
    /  \  | |__) || |     | | |  \| | |__ | |  | |
   / /\ \ |  ___/ | |     | | | . ` |  __|| |  | |
  / ____ \| |    _| |_   _| |_| |\  | |   | |__| |
 /_/    \_\_|   |_____| |_____|_| \_|_|    \____/

The `description` is the information that gets displayed when the api is accessed from a browser and loads the base route.
Also the instance of `app` below description has info that gets displayed as well when the base route is accessed.
"""

description = """🤡
(This description is totally satirical and does not represent the views of any real person alive or deceased. 
And even though the topic is totally macabre, I would love to make anyone who abuses children very much deceased.
However, the shock factor of my stupid candy store keeps you listening to my lectures. If anyone is truly offended
please publicly or privately message me and I will take it down immediately.)🤡


## Description:
Sweet Nostalgia Candies brings you a delightful journey through time with its extensive collection of 
candies. From the vibrant, trendy flavors of today to the cherished, classic treats of yesteryear, 
our store is a haven for candy lovers of all ages (but mostly kids). Step into a world where every shelf and corner 
is adorned with jars and boxes filled with colors and tastes that evoke memories and create new ones. 
Whether you're seeking a rare, retro candy from your childhood or the latest sugary creation, Sweet 
Nostalgia Candies is your destination. Indulge in our handpicked selection and experience a sweet 
escape into the world of confectionery wonders! And don't worry! We will watch your kids!! (😉)

#### Contact Information:

- **Address:** 101 Candy Lane, Alcatraz Federal Penitentiary, San Francisco, CA 94123.
- **Phone:** (123) 968-7378 [or (123 you-perv)]
- **Email:** perv@kidsinvans.com
- **Website:** www.kidsinvans.fun

"""

# Needed for CORS
# origins = ["*"]


# This is the `app` instance which passes in a series of keyword arguments
# configuring this instance of the api. The URL's are obviously fake.
app = FastAPI(
    title="KidsInVans.Fun🤡",
    description=description,
    version="0.0.1",
    terms_of_service="http://www.kidsinvans.fun/worldleterms/",
    contact={
        "name": "KidsInVans.Fun",
        "url": "http://www.kidsinvans.fun/worldle/contact/",
        "email": "perv@www.kidsinvans.fun",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

# Needed for CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

"""
  _      ____   _____          _         _____ _                _____ _____ ______  _____
 | |    / __ \ / ____|   /\   | |       / ____| |        /\    / ____/ ____|  ____|/ ____|
 | |   | |  | | |       /  \  | |      | |    | |       /  \  | (___| (___ | |__  | (___
 | |   | |  | | |      / /\ \ | |      | |    | |      / /\ \  \___ \\___ \|  __|  \___ \
 | |___| |__| | |____ / ____ \| |____  | |____| |____ / ____ \ ____) |___) | |____ ____) |
 |______\____/ \_____/_/    \_\______|  \_____|______/_/    \_\_____/_____/|______|_____/

This is where you will add code to load all the countries and not just countries. Below is a single
instance of the class `CountryReader` that loads countries. There are 6 other continents to load or
maybe you create your own country file, which would be great. But try to implement a class that 
organizes your ability to access a countries polygon data.
"""

class Candy_Info(BaseModel):
    """
    Provides JSON-schema for a "candy" object / entry.
    """

    id: int = Field(description="The ID of a candy.")
    name: str = Field(None, description="The name of a candy.")
    prod_url: str = Field(None, description="The product url of a candy.")
    img_url: str = Field(None, description="The image url of a candy.")
    price: float = Field(None, description="The price of a candy.")
    desc: str = Field(None, description="The description of a candy.")
    category: str = Field(None, description="The category name of a candy.")
    category_id: int = Field(None, description="The category ID of a candy.")


class New_Category(BaseModel):
    """
    Provides JSON-schema for a "category" object / entry.
    """

    name: str = Field(description="The name of a category.")
    id: int = Field(description="The ID of a category.")


TAGS_METADATA: list[dict[str, str]] = [
    {
        "name": "/",
        "description": "Redirects to the docs.",
    },
    {
        "name": "Candies",
        "description": "Operations with candies.",
    },
    {
        "name": "Categories",
        "description": "Operations with categories.",
    },
    {
        "name": "Images",
        "description": "Retrieves image of candy by ID.",
    },
]

mm = MongoManager(db="candy_store")

"""
  _      ____   _____          _        __  __ ______ _______ _    _  ____  _____   _____
 | |    / __ \ / ____|   /\   | |      |  \/  |  ____|__   __| |  | |/ __ \|  __ \ / ____|
 | |   | |  | | |       /  \  | |      | \  / | |__     | |  | |__| | |  | | |  | | (___
 | |   | |  | | |      / /\ \ | |      | |\/| |  __|    | |  |  __  | |  | | |  | |\___ \
 | |___| |__| | |____ / ____ \| |____  | |  | | |____   | |  | |  | | |__| | |__| |____) |
 |______\____/ \_____/_/    \_\______| |_|  |_|______|  |_|  |_|  |_|\____/|_____/|_____/

This is where methods you write to help with any routes written below should go. Unless you have 
a module written that you include with statements above.  
"""


"""
  _____   ____  _    _ _______ ______  _____
 |  __ \ / __ \| |  | |__   __|  ____|/ ____|
 | |__) | |  | | |  | |  | |  | |__  | (___
 |  _  /| |  | | |  | |  | |  |  __|  \___ \
 | | \ \| |__| | |__| |  | |  | |____ ____) |
 |_|  \_\\____/ \____/   |_|  |______|_____/

 This is where your routes will be defined. Routes are just python functions that retrieve, save, 
 delete, and update data. How you make that happen is up to you.
"""


@app.get("/")
def docs_redirect():
    """Api's base route that displays the information created above in the ApiInfo section."""
    return RedirectResponse(url="/docs")


@app.get("/candies")
def list_all_candies():
    """
    Retrieve a list of all candies available in the store.
    """
    mm.setCollection("candies")
    result = mm.get(filter={"_id": 0})
    return result


@app.get("/candies/category/{category_by_id}")
def candies_by_category(category_by_id: int = Path(ge=0)):
    """
    Get detailed information about candies in a category by category ID.
    """
    mm.setCollection("candies")

    query: dict = {"category_id": category_by_id}

    candy_list: list[dict] = mm.get(
        query, {"_id": 0}
    )
    return {"candies": candy_list}


@app.get("/candies/id/{id}")
def get_candy_by_id(id: int):
    """
    Get detailed information about a specific candy.
    """
    mm.setCollection("candies")
    candy_list: list[dict] = list(mm.get({"id": id}))
    return {"candies": candy_list}

@app.get("/image/base64/{image_id}/image")
def get_image(image_id: int = Path(ge=0)):
    mm.setCollection("candies")
    candy_list: list[dict] = list(mm.get({"id": image_id}))

    if not candy_list:
        return None

    img_url: str = candy_list[0]["img_url"]
    file_name: str = candy_list[0]["id"]
    image_response: requests.Response = requests.get(img_url)
    headers = {"Content-Language": "English", "Content-Type": "image/jpg"}
    headers["Content-Disposition"] = f"attachment;filename={file_name}.jpg"
    return Response(image_response.content, media_type="image/jpg", headers=headers)



@app.post("/candies")
def add_new_candy(candy_info: Candy_Info):
    """
    Add a new candy to the store's inventory.
    """
    mm.setCollection("candies")

    candy: list[dict] = mm.get({"id": candy_info.id})

    # If existing candy, do nothing
    if candy:
        return {"acknowledge": False, "inserted_ids": []}

    mm.setCollection("categories")

    c_id: list[dict] = mm.get({"id": candy_info.category_id}, {"_id": 1})
    c_name: list[dict] = mm.get({"name": candy_info.category}, {"_id": 1})

    if c_id and c_name:
        # If existing category, just insert
        if c_id[0]["_id"] == c_name[0]["_id"]:
            mm.setCollection("candies")
            result = mm.post(dict(candy_info))
            return result
        # If _id do not match
        else:
            return {"acknowledge": False, "inserted_ids": []}
    # If one or other list is empty, do nothing
    elif (c_id and not c_name) or (not c_id and c_name):
        return {"acknowledge": False, "inserted_ids": []}
    # If not existing category, create new category
    # Then insert new candy
    else:
        mm.setCollection("candies")
        result = mm.post(dict(candy_info))

        mm.setCollection("categories")
        tempRes = mm.post(
            {"name": candy_info.category, "id": candy_info.category_id}
        )

        result["inserted_ids"] += tempRes["inserted_ids"]
        return result


@app.put("/candies/{candy_id}")
def update_candy_info(candy_info: Candy_Info):
    """
    Update information about an existing candy.
    """
    mm.setCollection("candies")

    query: dict = {}

    for key, val in dict(candy_info).items():
        if key == "id":
            continue
        if not val is None:
            query[key] = val

    result: dict = mm.put("id", candy_info.id, query)

    return result


@app.delete("/candies/{candy_id}")
def delete_candy(candy_id: int):
    """
    Remove a candy from the store's inventory.
    """
    mm.setCollection("candies")
    result = mm.delete({"id": candy_id})
    return result


@app.get("/categories")
def all_categories():
    """
    Get a list of all candy category information.
    """
    mm.setCollection("categories")
    category_list: list[dict] = mm.get({}, {"_id": 0})
    return {"categories": category_list}


@app.post("/categories")
def add_new_category(
    category: New_Category
):
    """
    Insert a new category into the database.
    """
    mm.setCollection("categories")
    category_id: list[dict] = mm.get({"id": category.id}, {"_id": 1})
    category_name: list[dict] = mm.get({"id": category.id}, {"_id": 1})

    if category_id and c_name:
        # If existing category
        if category_id[0]["_id"] == category_name[0]["_id"]:
            return {"acknowledge": False, "inserted_ids": []}
        # If _id do not match, return None
        else:
            return {"acknowledge": False, "inserted_ids": []}
    # If one or other list is empty, do nothing
    elif (candy_id and not candy_name) or (not candy_id and candy_name):
        return {"acknowledge": False, "inserted_ids": []}
    # If not existing category, create new category
    # Then insert new category
    else:
        result = mm.post({"name": category.name, "id": category.name})
        return result


@app.get("/categories/category_id/{category_id}")
def category_by_id(category_id: int):
    """
    Get the information of a candy category by ID.
    """
    mm.setCollection("categories")
    category_list: list[dict] = mm.get({"id": category_id}, {"_id": 0})
    return {"categories": category_list}
"""
This main block gets run when you invoke this file. How do you invoke this file?

        python api.py 

After it is running, copy paste this into a browser: http://127.0.0.1:8080 

You should see your api's base route!

Note:
    Notice the first param below: api:app 
    The left side (api) is the name of this file (api.py without the extension)
    The right side (app) is the bearingiable name of the FastApi instance declared at the top of the file.
"""
if __name__ == "__main__":
    uvicorn.run(
        "api:app", 
        host="167.99.57.236", 
        port=8084, 
        log_level="debug", 
        reload=True
    )
"""                                   ^
                                      |
CHANGE DOMAIN NAME                    |              

"""
