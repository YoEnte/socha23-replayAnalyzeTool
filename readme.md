this is a replay analyse tool for the german software challenge 23

npm install xml-reader

npm install xml-query

put replays.xml in a folder or leave them in the socha replays folder

set 'directoryPath' to the absolute path of the folder with the replays

set 'logEveryMatch' (bool) if every match should be summarized and logged

run node index.js

if you want to export to external file run: 'node index.js > outputFile.xyz'

hope there are no bugs (didn't test it that much) and every important feature is there

ps: the code has basically no error handling, therefore it cannot handle courrupted files or format errors
