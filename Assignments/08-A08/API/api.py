# Libraries for FastAPI
from fastapi import FastAPI, Query, Path, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response,  FileResponse, JSONResponse
from mongoManager import MongoManager
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List
import base64
import json
import uvicorn
import os
from random import shuffle
from passlib.context import CryptContext
from bson import ObjectId
import jwt
from typing import Optional
import paramiko


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

# Convert ObjectId to string before returning the response
def convert_to_dict(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

class Person(BaseModel):
    _id: str
    first: str
    last: str 
    email: str
    user: str
    password: str

class Candy(BaseModel):
    _id: int
    id: str
    name: str
    prod_url: str
    img_url: str
    price: float
    desc: str
    categorys: List[int]
    img_path: str

class Location(BaseModel):
    _id: str
    user_name: str
    lon: float
    lat: float
    timestamp: int

class ImageData(BaseModel):
    _id: int
    image_Name: str

class UploadImageRequest(BaseModel):
    image_base64: str
    filename: str
    file_type: str

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

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

mm = MongoManager(db='candy_store')
mm.setDb('candy_store')

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
async def docs_redirect():
    """Api's base route that displays the information created above in the ApiInfo section."""
    return RedirectResponse(url="/docs")



@app.get("/candies")
def list_all_candies():
    """
    Retrieve a list of all candies available in the store.
    """
    mm.setCollection('candies')
    result = mm.get()
    return result['data']


@app.get("/candies/category/{category}")
def candies_by_category(category: str):
    """
    Search for candies based on a query string (e.g., name, category, flavor).
    """
    mm.setCollection('candies')
    result = mm.get(
        query = {'category':[str(category)]},
        filter = {"_id":0,"name":1,"price":1,"category":1})
    return result


@app.get("/candies/id/{id}")
def get_candy_by_id(
    id: str
):
    """
    Get detailed information about a specific candy.
    """
    mm.setCollection('candies')
    result = mm.get(
        query = {'_id':int(id)})
    return result['data']

@app.get("/images")
def list_all_images():
    """
    Retrieve a list of all candies available in the store.
    """
    mm.setCollection('images')
    result = mm.get()
    images = []
    for image in result.get("data", []):
        image["_id"] = str(image["_id"])
        images.append(image)
    return images

@app.post("/upload_Image")
async def upload_image(username: str, password: str, file: UploadFile = File(...)):
    try:
        # Define the accepted content types for the file upload
        ACCEPTED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/jpg"]

        # Check if the file's content type is accepted
        if file.content_type not in ACCEPTED_CONTENT_TYPES:
            raise HTTPException(status_code=415, detail="Unsupported file type")

        # FTP server details
        ftp_host = "167.99.57.236"
        ftp_port = 22
        ftp_directory = "/sftpuser"

        # Create an SFTP client
        transport = paramiko.Transport((ftp_host, ftp_port))
        transport.connect(username=username, password=password)

        sftp = paramiko.SFTPClient.from_transport(transport)

        # Upload the file
        sftp.putfo(file.file, f"{ftp_directory}/{file.filename}")

        # Close the SFTP connection
        sftp.close()
        transport.close()

        return JSONResponse(content={"message": "Image uploaded successfully to FTP server"}, status_code=201)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to upload image to FTP server: " + str(e))

@app.post("/upload_image")
async def upload_image(request: UploadImageRequest):
    try:
        # Decode the base64-encoded image data
        image_data = base64.b64decode(request.image_base64)

        # File details
        image_filename = request.filename
        image_file_type = request.file_type

        # Save the image file locally (you can save it to a different location if needed)
        with open(f"{image_filename}.{image_file_type}", "wb") as file:
            file.write(image_data)

        return {"message": "Image uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to upload image: " + str(e))

@app.post("/register")
def register(person: Person):
    """
    Add a new user to the store's login.
    """
    try:
        mm.setCollection("users")
        person.password = hash_password(person.password)
        # print(hash_password(person.password))

        token = jwt.encode({"username": person.first}, "secret", algorithm="HS256")

        # Add the token to the person's dictionary
        person_data = person.dict()
        person_data["token"] = token

        # Save the person's data in the database
        mm.post(person_data)

        return token
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users")
def get_users():
    """
    Add a new user to the store's login.
    """
    mm.setCollection("users")
    users = mm.get_users()
    return users['data']
    

@app.post("/candies")
def add_new_candy(new_candy: Candy):
    """
    Add a new candy to the store's inventory.
    """
    # Assuming Candy is a Pydantic model representing the candy data
    mm.setCollection("candies")
    mm.post(new_candy.dict())
    return {"message": "Candy added successfully"}


@app.put("/candies/{candy_id}")
def update_candy_info(candy_id: int):
    """
    Update information about an existing candy.
    """
    # Assuming Candy is a Pydantic model representing the candy data
    mm.setCollection("candies")
    result = mm.update({"_id": candy_id}, updated_candy.dict())
    if result.modified_count == 1:
        return {"message": "Candy updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Candy not found")


@app.delete("/candies/{candy_id}")
def delete_candy(candy_id: int):
    """
    Remove a candy from the store's inventory.
    """
    mm.setCollection("candies")
    result = mm.delete({"_id": candy_id})
    if result.deleted_count == 1:
        return {"message": "Candy deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Candy not found")

@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    """
    Delete a user by their ID.
    """
    # Convert the user_id to ObjectId if needed
    if not mm.is_valid_object_id(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    # Set the collection to "users"
    mm.setCollection("users")

    # Try to delete the user
    delete_result = mm.delete({"_id": ObjectId(user_id)})

    # Check if the delete operation was successful
    if delete_result.deleted_count == 1:
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.get("/categories")
def list_categories():
    """
    Get a list of candy categories (e.g., chocolates, gummies, hard candies).
    """
    mm.setCollection('categories')
    result = mm.get()
    return result['data']

@app.get("/location", response_model=List[Location])
def get_location():
    """
    Get a list of Locations and User_ID.
    """
    mm.setCollection('location')
    results = mm.get()
    return results['data']

@app.get("/users_with_locations")
def get_users_with_locations():
    """
    Combine users and locations together.
    """
    mm.setCollection("users")
    results = mm.aggregate([
        {
            "$lookup": {
                "from": "location", # The collection to join
                "localField": "user", # Field from the users collection
                "foreignField": "user_name", # Field from the locations collection
                "as": "locations" # Output array field that contains the joined records
            }
        },
        {
            "$match": {
                "locations": { "$ne": [] } # Ensure locations array is not empty
            }
        },
        {
            "$unwind": "$locations" # Deconstruct the locations array
        },
        {
            "$project": {                     # Define the structure of the output documents
                "_id": {"$toString": "$_id"},                     # Exclude this field
                "user": 1,                 # Include user_id
                "first": 1,              # Include first_name
                "last": 1,               # Include last_name
                "lat": "$locations.lat",  # Include latitude from the joined data
                "lon": "$locations.lon", # Include longitude from the joined data
                "timestamp": "$locations.timestamp"
            }
        }
    ])

    # Convert ObjectId to string for each document in the results
    results_list = []
    for result in results:
        result["_id"] = str(result["_id"]) # Convert ObjectId to string
        results_list.append(result)

    return results_list

@app.get("/login")
async def login(email: str, password: str):
    mm.setCollection('users')
    
    try:
        # Retrieve user data based on email
        user_data = mm.get(query={'email': email})

        if not user_data.get("success"):  # Check if the operation was successful
            return {"error": "User not found"}

        # Retrieve the hashed password stored in the database
        stored_password_hash = None
        for item in user_data.get("data", []):
            stored_password_hash = item.get("password")
            break

        if not stored_password_hash:
            return {"error": "Password hash not found for the user"}

        # Verify the password
        if not pwd_context.verify(password, stored_password_hash):
            return {"error": "Invalid password"}

        # Convert ObjectId to string
        for item in user_data.get("data", []):
            item["_id"] = str(item["_id"])

        # If passwords match, return user data
        return user_data.get("data", [])[0]

    except Exception as e:
        return {"error": "An error occurred during login"}

"""
This main block gets run when you invoke this file. How do you invoke this file?

    python3 api.py 

After it is running, copy paste this into a browser: http://127.0.0.1:8080 

You should see your api's base route!

Note:
    Notice the first param below: api:app 
    The left side (api) is the name of this file (api.py without the extension)
    The right side (app) is the bearingiable name of the FastApi instance declared at the top of the file.
"""
if __name__ == "__main__":
    #gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:main --bind 0.0.0.0:8000 --keyfile=./key.pem --certfile=./cert.pem

    # uvicorn.run("api:app", host="kidsinvans.fun", port=8080, log_level="debug", reload=True)

    uvicorn.run(
        "api:app",
        host="167.99.57.236",  # Use 0.0.0.0 to bind to all network interfaces
        #port=443,  # Standard HTTPS port
        port=8084,  # Standard HTTPS port
        log_level="debug",
        reload=True
    )
"""                                   ^
                                      |
CHANGE DOMAIN NAME                    |              

"""