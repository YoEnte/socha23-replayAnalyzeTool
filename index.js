const path = require('path');
const fs = require('fs');
const xmlReader = require('xml-reader');
const xmlQuery = require('xml-query');

const directoryPath = path.join(__dirname, 'replays');

fs.readdir(directoryPath, (err, files) => {

    // handle errors
    if (err) {
        return console.log('dir scan abort:', err);
    }

    //console.log(`found ${files.length} files:`)

    var data = {
        ONE: {
            winCodes: [],
            fishPerGame: [],
            causes: [],
            reasons: [],
        },
        TWO: {
            winCodes: [],
            fishPerGame: [],
            causes: [],
            reasons: [],
        },
        GEN: {
            matches: files.length,
            moves: [],
        }
    };

    // loop through all files
    files.forEach((file, f) => {

        // xml stuff (https://www.npmjs.com/package/xml-query)
        const xml = fs.readFileSync(path.join(directoryPath, file)).toString();
        const ast = xmlReader.parseSync(xml);
        const xq = xmlQuery(ast);
        
        // get all moves for moveCount
        var moves = xq.find('lastMove').ast; // check
        data.GEN.moves.push(moves.length);

        // player and score tags
        var players = xq.find('player').ast;
        var scores = xq.find('score').ast;
        
        // loop tru both player tags, get team str
        players.forEach((player, i) => {
            var team = player.attributes.team;

            // parts of player's score
            var parts = scores[i].children;

            // save part data
            parts.forEach((part, j) => {
                if (j == 0) {   // win exit code
                    data[team].winCodes.push(parseInt(part.children[0].value));
                } else if (j == 1) {    // fish
                    data[team].fishPerGame.push(parseInt(part.children[0].value));
                }
            });
            
            // add causes and reasons
            data[team].causes.push(scores[i].attributes.cause);
            data[team].reasons.push(scores[i].attributes.reason);
        });

        // log each game:
        console.log(`GAME ${f + 1}: ${file}`);
        console.log(`GENERAL: moves: ${data.GEN.moves[f]}`);
        console.log(`TEAM ONE: win code: ${data.ONE.winCodes[f]}, fish: ${data.ONE.fishPerGame[f]}, exits: ${data.ONE.causes[f]}, reasons: ${data.ONE.reasons[f]}`);
        console.log(`TEAM TWO: win code: ${data.TWO.winCodes[f]}, fish: ${data.TWO.fishPerGame[f]}, exits: ${data.TWO.causes[f]}, reasons: ${data.TWO.reasons[f]}`);
        console.log("");
    });

    // calc totals for overview
    data.ONE.totalWinCodes = data.ONE.winCodes.reduce((accumulator, value) => {return {...accumulator, [value]: (accumulator[value] || 0) + 1}}, {});
    data.ONE.totalFish = data.ONE.fishPerGame.reduce((a, b) => a + b, 0);
    data.ONE.totalCauses = data.ONE.causes.reduce((accumulator, value) => {return {...accumulator, [value]: (accumulator[value] || 0) + 1}}, {});
    data.ONE.totalReasons = data.ONE.reasons.reduce((accumulator, value) => {return {...accumulator, [value]: (accumulator[value] || 0) + 1}}, {});

    data.TWO.totalWinCodes = data.TWO.winCodes.reduce((accumulator, value) => {return {...accumulator, [value]: (accumulator[value] || 0) + 1}}, {});
    data.TWO.totalFish = data.TWO.fishPerGame.reduce((a, b) => a + b, 0);
    data.TWO.totalCauses = data.TWO.causes.reduce((accumulator, value) => {return {...accumulator, [value]: (accumulator[value] || 0) + 1}}, {});
    data.TWO.totalReasons = data.TWO.reasons.reduce((accumulator, value) => {return {...accumulator, [value]: (accumulator[value] || 0) + 1}}, {});

    data.GEN.totalMoves = data.GEN.moves.reduce((a, b) => a + b, 0);
    data.GEN.totalMatchFish = data.ONE.totalFish + data.TWO.totalFish;

    // log overview
    console.log('\n/////////////   OVERVIEW   /////////////\n');

    console.log(`played matches: ${data.GEN.matches}`);
    console.log(`total moves: ${data.GEN.totalMoves} || average moves per match: ${data.GEN.totalMoves / data.GEN.matches}`);
    console.log(`total match fish: ${data.GEN.totalMatchFish}`);

    console.log('\nTEAM ONE:');
    Object.keys(data.ONE.totalWinCodes).forEach((code, i) => {console.log(`win code '${code}' (${(code == '2') ? "win" : (code == '1') ? "tie" : "lost"}): ${data.ONE.totalWinCodes[code]} => ${data.ONE.totalWinCodes[code] / data.GEN.matches * 100}%`)});
    console.log(`total fish: ${data.ONE.totalFish} || average fish per match: ${data.ONE.totalFish / data.GEN.matches} => ${data.ONE.totalFish / data.GEN.totalMatchFish * 100}%`);
    Object.keys(data.ONE.totalCauses).forEach((cause, i) => {console.log(`cause for exit '${cause}': ${data.ONE.totalCauses[cause]} => ${data.ONE.totalCauses[cause] / data.GEN.matches * 100}%`)});
    Object.keys(data.ONE.totalReasons).forEach((reason, i) => {console.log(`reason for exit '${reason}': ${data.ONE.totalReasons[reason]} => ${data.ONE.totalReasons[reason] / data.GEN.matches * 100}%`)});

    console.log('\nTEAM TWO:');
    Object.keys(data.TWO.totalWinCodes).forEach((code, i) => {console.log(`win code '${code}' (${(code == '2') ? "win" : (code == '1') ? "tie" : "lost"}): ${data.TWO.totalWinCodes[code]} => ${data.TWO.totalWinCodes[code] / data.GEN.matches * 100}%`)});
    console.log(`total fish: ${data.TWO.totalFish} || average fish per match: ${data.TWO.totalFish / data.GEN.matches} => ${data.TWO.totalFish / data.GEN.totalMatchFish * 100}%`);
    Object.keys(data.TWO.totalCauses).forEach((cause, i) => {console.log(`cause for exit '${cause}': ${data.TWO.totalCauses[cause]} => ${data.TWO.totalCauses[cause] / data.GEN.matches * 100}%`)});
    Object.keys(data.TWO.totalReasons).forEach((reason, i) => {console.log(`reason for exit '${reason}': ${data.TWO.totalReasons[reason]} => ${data.TWO.totalReasons[reason] / data.GEN.matches * 100}%`)});
});