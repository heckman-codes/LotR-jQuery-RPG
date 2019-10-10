var characters = [];

function initializeCharacters() {
    var aragorn = {
        name: "Aragorn",
        hp: 120,
        ap: 11,
        cp: 27,
        pic: "./assets/images/aragorn.png",
    };
    var sauron = {
        name: "Sauron",
        hp: 170,
        ap: 20,
        cp: 24,
        pic: "./assets/images/sauron.png",
    };
    var witchKing = {
        name: "Witch King",
        hp: 120,
        ap: 15,
        cp: 13,
        pic: "./assets/images/witchking.png",
    };
    var gandalf = {
        name: "Gandalf",
        hp: 110,
        ap: 9,
        cp: 23,
        pic: "./assets/images/gandalf.png",
    };
    characters = [];
    characters.push(aragorn, gandalf, witchKing, sauron);

    baseAttack = 0;
}

var baseAttack = 0;
var yourCharacter;
var defendingCharacter;


var audioIsPlaying = false;

function playAudio() {
    var audio = new Audio("assets/lotr-theme.mp3");
    audio.play();
    audioIsPlaying = true;
}


initializeGame();

// This resets the game display to the initial state
function initializeGame() {

    //Empties all divs that store characters
    $("#character-selection, #defender-section, #enemy-selection, #attack-message, #defense-message").empty();
    initializeCharacters();

    // Initial state. Menu where you choose your character
    $("#left-div").css("width", "100%");
    $("#header-text").text("Choose your character");
    $("#right-div").css("display", "none");
    $("#reset").css("display", "none");
    $("#attack").css("display", "initial");


    // Creates divs that hold each characters information
    for (let i = 0; i < characters.length; i++) {
        var character = $("<div>");
        var characterName = $("<p>")
        var characterHp = $("<p>")
        character.addClass("character").attr("id", characters[i].name);
        $("#character-selection").append(character);
        character.append(characterName);
        character.append(characterHp);
        character.css("backgroundImage", "url(" + characters[i].pic + ")");
        characterName.addClass("name-stat");
        characterHp.addClass("hp-stat");
        characterName.text(characters[i].name);
        characterHp.text("Health Points: " + characters[i].hp);
    }
};

//This click function places what ever character you clicked into "your hero" section
$("#character-selection").on("click", ".character", function (c) {
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].name == this.id) {
            yourCharacter = characters[i];
            Math.max(0, yourCharacter.hp);
            playerSelected = true;
            baseAttack = characters[i].ap;
            console.log(yourCharacter);
            console.log(baseAttack);
        }
        // This will play the battle music if it isn't already playing
    } if (audioIsPlaying == false) {
        playAudio();
    }
    //When you select every character card disappears (opacity goes to 0)
    $(".character").css("opacity", "0");
    $(this).removeClass("character").addClass("your-character");
    $(".your-character").append(c.this);
    $("#header-text").text(yourCharacter.name + " is your hero");

    //This click function removes each character that isn't your selection and puts them into the enemy selection
    $(".character").off("click").each(function () {
        $(".character").removeClass("character").addClass("enemies");
        $('#enemy-selection').append(this);
    });

    // Fades your character in and sets up battle stage
    $(".your-character").fadeTo(2000, "1");
    $('.characters').remove();
    $("#left-div").css("width", "50%");
    $("#left-div").css("float", "left");
    $("#right-div").css("display", "initial");
    $("#right-div").css("width", "50%");
    $("#right-div").css("float", "right");

    //Enemies fade in after your character 
    $(".enemies").fadeTo(4000, "1");
});

//This function moves enemies to select and puts them in the defender section
$("#enemy-selection").on("click", ".enemies", function (e) {

    $("#attack-message").empty();
    $("#defense-message").empty();

    //This for loop picks what character will be defending
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].name == this.id) {
            defendingCharacter = characters[i];
            Math.max(0, defendingCharacter.hp);
            defenderSelected = true;
            console.log(defendingCharacter);
        }
    }
    // If you already picked a defender it lets us know that there can only be one
    if ($(".defender").length == 1) {
        $("#attack-message").text("You can only choose one defender");
    }

    // If we don't have any defenders we can choose one and it fades into the defender position
    if ($(".defender").length < 1) {
        $(this).removeClass("enemies").addClass("defender");
        $(this).appendTo("#defender-section");
        $("#enemies-section").remove();
        $(".defender").css("opacity", "0");
        $(".defender").fadeTo(1000, "1");
    }
});

// Runs the attack function - math parts
$("#attack").on("click", function () {
    attack();
});

// This is the attack function that handles the math between your hero and the defeneder
function attack() {
    //Empties the messages so they can repopulate with data
    $("#attack-message").empty();
    $("#defense-message").empty();

    //IF you don't have a defender it tells you to choose first and stops the function from running
    if ($(".defender").length == 0) {
        $("#attack-message").text("Choose a character to fight");
        return;

        //This handles the math part
    } else if (yourCharacter.hp > 0 && defendingCharacter.hp > 0); {
        baseAttack = baseAttack + yourCharacter.ap;
        yourCharacter.hp = Math.max(0, (yourCharacter.hp - defendingCharacter.cp));
        defendingCharacter.hp = Math.max(0, (defendingCharacter.hp - baseAttack));
        console.log(baseAttack);
        console.log("your char hp: " + yourCharacter.hp);
        console.log("defending char hp: " + defendingCharacter.hp);
    }

    //This is the damage message you see between combatants
    $("#attack-message").text(yourCharacter.name + " did " + baseAttack + " damage to " + defendingCharacter.name);
    $("#defense-message").text(defendingCharacter.name + " did " + defendingCharacter.cp + " damage to " + yourCharacter.name);

    // If defender is dead remove it from the div
    if (yourCharacter.hp <= 0) {
        $(".your-character").fadeTo(2000, "0");
        $("#attack-message").text(defendingCharacter.name + " has defeated you.");
        $("#defense-message").text("You lose!");
        $("#reset").css("display", "initial");
        $("#attack").css("display", "none");
    } else if (defendingCharacter.hp <= 0) {
        var extraHp = 25;
        yourCharacter.hp = yourCharacter.hp + extraHp;
        $(".defender").delay(2000).fadeTo(2000, "0");
        $(".defender").remove();
        // $(".defender").delay(2000).remove();
        $("#attack-message").text("You have defeated " + defendingCharacter.name + "!");
        $("#defense-message").text("As a winning bonus here's " + extraHp + "hp");
    }

    //If there is no defender, enemies to select, and your HP is above 0 you win!
    if (($(".defender").length == 0) && ($(".enemies").length == 0) && (yourCharacter.hp > 0)) {
        $("#attack-message").text("You won!");
        $("#defense-message").empty();
        $("#reset").css("display", "initial");
        $("#attack").css("display", "none");
        return;
    }


    //These look for elements within the character divs and modifies their values
    $(".your-character").find(".hp-stat").text("Health Points: " + yourCharacter.hp);
    $(".defender").find(".hp-stat").text("Health Points: " + defendingCharacter.hp);


};
// This button resets the game display to the initial state
$("#reset").on("click", function () {
    initializeGame();
});



