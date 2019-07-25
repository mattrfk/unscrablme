#include <stdio.h>
#include <string.h>

#define BLANK '_'
#define NOLL '#'

int blanks_left = 0;
int capitals = 0;

int cInLetters(int c, char *letters, int repl) {
	char *r = strrchr(letters, c);
	if(r){
		*r = repl;
		return 1;
	}
	return 0;
}

int isCapital(char c) {
	if(c >= 65 && c <= 90) 
		return 1;
	return 0;
}

int toLower(char c) {
	return c + 32;
}

int toCapital(char c) {
	return c - 32;
}

// Can w be made from letters, and does w start with prefix and 
// end with suffix?
int word_matches(char* w, char* letters, char* prefix, char* suffix){
	int min = 0;
	int wlen = strlen(w) - 1; // accounting for \ns  in the file
	int llen = strlen(letters);
	int slen = 0, plen = 0; // suffix and prefix length

	char letts[30]; //make a local copy of letters so I can edit it
	strncpy(letts, letters, 30);

	if(prefix) {
		plen = strlen(prefix);
		for(int n = 0; n < plen; n++) {
			if(prefix[n] != w[n]) return 0;
		}
		min = plen; // prefix matches, ignore that part of the word
	}

	if(suffix) {
		slen = strlen(suffix);
		for(int n = slen-1, j = wlen-1; n >= 0; n--,j--) {
			if(suffix[n] != w[j]) return 0;
		}
		wlen -= slen; // suffix matches, ignore end of word
	}

	if(capitals) {
		for(int i = 0; i < llen; i++) {
			if(isCapital(letts[i])) {
				if(wlen+plen <= i || w[i+plen] != toLower(letts[i])) {
					return 0;
				}
				else {
					letts[i] = NOLL;
					w[i + plen ] = toCapital(w[i + plen]);
				}
			}
		}
	}

	for(int i = min ;i < wlen; i++){
		if( !isCapital(w[i]) && 
				w[i] != '\n' && 
				!cInLetters(w[i], letts, NOLL)) {
			if( blanks_left > 0) { // you get a free pass
				blanks_left--;
			} 
			else {
				return 0;
			}
		}
	}

	return 1;
}

int solve( char* dict, char* letters, char* prefix, char* suffix ) {
	FILE *fp;
	char buffer[255];

	fp = fopen(dict, "r");
	if(!fp) {
		printf("could not open dictionary at: %s\n", dict);
		return 0;
	}

	// setup for blanks
	int num_blanks = 0;
	for(int i = 0; i < strlen(letters); i++) {
		if(letters[i] == BLANK) {
			num_blanks++;
			letters[i] = NOLL;
		}
	}

	// scan for capitals
	for(int i = 0; i < strlen(letters); i++) {
		if(isCapital(letters[i])) {
			capitals = 1;
			break;
		}
	}

	int words_found = 0;
	int length = strlen(prefix) + 
							 strlen(suffix) + 
							 strlen(letters);

	while(fgets(buffer, 255, (FILE*) fp)) {
		if(strlen(buffer)-1 > length) { // -1 accounting for \n
			return 0;
		}

		blanks_left = num_blanks;

		if(word_matches(buffer, letters, prefix, suffix)) {
			words_found++;
			printf("%s", buffer);
		}
	}

	fclose(fp);

	return words_found;
}


int main(int argc, char** argv){
	if(argc < 3) {
		printf("Usage: dictionary-path, letters, [prefix, suffix]\n");
		printf("Note: set prefix as '' if you only want a suffix\n");
		return 0;
	}
	else {
		char* prefix = "";
		char* suffix = "";

		char* dict = argv[1];
		char* letters = argv[2];

		if(argc > 3) prefix = argv[3];
		if(argc > 4) suffix = argv[4];

		solve(dict, letters, prefix, suffix);

		return 0;
	}
}
