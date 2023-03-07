const fs = require("fs");
const clr = require('clr-js');

const s = ["┏","━","┳","┓","┃","┣","╋","┫","┗","┻","┛"]

const init_grid_text = fs.readFileSync("grid99.txt").toString()
let init_grid = []
init_grid_text.split("\n").forEach(element => {
    l = []
    element.split("").forEach(lett => {
        if (lett == " ") {
            l.push([0,[]])
            return
        }
        l.push([Number(lett),[]])
    })
    init_grid.push(l)
})

const pre_disp = (l,s,long) => {
    let res = []
    l.slice(s,s+long).forEach(element => {
        if (element[0] == 0){
            res.push(" ")
            return
        }
        if (element[1].length == 0) res.push(clr.bold(element[0].toString()).it())
        else res.push(clr.blue(element[0].toString()).it())
    });
    return res.join(" ")
}

const display_sudoku = (grid) => {
    
    r=s[0]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[2]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[2]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[3]+"\n"
    for (let block_l = 0; block_l < 3; block_l++) {
        for (let in_block = 0; in_block < 3; in_block++) {
            r+=s[4]
            for (let in_block_col = 0; in_block_col < 3; in_block_col++) {
                r += " "+ pre_disp(grid[block_l*3+in_block],in_block_col*3,3)+" "+s[4]
            }
            r+="\n"
        }
        r +=  block_l == 2 ? s[8]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[9]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[9]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[10]+"\n" : s[5]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[6]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[6]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[1]+s[7]+"\n"
    }

    console.log(r)
}

const all_lines_and_cols = (grid,x,y,r) => {
    for (let i = 0; i < grid.length; i++) {
        const element = grid[i][x][0];
        if (element != 0) {
            r[element-1] = 0
        }
    }
    for (let j = 0; j < grid[y].length; j++) {
        const element = grid[y][j][0];
        if (element != 0) {
            r[element-1] = 0
        }
    }
    return r
}

const this_square = (grid,x,y,r) => {
    const square_col  = Math.floor(x/3)
    const square_line = Math.floor(y/3)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const element = grid[square_line*3+i][square_col*3+j][0];
            if (element != 0) {
                r[element-1] = 0
            }
        }
    }
    return r
}

const con = (grid,x,y) => {
    return this_square(grid,x,y,all_lines_and_cols(grid,x,y,[1,1,1,1,1,1,1,1,1]))
}

const pen_start = (grid) => {
    for (let line_n = 0; line_n < grid.length; line_n++) {
        const line = grid[line_n];
        // console.log("y",line_n,line.length)
        for (let col_n = 0; col_n < grid[line_n].length; col_n++) {
            // console.log(line_n,col_n)
            const element = grid[line_n][col_n];
            if (element[0] != 0) continue
            let to_remove = con(grid,col_n,line_n)
            grid[line_n][col_n][1] = to_remove
        }
    }
}



const fill_when_one = (grid) => {
    let n = 0
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const element = grid[y][x];
            if (element[0] == 0){
                const sum = element[1].reduce((partialSum, a) => partialSum + a, 0);
                if (sum == 1){
                    console.log(sum,element[1].join(", "),x,y)
                    let v = element[1].findIndex(e => e == 1)+1
                    grid[y][x][0] = v
                    enleve_poss(grid,x,y,v)
                    n++
                }
            }
        }
    }
    return n != 0
}

const enleve_poss = (grid,x,y,v) => {
    for (let i = 0; i < grid.length; i++) {
        const element = grid[i][x][0];
        if (element == 0) {
            grid[i][x][1][v-1] = 0
        }
    }
    for (let j = 0; j < grid[y].length; j++) {
        const element = grid[y][j][0];
        if (element == 0) {
            grid[y][j][1][v-1] = 0
        }
    }
    const square_col  = Math.floor(x/3)
    const square_line = Math.floor(y/3)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const element = grid[square_line*3+i][square_col*3+j][0];
            if (element == 0) {
                grid[square_line*3+i][square_col*3+j][1][v-1] = 0
            }
        }
    }
    return r

}

const combine = (l1,l2) => {
    r = [0,0,0,0,0,0,0,0,0]
    for (let i = 0; i < 9; i++) {
        if (l1[i] == -1 || l2[i] == -1) {r[i] == -1; continue}
        r[i] = l1[i] + l2[i]
    }
    return r
}


const seule_de_care = (grid) => {
    let n = 0
    for (let square_col = 0; square_col < 3; square_col++) {
        for (let square_line = 0; square_line < 3; square_line++) {
        
            l = [0,0,0,0,0,0,0,0,0]
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const element = grid[square_line*3+i][square_col*3+j];
                    if (element[0] == 0) {
                        l = combine(l,element[1])
                    }else{
                        l[element[0]-1] = -1
                    }
                }
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let xx = square_line*3+i
                    let yy = square_col*3+j
                    const element = grid[xx][yy];
                    if (element[0] == 0) {
                        element[1].forEach((e,k) => {
                            if(e == 1 && l[k] == 1){
                                console.log("x:",xx, "y:",yy, "k+1:",k+1)
                                grid[xx][yy][0] = k+1
                                enleve_poss(grid,yy,xx,k+1)
                                n++
                            }
                        })
                    }
                }
            }
        }
    }
    return n!=0
}


display_sudoku(init_grid)
pen_start(init_grid)
let i = 0
while (fill_when_one(init_grid)) {
    i++
    console.log("i:",i)
    display_sudoku(init_grid)
}
let n = 0
let c = 1
while (c > 0) {
    c = 0
    n++
    console.log("n:",n)
    c =  seule_de_care(init_grid)
    c += fill_when_one(init_grid)
    display_sudoku(init_grid)
}