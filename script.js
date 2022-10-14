const DisplayController = (
    ()=> {
        const _board = document.querySelector("#board");

        const _makeCell = (rowNo, columnNo)=> {
            const cell = document.createElement('div');
            cell.classList.add("board-cell")
            return cell;
        };

        const makeBoard = (boardSideLength)=>{
            _board.style.gridTemplateColumns = `repeat(${boardSideLength}, minmax(0, 1fr))`;
            for(let i = 0; i < boardSideLength; i++) {
                for(let j = 0; j < boardSideLength; j++) {
                    _board.appendChild(_makeCell(i+1, j+1));
                }
            }
        };

        const setCell = (index, sign)=> {
            _board.querySelector(`#board > div:nth-child(${index})`).textContent = sign;
        };

        return {
            makeBoard,
            setCell,
        };
    }
)();

const GameBoard = (
    (boardSize) => {
        const _boardSize = boardSize;
        const _board = [...Array(_boardSize).fill('')];
        const reset = ()=> {
            for(let i = 0; i < _boardSize; i++) {
                _board[i] = '';
            }
        };

        const getCell = (index) => {
            return _board[index];
        }

        const setCell = (index, sign)=> {
            if(_board[index] === '') {
                _board[index] = sign;
                DisplayController.setCell(index, sign);
                return true;
            }
            return false;
        };

        const getEmptyCell = () => {
            const fields = []
            for(let i = 0; i < _boardSize; i++) {
                if(_board[i] === '') {
                    fields.push(i);
                }
                _board[i] = '';
            }
            return fields;
        };

        return {
            reset,
            getCell,
            setCell,
            getEmptyCell,
        };
    }
)(3*3);


DisplayController.makeBoard(3);
console.log(GameBoard.setCell(4, 'X'));



