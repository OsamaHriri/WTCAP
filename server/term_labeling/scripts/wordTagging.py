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
        #self.getTagOfWordQ = """ Match (w:Word) -[r:tag]-> (t:Tag) with w , t , count(r) as c where w.name=$word  return {name :t.name  , frequency: c } as Tag order by c Desc """
        self.getTagOfWordQ =""" match (w1:Word)-[r1:tag]->(t1:Tag) where w1.name=$word with collect(t1.name) as alltags
                                optional match (w:Word)-[r:tag]->(t:Tag) where r.poemID=$poem and r.sader=$place and r.position=$position and r.row=$row with alltags ,collect(t.name) as temp 
                                return [x IN alltags where not x in temp] as list
                            """
        self.checkWords = """match (:Tag)<-[r:tag]-(w:Word) where  r.poemID=$poem  return distinct r.position as position,r.row as row , r.sader as sader """
        self.checkpoems = """ match (:Tag)<-[r:tag]-(:Word) where r.poemID in $poems return distinct r.poemID as poemID """
        self.tagsOfword = """ match (t:Tag)<-[r:tag]-(:Word) where r.poemID = $poem and r.sader = $place and r.position = $position and r.row = $row return t.name as tag"""
        self.removeTagrelationQ = """ match(t:Tag)<-[r:tag]-(:Word) where t.name =$tag and r.poemID = $poem and r.sader = $place and r.position = $position and r.row = $row  delete r"""

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

    def searchTagsOfWord(self, word , poem , place , row , position):
        """
        get all the tags of given word based on its position in poem .
        :param word:
        :return:
        """
        if not self.ifExists(word=word):
            return []
        search = self.graph.run(self.getTagOfWordQ, word=word , poem = poem , place = place , row = row , position = position).data()
        if len(search) == 0:
            return []
        else :
            return search[0]["list"]

    def get_tagged_words_from_poem(self, id):
      check = self.graph.run(self.checkWords, poem = id).data()
      l = []
      for d in check:
          l.append(d)
      return l

    def get_Tagged_poems(self,poems):
        l = []
        for p in poems :
            l.append(p["id"])
        return self.graph.run(self.checkpoems, poems = l).data()

    def get_term_current_tags(self ,row ,place ,position ,id):

        return self.graph.run(self.tagsOfword, poem = id , row=row , position= position , place = place).data()

    def remove_tag_reletion(self,row ,place ,position ,id ,tag):

        self.graph.run(self.removeTagrelationQ, poem=id, row=row, position=position, place=place , tag = tag)
        return True




