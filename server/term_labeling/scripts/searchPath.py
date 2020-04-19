from graph import Graph
import sys

def main(arg):
    p = Graph()
    g, tags = p.getdata()
    head = []
    for t in tags:
        if t.level == "0":
            head.append(t)
    for l in head:
        p = g.find_path(l.name, arg)
        if p is not None:
            break
    if p is not None:
        print(p)


if __name__ == "__main__":
    main(sys.argv[1])
    # main("جبل")
