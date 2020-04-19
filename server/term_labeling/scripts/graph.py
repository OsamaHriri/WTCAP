import csv
import sys


class Tag(object):
    def __init__(self, number,name,parent,level):
        self.number = number
        self.name=name
        self.parent=parent
        self.level=level

    def __str__(self):
       return "id= "+str(self.number)+" Name= "+self.name+ " Parent= "+self.parent+" Level"

class Graph(object):

    def __init__(self, graph_dict=None):
        """ initializes a graph object
            If no dictionary or None is given,
            an empty dictionary will be used
        """
        if graph_dict == None:
            graph_dict = {}
        self.__graph_dict = graph_dict

    def vertices(self):
        """ returns the vertices of a graph """
        return list(self.__graph_dict.keys())

    def edges(self):
        """ returns the edges of a graph """
        return self.__generate_edges()

    def add_vertex(self, vertex):
        """ If the vertex "vertex" is not in
            self.__graph_dict, a key "vertex" with an empty
            list as a value is added to the dictionary.
            Otherwise nothing has to be done.
        """
        if vertex not in self.__graph_dict:
            self.__graph_dict[vertex] = []

    def add_edge(self, parent ,child):
        """ assumes that edge is of type set, tuple or list;
            between two vertices can be multiple edges!
        """

        vertex1=parent
        vertex2=child
        if vertex1 in self.__graph_dict:
            self.__graph_dict[vertex1].append(vertex2)
        else:
            self.__graph_dict[vertex1] = [vertex2]

    def __generate_edges(self):
        """ A static method generating the edges of the
            graph "graph". Edges are represented as sets
            with one (a loop back to the vertex) or two
            vertices
        """
        edges = []
        for vertex in self.__graph_dict:
            for neighbour in self.__graph_dict[vertex]:
                if {neighbour, vertex} not in edges:
                    edges.append({vertex, neighbour})
        return edges

    def __str__(self):
        res = "vertices: "
        for k in self.__graph_dict:
            res += str(k) + " "
        res += "\nedges: "
        for edge in self.__generate_edges():
            res += str(edge) + " "
        return res

    def find_path(self, start_vertex, end_vertex, path=None):
        """ find a path from start_vertex to end_vertex
            in graph """
        if path == None:
            path = []
        graph = self.__graph_dict
        path = path + [start_vertex]
        if start_vertex == end_vertex:
            return path
        if start_vertex not in graph:
            return None
        for vertex in graph[start_vertex]:
            if vertex not in path:
                extended_path = self.find_path(vertex,
                                               end_vertex,
                                               path)
                if extended_path:
                    return extended_path
        return None


   #get all children of node , input tag object
    def getChildrensbyNode(self,vertex):
        return self.__graph_dict[vertex]


   #get all children of node , input tag name
    def getChildrensbyName(self,name):
         return self.__graph_dict[name]


    #generate data from csv file and create graph
    def getdata(self):
        tags = []
        line = 0
        with open('dataset.csv', 'r', encoding="utf8") as f:
            reader = csv.reader(f)
            for row in reader:
                if line != 0:
                    tags.append(Tag(row[0], row[1], row[2], row[3]))
                    # line=line+1
                else:
                    line = line + 1

        g = Graph()
        tags.sort(key=lambda x: x.level)
        x = 0
        for parent in tags:
            for child in tags:
                if parent.number == child.parent and parent.name != child.name and parent.level < child.level:
                    g.add_edge(parent.name, child.name)

        return g, tags


graph= Graph()







