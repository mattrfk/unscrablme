import time
from subprocess import call, DEVNULL

program = "solver.py"

trials = [
        ["what",'',''],
        ["who",'',''],
        ["thisisatestletters",'',''],
        ["aaeeiioouubcdfgjklmnpqrtwxzyyssss",'',''],
        #["aaaaabbccddeeffgghhiijjllkkmmnnnooopppqqrrrssstttuuuvvv",'',''],
        ["???????????",'',''],
        #["unscrable",'a','s'],
        ['?????????????','c','s']
    ]

interpreters = [
        "pypy3", 
        "python3", 
       # "python"
        ]

def speedtest(program, arg, interpreter):

    [a, b, c] = arg
    t1 = time.time()
    call([interpreter, program, a, b, c] ,stdout=DEVNULL)
    t2 = time.time()

    return t2 - t1


for i in interpreters:
    print("------ testing %s -------" % i)
    for t in trials:
        elapsed = speedtest(program, t, i)
        print("for '%s' \n\t\tit took %f seconds" % (t, elapsed))
    print()

#print("------ testing c -------" )
#for t in trials:
#    t1 = time.time()
#    [a,b,c] = t
#    call(["./solver", a, b, c], stdout=DEVNULL)
#    t2 = time.time()
#    elapsed = t2-t1
#    print("for '%s' \n\t\tit took %f seconds" % (t, elapsed))
