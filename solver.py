import sys

WORDFILE = "SOWPODS.txt"

def solve(letters, prefix='', suffix=''):
    matches = [] # store the results here
    with open(WORDFILE) as f:
        for line in f:
            w = str(line).rstrip()

            # don't check words that are too long
            if len(w) > len(letters) + len(prefix) + len(suffix):
                break
            if word_matches(w, letters, prefix, suffix):
                matches.append(w)

    return matches


def word_matches(w, letters, prefix, suffix):
    if prefix:
        if w.startswith(prefix):
            w = w.replace(prefix, '', 1)
        else: 
            return False

    if suffix:
        if w.endswith(suffix):
            w = w.replace(suffix, '', 1)
        else: 
            return False

    for c in w:
        if c not in letters: 
            return False
        else:
            letters = letters.replace(c, '', 1)

    return True

if __name__ == "__main__":
    if len(sys.argv) > 1: 
        if len(sys.argv) > 1:
            letters = sys.argv[1] 
        else:
            print("give me some letters")
    else: 
        quit()
    prefix = sys.argv[2] if len(sys.argv) > 2 else ''
    suffix = sys.argv[3] if len(sys.argv) > 3 else ''
    print("finding words for %s..." % letters)
    r = solve(letters, prefix, suffix)
    print("%s\n\nI found %s words" % (r, len(r)))
