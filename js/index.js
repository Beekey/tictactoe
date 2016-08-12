$(document).ready(function() {
// strings containing code to add various elements of the page that are not continously visible,
  // that appear in multiple places or move from one place to another
    var addO = '<img class="img-responsive" src="https://raw.githubusercontent.com/Beekey/tictactoe/master/images/playerO.png" alt="O">';
    var addX = '<img class="img-responsive" src="https://raw.githubusercontent.com/Beekey/tictactoe/master/images/playerX.png" alt="X">';
    var addStrikeH = '<img class="img-responsive" src="https://raw.githubusercontent.com/Beekey/tictactoe/master/images/strikeHorizontal.png">';
    var addStrikeV = '<img class="img-responsive" src="https://raw.githubusercontent.com/Beekey/tictactoe/master/images/strikeVertical.png">';
    var addStrikeU = '<img class="img-responsive" src="https://raw.githubusercontent.com/Beekey/tictactoe/master/images/strikeUp.png">';
    var addStrikeD = '<img class="img-responsive" src="https://raw.githubusercontent.com/Beekey/tictactoe/master/images/strikeDown.png">';
    var addLevel = '<img class="img-responsive" src="https://raw.githubusercontent.com/Beekey/tictactoe/master/images/levelUnderline1.png">';
    var human, computer, started; //human and computer are either X or O... started is either "human" or "computer" depending on who made the first move in the current game.
    var level = ""; // difficulty level - values: "medium" "casual" and "hard"
    var currentLevel = ""; // used so the level could not be changed mid game
    var currentMoves = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7]
    ]; // All winning combinations, the first three subarrays are also used to check curren state of the board. Values of each  element can be X, O or a number. If the element is a number that board position is empty.
    var winningCode = ["h1", "h2", "h3", "v1", "v2", "v3", "D", "U"]; // used to pick the right striketrhough line after a win
      var indexOfWinner; // index of winningCode element corresponding to a detected winning combination
    var availablePositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //holds all unused board positions, used for determining random computer moves
    var bestPositions = [1, 3, 5, 7, 9]; //corners and center, used for determining computer moves and in some case for figuring out player positions on the board.
    var moveNo = 0; //holds the number of moved played by both players 
      var won = 0, // score counters
      tied = 0,
      lost = 0;
    var computerNextMove; // values 1-9 -  holds chosen position of the computer's move
  var computerNext = false; // true if computer is next to play and false when it isn't; human always starts first so the initial value here if false
    var randomNumber; //used to pick some of the computer moves
    var potentialWinner; //[x,y] coordinates of element that would create a winning combination if played, [-1,-1] if there is no such element
    var playToWin = 0; // values 0 and 1-9 used on level hard to hold position of the element that will create an unbeatable fork for the computer; 0 is default and indicates that a fork is not possible at the moment
  //-------------------------------------------------
  // window width and height are used to determine the screen dimensions and size the elements of the page so they fit into the window without overflow
    var windowWidth = $(window).width(); 
    var windowHeight = $(window).height();
    var whRatio = windowWidth / windowHeight;
    var paperWidth; //main board width is used to determine the dimensions of all the other graphic elements

    if (whRatio <= 0.891) paperWidth = windowWidth * 0.9;
    else paperWidth = windowHeight * 0.9 * 0.891;
  //the various constants are width/hight ratios of specific graphic elements and ratios of the element width compared to the main board width
  // example: creator image - 5.5 is width of board (paperWidth) / width of creator image
  // while 2 is width of creator image / height of creator image
    $("#board img").css({
      "width": paperWidth + "px",
      "height": paperWidth / 0.891 + "px"
    });
    $("#board").css({
      "width": paperWidth + "px",
      "height": paperWidth / 0.891 + "px"
    });
    $("#creator img").css({
      "width": paperWidth / 5.5 + "px",
      "height": paperWidth / 5.5 / 2 + "px"
    });
    $("#creator").css({
      "width": paperWidth / 5.5 + "px",
      "height": paperWidth / 5.5 / 2 + "px"
    });
    $(".position").css({
      "width": paperWidth / 5.7 + "px",
      "height": paperWidth / 5.7 + "px",
      "padding": paperWidth / 31 + "px"
    });
    $(".position img").css({
      "width": paperWidth / 9.1 + "px",
      "height": paperWidth / 9.1 + "px"
    });
    $(".score").css({
      "font-size": paperWidth / 7.7 + "px",
      "width": paperWidth / 5 + "px"
    });
    $(".strikeH").css({
      "width": paperWidth / 1.7 + "px",
      "height": paperWidth / 18 + "px",
      "padding": paperWidth / 65 + "px"
    });
    $(".strikeH img").css({
      "width": paperWidth / 1.8 + "px",
      "height": paperWidth / 1.8 / 20.5 + "px"
    });
    $(".strikeV").css({
      "width": paperWidth / 7 + "px",
      "height": paperWidth / 1.8 + "px",
      "padding": paperWidth / 65 + "px"
    });
    $(".strikeV img").css({
      "width": paperWidth / 9.1 + "px",
      "height": paperWidth / 9.1 / 0.2023 + "px"
    });
    $(".strikeD").css({
      "width": paperWidth / 1.7 + "px",
      "height": paperWidth / 1.8 + "px",
      "padding": paperWidth / 65 + "px"
    });
    $(".strikeD img").css({
      "width": paperWidth / 2 + "px",
      "height": paperWidth / 2 / 1.0348 + "px"
    });
    $(".strikeU").css({
      "width": paperWidth / 1.5 + "px",
      "height": paperWidth / 2 + "px",
      "padding": paperWidth / 65 + "px"
    });
    $(".strikeU img").css({
      "width": paperWidth / 1.7 + "px",
      "height": paperWidth / 1.7 / 1.3855 + "px"
    });
    $("#xoro").css({
      "width": paperWidth + "px",
      "height": paperWidth / 2.7 + "px",
      "padding": paperWidth / 70 + "px"
    });
    $("#xoro button").css({
      "width": paperWidth / 5.5 + "px",
      "height": paperWidth / 5.5 + "px",
      "margin": paperWidth / 30 + "px " + paperWidth / 27 + "px " + paperWidth / 47 + "px " + paperWidth / 27 + "px"
    });
    $("#xoro img").css({
      "width": paperWidth / 5.9 + "px",
      "height": paperWidth / 5.9 + "px"
    });
    $("#pick_side").css({
      "width": paperWidth / 2 + "px",
      "height": paperWidth / 2 / 4.8077 + "px"
    });
    $("#level_selector").css({
      "width": paperWidth / 1.5 + "px",
      "height": paperWidth / 1.5 / 7.0588 + "px"
    });
    $(".underline").css({
      "height": paperWidth / 1.5 / 7.0588 + "px"
    });
    $("#lc").css("width", paperWidth / 1.5 / 3.3 + "px");
    $("#lm").css("width", paperWidth / 1.5 / 2.7 + "px");
    $("#lh").css("width", paperWidth / 1.5 / 4.4 + "px");
    $(".level_underline").css({
      "height": paperWidth / 1.5 / 7.0588 + "px",
      "width": paperWidth / 1.5 / 7.0588 * 1.5930 + "px"
    });
//Called  once after X or O is chosen. It hides X or O selection section and makes the level selection panel visible and sets the level to medium
    function setLevel() {
      $("#xoro").hide();
      $("#level_selector").css({
        "background-image": 'url("https://raw.githubusercontent.com/Beekey/tictactoe/master/images/level1.png")'
      });
      $("#lm .level_underline").html(addLevel);
      $(".underline").css("cursor", "pointer")
      level = "medium"; //other two values: "casual" and "hard"
      currentLevel = level; // used so the level could not be changed mid game
      started = "human"; //human plays first in the first game after loading
      return;
    }
// in next 3 click events:
// only change level if the clicked level is different than curren level and if  x or o is already picked
  // remove underline from previous level and underline the new active level
  // if a game is not in progress (moveNo=0) change active level to the newly selected one
  //level switch to casual  
    $("#lc").on("click", function() {
        if (level != "casual" && level != "") {
          if (level == "medium") $("#lm .level_underline").html("");
          else $("#lh .level_underline").html("");
          $("#lc .level_underline").html(addLevel);
          level = "casual";
          if (moveNo === 0) currentLevel = level;
        }
      })
      //level switch to medium  
    $("#lm").on("click", function() {
        if (level != "medium" && level != "") {
          if (level == "casual") $("#lc .level_underline").html("");
          else $("#lh .level_underline").html("");
          $("#lm .level_underline").html(addLevel);
          level = "medium";
          if (moveNo === 0) currentLevel = level;
        }
      })
      //level switch to hard
    $("#lh").on("click", function() {
        if (level != "hard" && level != "") {
          if (level == "medium") $("#lm .level_underline").html("");
          else $("#lc .level_underline").html("");
          $("#lh .level_underline").html(addLevel);
          level = "hard";
          if (moveNo === 0) currentLevel = level;
        }
      })
    
    // one time click events that react to human picking a side
    // immediately followd by setLevel function
    $("#pickX").on("click", function() {
      human = "X";
      computer = "O";
      setLevel();
    });
    $("#pickO").on("click", function() {
      human = "O";
      computer = "X";
      setLevel();
    });
      // prints red strikethrough line to mark the winning combination
      // takes in U, D, h1, h2, h3, v1, v2, v3 (all strings)
    // input is used to form id and class names
  // z-index is changed to bring the placeholder element into the visible zone above board
  // eval is used so a string could be used as variable
    function printS(loc) {
      $(".strike" + loc[0].toUpperCase()).css("z-index", "1");
      $("#s" + loc).html(eval("addStrike" + loc[0].toUpperCase()));
      return;
    }
      // deletes red strikethrough line that marked the winning combination
  // z-index is lowered to put the placeholder back under the board so it wouldn't 
  // block the interaction with the board
    function deleteS(loc) {
      $(".strike" + loc[0].toUpperCase()).css("z-index", "-1");
      $("#s" + loc).html("");
      return;
    }
      //--------------------
  // go through all possible winning combination and check if player (variable, can be human or computer)
  //played a winning move, returns -1 if there is no winner otherwise returns index of the winning combination
    function foundWinner(player) {
      var j = 0;
      while (j < currentMoves.length) {
        if (currentMoves[j][0] === player && currentMoves[j][1] === player && currentMoves[j][2] === player) return j;
        j++;
      }
      return -1;
    }
  //handle game end - reset the arrays with positions and winning combinations to initial values
  //set difficulty level for the next game (in case it was changed)
  //reset the move counter and the playToWin position to 0
      function endGame() {
      currentMoves = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
      ];
      availablePositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      bestPositions = [1, 3, 5, 7, 9];
      currentLevel = level;
      moveNo = 0;
      playToWin = 0;
          //leave the finished game on for 2 seconds then clear the board for the next game
      setTimeout(function() {
        $(".position").text("");
        deleteS(winningCode[indexOfWinner]);
      }, 2000);
        //switch the player who starts the next game
      if (started === "human") {
        started = "computer";
        computerNext = true;
      } else started = "human";
      return;
    }
  
  // checks if one of the potential winning combinations has two player symbols and an empty space
  // making it open for playing and winning the game
  // used both to find a move that will win the game for the computer and to find a potential winning position
  // for the human and play it in order to prevent human from playing it
  // returns index of the first element that fits the criteria or [-1,-1] if there is no such element
    function twoOutOfThree(player, other) {
      var i = 0;
      //currentMoves length = 8
      while (i < 8) {
        if (currentMoves[i].indexOf(other) === -1) {
          if (currentMoves[i][0] === player) {
            if (currentMoves[i][1] === player) return [i, 2];
            else if (currentMoves[i][2] === player) return [i, 1]
          } else if (currentMoves[i][1] === player && currentMoves[i][2] === player) return [i, 0];
        }
        i++
      }
      return [-1, -1];
    }
// bestPositions is an array made of currently unoccupied corner positions and the center (if it's not occupied)
  // function below picks computer move at random from bestPositions
    function pickBestRandom() {
      randomNumber = Math.floor(Math.random() * bestPositions.length);
      computerNextMove = bestPositions[randomNumber];
      return;
    }
//availablePositions is an array made of currently unoccupied positions on the board
  //function below pics computer move at random from availablePositions
    function pickAnyRandom() {
      randomNumber = Math.floor(Math.random() * (9 - moveNo));
      computerNextMove = availablePositions[randomNumber];
    }
    //Casual level - computer will play at random unless it has an
    //opportunity to win the game. It doesn't check if the human has
    //an oportunity to win, so it doesn't play to preven it
    // move numbers start from 0 (first move), moveNo=4 actually represents 5th move this is so
  // because the counter for moves is advanced later on in another function after the move has been chosen
    function levelCasual() {
      if (moveNo < 3) {
        pickAnyRandom();
        return;
      } else {
        potentialWinner = twoOutOfThree(computer, human);
        if (potentialWinner[0] !== -1) {
          computerNextMove = currentMoves[potentialWinner[0]][potentialWinner[1]];
          return;
        }
      }
      pickAnyRandom();
      return;
    }

    //level medium - computer will pick a good starting position,
    // it checks if it is in a position to win and if it is uses it 
    // it also checks to see if human has a chance to win in the next move and prevents it
    // it's not unbeatable, human has a chance to win
    // move numbers start from 0 (first move), moveNo=4 actually represents 5th move this is so
  // because the counter for moves is advanced later on in another function after the move has been chosen
    function levelMedium() {
      if (moveNo===0 || moveNo===2) {pickBestRandom();return;}
      if (moveNo===1) {pickAnyRandom();return;} //this could be omitted as it would go through and execute in the end of the function, I left it here to make it easier to follow the logic of the algorithm
      //potential winner can only be human at this point, check if it is
      if (moveNo === 3) {
        potentialWinner = twoOutOfThree(human, computer);
        //if there is a potential winning combination, play to preven human from winning
        if (potentialWinner[0] !== -1) {
          computerNextMove = currentMoves[potentialWinner[0]][potentialWinner[1]];
          return;
        }
      }
      //check if potential winner is computer if it is play the winning move
      if (moveNo > 3 && moveNo < 9) {
        potentialWinner = twoOutOfThree(computer, human);
        if (potentialWinner[0] !== -1) {
          computerNextMove = currentMoves[potentialWinner[0]][potentialWinner[1]];
          return;
        }
        //check if human has a chance to win with the next move and if so play the winning move to prevent the win
        potentialWinner = twoOutOfThree(human, computer);
        if (potentialWinner[0] !== -1) {
          computerNextMove = currentMoves[potentialWinner[0]][potentialWinner[1]];
          return;
        }
      }
      // otherwise play randomly 
      pickAnyRandom();
      return;
    }
  // level hard - picks good starting move, chooses some critical moves based on what human played
  // uses opportunities to create a fork and guarantee a win
  // it checks to see if it can play a winning combination or prevent human from playing one in the next move
  //it's very hard to beat the computer at this level, but not impossible, a slight opportunity 
  // for the human to win was intentionaly left, so the game would be more interesting
  // as much randomness as possible is preserved to keep the game interesting
  // move numbers start from 0 (first move), moveNo=4 actually represents 5th move this is so
  // because the counter for moves is advanced later on in another function after the move has been chosen
    function levelHard() {
      if (moveNo === 0) {
        pickBestRandom();
        return;
      }
      // if human played first and picked a corner position play the center
      // otherwise pick a random position
      if (moveNo === 1) {
        if (currentMoves[1][1] === 5 && bestPositions.length === 4) {
          computerNextMove = 5;
          return;
        }
        pickAnyRandom();
        return;
      }
    //in the third move if the center is not occupied 
      // (computer played a corner and human played anywhere but the corner)
      // create a fork opportunity that will lead to a certain win later in the game
      if (moveNo === 2) {
        if (currentMoves[1][1] === 5) {
          //if human played a corner pick an appropriate corner depending on position of the corner computer
          // played in the first move, if there are two appropriate corners choose one at random
          // if needed rememer the move that will create a fork in the 5th move (playToWin is the position of that move)
          if (bestPositions.length === 3)
            switch (computerNextMove) {
              case 1:
                if (currentMoves[2][2] !== human) {
                  computerNextMove = 9;
                  return;
                } else {
                  randomNumber = Math.floor(Math.random() * 2);
                  if (randomNumber === 0) {
                    computerNextMove = 3;
                    playToWin = 7;
                    return;
                  } else {
                    computerNextMove = 7;
                    playToWin = 3;
                    return;
                  }
                }
              case 3:
                if (currentMoves[2][0] !== human) {
                  computerNextMove = 7;
                  return;
                } else {
                  randomNumber = Math.floor(Math.random() * 2);
                  if (randomNumber === 0) {
                    computerNextMove = 1;
                    playToWin = 7;
                    return;
                  } else {
                    computerNextMove = 7;
                    playToWin = 1;
                    return;
                  }
                }
              case 7:
                if (currentMoves[0][2] !== human) {
                  computerNextMove = 3;
                  return;
                } else {
                  randomNumber = Math.floor(Math.random() * 2);
                  if (randomNumber === 0) {
                    computerNextMove = 1;
                    playToWin = 9;
                    return;
                  } else {
                    computerNextMove = 9;
                    playToWin = 1;
                    return;
                  }
                }
              case 9:
                if (currentMoves[0][0] !== human) {
                  computerNextMove = 1;
                  return;
                } else {
                  randomNumber = Math.floor(Math.random() * 2);
                  if (randomNumber === 0) {
                    computerNextMove = 3;
                    playToWin = 7;
                    return;
                  } else {
                    computerNextMove = 7;
                    playToWin = 3;
                    return;
                  }
                }
            }
          else
            //if human/s first move (after the computer played a corner) was to play a side position (2,4,6,8)
            //play the corner that will create a for opportunity and lead to a certain win
            //use playToWin to store the 5th move that will complete the fork
            switch (computerNextMove) {
              case 1:
                if (currentMoves[0][1] === human || currentMoves[1][2] === human)
                  computerNextMove = 7;
                else computerNextMove = 3;
                playToWin = 9;
                return;
              case 3:
                if (currentMoves[0][1] === human || currentMoves[1][0] === human)
                  computerNextMove = 9;
                else computerNextMove = 1;
                playToWin = 7;
                return;
              case 7:
                if (currentMoves[0][1] === human || currentMoves[1][0] === human)
                  computerNextMove = 9;
                else computerNextMove = 1;
                playToWin = 3;
                return;
              case 9:
                if (currentMoves[0][1] === human || currentMoves[1][2] === human)
                  computerNextMove = 7;
                else computerNextMove = 3;
                playToWin = 1;
                return;
            }
        }
        // if human played center as their first move (second move of the game) pick a random position for the computer's next move
        pickAnyRandom();
        return;
      }
// fourth move human played first move, computer second, human third, it's computer's turn
      if (moveNo === 3) {
 // if human played oposite corners, computer first move could only be the center
        // play a random side position to prevent human from creating a fork
        if ((currentMoves[0][0] === human && currentMoves[2][2] === human) ||
          (currentMoves[0][2] === human && currentMoves[2][0] === human)) {
          randomNumber = Math.floor(Math.random() * 4) + 1;
          computerNextMove = randomNumber * 2;
          return;
        }
              //potential winner can only be human at this point, check if it is so
        potentialWinner = twoOutOfThree(human, computer);
        //if there is a chance for the human to win in the next move play the potential winning position
        //to prevent the human from playing it
        if (potentialWinner[0] !== -1) {
          computerNextMove = currentMoves[potentialWinner[0]][potentialWinner[1]];
          return;
        }
        //if central position is available make it computer's next move to maximize computer's chances of 
        //winning and minimize human's chances
        if (currentMoves[1][1] === 5) {
          computerNextMove = 5;
          return;
        }
        // otherwise we skip to the end of the function and play one of the remaining corners
        // this opens a slight possibility for the human to create potential for a fork and ultimately
        // example: human plays 3, computer plays center (5), human plays 4 if then
        // computer randomly picks corner 9 to play human will get a chance to win
        // this can be prevented with the algorithm but I chose to leave it so the game would
        // be more interesting to play, there's no fun in playing a game that you can never win
      }
// fifth to last move are bundled together
      if (moveNo > 3 && moveNo < 9) {
              //check if potential winner is computer if it is play the winning move
        potentialWinner = twoOutOfThree(computer, human);
        if (potentialWinner[0] !== -1) {
          computerNextMove = currentMoves[potentialWinner[0]][potentialWinner[1]];
          return;
        }
        // check if fifth move can create a fork if true play to create it
        if (moveNo === 4 && playToWin !== 0) {
          computerNextMove = playToWin;
          return;
        }
        // check if human has a chance to win with the next move and move to prevent the win if  it's true
        potentialWinner = twoOutOfThree(human, computer);
        if (potentialWinner[0] !== -1) {
          computerNextMove = currentMoves[potentialWinner[0]][potentialWinner[1]];
          return;
        }
      }
      //if there are any unoccupied positions from the bestPositions group pick one of them at random
      if (bestPositions.length !== 0) {
        pickBestRandom();
        return;
      }
      //otherwise pick of the unoccupied positions at random
      pickAnyRandom();
      return;
    }
// part of the computer move function that is repeated a number of times, so the code is given it's own function to avoid the repetition
    function computerMoveCheck() {
        //advance the move counter by one
      moveNo++;
     // after the fourth move start checking if the move computer played produced a win
      //if it did print the red strikethrough line, advance and update the lost score counter
      // call the function that handles the end of the game
      if (moveNo > 4) {
        indexOfWinner = foundWinner(computer);
        if (indexOfWinner != -1) {
          printS(winningCode[indexOfWinner]);
          lost++;
          $("#scoreLost").text(lost);
          endGame();
        } 
        // if  there was no win and the last available move was played advance and update the tied score counter
        else if (moveNo === 9) {
          tied++;
          $("#scoreTied").text(tied);
          endGame();
        } //end of if last move
      } //end of if more than 4 moves were played
      return;
    }
    // check if it's computer's turn to play first, if it is wait 2s for the board to clear then play
    function checkIfComputerMoveAfterLoss() {
      if (computerNext === true) {
        computerNext = false;
        setTimeout(function() {
          computerMove();
        }, 2000);
      }
      return;
    }
    //handles computer move
    function computerMove() {
      //pick the next move computer will play depending on the difficulty level
      if (currentLevel === "casual") levelCasual();
      else {
        if (currentLevel === "medium") levelMedium();
        else levelHard();
      }
      // remove the chosen move position from availablePoisitions and if it's a corner or center also from bestPositions
      availablePositions.splice(availablePositions.indexOf(computerNextMove), 1);
      if (bestPositions.indexOf(computerNextMove) !== -1)
        bestPositions.splice(bestPositions.indexOf(computerNextMove), 1);
      //print the cumputer symbol in the chosen position, update the currentMoves array
      //check if there was a computer win or if game ended in a tie
      //check if it's computers turn to play if not idle allowing the human to play
      switch (computerNextMove) {
        case 1:
            $("#p11").html(eval("add" + computer));
            currentMoves[0][0] = computer;
            currentMoves[3][0] = computer;
            currentMoves[6][0] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 2:
            $("#p12").html(eval("add" + computer));
            currentMoves[0][1] = computer;
            currentMoves[4][0] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 3:
            $("#p13").html(eval("add" + computer));
            currentMoves[0][2] = computer;
            currentMoves[5][0] = computer;
            currentMoves[7][0] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 4:
            $("#p21").html(eval("add" + computer));
            currentMoves[1][0] = computer;
            currentMoves[3][1] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 5:
            $("#p22").html(eval("add" + computer));
            currentMoves[1][1] = computer;
            currentMoves[4][1] = computer;
            currentMoves[6][1] = computer;
            currentMoves[7][1] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 6:
            $("#p23").html(eval("add" + computer));
            currentMoves[1][2] = computer;
            currentMoves[5][1] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 7:
            $("#p31").html(eval("add" + computer));
            currentMoves[2][0] = computer;
            currentMoves[3][2] = computer;
            currentMoves[7][2] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 8:
            $("#p32").html(eval("add" + computer));
            currentMoves[2][1] = computer;
            currentMoves[4][2] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
        case 9:
            $("#p33").html(eval("add" + computer));
            currentMoves[2][2] = computer;
            currentMoves[5][2] = computer;
            currentMoves[6][2] = computer;
            computerMoveCheck();
            checkIfComputerMoveAfterLoss();
          break;
      }
    }
    //check for end of the game after human played
    function humanMoveCheck() {
      moveNo++;
      // after the fourth move start checking if the move human played produced a win
      //if it did print the red strikethrough line, advance and update the won score counter
      // then call the function that handles the end of the game
      if (moveNo > 4) {
        indexOfWinner = foundWinner(human);
        if (indexOfWinner != -1) {
          printS(winningCode[indexOfWinner]);
          won++;
          $("#scoreWon").text(won);
          endGame();
        } //end of if there was a winning combination
        //check if the final moved was played without a win, if true advance tied counter, end game
        else if (moveNo === 9) {
          tied++;
          $("#scoreTied").text(tied);
          endGame();
        } //end of if last move
      }
      return;
    }
    //check if the next move should be played by the computer and if so call the computerMove function
  //allow 2 seconds for the board to clear
    function checkIfComputerMove() {
      if (moveNo !== 0 || computerNext === true) {
        if (computerNext === true) computerNext = false;

        if (moveNo !== 0) computerMove();
        else setTimeout(function() {
          computerMove();
        }, 2000);
      }
      return;
    }
    //handle click events  on the board positions, only react if the position is unoccupied
  //remove chosen position from availablePositions and if corner or center from bestPositions, too
  // print computer player symbol in the chosen position
  //update the currentMoves array, check if there was a win or a tie,
  //check if it's computer's turn to play
    $("#p11").on("click", function() {
        if (currentMoves[0][0] === 1) {
          availablePositions.splice(availablePositions.indexOf(1), 1);
          bestPositions.splice(bestPositions.indexOf(1), 1);
          $("#p11").html(eval("add" + human));
          currentMoves[0][0] = human;
          currentMoves[3][0] = human;
          currentMoves[6][0] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p11
    $("#p12").on("click", function() {
        if (currentMoves[0][1] === 2) {
          availablePositions.splice(availablePositions.indexOf(2), 1);
          $("#p12").html(eval("add" + human));
          currentMoves[0][1] = human;
          currentMoves[4][0] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p12
    $("#p13").on("click", function() {
        if (currentMoves[0][2] === 3) {
          availablePositions.splice(availablePositions.indexOf(3), 1);
          bestPositions.splice(bestPositions.indexOf(3), 1);
          $("#p13").html(eval("add" + human));
          currentMoves[0][2] = human;
          currentMoves[5][0] = human;
          currentMoves[7][0] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p13
    $("#p21").on("click", function() {
        if (currentMoves[1][0] === 4) {
          availablePositions.splice(availablePositions.indexOf(4), 1);
          $("#p21").html(eval("add" + human));
          currentMoves[1][0] = human;
          currentMoves[3][1] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p21
    $("#p22").on("click", function() {
        if (currentMoves[1][1] === 5) {
          availablePositions.splice(availablePositions.indexOf(5), 1);
          bestPositions.splice(bestPositions.indexOf(5), 1);
          $("#p22").html(eval("add" + human));
          currentMoves[1][1] = human;
          currentMoves[4][1] = human;
          currentMoves[6][1] = human;
          currentMoves[7][1] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p22
    $("#p23").on("click", function() {
        if (currentMoves[1][2] === 6) {
          availablePositions.splice(availablePositions.indexOf(6), 1);
          $("#p23").html(eval("add" + human));
          currentMoves[1][2] = human;
          currentMoves[5][1] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p23
    $("#p31").on("click", function() {
        if (currentMoves[2][0] === 7) {
          availablePositions.splice(availablePositions.indexOf(7), 1);
          bestPositions.splice(bestPositions.indexOf(7), 1);
          $("#p31").html(eval("add" + human));
          currentMoves[2][0] = human;
          currentMoves[3][2] = human;
          currentMoves[7][2] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p31
    $("#p32").on("click", function() {
        if (currentMoves[2][1] === 8) {
          availablePositions.splice(availablePositions.indexOf(8), 1);
          $("#p32").html(eval("add" + human));
          currentMoves[2][1] = human;
          currentMoves[4][2] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p32
    $("#p33").on("click", function() {
        if (currentMoves[2][2] === 9) {
          availablePositions.splice(availablePositions.indexOf(9), 1);
          bestPositions.splice(bestPositions.indexOf(9), 1);
          $("#p33").html(eval("add" + human));
          currentMoves[2][2] = human;
          currentMoves[5][2] = human;
          currentMoves[6][2] = human;
          humanMoveCheck();
          checkIfComputerMove();
        } //end of if not already clicked
      }) //end of click on p33

  }) // end of document ready