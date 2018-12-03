from bottle import ( run, request, hook, post )
import json
import subprocess

# my code

LETTERS = "letters"
PREFIX = "prefix"
SUFFIX = "suffix"

BLANKS_LIMIT = 5
LENGTH_LIMIT = 20

BLANK = '_'

DICT_PATH = "./SOWPODS.txt"
ANAGRAM = "./solve"

def solve(letters, prefix, suffix):
    print("solving...")
    print(ANAGRAM, DICT_PATH, "letters:", letters, "prefix: ", prefix, "suffix: ", suffix)
    
    try:
        res = subprocess.check_output(
                [ANAGRAM, DICT_PATH, letters, prefix, suffix],
                universal_newlines=True)
    except subprocess.CalledProcessError:
        print("got a problem")
        res = ''
    
    return res

# check for illegal characters
# enforce max length
def clean(s):
    s = s[:LENGTH_LIMIT]

    s = s.replace('?', BLANK)
    #TODO: remove all illegal symbols: numbers, etc.

    if s.count(BLANK) > BLANKS_LIMIT:
        s = s.replace(BLANK, '', s.count(BLANK) - BLANKS_LIMIT)
    return s

@hook('before_request')
def strip_path():
    r = request.environ['PATH_INFO'].rstrip('/')
    request.environ['PATH_INFO'] = r

@post('/unscrablme')
def process_post():
    try:
        json_in = request.json
    except:
        return pack_data("problem with the json")

    if ( not json_in or not LETTERS in json_in ):
        return pack_data("no good")

    prefix = ''
    suffix = ''

    if PREFIX in json_in:
        prefix = clean(json_in[PREFIX])
        print("prefix set to %s" % prefix)
    if SUFFIX in json_in:
        suffix = clean(json_in[SUFFIX])
        print("suffix set to %s" % suffix)
    
    letters = clean(json_in[LETTERS])
    
    solutions = solve(letters, prefix, suffix)
    data = {"words": solutions.split('\n')}
    
    return pack_data(data)

def pack_data(data):
    return json.dumps(data)

if __name__ == '__main__':
    run(host='0.0.0.0', port=1337,
        reloader=True)
