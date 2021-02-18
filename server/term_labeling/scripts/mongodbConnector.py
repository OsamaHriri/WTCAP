import pandas as pd
import json
import os
import pymongo
import time

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
        self.userHistoryCollections = self.db["userHistory"]

    def get_poem(self, poemID):
        return list(self.poemsCollections.find({"id": str(poemID)}))

    def get_poet_name(self, poet_id):
        return list(self.poetsCollections.find({"id": poet_id}, {"_id": 0, 'name':1}))

    def get_poems_by_poet(self, poet_id):
        return list(self.poemsCollections.find({"poet_id": poet_id}, {"_id": 0, "id": 1, "name": 1}))

    def get_poets(self):
        return list(self.poetsCollections.find({}, {"_id": 0, "info": 0, "place": 0, "whoAdded": 0, "period": 0}))

    def get_poems(self):
        return list(self.poemsCollections.find({}, {"_id": 0, "context": 0}))

        
    def get_periods_name(self):
        return list(self.periodsCollections.find({},{"id": 1, "name": 1}))

    def get_periodname_by_id(self,id):
        preiods = self.get_periods_name()
        for per in preiods : 
            if per['id'] == id :
                return per['name']
        return "unknown"

    def get_poet_per(self,poet_id):
         poet_id = int(poet_id)
         per_id = self.poetsCollections.find({"id": poet_id},{"period": 1})
         
         per_id = list(per_id)[0]['period']

         return self.get_periodname_by_id(per_id)
   
   
   
    def get_poems_context(self):
        return list(self.poemsCollections.find({}, {"_id": 0, "context": 1}))

    def get_periods(self):
        return list(self.poetsCollections.distinct("period"))

    def get_poems_by_period(self, p):
        #myquery = {"period": p}
        #x = self.poetsCollections.find(myquery, {"_id":0,"id": 1})
        result = self.poetsCollections.aggregate([
            { "$match": { "period": p } },
                {'$unset': [ "_id", "name","info","place","whoAdded","period" ] },
                    {'$lookup' : {'from': 'poems','let': {'id':"$id"},
                                  'pipeline':[{"$match":{ "$expr": { "$eq": ["$poet_id", "$$id"] }}},{'$project':{'_id':0,'context':{'sadr':1,'ajuz':1}}}],
                                            'as': 'results' }}])
        return list(result)

    def add_user_entry(self, user_id , poem_id, poem_name,poet_name):

        _dict = {'user_id':user_id,'poem_id':poem_id,'poem_name':poem_name,'poet_name':poet_name,'time':time.time()}
        self.userHistoryCollections.insert_one(_dict)


    def get_user_history(self, user_id ):
        return list(self.userHistoryCollections.find({'user_id':user_id},{'poem_name':1,'poet_name':1,'poem_id':1,'time':1}))

    def edit_poem_line(self,poem_id, line, sadr, ajuz):

        line = int(line)+1
        self.poemsCollections.update_one({'id':str(poem_id),'context.row_index':str(line)},
            {'$set':{'context.$.sadr':sadr , 'context.$.ajuz':ajuz}}, upsert=True)


    def get_all_user_history(self):
        return list(self.userHistoryCollections.find({},{'poem_id': 1, 'time': 1, 'poem_title': 1, 'poet_name': 1,'user_id':1}))




if __name__ == "__main__":


    c = Connector()
    # print(len(Connector().get_periods_name()))

    # poem_id, line, sadr, ajuz = 2092, 0 ,' بانَت  سُعادُ  فَفي  العَينَينِ  مَلمولُ' , ' مِن  حُبِّها  وَصَحيحُ  الجِسمِ  مَخولُ '
    # print(list(Connector().poemsCollections.find({"id":str(poem_id),"context.row_index":str(line)})))
    # Connector().edit_poem_line(poem_id, line, sadr, ajuz)
    # c.userHistoryCollections.drop()
    print(list(c.userHistoryCollections.find({})))
