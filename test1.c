#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <regex.h>
#include <sys/types.h>

struct Result{
int i;
char** str;
};

int IsValid(char *filename ){
	char *regex = "\\.txt$";
	regex_t regCMP;
	if(regcomp(&regCMP, regex, REG_EXTENDED)){
		return 0;
	}
	if(regexec(&regCMP, filename, 0, NULL, 0)){
		regfree(&regCMP);
		return 0;
	}
	else{
		regfree(&regCMP);
		return 1;
	}
}

int SearchMtr(char *HeadDr,char *fname,struct Result *result){
	char NextDr[70];
	int length;
	DIR *dir = opendir(HeadDr);
	strcpy(NextDr,HeadDr);
	if(!dir){
		return 0;
	}
	struct dirent *Dr = readdir(dir);
	while(Dr){
		if(Dr->d_type == DT_DIR && strcmp(Dr->d_name, ".")!=0 && strcmp(Dr->d_name, "..")!=0){
			length = strlen(NextDr);
			strcat(NextDr,"/");
			strcat(NextDr,Dr->d_name);
		//	printf("%s\n",NextDr);
			if(SearchMtr(NextDr ,fname, result)){
				closedir(dir);
				return 1;
			}
			NextDr[length]='\0';
		}
		if(Dr->d_type == DT_REG && IsValid(Dr->d_name)){
			length=strlen(NextDr);
			strcat(NextDr,"/");
			strcat(NextDr, Dr->d_name);
		//	NextDr[strlen(NextDr)]='\0';
		//	printf("%s\n",NextDr);
			if(strcmp(Dr->d_name,fname) == 0){
				//printf("||%s\n",NextDr);
				//printf("|%s\n",Dr->d_name);
				FILE *f = fopen( NextDr,"r");
				if(!f){
					//printf("|\n");
					return 0;
				}
				char arr[100];
				while(fgets(arr, 100, f)){
					if(arr[strlen(arr)-1] == '\n'){
						arr[strlen(arr)-1] = '\0';
					//	printf("1\n");
					}
					//printf("%s\n",arr);	
					if(strstr(arr, "Minotaur")){
						result->i++;
						char *res=(char*)calloc(strlen(NextDr),sizeof(char));
					//	printf("%s\n",NextDr);
						strcpy(res, NextDr);
					//	printf("%s\n",res);
						result->str[result->i-1]=res;
					//	free(res);
						return 1;
					}
					//printf("%s\n",arr);
					if(strcmp(arr,"Deadlock")==0){
					//	printf("2\n");
						continue;
					}
					//printf("%s\n",arr);
					char *tocmp="@include ";
					if(strstr(arr, tocmp)){
					//	printf("4\n");
						if(SearchMtr("./labyrinth",arr+strlen(tocmp),result)){
							//printf("3\n");
							char *rst = (char*)calloc(strlen(NextDr),sizeof(char));
							strcpy(rst, NextDr);
							printf("%s\n",rst);
							printf("%s\n",NextDr);
							result->i++;
							result->str[result->i-1] = rst;
							//free(rst);
							fclose(f);
							closedir(dir);
							return 1;
						}
					}
				}
			}
			NextDr[length] = '\0';
		}
		Dr=readdir(dir);
	}
	closedir(dir);
	return 0;
}

int main(){
	struct Result result;
	result.i=0;
	result.str=(char**)calloc(20,sizeof(char*));
	SearchMtr("./labyrinth", "file.txt", &result);
	int j=result.i-1;
	//printf("%d\n",j);
	FILE *res = fopen("result.txt","wa");
	for(j;j>=0;j--){
		printf("%s",result.str[j]);
		fprintf(res, "%s\n",result.str[j]);
		free(result.str[j]);
	}
	fclose(res);
	free(result.str);
	return  0;
}
