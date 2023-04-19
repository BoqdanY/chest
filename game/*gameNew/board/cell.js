export default class Cell {
  constructor(y, x, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = null;
    this.available = false;
    this.check = false;
    this.checkedBy = [];
    this.rookForCastling = null;
    this.cellForRookCastling = null;
    this.doubleMove = false;
  }
}