//!!BF  Nested loops won't work the way I thought they would
// If emulating a normal nested loop, will have to remember to set the counter value for the inner loop inside the outer loop

// I should probably try to rewrite this from scratch in a more JS-ideomatic style
// I'm pretty much emulating c-style, which probably doesn't have a great advantage here.

function BF(program) {
    program = program.split("")
    // CAN'T split and push in one chain, as push returns the new length of the array!! 
    // Took me hours to figure out what was going wrong!

    // Add 0 as EOF marker
    program.push(0);

    // set number of available data cells (typically 30,000) and initialise to 0 
    // TODO - figure out if more efficient to have some kind of memory mapping than one large array
    let data = Array(5).fill(0);

    // Instruction Pointer, Data Pointer, Bracket Stack, swap ReGister
    let IP = 0;
    let DP = 0;

    let BS = [];
    let RG = 0;

    let cycles = -1;
    while(program[IP]) {
        cycles++;
        console.log(cycles, data, IP, program[IP], DP);
        //TODO protect against moving pointers beyond 0 or end
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
                    // !!replace with anonymous function?
                    // Will jump to matching bracket, then the end-of-loop IP increment will move to following instruction.
                    IP = findMatchingBracket(program, IP);
                }
                break;
            case ']':
                // !!TODO - still not sure if ] needs to check DP, or always just jumps back to matching [
                // Seem to be different interpretations of the rules.
                // IF ] also checks DP, it's essentially allowing a BREAK from the DO-WHILE loop.
                if(data[DP] > 0) {
                    // as IP is advanced at the end of each loop, unless set IP - 1 here, the actual [ loop instruction jumped back to will be skipped
                    IP = BS.pop() - 1;

                    // Below wouldn't work, as BF has WHILE-DO loops, not DO-WHILE
                    // If the other way around, could have just used a single stack to track bracket addresses, I think. 
                    // !!TODO - try to figure out if BF remains turing-complete if had DO-WHILE 
                    /* Want to pop out [-address and push -] address 
                    RG = IP;                
                    IP = BS.pop() - 1;
                    BS.push(RG);
                    */
                }
                break;
            default:
                return "summatwong at cycle " + cycles + "'" + program[IP] + "'";
                break;
        }
        IP++;
    }
    return data;
}

/*!TODO - merge findMatchingBracket with bracketChecker
        - can probably now use it at run-time rather than pre-validating program
        - probably want both options, pre-validation for when writing compiler/programming tools.
        - at the moment, findMatchingBracket relies on a valid program
        
        > actually, could also build up a bracket-map during pre-validation to potentially increase performance
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



let proggy = "+++[->++[->+<]<]";
let result = bracketChecker(proggy) ? BF(proggy) :  "nup";

console.log(result);