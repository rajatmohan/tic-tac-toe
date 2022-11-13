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
        const _boardSideLength = boardSideLength;
        const _boardSize = _boardSideLength*_boardSideLength;
        const _board = [...Array(_boardSize).fill('')];

        const getBoard = () => _board;

        const getBoardSideLength = ()=> {
            return _boardSideLength;
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

        const setCellEmpty = (index)=> {
            _board[index] = '';
        };

        const isCellEmpty = (index)=> {
            return (_board[index] === ''? true: false );
        };

        const getEmptyCells = () => {
            const fields = [];
            for(let i = 0; i < _boardSize; i++) {
                if(_board[i] === '') {
                    fields.push(i);
                }
            }
            return fields;
        };

        const reset = ()=> {
            for(let i = 0; i < _boardSize; i++) {
                _board[i] = '';
            }
        };

        return {
            getBoard,
            getBoardSideLength,
            getCell,
            setCell,
            setCellEmpty,
            isCellEmpty,
            getEmptyCells,
            reset,
        };
    }
);

const MiniMaxi = ((maximizerSign)=> {
    const PLAYER_SCORE = 10;
    const _maximizerSign = maximizerSign;

    const _getWinScore = (board, index, depth) => {
        const score = PLAYER_SCORE - depth;
        if(board.getCell(index) == _maximizerSign) {
            return {score: score, isGameFinished: true};
        }
        else {
            return {score: -score, isGameFinished: true};
        }
    };

    const _evaluate = (board, depth)=> {
        const _boardSideLength = board.getBoardSideLength();
        
        // check for any row for win condition
        for(let i = 0; i < _boardSideLength; i++) {
            let j;
            for(j = 1; j < _boardSideLength; j++) {
                if(board.isCellEmpty(i*_boardSideLength+j) || board.getCell(i*_boardSideLength+j) !== board.getCell(i*_boardSideLength+j-1)) {
                    break;
                }
            }
            if(j == _boardSideLength) {
                return _getWinScore(board, i*_boardSideLength, depth);
            }
        }

        // check for any column for win condition
        for(let j = 0; j < _boardSideLength; j++) {
            let i;
            for(i = 1; i < _boardSideLength; i++) {
                if(board.isCellEmpty(i*_boardSideLength+j) || board.getCell(i*_boardSideLength+j) !== board.getCell((i-1)*_boardSideLength+j)) {
                    break;
                }
            }
            if(i == _boardSideLength) {
                return _getWinScore(board, j, depth);
            }
        }

        // check for major diagnol for win condition
        {
            let majorDiagWin = true;
            for(let i = 1, j = 1; i < _boardSideLength; i++, j++) {
                if(board.isCellEmpty(i*_boardSideLength+j) || board.getCell(i*_boardSideLength+j) !== board.getCell((i-1)*_boardSideLength+j-1)) {
                    majorDiagWin = false;
                    break;
                }
            }
            if(majorDiagWin) {
                return _getWinScore(board, 0, depth);
            }
        }
            
        //check for minor diagnol
        {
            let minorDiagWin = true;
            for(let i = 1, j = _boardSideLength-2; i < _boardSideLength; i++, j--) {
                if(board.isCellEmpty(i*_boardSideLength+j) || board.getCell(i*_boardSideLength+j) !== board.getCell((i-1)*_boardSideLength+j+1)) {
                    minorDiagWin = false;
                    break;
                }
            }
            if(minorDiagWin) {
                return _getWinScore(board, _boardSideLength-1, depth);
            }
        }
        
        // check for draw
        if(board.getEmptyCells().length === 0) {
            return {score: 0, isGameFinished: true};
        }

        // 0 for nothing
        return {score: 0, isGameFinished: false};
    };

    const _minimax = (board, depth, isMaximizer)=> {
        const result = _evaluate(board, depth);

        if(result.isGameFinished) {
            return {score: result.score};
        }

        const scores = [];
        const emptyCells = board.getEmptyCells();
        emptyCells.forEach(cellIndex => {
            board.setCell(cellIndex, (isMaximizer?'X':'O'));
            scores.push({index: cellIndex, score: _minimax(board, depth+1, !isMaximizer).score});
            board.setCellEmpty(cellIndex);
        });

        if(isMaximizer) {
            return scores.reduce( (maxi, score) => {
                return (score.score > maxi.score)? score: maxi;
            });
        }
        else {
            return scores.reduce( (mini, score) => {
                return (score.score < mini.score)? score: mini;
            });
        }
    };

    const findBestMove = (board, isMaximizer)=> {
        return _minimax(board, 0, isMaximizer);
    }

    return {
        findBestMove
    };
});

const PlayerAI = (name, sign, aiPrecision = 0.5, isMaximizer = false)=> {
    let _player = Player(name, sign);
    let _aiPrecision = aiPrecision;
    let _isMaximizer = isMaximizer;

    const setAiPrecision = (aiPrecision)=> {
        if(aiPrecision >= 0 && aiPrecision <= 1) {
            _aiPrecision = aiPrecision;
        }
    }

    const getAiPrecision = ()=> {
        return _aiPrecision;
    }

    const _generateRandom = (maxLimit = 9) => {
        return Math.floor(Math.random() * maxLimit);
    }

    const _randomMove = (board) => {
        const emptyCells = board.getEmptyCells();

        if(emptyCells.length > 0) {
            return emptyCells[_generateRandom(emptyCells.length)];
        }

        return -1;
    }

    const _miniMaxMove = (board, mimiMaxi)=> {
        const emptyCells = board.getEmptyCells();

        if(emptyCells.length > 0) {
            return mimiMaxi.findBestMove(board, _isMaximizer).index;
        }

        return -1;
    }

    const findBestMove = (board, miniMaxi) => {
        const accuracy = Math.random();
        if(accuracy < _aiPrecision) {
            return _miniMaxMove(board, miniMaxi);
        }
        return _randomMove(board);
    }

    const isPlayerAi = ()=> {
        return true;
    }

    return {
        ..._player,
        setAiPrecision,
        getAiPrecision,
        findBestMove,
        isPlayerAi,
    }

};

const GameController = ((boardSideLength)=> {
    const _boardSideLength = boardSideLength;
    let _state = 'GAME_NOT_STARTED';

    let _playerList = [PlayerAI('Player 1', 'X', 1, true), PlayerAI('Player 2', 'O', 1, false)];
    let _currentPlayer = _playerList[0];

    let _board = GameBoard(boardSideLength);
    let _miniMaxi = MiniMaxi(_currentPlayer.getSign());

    const _toggleTurn = ()=> {
        _currentPlayer = (_currentPlayer === _playerList[0])? _playerList[1]: _playerList[0];
    };

    const _checkWinConditionRow = (index) => {
        const columnNumber = index % _boardSideLength;
        const startCellIndex = index - columnNumber; 
        const indexVal = _board.getCell(index);
        for(let j = 0; j < _boardSideLength; j++) {
            if(_board.getCell(startCellIndex+j) !== indexVal) {
                return false;
            }
        }
        return true;
    };

    const _checkWinConditionColumn = (index) => {
        const columnNumber = index % _boardSideLength;
        const startCellIndex = columnNumber;
        const indexVal = _board.getCell(index);
        for(let i = 0; i < _boardSideLength; i++) {
            if(_board.getCell(startCellIndex+i*_boardSideLength) !== indexVal) {
                return false;
            }
        }
        return true;
    }; 

    const _checkWinConditionMajorDiagnol = (index) => {
        const rowNumber = Math.floor(index / _boardSideLength);
        const columnNumber = index % _boardSideLength;
        if(rowNumber === columnNumber) {
            const indexVal = _board.getCell(index);
            for(let i = 0, j = 0; i < _boardSideLength; i++, j++) {
                if(_board.getCell(i*_boardSideLength+j) !== indexVal) {
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
            const indexVal = _board.getCell(index);
            for(let i = 0, j = _boardSideLength-1; i < _boardSideLength; i++, j--) {
                if(_board.getCell(i*_boardSideLength+j) !== indexVal) {
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
            if(_board.getEmptyCells().length === 0) {
                return true;
            }
        }
        return false;
    };

    const playerClick = (index) => {
        if(_state === "GAME_STARTED" && _board.setCell(index, _currentPlayer.getSign())) {
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
        _board.reset();
    }

    const isGameWon = ()=> {
        return _state === "GAME_WON"? true: false;
    }

    const isGameDraw = ()=> {
        return _state === "GAME_DRAW"? true: false;
    }

    const isCurrentPlayerAI = () => {
        if(typeof _currentPlayer.isPlayerAi === 'function') {
            return true;
        }
        return false;
    }

    const playAIMove = () => {
        if(isCurrentPlayerAI()) {
            return _currentPlayer.findBestMove(_board, _miniMaxi);
        }
        return -1;
    }

    return {
        getAllPlayers,
        getCurrentPlayer,
        playerClick,
        startButtonClicked,
        restartButtonClicked,
        isGameDraw,
        isGameWon,
        isCurrentPlayerAI,
        playAIMove,
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
        const _gameEndMessageCloseBtn = _gameEndMessageDiv.querySelector(".close");

        // Game end message modal close button functionality
        _gameEndMessageCloseBtn.onclick = () => {
            _gameEndMessageDiv.style.display = "none";
        }

        const _removeClickListenerOnBoardCells = () => {
            const _cells = document.querySelectorAll(".board-cell");
            Array.from(_cells).forEach(cell => cell.removeEventListener('click', _playerClick));
        }

        const _addClickListenerOnBoardCells = () => {
            const _cells = document.querySelectorAll(".board-cell");
            Array.from(_cells).forEach(cell => cell.addEventListener('click', _playerClick));
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

            if(GameController.isCurrentPlayerAI()) {
                // diable onclick on board cells;
                _removeClickListenerOnBoardCells();
                const index = GameController.playAIMove();
                if(index >= 0) {
                    setTimeout(_playerMove, 1000, index);
                }
            }
            else {
                // enable on click on board cells;
                _addClickListenerOnBoardCells();
            }
        };

        const _winnerDisplay = (player)=> {
            _gameEndMessageDiv.style.display = "block";
            _gameEndMessage.textContent = `${player.getName()} Won !`;
        }

        const _drawDisplay = ()=> {
            _gameEndMessageDiv.style.display = "block";
            _gameEndMessage.textContent = `Draw`;
        }

        const _playerMove = (index) => {
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
        }

        const _playerClick = (e)=> {
            let index = parseInt(e.target.dataset.index);
            _playerMove(index);
        };

        const _makeCell = (index)=> {
            const cell = document.createElement('div');
            cell.classList.add("board-cell")
            cell.dataset.index = index;
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


