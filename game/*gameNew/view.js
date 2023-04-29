import figureTypes from "/game?=*gameNew/resources/figureTypes.js";
import Figure, { figuresImg } from "/game?=*gameNew/figures/figure.js";
import { colors } from "/game?=*gameNew/resources/colors.js";

const figuresForList = {
  queen: {
    white: figuresImg[figureTypes.q]['white'],
    black: figuresImg[figureTypes.q]['black']
  },
  rook: {
    white: figuresImg[figureTypes.r]['white'],
    black: figuresImg[figureTypes.r]['black']
  },
  knight: {
    white: figuresImg[figureTypes.n]['white'],
    black: figuresImg[figureTypes.n]['black']
  },
  bishop: {
    white: figuresImg[figureTypes.b]['white'],
    black: figuresImg[figureTypes.b]['black']
  }
};

export default class View {
  constructor(element, game) {
    this.element = element;
    this.game = game;
    this.selected = null;
  }

  drawBoard() {
    this.element.innerHTML = '';
    for (const row of this.game.board.cells) {
      const rowHTML = document.createElement('div');
      rowHTML.classList.add('row');
      for (const cell of row) {
        const cellHTML = this.createCellHtml(cell);
        rowHTML.append(cellHTML);
      }
      this.element.append(rowHTML);
    }
  }

  createCellHtml(cell) {
    const cellHTML = document.createElement('div');
    cellHTML.className = `col ${cell.color}`;
    if (cell.figure) {
      cellHTML.append(this.createFigureImg(cell));
    }
    if (cell.available) {
      if (cell.figure) {
        cellHTML.classList.add('availableFigure');
      } else {
        const available = document.createElement('div');
        available.classList.add('available');
        cellHTML.append(available);
      }
    }
    if (this.selected === cell) {
      cellHTML.classList.add('selected');
    }
    if (cell.checked) {
      cellHTML.classList.add('check');
    }
    cellHTML.addEventListener('click', () => {
      if (this.selected && this.selected !== cell && cell.available) {
        this.game.moveFigure(this.selected, cell);
        this.selected = null;
        this.game.clearAvailableCells();
        this.drawBoard();
        this.checkPawnTurn();
      } else if (cell.figure) {
        this.selected = cell;
        this.game.clearRookForCastling();
        this.game.checkAvailableCells(cell);
        this.drawBoard();
      }
    });
    return cellHTML;
  }

  createFigureImg(cell, src) {
    const img = document.createElement('img');
    img.classList.add('figure');
    img.src = src ? src :cell.figure.img;
    return img;
  }

  createFigureListHtml(cell) {
    const list = document.createElement('div');
    list.classList.add('listFigure');
    for (const [type, figureImgs] of Object.entries(figuresForList)) {
      const div = document.createElement('div');
      const img = this.createFigureImg(null, cell.figure.color === colors.WHITE ? figureImgs.white : figureImgs.black);
      div.append(img);
      div.addEventListener('click', () => {
        const createdFigure = new Figure(cell.figure.color, type);
        this.game.board.figures.push(createdFigure);
        this.game.deleteFigure(cell.figure);
        cell.figure = createdFigure;
        this.game.checkKing(createdFigure.color);
        this.game.checkStalemate(createdFigure.color);
        this.game.checkDraw();
        this.drawBoard();
        list.remove();
      });
      list.append(div);
    }
    return list;
  }

  addFigureList() {
    const div = document.createElement('div');
    div.classList.add('divListFigure');
    const list = this.createFigureListHtml(this.game.finalHorizontalCell);
    div.append(list);
    this.element.prepend(div);
  }

  checkPawnTurn() {
    if (this.game.finalHorizontal) {
      this.addFigureList();
      this.game.finalHorizontal = false;
      this.game.finalHorizontalCell = null;
    }
  }
}