from bottle import (
        run, request, 
        hook, post )
import json

# my code
from solver import solve

LETTERS = "letters"
STARTS = "startswith"
ENDS = "endswith"

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

    if ( not json_in or 
         not LETTERS in json_in 
        ):
        return pack_data("no good")

    starts_with = ''
    ends_with = ''

    if STARTS in json_in:
        starts_with = json_in[STARTS]
    if ENDS in json_in:
        ends_with = json_in[ENDS]
    
    letters = json_in[LETTERS]
    #TODO: make sure letters is clean 
    #TODO: insure max length of letters: 15? 20?
    solutions = solve(letters, starts_with, ends_with)
    data = {"words": solutions}
    print(data)
    
    return pack_data(data)

def pack_data(data):
    return json.dumps(data)

if __name__ == '__main__':
    run(host='0.0.0.0', port=1337,
        reloader=True)
