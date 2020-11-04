//przypisanie kontenera do zmiennej
var tablutDiv = document.querySelector('#tablutwindow');
//stworzenie głównej sceny
var stage = new Kinetic.Stage({
	container : tablutDiv,
	width : 450,
	height : 450,
});
var stageWidth = stage.attrs.width;
var stageHeight = stage.attrs.height;
//stałe
var EMPTY = 0;
var WHITE = 1;
var BLACK = 2;
var KING = 3;
var BOARD_SIZE = 9;
var SQUARE_SIZE = 50;
//warstwy
var boardLayer = new Kinetic.Layer();
var piecesLayer = new Kinetic.Layer();
var draggingLayer = new Kinetic.Layer();
//zmienne z obrazami
var boardImage = new Image();
boardImage.src = 'Images/Tablut.png';
var boardObj = new Kinetic.Image({
	x:0,
	y:0,
	height:450,
	width:450,
	image:boardImage
});

boardLayer.add(boardObj);

var blackImage = new Image();
blackImage.src = 'Images/Black.png';
var kingImage = new Image();
kingImage.src = 'Images/King.png';
var whiteImage = new Image();
whiteImage.src = 'Images/White.png';

var whiteList = new Array();
var blackList = new Array();

//tabela do planszy
var board = new Array(BOARD_SIZE);
for (var i = 0; i < BOARD_SIZE; i++){
	board[i] = new Array(BOARD_SIZE);
}
//startowe rozłozenie pionków
var boardInput="000222000000020000000010000200010002221131122200010002000010000000020000000222000";
boardInput.split();
var stringCounter = 0;
for (var row = 0; row < BOARD_SIZE; row++){
		for(var col = 0; col < BOARD_SIZE; col++){
		board[row][col] = parseInt(boardInput[stringCounter]);

		stringCounter++;
	}
}
//ustawienie pionków na planszy
for (var nextRow = 0; nextRow < BOARD_SIZE; nextRow++){
	for(var nextCol = 0; nextCol < BOARD_SIZE; nextCol++){
		if (board[nextRow][nextCol] == WHITE){
			whiteList.push(new Kinetic.Image({
				x:SQUARE_SIZE * (nextCol),
				y:SQUARE_SIZE * (nextRow),
				width:SQUARE_SIZE,
				height:SQUARE_SIZE,
				row:nextRow,
				col:nextCol,
				onBoard:true,
				colour:WHITE,
				image:whiteImage,
				draggable:true
			}));
			piecesLayer.add(whiteList[whiteList.length - 1]);
		}
		else if (board[nextRow][nextCol] == BLACK){
			blackList.push(new Kinetic.Image({
				x:SQUARE_SIZE * (nextCol),
				y:SQUARE_SIZE * (nextRow),
				width:SQUARE_SIZE,
				height:SQUARE_SIZE,
				row:nextRow,
				col:nextCol,
				onBoard:true,
				colour:BLACK,
				image:blackImage,
				draggable:false
			}));
			piecesLayer.add(blackList[blackList.length - 1]);
		}
	}
}
var king = new Kinetic.Image({
	x:SQUARE_SIZE * (5 - 1),
	y:SQUARE_SIZE * (5 - 1),
	width:SQUARE_SIZE,
	height:SQUARE_SIZE,
	row:4,
	col:4,
	onBoard:true,
	colour:KING,
	image:kingImage,
	draggable:true
});
piecesLayer.add(king);

//zmienna potrzebna do śledzenia tury
var playerTurn = 1; //1-tura białego  2-tura czarnego

//funkcja zmiany tury
function SwitchTurn(){
	if (playerTurn == 1){
		playerTurn = 2;
		for (var i = 0; i < whiteList.length; i++){
			whiteList[i].setAttr('draggable',false);
		}
		king.setAttr('draggable',false);
		for (var k = 0; k < blackList.length; k++){
			blackList[k].setAttr('draggable',true);
		}
		document.getElementById("turnBackground").innerHTML = "Tura czarnego"
		document.getElementById("turnBackground").style.color = "black"
	}else if (playerTurn == 2){
		playerTurn = 1;
		for (var i = 0; i < whiteList.length; i++){
			whiteList[i].setAttr('draggable',true);
		}
		king.setAttr('draggable',true);
		for (var k = 0; k< blackList.length; k++){
			blackList[k].setAttr('draggable',false);
		}
		document.getElementById("turnBackground").innerHTML = "Tura białego"
		document.getElementById("turnBackground").style.color = "white"
	}
}

//funkcja ograniczajaca ruchy
function ValidMove(piece,moveRow,moveCol){
	var row = piece.getAttr('row');
	var col = piece.getAttr('col');
	var type = piece.getAttr('colour');
	if(!(moveRow==4 && moveCol==4)){
		if ((moveRow == row && moveCol == col)
					|| (moveRow == BOARD_SIZE / 2 + 1
							&& moveCol == BOARD_SIZE / 2 + 1 && type != KING)
					|| board[moveRow][moveCol] == WHITE
					|| board[moveRow][moveCol] == BLACK) {
				return false;
			} else if (moveRow == row) {
				if (moveCol > col) {
					for (var nextCol = col + 1; nextCol < moveCol; nextCol++) {
						if (board[row][nextCol] != EMPTY) {
							return false;
						}
					}
				} else {
					for (var nextCol = col - 1; nextCol > moveCol; nextCol--) {
						if (board[row][nextCol] != EMPTY) {
							return false;
						}
					}
				}
				return true;
			} else if (moveCol == col) {
				if (moveRow > row) {
					for (var nextRow = row + 1; nextRow < moveRow; nextRow++) {
						if (board[nextRow][col] != EMPTY) {
							return false;
						}
					}
				} else {
					for (var nextRow = row - 1; nextRow > moveRow; nextRow--) {
						if (board[nextRow][col] != EMPTY) {
							return false;
						}
					}
				}

				return true;
			}

		return false;
	}
	return false;
}

//funckja do znajdowania pionka
function FindPiece (row,col){
	if (playerTurn == BLACK) {
			for (var nextPiece = 0; nextPiece < whiteList.length; nextPiece++) {
				if (whiteList[nextPiece].getAttr('row') == row
						&& whiteList[nextPiece].getAttr('col') == col){
					return nextPiece;
				}
			}
		} else {
			for (var nextPiece = 0; nextPiece < blackList.length; nextPiece++) {
				if (blackList[nextPiece].getAttr('row') == row
						&& blackList[nextPiece].getAttr('col') == col){
					return nextPiece;
				}
			}
		}

		return -1;
}

//funkcja pojmania piona
function CapturePiece(row,col,colourCaptured,colourCapturing,listCaputered){
	var index1 = -1;
	var index2 = -1;
	var index3 = -1;
	var index4 = -1;
	if(col>1 && row >1 && col<7 && row <7){
		if (board[row][col + 1] == colourCaptured && (board[row][col + 2] == colourCapturing )) {
			board[row][col + 1] = EMPTY;
			index1 = FindPiece(row, col + 1);
		} 
		if (board[row][col - 1] == colourCaptured && (board[row][col - 2] == colourCapturing )) {
			board[row][col - 1] = EMPTY;
			index2 = FindPiece(row, col - 1);
		} 
		if (board[row + 1][col] == colourCaptured && (board[row + 2][col] == colourCapturing )) {
			board[row + 1][col] = EMPTY;
			index3 = FindPiece(row + 1, col);
		} 
		if (board[row - 1][col] == colourCaptured && (board[row - 2][col] == colourCapturing )) {
			board[row - 1][col] = EMPTY;
			index4 = FindPiece(row - 1, col);
		}
	}

	if((row<=1 && col>1 && col<7) || (row>=7 && col>1 && col<7)) {
		if (board[row][col + 1] == colourCaptured && (board[row][col + 2] == colourCapturing )) {
			board[row][col + 1] = EMPTY;
			index1 = FindPiece(row, col + 1);
		} 
		if (board[row][col - 1] == colourCaptured && (board[row][col - 2] == colourCapturing )) {
			board[row][col - 1] = EMPTY;
			index2 = FindPiece(row, col - 1);
		} 
	}

	if(row<=1 && col>1 && col<7) {
		if (board[row + 1][col] == colourCaptured && (board[row + 2][col] == colourCapturing )) {
			board[row + 1][col] = EMPTY;
			index1 = FindPiece(row + 1, col);
		}
	}

	if(row>=7 && col>1 && col<7){
		if (board[row - 1][col] == colourCaptured && (board[row - 2][col] == colourCapturing )) {
			board[row - 1][col] = EMPTY;
			index1 = FindPiece(row - 1, col);
		}
	}
	
	if((col<=1 && row>1 && row<7) || (col>=7 && row>1 && row<7)) {
		if (board[row + 1][col] == colourCaptured && (board[row + 2][col] == colourCapturing )) {
			board[row + 1][col] = EMPTY;
			index1 = FindPiece(row + 1, col);
		} 
		if (board[row - 1][col] == colourCaptured && (board[row - 2][col] == colourCapturing )) {
			board[row - 1][col] = EMPTY;
			index2 = FindPiece(row - 1, col);
		}
	}

	if(col<=1 && row>1 && row<7) {
		if (board[row][col + 1] == colourCaptured && (board[row][col + 2] == colourCapturing )) {
			board[row][col + 1] = EMPTY;
			index1 = FindPiece(row, col + 1);
		}
	}

	if(col>=7 && row>1 && row<7){
		if (board[row][col - 1] == colourCaptured && (board[row][col - 2] == colourCapturing )) {
			board[row][col - 1] = EMPTY;
			index1 = FindPiece(row, col - 1);
		} 
	}

	if(row<=1 && col<=1){
		if (board[row][col + 1] == colourCaptured && (board[row][col + 2] == colourCapturing )) {
			board[row][col + 1] = EMPTY;
			index1 = FindPiece(row, col + 1);
		}
		if (board[row + 1][col] == colourCaptured && (board[row + 2][col] == colourCapturing )) {
			board[row + 1][col] = EMPTY;
			index2 = FindPiece(row + 1, col);
		}
	}

	if(row>=7 && col<=1){
		if (board[row][col + 1] == colourCaptured && (board[row][col + 2] == colourCapturing )) {
			board[row][col + 1] = EMPTY;
			index1 = FindPiece(row, col + 1);
		}
		if (board[row - 1][col] == colourCaptured && (board[row - 2][col] == colourCapturing )) {
			board[row - 1][col] = EMPTY;
			index2 = FindPiece(row - 1, col);
		}
	}

	if(row<=1 && col>=7){
		if (board[row + 1][col] == colourCaptured && (board[row + 2][col] == colourCapturing )) {
			board[row + 1][col] = EMPTY;
			index1 = FindPiece(row + 1, col);
		}
		if (board[row][col - 1] == colourCaptured && (board[row][col - 2] == colourCapturing )) {
			board[row][col - 1] = EMPTY;
			index2 = FindPiece(row, col - 1);
		}
	}

	if(row>=7 && col>=7){
		if (board[row][col - 1] == colourCaptured && (board[row][col - 2] == colourCapturing )) {
			board[row][col - 1] = EMPTY;
			index1 = FindPiece(row, col - 1);
		}
		if (board[row - 1][col] == colourCaptured && (board[row - 2][col] == colourCapturing )) {
			board[row - 1][col] = EMPTY;
			index2 = FindPiece(row - 1, col);
		}
	}

	if (index1 >= 0)
	{
		listCaputered[index1].setAttr('row', 50);
		listCaputered[index1].setAttr('col', 50);
		listCaputered[index1].setAttr('x',-500);
		listCaputered[index1].setAttr('y',-500);
	}
	if (index2 >= 0)
	{
		listCaputered[index2].setAttr('row', 50);
		listCaputered[index2].setAttr('col', 50);
		listCaputered[index2].setAttr('x',-500);
		listCaputered[index2].setAttr('y',-500);
	}
	if (index3 >= 0)
	{
		listCaputered[index3].setAttr('row', 50);
		listCaputered[index3].setAttr('col', 50);
		listCaputered[index3].setAttr('x',-500);
		listCaputered[index3].setAttr('y',-500);
	}
	if (index4 >= 0)
	{
		listCaputered[index4].setAttr('row', 50);
		listCaputered[index4].setAttr('col', 50);
		listCaputered[index4].setAttr('x',-500);
		listCaputered[index4].setAttr('y',-500);
	}
}

//funckja pojmania króla
function CaptureKing(row,col){
	if(board[4][4]==EMPTY){
		board[4][4]=BLACK;
	}
	if(col>1 && row >1 && col<7 && row <7){
		if (board[row][col + 1] == KING
			&& (board[row][col + 2] == BLACK)
			&& (board[row + 1][col + 1] == BLACK)
			&& (board[row - 1][col + 1] == BLACK)) {
				BlackWin();
			}
		else if (board[row][col - 1] == KING
				&& (board[row][col - 2] == BLACK)
				&& (board[row + 1][col - 1] == BLACK)
				&& (board[row - 1][col - 1] == BLACK)) {
					BlackWin();
				} 
		else if (board[row + 1][col] == KING
				&& (board[row + 2][col] == BLACK)
				&& (board[row + 1][col + 1] == BLACK)
				&& (board[row + 1][col - 1] == BLACK)) {
					BlackWin();
				}
		else if (board[row - 1][col] == KING
				&& (board[row - 2][col] == BLACK)
				&& (board[row - 1][col + 1] == BLACK)
				&& (board[row - 1][col - 1] == BLACK)) {
					BlackWin();
				}

	}
		
		if(row<=1 && col>1 && col<7) {
			if (board[row + 1][col] == KING
				&& (board[row + 2][col] == BLACK)
				&& (board[row + 1][col + 1] == BLACK)
				&& (board[row + 1][col - 1] == BLACK)) {
					BlackWin();
				}
		}

		if(row>=7 && col>1 && col<7){
			if (board[row - 1][col] == KING
				&& (board[row - 2][col] == BLACK)
				&& (board[row - 1][col + 1] == BLACK)
				&& (board[row - 1][col - 1] == BLACK)) {
					BlackWin();
				}
		}
		
		if(col<=1 && row>1 && row<7) {
			if (board[row][col + 1] == KING
				&& (board[row][col + 2] == BLACK)
				&& (board[row + 1][col + 1] == BLACK)
				&& (board[row - 1][col + 1] == BLACK)) {
					BlackWin();
				}
		}
	
		if(col>=7 && row>1 && row<7){
			if (board[row][col - 1] == KING
				&& (board[row][col - 2] == BLACK)
				&& (board[row + 1][col - 1] == BLACK)
				&& (board[row - 1][col - 1] == BLACK)) {
					BlackWin();
				} 
		}
	
		if(row<=1 && col<=1){
			if (board[row][col + 1] == KING
				&& (board[row][col + 2] == BLACK)
				&& (board[row + 1][col + 1] == BLACK)
				&& (board[row - 1][col + 1] == BLACK)) {
					BlackWin();
				}
				else if (board[row + 1][col] == KING
					&& (board[row + 2][col] == BLACK)
					&& (board[row + 1][col + 1] == BLACK)
					&& (board[row + 1][col - 1] == BLACK)) {
						BlackWin();
					}	
		}
	
		if(row>=7 && col<=1){
			if (board[row][col + 1] == KING
				&& (board[row][col + 2] == BLACK)
				&& (board[row + 1][col + 1] == BLACK)
				&& (board[row - 1][col + 1] == BLACK)) {
					BlackWin();
				}
				else if (board[row - 1][col] == KING
					&& (board[row - 2][col] == BLACK)
					&& (board[row - 1][col + 1] == BLACK)
					&& (board[row - 1][col - 1] == BLACK)) {
						BlackWin();
					}
		}
	
		if(row<=1 && col>=7){
			if (board[row][col - 1] == KING
				&& (board[row][col - 2] == BLACK)
				&& (board[row + 1][col - 1] == BLACK)
				&& (board[row - 1][col - 1] == BLACK)) {
					BlackWin();
				} 
				else if (board[row + 1][col] == KING
					&& (board[row + 2][col] == BLACK)
					&& (board[row + 1][col + 1] == BLACK)
					&& (board[row + 1][col - 1] == BLACK)) {
						BlackWin();
					}
		}
	
		if(row>=7 && col>=7){
			if (board[row][col - 1] == KING
				&& (board[row][col - 2] == BLACK)
				&& (board[row + 1][col - 1] == BLACK)
				&& (board[row - 1][col - 1] == BLACK)) {
					BlackWin();
				} 
				else if (board[row - 1][col] == KING
					&& (board[row - 2][col] == BLACK)
					&& (board[row - 1][col + 1] == BLACK)
					&& (board[row - 1][col - 1] == BLACK)) {
						BlackWin();
					}
		}
	if(board[4][4]==BLACK){
	board[4][4]=EMPTY;
	}
}

//funkcja sprawdzająca czy król dotarł do krawędzi
function KingToTheEdge(row,col){
	if(row>7 && board[row][col]==KING){
		WhiteWin(1);
	}
	else if(row<1 && board[row][col]==KING){
		WhiteWin(1);
	}
	else if(col>7 && board[row][col]==KING){
		WhiteWin(1);
	}
	else if(col<1&& board[row][col]==KING){
		WhiteWin(1);
	}
}

//funckja sprawdzająca ilość czarnych pionów
function OutOfBlackPieces(){
	var deafeatedCounter=0;
	for (var i=0; i<blackList.length; i++){
		if(blackList[i].getAttr('row')==50){
			deafeatedCounter++;
		}
	}
	if(deafeatedCounter==14){
		WhiteWin(2);
	}
}

//funkcja zwycięstwa gracza czarnego
function BlackWin(){
	alert("Król został pojmany, czarne wygrywają")
	location.reload();
}

//funckja zwycięstwa gracza białego
function WhiteWin(way){
	if(way==1){
		alert("Król dotarł do krawędzi, białe wygrywają")
		location.reload();
	}
	else if(way==2){
		alert("Czarne straciły zbyt wiele pionów, białe wygrywają")
		location.reload();
	}
}

//funckja ruchu piona
function Move(piece,row,col){
	board[piece.getAttr('row')][piece.getAttr('col')] = EMPTY;
	board[row][col] = piece.getAttr('colour');

	piece.setAttr('row', row);
	piece.setAttr('col', col);
	piece.setAttr('x',SQUARE_SIZE*(col));
	piece.setAttr('y',SQUARE_SIZE*(row));
}

//listener czekający na koniec przeciągania piona
piecesLayer.on('dragend', function(event){
	//aktualnie używany pion
	var piece = event.target;
	//pozycja myszy
	var mousePosition = stage.getPointerPosition();
	//pozycja startowa piona
	var originalRow = piece.getAttr('row');
	var originalCol = piece.getAttr('col');
	//przełożenie pozycji myszy na kolumny i rzędy
	var row = Math.floor(((mousePosition.y)/SQUARE_SIZE));
	var col = Math.floor(((mousePosition.x)/SQUARE_SIZE));

	
	if (ValidMove(piece,row,col)){
		Move(piece,row,col);

		if (playerTurn == WHITE){
			CapturePiece(row,col,BLACK,WHITE,blackList);
			CapturePiece(row,col,BLACK,KING,blackList);
			KingToTheEdge(row,col);
			OutOfBlackPieces();
		} 
		else if (playerTurn == BLACK){
			CapturePiece(row,col,WHITE,BLACK,whiteList);
			CaptureKing(row,col)
		}
		SwitchTurn();
	} else {
		Move(piece,originalRow,originalCol);
	}

	piecesLayer.draw();
});

piecesLayer.on("touchstart", function(event){
	var piece = event.target;
	console.log(piece.getAttr('row'));
	console.log(piece.getAttr('col'));
})

//funkcja rysująca wszystkie warstwy
function Redraw(){
	boardLayer.draw();
	piecesLayer.draw();
	draggingLayer.draw();
}

stage.add(boardLayer);
stage.add(piecesLayer);
stage.add(draggingLayer);
stage.draw();

setInterval(Redraw,100);