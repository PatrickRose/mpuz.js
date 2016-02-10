var mpuz;

$(function() {
    'use strict';

    mpuz = {
        _firstMultiplyNum: 0,
        _secondMultiplyNum: 0,
        _firstAddNum: 0,
        _secondAddNum: 0,
        _resultNum: 0,

        _vals: {},
        _inverse: {},

        _makingGuess: null,

        _guesses: {},

        _gameHasBeenSolved: false,

        init: function () {
            // Hide it while we fix things
            this._makingGuess = null;
            $('table').hide();
            this._gameHasBeenSolved = false;
            // First, let's shuffle up the numbers 0-9
            var numbers = this.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

            // Now set each of those
            this._vals = {
                'A': numbers[0],
                'B': numbers[1],
                'C': numbers[2],
                'D': numbers[3],
                'E': numbers[4],
                'F': numbers[5],
                'G': numbers[6],
                'H': numbers[7],
                'J': numbers[8],
                'K': numbers[9]
            };

            this._inverse = {};
            this._inverse[numbers[0]] = 'A';
            this._inverse[numbers[1]] = 'B';
            this._inverse[numbers[2]] = 'C';
            this._inverse[numbers[3]] = 'D';
            this._inverse[numbers[4]] = 'E';
            this._inverse[numbers[5]] = 'F';
            this._inverse[numbers[6]] = 'G';
            this._inverse[numbers[7]] = 'H';
            this._inverse[numbers[8]] = 'J';
            this._inverse[numbers[9]] = 'K';

            this._solved = {
                'A': false,
                'B': false,
                'C': false,
                'D': false,
                'E': false,
                'F': false,
                'G': false,
                'H': false,
                'J': false,
                'K': false,
                0: false,
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false,
            };

            this._guesses = {
                'A': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'B': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'C': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'D': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'E': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'F': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'G': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'H': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'J': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
                'K': {
                    0: false,
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                },
            };

            // Now, pick our two values for multiplication
            // We want a three digit and a two digit
            do {
                var isValid = false;
                // first/second add num shouldn't begin with 0,
                // because that's boring
                // Most of those instances will be because the first digit
                // in firstMultiplyNum is a 0 or either digit in
                // secondMultiplyNum is 0
                var firstDigitForFirst = Math.floor(Math.random() * 9) + 1,
                    otherDigitsForFirst = Math.floor(Math.random() * 100),
                    firstDigitForSecond = Math.floor(Math.random() * 9) + 1,
                    secondDigitForSecond = Math.floor(Math.random() * 9) + 1;
                this._firstMultiplyNum = firstDigitForFirst * 100 + otherDigitsForFirst;

                this._secondMultiplyNum = firstDigitForSecond * 10 + secondDigitForSecond;
                this._firstAddNum = secondDigitForSecond * this._firstMultiplyNum;
                this._secondAddNum = firstDigitForSecond * this._firstMultiplyNum;
                // Make sure they don't begin with 0
                isValid = Math.floor(this._firstAddNum / 1000) != 0 &&
                Math.floor(this._secondAddNum / 1000) != 0 &&
                this._matchesDifficulty();

            }
            while (!isValid);

            // We know that this is now valid
            this._resultNum = this._firstAddNum + (this._secondAddNum * 10);

            this._drawNumbers();
            $('table').show();

            $('table#guesses td').html('');
            this._updateStatus('Click a digit to make a guess');
        },

        _matchesDifficulty: function() {
            var difficulty = $('#difficulty .active').data('difficulty'),
                resultNum = this._firstAddNum + (this._secondAddNum * 10),
                exactDigitCount = true,
                numsAsString = this._firstAddNum.toString() + this._secondAddNum.toString() + this._firstMultiplyNum.toString() + this._secondMultiplyNum.toString() + resultNum.toString(),
                digitsAllowed;

            switch (difficulty) {
                case 'easy':
                    digitsAllowed = 5;
                    break;
                case 'medium':
                    digitsAllowed = 6;
                    break;
                case 'hard':
                    digitsAllowed = 7;
                    exactDigitCount = false;
                    break;
                case 'random':
                default:
                    // No point continuing - this always matches that difficulty level
                    return true;
            }

            for(var i = 0; i < 10; i++) {
                var regex = numsAsString.match(new RegExp(i, 'g'));

                if (regex && regex.length > 0) {
                    digitsAllowed--;

                    if (digitsAllowed == 0 && !exactDigitCount) {
                        return true;
                    }

                    if (digitsAllowed < 0 && exactDigitCount) {
                        return false;
                    }
                }
            }

            return true;
        },

        _drawNumbers: function () {
            // Initialise each of these
            this._drawNumber($('table#game tr#multiply-num-1'), this._firstMultiplyNum);
            this._drawNumber($('table#game tr#multiply-num-2'), this._secondMultiplyNum);
            this._drawNumber($('table#game tr#add-num-1'), this._firstAddNum);
            this._drawNumber($('table#game tr#add-num-2'), this._secondAddNum);
            this._drawNumber($('table#game tr#result-num'), this._resultNum);
        },

        _drawNumber: function ($tableRow, number) {
            this._drawDigit($tableRow.find('.ten-thousands'), Math.floor(number / 10000) % 10);
            this._drawDigit($tableRow.find('.thousands'), Math.floor(number / 1000) % 10);
            this._drawDigit($tableRow.find('.hundreds'), Math.floor(number / 100) % 10);
            this._drawDigit($tableRow.find('.tens'), Math.floor(number / 10) % 10);
            this._drawDigit($tableRow.find('.singles'), Math.floor(number % 10));
        },

        _drawDigit: function ($tableCell, number) {
            var letterForNumber = this._inverse[number];

            // This cell doesn't exist
            if ($tableCell.length == 0) {
                return;
            }

            if (this._solved[letterForNumber]) {
                $tableCell.addClass('solved');
                $tableCell.html(number);
            } else {
                $tableCell.removeClass('solved');
                $tableCell.html(letterForNumber);
                $tableCell.attr('data-letter', letterForNumber);
            }
        },

        // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        shuffle: function (array) {
            var temporaryValue, randomIndex, currentIndex = array.length;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        },

        beginGuess: function (letterGuess) {
            // Reset the guess making (in case they select a letter already set)
            this._makingGuess = null;

            if (this._gameHasBeenSolved) {
                this._updateStatus('Game solved! Hit "Regenerate Puzzle" to start again!');
                return;
            }

            // Make sure there is an element with that letter
            if ($("table#game [data-letter='" + letterGuess + "']").length == 0) {
                this._updateStatus(letterGuess + ' is not used in this puzzle');
                return;
            }

            if (this._solved[letterGuess]) {
                this._updateStatus(letterGuess + ' has already been set!');
                return;
            }

            // We're now making a guess
            this._makingGuess = letterGuess;

            // Update the status bar
            this._updateStatus('Making a guess for letter ' + letterGuess + '. Press a number from 0-9');
        },

        _updateStatus: function (newStatus) {
            $("#status-bar #status").html(newStatus);
        },

        handleKeyPress: function (event) {
            // First, are we even making a guess?
            if (this._makingGuess === null) {
                // They might be starting a new guess
                var key = event.key.toUpperCase();
                if ($.inArray(key, ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"]) != -1) {
                    this.beginGuess(key);
                }
                return;
            }

            // Check if we have 0-9
            if ($.inArray(event.key, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) == -1) {
                this._updateStatus('You need to press a number from 0-9. You are still guessing for the letter ' + this._makingGuess);
                return;
            }

            this._makeGuess(this._makingGuess, event.key);
        },

        _testIfGameSolved: function () {
            var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];

            for (var i = 0; i < letters.length; i++) {
                var letter = letters[i];
                if (this._solved[letter])
                {
                    // This letter has been solved, so it's fine
                    continue;
                }

                // Is this letter in use?
                if ($("table#game [data-letter='" + letter + "']").length != 0) {
                    this._gameHasBeenSolved = false;

                    return;
                }
            }

            this._gameHasBeenSolved = true;
            this._updateStatus('Game solved! Hit "Regenerate Puzzle" to start again!');
        },

        _makeGuess: function (letter, number) {
            // Have they already made this guess?
            if (this._guesses[letter][number]) {
                this._updateStatus('You already made that guess. You are still guessing for the letter ' + letter);
                return;
            }

            // Has this number been solved?
            if (this._solved[number]) {
                this._updateStatus('That number has already been solved. You are still guessing for the letter ' + letter);
                return;
            }

            if (this._inverse[number] == letter) {
                // Success!
                this._solved[number] = true;
                this._solved[letter] = true;
                this._drawNumbers();
                this._updateStatus("That's correct! " + letter + " is " + number);
                this._guesses[letter] = {
                    0: true,
                    1: true,
                    2: true,
                    3: true,
                    4: true,
                    5: true,
                    6: true,
                    7: true,
                    8: true,
                    9: true
                };
                this._guesses['A'][number] = true;
                this._guesses['B'][number] = true;
                this._guesses['C'][number] = true;
                this._guesses['D'][number] = true;
                this._guesses['E'][number] = true;
                this._guesses['F'][number] = true;
                this._guesses['G'][number] = true;
                this._guesses['H'][number] = true;
                this._guesses['J'][number] = true;
                this._guesses['K'][number] = true;
                this._testIfGameSolved();
            } else {
                this._updateStatus("That's incorrect! " + letter + " is not " + number);
                this._guesses[letter][number] = true;
            }

            this._makingGuess = null;
            this._drawGuessTable();
        },

        _drawGuessTable: function () {
            for (var letter in this._guesses) {
                if (this._guesses.hasOwnProperty(letter)) {
                    for (var number in this._guesses[letter]) {
                        if (this._guesses[letter].hasOwnProperty(number)) {
                            if (this._guesses[letter][number]) {
                                $('table#guesses tr.letter-' + letter + ' td.digit-' + number).html(this._vals[letter] == number ? 'O' : 'x');
                            }
                        }
                    }
                }
            }
        }
    };
});
