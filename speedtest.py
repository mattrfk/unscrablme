import time
from subprocess import call, DEVNULL

program = "solver.py"

trials = [
        ["what",'',''],
        ["who",'',''],
        ["thisisatestletters",'',''],
        ["aaeeiioouubcdfgjklmnpqrtwxzyyssss",'',''],
        ["-----------",'',''],
        ["unscrable",'a','s'],
        ['-------------','c','s'],
        ['------------------------','','']
    ]

programs = [
        ["pypy3", "solver.py"],
        ["python3","solver.py"], 
        ["./solver"],
    ]

def speedtest(program, arg):

    t1 = time.time()
    call(program + arg, stdout=DEVNULL)
    t2 = time.time()

    return t2 - t1


for p in programs:
    print("------ testing %s -------" % p)
    for t in trials:
        elapsed = speedtest(p, t)
        print("for '%s' \n\t\tit took %f seconds" % (t, elapsed))
    print()
