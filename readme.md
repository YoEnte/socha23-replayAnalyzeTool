this is a replay analyse tool for the german software challenge 23

how to use:
- npm install xml-reader + npm install xml-query

- have replays.xml in a folder
- set 'directoryPath' to the absolute path of the folder with the replays

- set 'logEveryMatch' (bool) if every match should be logged
- set 'logProgress' (bool) if progress bar should be logged
- set 'logProgressNumber' (int) for how many matches should be summarized for progress bar update
- set 'logProgressClear' (bool) if the console should be cleared (only if progress bar is active)

- run node index.js

if you want to export to another file run: 'node index.js > outputFile.xyz' (logProgressClear does not work here)

hope there are no bugs (didn't test it that much) and every important feature is there

ps: the code has basically no error handling, therefore it cannot handle courrupted files or format errors