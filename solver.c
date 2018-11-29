#include <stdio.h>
#include <string.h>

#define DICT "/Users/m/Documents/code/anagram_solver/SOWPODS.txt"
#define BLANK '-'
#define NOLL '#'

int blanks_left = 0;

int cInLetters(int c, char *letters, int repl) {
	char *r = strrchr(letters, c);
	if(r){
		*r = repl;
		return 1;
	}
	return 0;
}

// Can w be made from letters, and does w start with prefix and 
// end with suffix?
int word_matches(char* w, char* letters, char* prefix, char* suffix){
	int min = 0;
	int wlen = strlen(w) - 1; // accounting for \ns  in the file
	int llen = strlen(letters);
	int slen = 0, plen = 0; // suffix and prefix length

	char letts[100]; //make a local copy of letters so I can edit it
	strncpy(letts, letters, 100);

	if(prefix) {
		plen = strlen(prefix);
		for(int n = 0; n < plen; n++) {
			if(prefix[n] != w[n]) return 0;
		}
		min = plen; // prefix matches, now ignore that part of the word
	}

	if(suffix) {
		slen = strlen(suffix);
		for(int n = slen-1, j = wlen-1; n >= 0; n--,j--) {
			if(suffix[n] != w[j]) return 0;
		}
		wlen -= slen; // suffix matches, ignore end of word now
	}

	for(int i = min ;i < wlen; i++){
		if( w[i] != '\n' && !cInLetters(w[i], letts, NOLL)) {
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

int solve( char* letters, char* prefix, char* suffix ) {
	FILE *fp;
	char buffer[255];

	fp = fopen(DICT, "r");

	// setup for blanks
	int num_blanks = 0;
	for(int i = 0; i < strlen(letters); i++) {
		if(letters[i] == BLANK) {
			num_blanks++;
			letters[i] = NOLL;
		}
	}

	int words_found = 0;
	int length = strlen(prefix) + 
							 strlen(suffix) + 
							 strlen(letters) +
							 num_blanks;

	while(fgets(buffer, 255, (FILE*) fp)) {
		if(strlen(buffer) > length) {
			return 0;
		}

		blanks_left = num_blanks;

		// trim newlines
		//cInLetters('\n', buffer, '\0');

		if(word_matches(buffer, letters, prefix, suffix)) {
			words_found++;
			printf("%s", buffer);
		}
	}

	printf("%d words found\n", words_found);

	fclose(fp);
	return 0;
}


int main(int argc, char** argv){
	if(argc < 2) {
		printf("give me some letters\n");
		return 0;
	}
	else {
		char* prefix = "";
		char* suffix = "";

		if(argc > 2) prefix = argv[2];
		if(argc > 3) suffix = argv[3];

		solve(argv[1], prefix, suffix);
	}
}
