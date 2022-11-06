const boardSideLength = 3;

const Player = (
    (name, sign) => {
        let _name = name;
        let _sign = sign;

        const getName = () => _name;
        const setName = (name) => _name = name;
        const getSign = () => _sign;
        const setSign = (sign) => _sign = sign;

        return {
            getName,
            setName,
            getSign,
            setSign,
        }
    }
);

const GameBoard = (
    (boardSideLength) => {
        const _boardSize = boardSideLength*boardSideLength;
        const _board = [...Array(_boardSize).fill('')];

        const getBoard = () => _board;

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
            getBoard,
            reset,
            getCell,
            setCell,
            getEmptyCell,
        };
    }
)(boardSideLength);

const GameController = ((boardSideLength)=> {
    const _boardSideLength = boardSideLength;
    let _state = 'GAME_NOT_STARTED';

    let _playerList = [Player('Player 1', 'X'), Player('Player 2', 'O')];
    let _currentPlayer = _playerList[0];

    const _toggleTurn = ()=> {
        _currentPlayer = (_currentPlayer === _playerList[0])? _playerList[1]: _playerList[0];
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
        if(_state === "GAME_STARTED" && GameBoard.setCell(index, _currentPlayer.getSign())) {
            if(_checkGameWinCondition(index)) {
                _state = "GAME_WON";
            }
            else if(_checkDrawCondition(index)) {
                _state = "GAME_DRAW";
            }
            else {
                _toggleTurn();
            }
            return true;
        }
        return false;
    };
    
    const getAllPlayers = ()=> {
        return _playerList;
    };

    const getCurrentPlayer = ()=> {
        return _currentPlayer;
    };

    const startButtonClicked = ()=> {
        _state = "GAME_STARTED";
    };

    const restartButtonClicked = ()=> {
        _state = "GAME_STARTED";
        _currentPlayer = _playerList[0];
        GameBoard.reset();
    }

    const isGameWon = ()=> {
        return _state === "GAME_WON"? true: false;
    }

    const isGameDraw = ()=> {
        return _state === "GAME_DRAW"? true: false;
    }

    return {
        getAllPlayers,
        getCurrentPlayer,
        playerClick,
        startButtonClicked,
        restartButtonClicked,
        isGameDraw,
        isGameWon,
    };
    
})(boardSideLength);

const DisplayController = (
    (boardSideLength)=> {
        const _board = document.querySelector("#board");
        const _playerInfo = document.querySelector("#playerInfoContainer");
        const _boardSideLength = boardSideLength;
        const _startButton = document.querySelector("#startButton");
        const _gameEndMessageDiv = document.querySelector("#gameEndMessageModal");
        const _gameEndMessage = document.querySelector("#gameEndMessage");
        const __gameEndMessageCloseBtn = _gameEndMessageDiv.querySelector(".close");

        // Game end message modal close button functionality
        __gameEndMessageCloseBtn.onclick = () => {
            _gameEndMessageDiv.style.display = "none";
        }

        const _hightLightCurrentPlayer = ()=>{
            let currentPlayer = GameController.getCurrentPlayer()
            Array.from(_playerInfo.children).forEach(child => {
                if(child.dataset.sign === currentPlayer.getSign()) {
                    child.classList.add("player-active");
                }
                else {
                    child.classList.remove("player-active");
                }
            });
        };

        const _winnerDisplay = (player)=> {
            _gameEndMessageDiv.style.display = "block";
            _gameEndMessage.textContent = `${player.getName()} Won !`;
        }

        const _drawDisplay = ()=> {
            _gameEndMessageDiv.style.display = "block";
            _gameEndMessage.textContent = `Draw`;
        }

        const _playerClick = (e)=> {
            let index = parseInt(e.target.dataset.index)
            if(index >= 0) {
                let sign = GameController.getCurrentPlayer().getSign();
                if(GameController.playerClick(index)) {
                    _setCell(index, sign);

                    // win draw else toggle
                    if(GameController.isGameWon()) {
                        _winnerDisplay(GameController.getCurrentPlayer());
                    }
                    else if(GameController.isGameDraw()) {
                        _drawDisplay();
                    }
                    else {
                        _hightLightCurrentPlayer();
                    }
                }
            }
        };

        const _makeCell = (index)=> {
            const cell = document.createElement('div');
            cell.classList.add("board-cell")
            cell.dataset.index = index;
            cell.addEventListener('click', _playerClick);
            return cell;
        };

        const _editPlayerNameKeyUp = (e)=> {
            let playerEdited = GameController.getAllPlayers().filter(player => player.getSign() === e.target.dataset.sign);    
            if(playerEdited.length == 1) {
                playerEdited[0].setName(e.target.value);
            }
        }

        const _makePlayerInfo = (player)=> {
            const playerName = document.createElement('input');
            playerName.classList.add("player-info");
            playerName.setAttribute("maxLength", 15);
            playerName.setAttribute("size", 20);
            playerName.dataset.sign = player.getSign();
            playerName.value = `${player.getName()}`;
            playerName.onkeyup = _editPlayerNameKeyUp;
            return playerName;
        }

        const _startButtonClicked = (event)=> {
            event.preventDefault();
            if(event.target.textContent == "Start Game") {
                event.target.textContent = 'Restart Game';
                GameController.startButtonClicked();
            }
            else {
                event.target.textContent = 'Restart Game';
                GameController.restartButtonClicked();
                _reset();
            }

            _hightLightCurrentPlayer();
        }

        const _setCell = (index, sign)=> {
            _board.querySelector(`#board > div:nth-child(${index+1})`).textContent = sign;
        };

        const _reset = () => {
            _board.querySelectorAll('#board > div').forEach((divEle)=>{
                divEle.textContent = '';
            });
            GameController.restartButtonClicked();
        }

        const init = ()=>{
            // create board
            _board.style.gridTemplateColumns = `repeat(${_boardSideLength}, minmax(0, 1fr))`;
            for(let i = 0; i < _boardSideLength*_boardSideLength; i++) {
                _board.appendChild(_makeCell(i));
            }
            _startButton.addEventListener('click', _startButtonClicked);

            // create player info
            GameController.getAllPlayers().forEach(player => {
                _playerInfo.appendChild(_makePlayerInfo(player));
            });

        };

        return {
            init
        };
    }
)(boardSideLength);

DisplayController.init();


