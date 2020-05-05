from py2neo import Graph, Node


class Tag(object):
    def __init__(self):
        self.graph = Graph("bolt://localhost:7687", auth=("neo4j", "123123147"))
        self.searchTagQ = """ MATCH (t) -[p:Parent]-> (n) WHERE n.name=$name return t.name as name , t.level as level  """
        self.getMaxIDQ = """ Match (t) return Max(tointeger(t.id)) as max """
        self.searchQ = """ Match (t) where t.name=$name return t.name as name ,t.level as level"""
        self.updatechildrenQ = """ Match (t) -[:Parent] ->(n) -[:Parent] -> (c) where n.name=$name create (t)-[:Parent]->(c) """
        self.removeTagQ = """Match (t) where t.name=$name DETACH DELETE t """
        self.createReletionQ = """ Match (t) ,(n) where t.name=$parent and n.name=$name create (t)-[:Parent]->(n)  """
        self.removeRQ = """ Match (t) -[p:Parent] -> (n) where n.name=$name delete p """

    def ifExists(self, name):
        s = self.graph.run(self.searchQ, name=name).data()
        if len(s) == 0:
            return False
        return True

    def getAttrOfTag(self, name):
        return self.graph.run(self.searchQ, name=name).data()[0]

    def getTags(self, name):
        search = self.graph.run(self.searchTagQ, name=name).data()
        parents = []
        for p in search:
            parents.append(p["name"])
        return parents

    def addTag(self, name, parent=None):
        if self.ifExists(name):
            return False
        maxID = self.graph.run(self.getMaxIDQ).data()[0]["max"] + 1
        if parent is None:
            self.graph.create(Node("Tag", id=maxID, name=name, level=0))
            return True
        if not self.ifExists(parent):
            return False
        nParent = self.getAttrOfTag(parent)["level"] + 1
        self.graph.create(Node("Tag", id=maxID, name=name, level=nParent))
        self.graph.run(self.createReletionQ,name=name,parent=parent)
        return True

    def removeTag(self, name):
        if not self.ifExists(name):
            return False
        self.graph.run(self.updatechildrenQ, name=name)
        self.graph.run(self.removeTagQ, name=name)
        return True

    def changeParent(self, name, newParent):
        if not self.ifExists(name) or not self.ifExists(newParent):
            return False
        self.graph.run(self.removeRQ , name=name)
        self.graph.run(self.createReletionQ , name=name , parent=newParent)
        return True


tag = Tag()
# tag.getTags("عجل")
# tag.addTag("بحر")
#tag.addTag("a")
#tag.addTag("b","a")
#tag.addTag("c","b")
#tag.changeParent("c","a")
#tag.removeTag("c")
#tag.removeTag("a")
#tag.removeTag("b")