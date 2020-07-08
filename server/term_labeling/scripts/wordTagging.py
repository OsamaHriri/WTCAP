from py2neo import Graph, Node


class Tagging(object):
    def __init__(self):
        self.graph = Graph("bolt://localhost:7687", auth=("neo4j", "123123147"))
        self.getMaxIDQ1 = """ Match (w:Word) return Max(tointeger(w.id)) as max """
        self.getMaxIDQ2 = """ Match (t:Tag) return Max(tointeger(t.id)) as max """
        self.searchQ1 = """ Match (w:Word) where w.name=$name return w.name as name """
        self.searchQ2 = """ Match (t:Tag) where t.name=$name return t.name as name  """
        self.searchQ3 = """ Match (w:Word)-[r:tag]->(t:Tag) where t.name=$tag and w.name=$word and r.poemID=$poem and r.sader=$sader and r.position=$position and r.row=$row return r  """
        self.createReletionQ = """ Match (w:Word) ,(t:Tag) where w.name=$word and t.name=$tag create (w)-[:tag{position: $position,poemID: $poem,row : $row,sader : $sader}]->(t) """
        self.removeWordQ = """ Match (w:Word) where w.name=$word detach delete w """
        self.getTagOfWordQ = """ Match (w:Word) -[r:tag]-> (t:Tag) where w.name=$word return t.name as name"""

    def ifExists(self, word=None, tag=None, ):
        """
         # check if a word or tag exist in the db but not both .
        """
        if tag is None:
            s = self.graph.run(self.searchQ1, name=word).data()
        else:
            s = self.graph.run(self.searchQ2, name=tag).data()
        if len(s) == 0:
            return False
        return True

    def ifReleationExist(self, word, tag, poem, sader, row, position):
        """
         # check of this a relation between tag and word exist based on the input parameters.
        """
        s = self.graph.run(self.searchQ3, word=word, tag=tag, sader=sader, row=row, poem=poem, position=position).data()
        if len(s) == 0:
            return False
        return True

    def tagWord(self, word, tag, poemID, sader, row, position):
        """
         sader or ajez , parent must exist.
        # if tag doesn't exist , we create a new one(optional we can remove it )
        # create a relation between tag and word based on poem Id , row and the position of the word in the poem.
        :param word:
        :param tag:
        :param poemID: stand for the id of the poem that the word being tagged in.
        :param row: the row which the word exist.
        :param position: stand for the word position in the poem.
        :return:
        """
        if sader not in (0, 1):
            return False
        if not self.ifExists(tag=tag):
            return False
        if not self.ifExists(word=word):
            temp = self.graph.run(self.getMaxIDQ1).data()[0]["max"]
            if temp is None:
                maxID1 = 1
            else:
                maxID1 = temp + 1
            self.graph.create(Node("Word", id=maxID1, name=word))
        if not self.ifReleationExist(word, tag, poemID, sader, row, position):
            self.graph.run(self.createReletionQ, word=word, tag=tag, sader=sader, row=row, poem=poemID,
                           position=position)
            return True
        return False

    def removeWord(self, word):
        """
        check if a word exists and remove it with all relationships.
        :param word:
        :return:
        """
        if not self.ifExists(word=word):
            return False
        self.graph.run(self.removeWordQ, word=word)
        return True

    def searchTagsOfWord(self, word):
        """
        get all the tags of given word , perform distinct function on the answer.
        :param word:
        :return:
        """
        l = []
        if not self.ifExists(word=word):
            return l
        search = self.graph.run(self.getTagOfWordQ, word=word)
        for t in search:
            l.append(t["name"])
        return list(dict.fromkeys(l))

#t = Tagging()
#t.tagWord("الارض", "العالم", 3,1,1, 3)
#t.tagWord("الارض", "العالم", 3,1,1, 3)
#t.tagWord("بحر", "العالم", 1,0,2, 1)
#t.tagWord("بحر", "العالم", 1,0,2, 1)
#t.tagWord("بحر", "العالم", 1,0,2, 1)
#t.tagWord("بحر", "العالم", 4,0,3, 33)
#t.tagWord("بحر", "ماء", 2,1,4, 2)
#t.tagWord("محيطأ", "ماء", 2,0,5, 2)
#t.tagWord("محيطأ", "ماء", 2,0,5, 2)
#t.tagWord("محيطأ", "ماء", 2,0,5, 2)
#t.tagWord("محيط", "ماء", 2,0,57, 2)
#t.tagWord("محيط", "ماء", 2,0,58, 2)
#print(t.searchTagsOfWord("بحر"))
