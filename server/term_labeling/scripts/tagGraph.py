from py2neo import Graph, Node
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from json import dumps



class Tag(object):
    def __init__(self):
        self.graph = Graph("bolt://localhost:7687", auth=("neo4j", "123123147"))
        self.getParentQ = """ MATCH (t:Tag) -[p:Parent]-> (n:Tag) WHERE n.name=$name return {name :t.name} as parent"""
        self.getParentQ1 = """ MATCH (t:Tag) -[p:Parent]-> (n:Tag) WHERE n.name=$name return t.name as name ,t.parent as parent"""
        self.getChildrenQ = """ MATCH (t:Tag) -[p:Parent]-> (n:Tag) WHERE t.name=$name return {name : n.name} as child """
        self.getBrothersQ = """ MATCH (t:Tag) -[p:Parent]-> (n:Tag) WHERE t.name=$parent and n.name<>$name return {name : n.name} as brother """
        self.getMaxIDQ = """ Match (t:Tag) return Max(tointeger(t.id)) as max """
        self.searchQ = """ Match (t:Tag) where t.name=$name return t.id as id ,t.name as name ,t.parent as parent """
        self.updatechildrenQ = """ Match (t:Tag) -[:Parent] ->(n:Tag) -[:Parent] -> (c:Tag) where n.name=$name create (t)-[:Parent]->(c) """
        self.updateAttrQ = """ Match (t:Tag) -[:Parent] ->(n:Tag) -[:Parent] -> (c:Tag) where n.name=$name set c.parent=t.id"""
        self.updateRootAttQ = """ Match (t:Tag) -[p:Parent] -> (n:Tag) where t.name=$name set n.parent=-1 """
        self.updateAttQ = """ Match (t:Tag) -[p:Parent] -> (n:Tag) where n.name=$name set n.parent=t.id  """
        self.removeTagQ = """Match (t:Tag) where t.name=$name DETACH DELETE t """
        self.createReletionQ = """ Match (t:Tag) ,(n:Tag) where t.name=$parent and n.name=$name create (t)-[:Parent]->(n)  """
        self.removeParentQ = """ Match (t:Tag) -[p:Parent] -> (n:Tag) where n.name=$name delete p """
        self.setToRootQ= """ Match (n:Tag) where n.name=$name set n.parent=-1 """
        self.getAllTagsQ = """ Match (t:Tag) return t.name as name ,t.parent as parent , t.id as id """
        self.getAllRootsQ = """ Match (t:Tag) where t.parent=-1 return {name : t.name } as root  """
        self.jsonQuery = """ MATCH r=(t:Tag)-[:Parent*]->(rs:Tag)  where t.parent=-1 WITH COLLECT(r) AS rs CALL apoc.convert.toTree(rs, true ,{ nodes: { Tag:['name']} }) yield value   RETURN value as tags """
        self.setParentQ = """ match (t:Tag) ,(n:Tag)  where t.name=$parent and n.name =$ name set n.parent = t.id create (t)-[:Parent]->(n) """
        self.editTagQ = """ match (t:Tag) where t.name =$name set t.name=$newName """
    def ifExists(self, name):
        s = self.graph.run(self.searchQ, name=name).data()
        if len(s) == 0:
            return False
        return True

    def getAttrOfTag(self, name):
        """
           # return metadata on a given tag name.
           """
        return self.graph.run(self.searchQ, name=name).data()[0]

    def getAllTags(self):
        """
        return all tags in the db.
        :return:
        """
        query = self.graph.run(self.getAllTagsQ).data()
        tags = []
        for p in query:
            tags.append(p["name"])
        return tags

    def getAllheads(self):
        """
        return all the heads(roots) in the hierarchy.
        :return:
        """
        roots = self.graph.run(self.getAllRootsQ).data()
        return {'roots' : roots}

    def getParent(self, name):
        """
           # return the tags parent's name.
           # return empty list if the tag is a root.
           """
        search = self.graph.run(self.getParentQ, name=name).data()
        return {'parent' : search}

    def getParentInline(self, name):
        """
           # return the tags parent's name.
           # return empty list if the tag is a root.
           """
        search = self.graph.run(self.getParentQ1, name=name).data()[0]
        return search

    def getChildrens(self,name):
        """
                  # return the tags children's name.
                  # return empty list if the tag is a leaf.
                  """
        search = self.graph.run(self.getChildrenQ, name=name).data()
        return {'children' : search}

    def getBrothers(self, name , parent):
        """
                  # return the tags children's name.
                  # return empty list if the tag is a leaf.
                  """
        search = self.graph.run(self.getBrothersQ, name=name ,parent=parent).data()
        return {'brothers': search}


    def addTag(self, name, parent=None):
        """
          # create tag with no parent means the tag is a root(root parent id is -1).
          # if the parent not None , the parent need to exist in db.
          """
        if self.ifExists(name):
            return {"Tag": False}
        maxID = self.graph.run(self.getMaxIDQ).data()[0]["max"] + 1
        if parent is None:
            self.graph.create(Node("Tag", id=maxID, name=name,parent=-1))
            return {"Tag":True}
        if not self.ifExists(parent):
            return {"Tag":True,"parent":False}
        parentID= self.getAttrOfTag(parent)["id"]
        self.graph.create(Node("Tag", id=maxID, name=name, parent=parentID))
        self.graph.run(self.createReletionQ,name=name,parent=parent)
        return {"Tag":True,"parent":True}

    def removeTag(self, name):
        """
          # when removing tags ,we update the value of their children's parentid to be the value of their grandfatherid.
          # when removing tags , we remove all of their relation with words(from word tagging) and tags.
          """
        if not self.ifExists(name):
            return {"remove":False }
        if self.getAttrOfTag(name)["parent"] ==-1:
            self.graph.run(self.updateRootAttQ, name=name)
        else:
            self.graph.run(self.updatechildrenQ, name=name)
            self.graph.run(self.updateAttrQ, name=name )
        self.graph.run(self.removeTagQ, name=name)
        return {"remove":True}

    def checkCycle(self,source ,target):
        """
        check if connecting two nodes create a cycle in the hierarchy.
        :param source:
        :param target:
        :return:
        """
        s = self.getAttrOfTag(source)
        t = self.getAttrOfTag(target)
        if t["parent"] == s["id"] :
            return True
        while t["parent"] != -1 :
            temp = self.getParentInline(t["name"])
            if temp["parent"] == s["id"]:
                return True
            t=temp
        return False

    def change_Parent(self, name, newParent=None):
        """
          # if parent is none , we changed tag parentid to -1(root).
          # newparent need to be in db.
          # changing parent for a tag will remove the relation between the tag and the prev parent.
          """
        if newParent is None:
            if not self.ifExists(name):
                return False
            else :
                self.graph.run(self.removeParentQ, name=name)
                self.graph.run(self.setToRootQ , name=name)
                return True
        if self.checkCycle(name ,newParent):
            return False
        self.graph.run(self.removeParentQ , name=name)
        self.graph.run(self.createReletionQ , name=name , parent=newParent)
        self.graph.run(self.updateAttQ, name=name)
        return True

    def getAllTagsbyjson(self):
        query = self.graph.run(self.jsonQuery).data()
        return query


    def findDepth(self ,target):
        t = self.getAttrOfTag(target)
        depth = 0
        while t["parent"] != -1:
            depth = depth + 1
            t = self.getAttrOfTag(self.getParentInline(t["name"])["name"])

        return {"depth" : depth}

    def newParent(self ,name , newParent):
        if not self.addTag(newParent)["Tag"]:
            return {"add": False}
        if not self.getAttrOfTag(name)["parent"] == -1 :
            t = self.getParentInline(name)["name"]
            self.graph.run(self.setParentQ, name=newParent, parent=t)
        self.change_Parent(name,newParent)
        return {"add" : True}


    def changeParent(self ,name , newParent):
        if not self.ifExists(newParent):
            return {"change":False}
        if not self.getAttrOfTag(name)["parent"] == -1 :
            t = self.getParentInline(name)["name"]
            self.graph.run(self.setParentQ, name=newParent, parent=t)
        if not self.change_Parent(name,newParent):
            return {"change": False}
        else :
            return {"change" : True}

    def editTag(self, name, newName):
        if  self.ifExists(newName):
            return {"edit":False}
        self.graph.run(self.editTagQ, name= name , newName=newName)
        return {"edit":True}



#tag = Tag()
# tag.getTags("عجل")
# tag.addTag("بحر")
#tag.addTag("a")
#tag.addTag("b","a")
#tag.addTag("d","a")
#tag.addTag("c","b")
#tag.change_Parent("a","c")
#tag.newParent("d","b")
#tag.removeTag("c")
#tag.removeTag("a")
#tag.removeTag("b")
#tag.removeTag("d")

#for t in tag.getAllTags():
#    print(t.name,t.id,t.parent)

#print(tag.getChildrens("العالم"))
#print(tag.getParent("العالم"))
#print( tag.getAllheads())
#print(tag.getAllTagsbyjson())
#print(tag.findDepth("العالم"))
#print(tag.findDepth("ماء"))