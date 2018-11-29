import sys

WORDFILE = "SOWPODS.txt"
MAX = 15 # longest word in sowpods is 5
BLANK = '?'
blanks = 0

def solve(letters, prefix='', suffix=''):
    matches = [] # store the results here

    # extract blanks
    global blanks 
    blanks = letters.count(BLANK)
    if blanks > 0:
        letters = letters.replace(BLANK, '')

    with open(WORDFILE) as f:
        for line in f:
            w = str(line).rstrip()
            if ( len(w) > len(letters) + len(prefix) + len(suffix) or
                 len(w) > MAX ): break

            word = word_matches(w, letters, prefix, suffix)
            if word:
                matches.append(word)

    return matches

# return false if: w doesn't start/end with prefix/suffix,
# or if w cannot be formed from letters
def word_matches(w, letters, prefix, suffix):
    word = w # make a copy of word

    if prefix: # if prefix is blank don't do anything with ti
        if w.startswith(prefix):
            w = w.replace(prefix, '', 1) # delete prefix from w
        else: 
            return False

    if suffix:
        if w.endswith(suffix):
            w = w.replace(suffix, '', 1)
        else: 
            return False

    global blanks
    for c in w:
        if c not in letters: 
            if blanks > 0:
                blanks -= 1
                # change word here?
            else:
                return False
        else:
            letters = letters.replace(c, '', 1)

    return word

if __name__ == "__main__": # if run from command line (vs imported)
    if len(sys.argv) > 1: 
        letters = sys.argv[1] 
    else: 
        print("give me some letters")
        quit()

    prefix = sys.argv[2] if len(sys.argv) > 2 else ''
    suffix = sys.argv[3] if len(sys.argv) > 3 else ''
    print(prefix)
    print(suffix)
    print("finding words for %s..." % letters)
    r = solve(letters, prefix, suffix)
    print("%s\n\nI found %s words" % (r, len(r)))





