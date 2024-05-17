let puzzlePieces = [];
let board = []; 
let puzzle;
let w, h;
let cols = 3;
let rows = 3;
let timer;
let timeLeft = 40;
let initialTime = 40;
let homePage;
let game = false;
let winner;
let retrybutton;
let song;

function preload() {
  puzzle = loadImage("images/minions.png");
  homePage = loadImage("images/homepage.png");
  retry = loadImage("images/retry.png");
  winner = createImg("gifs/winner.gif");
  song = loadSound('sounds/MinionsBananaSong.mp3');
  song.loop(); //şarkı bitince tekrar başlamasını sağlar
}

function setup() {
  createCanvas(600, 600);
  w = width / cols;
  h = height / rows;
  createPuzzlePieces();
  puzzlePieces.pop();
  board.pop();
  board.push(-1);// bir boşluk bırakmak için
  Shuffle(board);
  shufflePieces();
  timer = setInterval(countdown, 1000);
  retrybutton = createButton("TRY AGAIN");
  song.play(); //şarkıyı başlatır
}

function draw() {
  background("#ECFF33");
  winner.hide(); //winner gifini gizler
  if (!game) {
    showHomePage();
  } else if (game && timeLeft > 0) {
    showPuzzle();
  } else {
    showGameOver();
  }
}

function showHomePage() {
    image(homePage, 0, 0, width, height);
    fill("#ECFF33");
    stroke(0);
    strokeWeight(10);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('M.I.N.I', width / 2, 40);
    textSize(40);
    textAlign(CENTER, CENTER);
    text('P.U.Z.Z.L.E', width / 2, 80);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('BY: RÇ', width / 2, 120);

    textAlign(CENTER, CENTER);
    textSize(20);
    text('HOW TO PLAY :', width / 2, 170);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('Complete the puzzle according to the picture below,', 275, 200);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(' just click on the pieces to move them and DONT forget the TIME.', 275, 230);
    
    textAlign(CENTER, CENTER);
    textSize(25);
    text('! CLICK THE SCREEN TO START !', width / 2, 470);
    
    retrybutton.hide(); //tekrar deneyin butonunu gizler
}

function showPuzzle() {
  for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let index = i + j * cols;
        let pieceIndex = board[index];
        if (pieceIndex > -1) {
          let piece = puzzlePieces[pieceIndex];
          piece.updatePosition(i, j);
          piece.display();
        }
      }
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * w;
        let y = j * h;
        strokeWeight(3);
        noFill();
        rect(x, y, w, h);
      }
    }
    if (isCompleted()) {
      winner.position(0, 0);
      winner.size(600, 600);
      winner.show(); // winner gifini gösterir
      clearInterval(timer);
    }
    textAlign(RIGHT);
    textSize(20);
    fill("black");
    text("Time Remaining : " + timeLeft + " sec", width - 20, 20);
    
     retrybutton.hide();
}

function showGameOver() {
    song.stop(); //şarkıyı durdurur
    image(retry, 0, 0, width, height);
    retrybutton.show(); //tekrar deneyin butonunu gösterir
    retrybutton.mousePressed(resetGame);
    retrybutton.position(360, 295);
    retrybutton.size(130,35);
    retrybutton.style("font-family", "Cursive");
    retrybutton.style('font-size', '20px');
    retrybutton.style("background-color", "#ECFF33");
    retrybutton.style("color", "black");
    
    fill("#ECFF33");
    stroke(0);
    strokeWeight(10);
    textSize(45);
    textAlign(CENTER, CENTER);
    text('... S.O.R.R.Y ...', width / 2, 100);
    textSize(50);
    textAlign(CENTER, CENTER);
    text('! YOUR TIME IS UP !', width / 2, 175);
    textSize(55);
    textAlign(CENTER, CENTER);
    text('! GAME OVER !', width / 2, 250);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(' GOOD LUCK  :)', 310, 495);
}

function isCompleted() {
  if (board[board.length - 1] !== -1) {
    return false;
  }

  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== puzzlePieces[i].index) {
      return false;
    }
  }
  return true;
}

function resetGame() {
  song.play();
  game = true; //oyunu tekrar başlatmak için play değerini true yapar
  timeLeft = initialTime; //süreyi başlangıç değerine geri döndürür
  timer = setInterval(countdown, 1000); 
  shufflePieces();
}

function countdown() {
  if (game) {
    timeLeft--; //saniyeyi azaltır
    if (timeLeft <= 0) {
      clearInterval(timer);
    }
  }
}

function mousePressed() {
  if (!game && timeLeft > 0  && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    game = true; //oyun başlar
    return;
  } else if (!game && timeLeft <= 0 && mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    retryButtonClicked = true; //oyun yeniden başlar
  }
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  move(i, j, board);
}

function createPuzzlePieces() { 
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      img.copy(puzzle, x, y, w, h, 0, 0, w, h);//resmi kopyalar
      let index = i + j * cols;
      board.push(index);
      let piece = new PuzzlePiece(index, img, x, y);
      puzzlePieces.push(piece);
    }
  }
}

function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function randomMove(arr) {
  let r1 = floor(random(cols));
  let r2 = floor(random(rows));
  move(r1, r2, arr);
}

function move(i, j, arr) {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);
  if (isNeighbor(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr);
  }
}

function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }
  if (abs(i - x) === 1 || abs(j - y) === 1) {
    return true;
  }
  return false;
}

function findBlank() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === -1) return i;
  }
}

function Shuffle(arr) {
  for (let i = 0; i < 1000; i++) {
    randomMove(arr);
  }
}

function shufflePieces() {
  board = []; //diziyi sıfırlar
  puzzlePieces = []; //diziyi temizler

  //parçaları oluşturur ve karıştırır
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      img.copy(puzzle, x, y, w, h, 0, 0, w, h);
      let index = i + j * cols;
      board.push(index);
      let piece = new PuzzlePiece(index, img, x, y);
      puzzlePieces.push(piece);
    }
  }
  puzzlePieces.pop();
  board.pop();
  board.push(-1);
  Shuffle(board);
}

