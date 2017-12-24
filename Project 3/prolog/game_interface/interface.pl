:- include('../game_logic/main.pl').


% gameData(Board, Mode, Difficulty, NextToPlay).

initGame(Mode, Difficulty) :-
    board(X),
    assert(gameData(X, Mode, Difficulty, w)).


getBoard(Board) :-
    gameData(Board, _, _, _).

getMode(Mode) :-
    gameData(_, Mode, _, _).

getDifficulty(Difficulty) :-
    gameData(_, _, Difficulty, _).

getNextToPlay(Next) :-
    gameData(_, _, _, Next).


makePlay(npc) :-
    gameData([Board, npc, Difficulty, Color]),
    moveNPC_Logic(Color, Difficulty, Board, NewBoard),
    retract(gameData(_)),
    ite(Color == w, NextColor = b, NextColor = w),
    assert(gameData(NewBoard, npc, Difficulty, NextColor)).
    

makePlay(single).

makePlay(multi).