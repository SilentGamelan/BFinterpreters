// broinFerk.js - a simple javascript BrainF**k interpreter 

/**
 *  Originally began as an attempt to emulate a turing machine from scratch, without following a tutorial.
 *  I was inspired to try after becoming bored with my other practice projects and stumbling across my old copy of Godel, Escher and Bach by Hofstader.
 * 
 *  While looking up a concise definition of a turing machine I happened upon a description of the language P′′ created by Corrado Böhm, which in turn led me
 *  a description of the brainf**k language (which is considered a variation of P′′)
 * 
 *  I'm aware that there are much shorter, faster, and smarter implementations, but this is mine.
 */



function BF(program, memSize = 13000, memWrap = true, valueWrap = true, bracketMap = true, input="Hello World.", VALMAX=255) {
    
    // CAN'T split and push in one chain, as push returns the new length of the array!! 
    // Took me hours to figure out what was going wrong!
    program = program.split("")

    // TODO: move this to bracket checking function? Am I trying to proactively handle invalid programs?
    // Add 0 as EOF marker
    program.push(0);

    // set number of available data cells (typically 30,000) and initialise to 0 
    // TODO - figure out if more efficient to have some kind of memory mapping than one large array
    let data = Array(memSize).fill(0);

    // Instruction Pointer, Data Pointer, Bracket Stack
    let IP = 0;
    let DP = 0;
    let BS = [];

    // input/output streams
    // for the moment, just simulate with arrays - input is currently an optional parameter
    // FIXME: add external file handling, needs to detect if user is passing array or a filename. Also, need to handle the optional parameters correctly
    let output = [];

    let cycles = -1;
    // currently will only stop on falsy values, have taken 0 to be EOF marker
    while(program[IP]) {
        cycles++;
        console.log(cycles, data, IP, program[IP], DP);
        // TODO: protect against moving pointers beyond 0 or end
        // TODO: add input/output operators , . 
        switch (program[IP]) {
            case '+':
                data[DP]++;
                break;
            case '-':
                data[DP]--;
                break;
            case '>':
                DP++;
                break;
            case '<':
                DP--;
                break;
            case '[':
                if(data[DP] > 0) {
                    BS.push(IP);
                } else {
                    // FIXME: decide if using brackMap flag, if so then need to bind appropriate function to findMatchingBracket variable above
                    // Will jump to matching bracket, then the end-of-loop IP increment will move to following instruction.
                    IP = findMatchingBracket(program, IP);
                }
                break;
            case ']':
                // As ] also checks DP, it's essentially allowing a BREAK from the DO-WHILE loop.
                if(data[DP] > 0) {
                    // as IP is advanced at the end of each loop, unless set IP - 1 here, the actual [ loop instruction jumped back to will be skipped
                    IP = BS.pop() - 1;
                } else {
                    // dump expired opening bracket
                    BS.pop();
                }

                    // Below wouldn't work, as BF has WHILE-DO loops, not DO-WHILE
                    // If the other way around, could have just used a single stack to track bracket addresses, I think. 
                    // TODO - try to figure out if BF remains turing-complete if had DO-WHILE 
                    /* Want to pop out [-address and push -] address using swap register
                    RG = IP;                
                    IP = BS.pop() - 1;
                    BS.push(RG);
                    */
                break;
            default:
                return "summatwong at cycle " + cycles + "'" + program[IP] + "'";
                break;
        }

        // TODO: Adding in optional buffer/value over/underflow protection
        // FIXME: make a decision on what I'm actually aiming for here
        /** Am I trying to make a minimal, highspeed interpreter or a complete one?
         * 
         * Think it would be better to write two versions really
         * Following this decision, should this be shunted off to a separate function?
         * How do I decide when globals are BAD, and when are function calls with parameters really necessary with JS?
         */
        if(memWrap) { 
            if(DP > memSize) {
                DP = 0
            } else if (DP < 0) {
                DP = memSize;
            }
        }

        if(valueWrap) {
            if(data[DP] < 0) {
                data[DP] =  VALMAX;
            } else if(data[DP] > VALMAX) {
                data[DP] = 0;
            }
        }
        IP++;
    }
    return data;
}

/**
 * TODO:
 *       - merge findMatchingBracket with bracketChecker
 *       - can probably now use it at run-time rather than pre-validating program
 *       - probably want both options, pre-validation for when writing compiler/programming tools.
 *       - at the moment, findMatchingBracket relies on a valid program
 *       
 *       > actually, could also build up a bracket-map during pre-validation to potentially increase performance
*/
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
  
function findMatchingBracket(program, IP) {
    let openB = 1;
    
    while(openB > 0) {
        IP++;
        switch(program[IP]) {
            case '[':
                openB++;
                break;
            case ']':
                openB--;
                break;
            case 0:             // ie - have reached EOF, need to terminate !TODO - see above comments
                break;
            default:
                break;
        }
    }

    return IP;
}

// required for value-wrap around, as JS % operator does not behave as expected for negative values
function mod(x, y) {
    let r = x % y;
    return r < 0 ? y + r : r; 
}

let proggy = "+++[->++[->+<]<]";
let result = bracketChecker(proggy) ? BF(proggy, 2000) :  "nup";

console.log(result);