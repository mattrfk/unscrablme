#include <stdio.h>
#include <string.h>

//#define DICT "TEST.txt"
#define DICT "SOWPODS.txt"

int cInLetters(int c, char *letters) {
	char *r = strrchr(letters, c);
	if(r){
		*r = '-';
		return 1;
	}
	return 0;
}

int word_matches(char* w, char* letters, char* prefix, char* suffix){
	int min = 0;
	int wlen = strlen(w);
	int llen = strlen(letters);
	char letts[100]; // biggest word in sowpods is 15 characters...

	strncpy(letts, letters, 100);

	//printf("prefix: %s\n", prefix);

	if(prefix) {
		int plen = strlen(prefix);
		for(int n = 0; n < plen; n++) {
			if(prefix[n] != w[n]) return 0;
		}
		min = plen; // prefix matches, now ignore that part of the word
	}

	if(suffix) {
		int slen = strlen(suffix);
		for(int n = slen-1, j = wlen-1; n > 0; n--,j--) {
			//printf("n: %d, j: %d", n, j);
			if(suffix[n] != w[j]) return 0;
		}
		wlen -= slen; // suffix matches, ignore end of word now
	}

	for(int i = min ;i < wlen; i++){
		//printf("letts: %s\n", letts);
		if( i > llen ) return 0; // word longer than letters?
		if( w[i] != '\n' && !cInLetters(w[i], letts )) {
			return 0;
		}
	}

	return 1;
}

char *solve( char* letters, char* prefix, char* suffix ) {
	FILE *fp;
	char buffer[255];

	fp = fopen(DICT, "r");

	int words_found = 0;
	//TODO: calculate lengths and exit early
	while(fgets(buffer, 255, (FILE*) fp)) {
			if(word_matches(buffer, letters, prefix, suffix)) {
				words_found++;
				printf("%s", buffer);
			}
	}

	printf("%d words found\n", words_found);

	fclose(fp);
	return "one";
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
		if(argc > 3) prefix = argv[3];

		printf("solving for '%s'...\n", argv[1]);
		solve(argv[1], prefix, suffix);
	}
}
