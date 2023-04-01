import Figure, { figureNames } from "/game?=figures/figure.js";
import { colors } from "/game?=resources/colors.js";
import Board from "/game?=board/board.js";

const whiteImg = '/game?=resources/img/whitePawn.png';
const blackImg = '/game?=resources/img/blackPawn.png';

export default class Pawn extends Figure {
  isFirstStep = true;
  constructor(color, cell, direction) {
    super(color, cell);
    this.img = color === colors.WHITE ? whiteImg : blackImg;
    this.name = figureNames.PAWN;
    this.direction = direction;
  }

  moveFigure() {
    super.moveFigure();
    this.isFirstStep = false;
  }

  canMove(selectedCell) {
    if (!super.canMove(selectedCell)) {
      return false;
    }
    if ((selectedCell.y === this.cell.y + this.direction || this.isFirstStep && selectedCell.y === this.cell.y + this.direction * 2)
      && selectedCell.x === this.cell.x
      && Board.getCell(selectedCell.y, selectedCell.x).isEmpty()) {
      return true;
    }
    if (selectedCell.y === this.cell.y + this.direction && (selectedCell.x === this.cell.x + 1 || selectedCell.x === this.cell.x - 1)
      && this.cell.isEnemy(selectedCell)) {
      return true;
    }
    return false;
  }
}