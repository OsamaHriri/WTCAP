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
        self.periodsCollections = self.db["period"]
    def get_poem(self, poemID):
        return list(self.poemsCollections.find({"id": str(poemID)}))

    def get_poems_by_poet(self, poet_id):
        return list(self.poemsCollections.find({"poet_id": poet_id}, {"id": 1, "name": 1}))

    def get_poets(self):
        return list(self.poetsCollections.find({}, {"_id": 0, "info": 0, "place": 0, "whoAdded": 0, "period": 0}))

    def get_poems(self):
        return list(self.poemsCollections.find({}, {"_id": 0, "context": 0}))
        
    def get_periods(self):
        return list(self.periodsCollections.find({},{"id": 1, "name": 1}))

    def get_periodname_by_id(self,id):
        preiods = self.get_periods()
        for per in preiods : 
            if per['id'] == id :
                return per['name']
        return "unknown"
if __name__ == "__main__":

    print(Connector().get_periodname_by_id(18))
