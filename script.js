var arr = [[], [], [], [], [], [], [], [], []]; //this should be displayed in the web
var filled = [[], [], [], [], [], [], [], [], []]; //this should be used as a visited or filled array

//connecting HTML divs of cells to the arr by using ids
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

//setting all values of filled as false
function initializeTemp(filled) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            filled[i][j] = false;
        }
    }
}

//marking those cells of 'filled' true in which 'boards' have the value
function setTemp(board, filled) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                filled[i][j] = true;
            }
        }
    }
}

//after copying from board, filling all those boxes with red
function setColor(filled) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (filled[i][j] == true) {
                arr[i][j].style.color = "#DC3545"; //this is red
            }
        }
    }
}

// colouring all cells of arr as green initially
function resetColor() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

//this board will save the ans temporarily and we receive from API here
var board = [[], [], [], [], [], [], [], [], []];

// creating aliases for the button names(DOM content)
let button = document.getElementById('generate-sudoku');
let solve = document.getElementById('solve');

//console.log(arr);

//copying the board back to arr
function changeBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            }
            else
                arr[i][j].innerText = '';
        }
    }
}

//starts from here 
// when we click button function will be called
button.onclick = function () {
    var xhrRequest = new XMLHttpRequest(); 
    //XMLHttpRequest() is a js method by which we can update the data in our page without reloading the whole page 
    // and we use the function using the var XMLHttpRequest like class/object 
    
    method = 'GET';
    url = 'https://sugoku.herokuapp.com/board?difficulty=easy'; // creating an alias for the API link
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random

    //initialising the req to the server
    xhrRequest.open(method, url);// using .open we send a request to the server
    
    
    xhrRequest.onload = function () {
        //on loading, we get a data response in JSON(file format like .pdf) format; 
        //we parse it to readable js format and store it in a variable
        var response = JSON.parse(xhrRequest.response)
        console.log(response);

        //marking all the cells of filled as false, it'll work like a visited array
        //filled[i][j] == true means arr[i][j] already contains the correct element
        initializeTemp(filled);

        //making all the box's inner html text color as green
        resetColor();

        //we got a unsolved sudoku board via the API call
        //assinging it to our board variable to solve
        board = response.board;

        //setting all the occupied cells as true or visited in filled
        setTemp(board, filled);

        //make the color style of those boxes as red
        setColor(filled);

        //update the table and displaying it in website
        changeBoard(board);
    }

    //now send the req to the web page of ours
    xhrRequest.send();
    //we fetched the data, updated the filled array and arr and displayed the unsolved arr on the webpage
}


//solution
function isPossible(board, sr, sc, val) {
    for (var row = 0; row < 9; row++) {
        if (board[row][sc] == val) {
            return false;
        }
    }

    for (var col = 0; col < 9; col++) {
        if (board[sr][col] == val) {
            return false;
        }
    }

    var smfri = Math.floor((sr / 3)) * 3; //sub-matrix first row index
    var smfci = Math.floor((sc / 3)) * 3; //sub_matrix first col index

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[smfri + i][smfci + j] == val) { 
                return false;
            }
        }
    }
    return true;

}

//main board filling logic - backtracking
function solveSudokuHelper(board, row, col) {
    if (row == 9) {
        changeBoard(board);
        return;
    }
    var nrow = 0, ncol = 0;
    if (col == 8) {
        nrow = row + 1;
        ncol = 0;
    }
    else {
        nrow = row;
        ncol = col + 1;
    }
    if (board[row][col] != 0) {
        solveSudokuHelper(board, nrow, ncol);
    }
    else {
        for (var po = 1; po <= 9; po++) {
            if (isPossible(board, row, col, po)) {
                board[row][col] = po;
                solveSudokuHelper(board, nrow, ncol);
                board[row][col] = 0;
            }
        }
    }
}

function solveSudoku(board) {
    solveSudokuHelper(board, 0, 0);
}

solve.onclick = function () {
    solveSudoku(board);
}