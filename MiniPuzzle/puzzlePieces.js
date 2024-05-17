class PuzzlePiece {
  constructor(index, img, x, y) {
    this.index = index;
    this.img = img;
    this.x = x;
    this.y = y;
  }
  
  updatePosition(i, j) {
    this.x = i * w;
    this.y = j * h;
  }
  
  display() {
    image(this.img, this.x, this.y, w, h);
  }
}