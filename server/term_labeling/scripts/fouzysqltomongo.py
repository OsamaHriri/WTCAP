import pandas as pd
import xml.etree.ElementTree as ET
import json
import os
import pymongo
import mysql.connector
import mongodbConnector as mdbc

class ArabicRhetoricSyncer():

    def __init__(self):
    
        self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mydb1 = self.myclient["arabic_semantic_labeling"]
        self.mycol = self.mydb1["poems"]
        self.poetsCollections = self.mydb1["poets"]
        self.periodCollections = self.mydb1["period"]

        self.mydb = mysql.connector.connect(
            host="132.75.251.80",
            user="root",
            passwd="1234",
            database="arabicrhetoricdb"
        )
        
    def sync_poets(self):
    
        mycursor = self.mydb.cursor()
        sql2 = "SELECT *  FROM poet"
        mycursor.execute(sql2)

        poets = mycursor.fetchall()

        poets_id = set([p[0] for p in poets])

        mongo_poets = list(self.poetsCollections.find({}, {"_id": 0, "info": 0, "place": 0, "whoAdded": 0, "period": 0}))

        agent_ids = set([int(x['id']) for x in mongo_poets])



        poets_toadd = poets_id - agent_ids
        poets = []
        for id in poets_toadd:

            sql = "SELECT *  FROM poet where id = " + str(id)
            poet={}
            mycursor.execute(sql)
            myresult = mycursor.fetchall()
            myresult=myresult[0]
            poet['id'] = myresult[0]
            poet['name'] = myresult[1]
            poet['info'] = myresult[2]
            poet['place'] = myresult[3]
            poet['who Added'] = myresult[4]
            poet['period'] = myresult[5]
            poets.append(poet)

        if poets :
            self.poetsCollections.insert_many(poets)
            print(str(len(poets)) + " added")
        else:
            print("0 new poets")
        

    def sync_periods(self):
        cur_per = self.poetsCollections.distinct("period")
        mycursor = self.mydb.cursor()
        sql2 = "SELECT id,name  FROM period"
        mycursor.execute(sql2)
        period = mycursor.fetchall()
        col=[]
        for p in period:
            _dict = {}
            _dict['id'] = p[0]
            _dict['name'] = p[1]
            if p[0] not in cur_per :
                col.append(_dict)
        if col :
            self.periodCollections.insert_many(col)    
        else:
            print("periods already synced")
        
        
    def sync_poems(self):
    
        mycursor = self.mydb.cursor()
        sql2 = "SELECT *  FROM poem "
        mycursor.execute(sql2)
        poems = mycursor.fetchall()

        k=0
        poems_id = set([p[0] for p in poems])

        ids = list(self.mycol.find({},{"id":1}))
        agent_ids = set([int(x['id']) for x in ids])
         

        poesm_toadd = poems_id - agent_ids
        poems2 =[] 
        for i in range(len(poems)):
            if( int(poems[i][0]) in poesm_toadd):
                poems2.append(poems[i])
        print(len(poems2))

        poems = poems2

        for i in range(len(poems)):
            
            poem_id = poems[i][0]
            sql = "SELECT *  FROM word where poem_id = " + str(poem_id)
            
            mycursor.execute(sql)
            myresult = mycursor.fetchall()
            if myresult:
                string = ""
                df = pd.DataFrame(myresult, columns=['id', 'poem_id', 'poet_id', 'name', 'colomn', 'FL']).sort_values(
                    by=['colomn', 'FL'])
                for j in range(len(df)):
                    string = string + df.iloc[j, 3] + " "
                    if j< len(df) - 1:
                        if df.iloc[j + 1, 4] != df.iloc[j, 4]:
                            string += '\n'
                        elif df.iloc[j + 1, 5] != df.iloc[j, 5]:
                            string += '|'
                nstring = {}
                _list = []
                row = 1

                for srt in string.split("\n"):
                    nstring["row_index"] = str(row)
                    srt = srt.split("|")

                    if srt:
                        nstring["sadr"] = srt[0]
                    if len(srt) == 2:
                        nstring["ajuz"] = srt[1]
                    # nstring.append('"row_index":' + str(row) + ',' +
                    #                '"sadr":' + srt.split("|")[0] + ',' +
                    #                '"ajuz":' + srt.split("|")[1])
                    row += 1
                    _list.append(nstring.copy())
                poem = {}
                poem["id"] = str(poem_id)
                try:
                    if i < len(poems) :
                        if poems[i][1] is not None:
                            poem["poet_id"] = poems[i][1]
                        if poems[i][2] is not None:
                            poem["name"] = poems[i][2]
                        if poems[i][3] is not None:
                            poem["source"] = poems[i][3]
                        if poems[i][4] is not None:
                            poem["rhyme"] = poems[i][4]
                        if poems[i][5] is not None:
                            poem["whoAdded"] = poems[i][5]
                        if poems[i][6] is not None:
                            poem["lyric"] = poems[i][6]
                        if poems[i][7] is not None:
                            poem["numOfDewan"] = poems[i][7]
                except IndexError:
                    print(poem_id)
                    print(i)


                poem["context"] = _list
                self.mycol.insert_one(poem)
                k+=1

                if k % 1000 == 1:

                    print("proccessed {0} out of {1}".format(k,len(poems)))
                    
                    
                    
if __name__ =="__main__":
    ars = ArabicRhetoricSyncer()

    ars.sync_poets()
    print("periods synced")
    ars.sync_poems()
    print("periods synced")