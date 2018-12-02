import time
from subprocess import call, DEVNULL

trials = [
        ["what"],
        ["who"],
        ["thisisatestletters"],
        ["aaeeiioouubcdfgjklmnpqrtwxzyyssss"],
        ['__________________________']
    ]

programs = [
        ["./anagram"],
        ["./solve_old", "./SOWPODS.txt"],
    ]

def speedtest(program, arg):

    t1 = time.time()
    call(program + arg, stdout=DEVNULL)
    t2 = time.time()

    return t2 - t1

def do_test(program, arg):
    trials = 10
    results = []
    for i in range(0,trials):
        results.append(speedtest(p, t))
    avg = sum(results) / len(results)
    print("input: %s, avg of %d trials: %f" % 
            (arg, trials, avg))
    print("min: %d, max: %f\n\n" % 
            (min(results), max(results)))


for p in programs:
    print("------ testing %s -------" % p)
    for t in trials:
        do_test(p, t)
    print()
