This project performs data filtering on a large data.

TO run the project open command prompt and type the following commands :-

1. If you want to read the complete file then type
   /////////////////////////////////////
   node sample.js listAll
   /////////////////////////////////////  
    the above command will read the complete main.csv file and print it on the cmd.

2. if you want to filter data according to a particular country and you want to find the two lowest price for each group of SKU then type the below command :-
   /////////////////////////////////////
   node sample.js filter --country="country name"

   for eg:- node sample.js filter --country="USA"
   /////////////////////////////////////
