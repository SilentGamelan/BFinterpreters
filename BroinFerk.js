//!! Nested loops won't work the way I thought they would
// If emulating a normal nested loop, will have to remember to set the counter value for the inner loop inside the outer loop



function BF(program) {
    program = program.split("")
    // CAN'T split and push in one chain, as push returns the new length of the array!! 
    // Took me hours to figure out what was going wrong!
    program.push(0);

    // set number of available data cells
    let data = Array(5).fill(0);

    let IP = 0;
    let DP = 0;

    let BS = [];

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
                    data[DP]--;
                }
                break;
            case ']':
                if(BS.length > 0) {
                    // as IP is advanced at the end of each loop, unless set IP - 1 here, the actual loop jumped back to will be skipped
                    IP = BS.pop() - 1;
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

let proggy = "+++[>++[>+<]<]";
console.log(BF(proggy));
