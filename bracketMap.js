// bracketMap.js

// When thinking about how to improve the performance of the BF interpreter, I wondered if pre-generating a bracket map would help.
// This function will scan a supplied BF program and return a dictionary object which associates each bracket with its matching pair
// The key-value pairs will be the position index of the brackets within the array containing the program.

// !TODO - insert this into the main program once working.
let program = "+++[->++[->+<]<]";

if(bracketChecker(program)) {
    console.log(bracketMapper(program));
} else {
    return false;
}

function bracketMapper(program) {
    let map = {};
    let IP = 0;
    let BS = [];
    
    while(IP < program.length) {
        switch(program[IP]) {
            case '[':
                BS.push(IP);
                break;
            case ']':
                openBracket = BS.pop();
                map[openBracket] = IP;
                map[IP] = openBracket;
                break;
            case 0:             // ie - have reached EOF, need to terminate !TODO - see above comments
            return map;
                break;
            default:
                break;
        }
        IP++;
    }

    return map;
}

function bracketChecker(brackets) {
    // make an array of each bracket in order
    brackets = brackets.replace(/[^\[\]]/g, '').split("");

    // keeps track of each new open bracket
    let lBracks = 0;
    for(let i = 0; i < brackets.length; i++) {
        
        // decrement when find a matching closing bracket
        brackets[i]=='[' ? lBracks++: lBracks--;
        
        // more closing brackets than opening brackets is a syntax error
        if(lBracks < 0) {
            return false;
        }
    }

    // any remaining unclosed brackets by end of program is a syntax error
    return lBracks !== 0 ? false : true;
}

function mod(x, y) {
    let r = x % y;
    return r < 0 ? y + r : r; 
}


console.log(mod(27, 26));
