:- include('../game_logic/main.pl').


% gameData(Board, Mode, Difficulty, NextToPlay).

initGame(Mode, Difficulty) :-
    retractall(gameData(_, _, _, _)),
    now(X),
	setrand(X),
    board(Board),
    assert(gameData(Board, Mode, Difficulty, w)).


getBoard(Board) :-
    gameData(Board, _, _, _).

getMode(Mode) :-
    gameData(_, Mode, _, _).

getDifficulty(Difficulty) :-
    gameData(_, _, Difficulty, _).

getNextToPlay(Next) :-
    gameData(_, _, _, Next).


makePlay(npc) :-
    gameData(Board, npc, Difficulty, Color),
    moveNPC_Logic(Color, Difficulty, Board, NewBoard),
    retractall(gameData(_, _, _, _)),
    ite(Color == w, NextColor = b, NextColor = w),
    assert(gameData(NewBoard, npc, Difficulty, NextColor)).
    

makePlay(single, Color, Col_Start, Row_Start, Col_Dest, Row_Dest).


/**
 * Makes a player move. If the move cannot be made, it fails and the board isn't changed.
 * +Color is the current player's color.
 */
makePlay(multi, Color, Col_Start, Row_Start, Col_Dest, Row_Dest) :-
    gameData(Board, multi, Difficulty, Color),
    move(Color, Board, Col_Start, Row_Start, Col_Dest, Row_Dest, NewBoard),
    retractall(gameData(_, _, _, _)),
    ite(Color == w, NextColor = b, NextColor = w),
    assert(gameData(NewBoard, multi, Difficulty, NextColor)).


freeGame :-
    retractall(gameData(_, _, _, _)).