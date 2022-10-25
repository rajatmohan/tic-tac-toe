const boardSideLength = 3;

const DisplayController = (
    (boardSideLength)=> {
        const _board = document.querySelector("#board");
        const _boardSideLength = boardSideLength;
        const _makeCell = (index)=> {
            const cell = document.createElement('div');
            cell.classList.add("board-cell")

            cell.addEventListener('click', ()=>GameController.playerClick(index));
            return cell;
        };

        const makeBoard = ()=>{
            _board.style.gridTemplateColumns = `repeat(${_boardSideLength}, minmax(0, 1fr))`;
            for(let i = 0; i < _boardSideLength*_boardSideLength; i++) {
                _board.appendChild(_makeCell(i));
            }
        };

        const setCell = (index, sign)=> {
            _board.querySelector(`#board > div:nth-child(${index+1})`).textContent = sign;
        };

        const reset = () => {
            _board.querySelectorAll('#board > div').forEach((divEle)=>{
                divEle.textContent = '';
            });
        }

        return {
            makeBoard,
            setCell,
            reset,
        };
    }
)(boardSideLength);

const GameController = ((boardSideLength)=> {
    let _sign = 'X';
    const _boardSideLength = boardSideLength;

    const _toggleTurn = ()=> {
        if(_sign == 'X') {
            _sign = 'O';
        }
        else {
            _sign = 'X';
        }
    };

    const _checkWinConditionRow = (index) => {
        const columnNumber = index % _boardSideLength;
        const startCellIndex = index - columnNumber; 
        const indexVal = GameBoard.getCell(index);
        for(let j = 0; j < _boardSideLength; j++) {
            if(GameBoard.getCell(startCellIndex+j) !== indexVal) {
                return false;
            }
        }
        return true;
    };

    const _checkWinConditionColumn = (index) => {
        const columnNumber = index % _boardSideLength;
        const startCellIndex = columnNumber;
        const indexVal = GameBoard.getCell(index);
        for(let i = 0; i < _boardSideLength; i++) {
            if(GameBoard.getCell(startCellIndex+i*_boardSideLength) !== indexVal) {
                return false;
            }
        }
        return true;
    }; 

    const _checkWinConditionMajorDiagnol = (index) => {
        const rowNumber = Math.floor(index / _boardSideLength);
        const columnNumber = index % _boardSideLength;
        if(rowNumber === columnNumber) {
            const indexVal = GameBoard.getCell(index);
            for(let i = 0, j = 0; i < _boardSideLength; i++, j++) {
                if(GameBoard.getCell(i*_boardSideLength+j) !== indexVal) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    const _checkWinConditionMinorDiagnol = (index) => {
        const rowNumber = Math.floor(index / _boardSideLength);
        const columnNumber = index % _boardSideLength;
        if(rowNumber + columnNumber == _boardSideLength-1) {
            const indexVal = GameBoard.getCell(index);
            for(let i = 0, j = _boardSideLength-1; i < _boardSideLength; i++, j--) {
                if(GameBoard.getCell(i*_boardSideLength+j) !== indexVal) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    const _checkGameWinCondition = (index)=> {
        return _checkWinConditionRow(index) || _checkWinConditionColumn(index) ||
            _checkWinConditionMajorDiagnol(index) || _checkWinConditionMinorDiagnol(index);
    }

    const _checkDrawCondition = (index)=> {
        if(!_checkGameWinCondition(index)) {
            if(GameBoard.getEmptyCell().length === 0) {
                return true;
            }
        }
        return false;
    };

    const playerClick = (index) => {
        if(GameBoard.setCell(index, _sign)) {
            _toggleTurn();
            console.log(_checkGameWinCondition(index));
            console.log(_checkDrawCondition(index));
        }
    };

    return {
        playerClick,
    };
    
})(boardSideLength);

const GameBoard = (
    (boardSideLength) => {
        const _boardSize = boardSideLength*boardSideLength;
        const _board = [...Array(_boardSize).fill('')];
        DisplayController.makeBoard();

        const reset = ()=> {
            for(let i = 0; i < _boardSize; i++) {
                _board[i] = '';
            }
            DisplayController.reset();
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
            const fields = [];
            for(let i = 0; i < _boardSize; i++) {
                if(_board[i] === '') {
                    fields.push(i);
                }
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
)(boardSideLength);


