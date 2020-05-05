import csv

from py2neo import Graph, Node, Relationship


# this class is only for one use , transfer all data from csv to neo4j . u need neo4j db to be active
class Tag(object):
    def __init__(self, number,name,parent,level):
        self.number = number
        self.name=name
        self.parent=parent
        self.level=level



graph = Graph("bolt://localhost:7687", auth=("neo4j", "123123147"))
nodes = []
line = 0
with open('dataset.csv', 'r', encoding="utf8") as f:
    reader = csv.reader(f)
    for row in reader:
        if line != 0:
           nodes.append(Tag(number=row[0], name=row[1] ,parent=row[2], level=row[3]))
            # line=line+1
        else:
            line = line + 1

p = Relationship.type("Parent")
for parent in nodes:
    for child in nodes:
        if parent.number==child.parent and parent.name != child.name and parent.level < child.level:
            graph.merge(p(Node("Tag",id=parent.number,name=parent.name,level=parent.level),
                          Node("Tag",id=child.number,name=child.name,level=child.level)), "Tag","name")
