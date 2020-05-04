import pandas as pd
import json
import os
import pymongo
"""  
   connector class, pre-made to ease the access to the mongodb database, 
   inorder for this claas to work, the database must be up and running


"""

class Connector:

    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.db = self.client["arabic_semantic_labeling"]
        self.poemsCollections = self.db["poems"]
        self.poetsCollections = self.db["poets"]

    def get_poem(self, poemID):
        return list(self.poemsCollections.find({"id": str(poemID)}))

    def get_poems_by_poet(self, poet_id):
        return list(self.poemsCollections.find({"poet_id": str(poet_id)}))

    def get_poets(self):
        return list(self.poetsCollections.find())
