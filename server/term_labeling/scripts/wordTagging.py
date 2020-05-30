from py2neo import Graph, Node



class Tagging(object):
    def __init__(self):
        self.graph = Graph("bolt://localhost:7687", auth=("neo4j", "123123145"))
        self.getMaxIDQ1 = """ Match (w:Word) return Max(tointeger(w.id)) as max """
        self.getMaxIDQ2 = """ Match (t:Tag) return Max(tointeger(t.id)) as max """
        self.searchQ1 = """ Match (w:Word) where w.name=$name return w.name as name """
        self.searchQ2 = """ Match (t:Tag) where t.name=$name return t.name as name  """
        self.searchQ3 = """ Match (w:Word)-[r:tag]->(t:Tag) where t.name=$tag and w.name=$word and r.poemID=$poem and r.postion=$position return r  """
        self.createReletionQ = """ Match (w:Word) ,(t:Tag) where w.name=$word and t.name=$tag create (w)-[:tag{postion: $postion,poemID: $poem}]->(t) """
        self.removeWordQ = """ Match (w:Word) where w.name=$word detach delete w """
        self.removeTagQ = """ Match (t:Tag) where t.name=$tag detach delete t """
        self.getTagOfWordQ = """ Match (w:Word) -[r:tag]-> (t:Tag) where w.name=$word return t.name as name"""

    def ifExists(self, word=None, tag=None ,):
        if tag is None:
            s = self.graph.run(self.searchQ1, name=word).data()
        else :
            s = self.graph.run(self.searchQ2, name=tag).data()
        if len(s) == 0:
            return False
        return True

    def ifReleationExist(self ,word ,tag ,poem ,position):
        s = self.graph.run(self.searchQ3, word=word ,tag=tag, poem=poem , position=position).data()
        if len(s) == 0:
            return False
        return True

     # postion : stand for the word postion in the poem
     # poemID: stand for the id of the poem that the word being tagged in
    def tagWord(self, word, tag, postion , poemID):
        if not self.ifExists(word=word):
            temp = self.graph.run(self.getMaxIDQ1).data()[0]["max"]
            if temp is None:
                maxID1 = 1;
            else:
                maxID1 = temp + 1
            self.graph.create(Node("Word", id=maxID1, name=word))
        if not self.ifExists(tag=tag):
            temp = self.graph.run(self.getMaxIDQ2).data()[0]["max"]
            if temp is None:
                maxID2 = 1
            else:
                maxID2 = temp + 1
            self.graph.create(Node("Tag", id=maxID2, name=tag))
        if not self.ifReleationExist(word ,tag ,postion ,poemID) :
            self.graph.run(self.createReletionQ, word=word, tag=tag,poem=poemID,postion=postion)
            return True
        return False

    def removeWord(self , word):
        if not self.ifExists(word=word):
            return False
        self.graph.run(self.removeWordQ, word=word)
        return True

    def removeTag(self , tag):
        if not self.ifExists(tag=tag):
            return False
        self.graph.run(self.removeTagQ, tag=tag)
        return True

    def searchTagsOfWord(self , word):
        l= []
        if not self.ifExists(word=word):
            return list
        search=self.graph.run(self.getTagOfWordQ, word=word)
        for t in search:
            l.append(t["name"])
        return list( dict.fromkeys(l))



t = Tagging()
t.tagWord("الارض","العالم",3 ,3)
t.tagWord("الارض","العالم",4 ,4)
print(t.searchTagsOfWord("الارض"))

