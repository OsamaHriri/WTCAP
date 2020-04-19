import csv

class Tag(object):
    def __init__(self, number,name,parent,level):
        self.number = number
        self.name=name
        self.parent=parent
        self.level=level

    def __str__(self):
       return self.name

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

    def add_edge(self, edge):
        """ assumes that edge is of type set, tuple or list;
            between two vertices can be multiple edges!
        """
        edge = set(edge)

        (vertex1, vertex2) = tuple(edge)
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


   #get all children of node , input tag object
    def getChildernsbyNode(self,vertex):
        return self.__graph_dict[vertex]


   #get all children of node , input tag name
    def getChildrenbyName(self,name):
        for v in self.__graph_dict.keys():
            if v.name==name :
                return self.__graph_dict[v]

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
        for t in tags:
            list = []
            for p in tags:
                if t.number == p.parent:
                    g.add_edge({t, p})
        return g ,tags

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
 # new id for a new created tag
def getNewID(list):
    max=-1
    for v in list:
      if int(v.number)>max:
          max=int(v.number)+1
    return max


# get tag object by given name
def getTag(name,tags):
    for v in tags:
        if(v.name==name):
            return v


# check if a tag name is exists or not
def ifExist(name,tags):
    for t in tags:
        if t.name==name:
          return True
    return False

# create new tag and place it in graph , create from string name only
def createNewTag(name,parent,tags):
    if ifExist(name) or not ifExist(parent):
        return False
    p=getTag(parent)
    T= Tag(getNewID(tags),name,p.number,str(int(p.level)+1))
    tags.append(T)
    g.add_edge((T,p))
    fields = [T.number, T.name, T.parent,T.level]
    with open("dataset.csv", 'a',encoding="utf8") as f:
        writer = csv.writer(f)
        writer.writerow(fields)
    return True




def getAllheads(tags):
    head=[]
    for v in tags:
        if(v.level=='0'):
            head.append(v)
    return head



def main(argv):
 g,tags=graph.getdata()
 head=getAllheads(tags)
 n=g.getChildrenbyName(head[0].name)
 for pa in head:
  p=g.find_path(pa,getTag(argv, tags))
  for i in p:
      print(i.name)

graph=Graph()
if __name__ == "__main__":
  ## main(sys.argv[1])
  main("قماش")