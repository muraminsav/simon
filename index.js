var database = firebase.database();
var ref = database.ref("scores");
ref.on("value", gotData, errData);
var nameInput = document.getElementById("name");
let patern = [];
let answ = [];
let level = 0;
let ind = 0;
var scoreArr = [];

function submitScore() {
  var data = {
    name: nameInput.value,
    score: level,
    onBoard: false,
  };
  ref.push(data);
}

function gotData(data) {
  var scores = data.val();
  var keys = Object.keys(scores);

  function myFunction() {
    keys.sort(function (a, b) {
      return scores[b].score - scores[a].score;
    });
    scoreArr = [];
    for (let i = 0; i < 15; i++) {
      let k = keys[i];

      var names = scores[k].name;
      var score = scores[k].score;
      var onBoard = scores[k].onBoard;
      let data = {
        names: names,
        score: score,
        onBoard: onBoard,
      };
      scoreArr.push(data);
      $("#scoreList").append("<li>" + names + ": Level " + score + "</li>");
    }
  }
  myFunction();
}
function errData(err) {
  console.log("Error!");
  console.log(err);
}

const blink = function (num) {
  $(".sq")[num].classList.add(color(num));
  setTimeout(function () {
    $(".sq")[num].classList.remove(color(num));
  }, 150);
};

const color = function (num) {
  switch (true) {
    case num === 0:
      return "dark_green";
    case num === 1:
      return "dark_red";
    case num === 2:
      return "dark_yellow";
    case num === 3:
      return "dark_blue";
  }
};

let paternGen = function (level) {
  patern.push(Math.floor(Math.random() * 4));
};

const equals = function (patern, answ) {
  return JSON.stringify(patern) === JSON.stringify(answ);
};

const paternLight = function () {
  if (patern.length <= ind) {
    return (ind = 0);
  }
  setTimeout(function () {
    ind += 1;
    blink(patern[ind - 1]);
    paternLight();
  }, 600);
  answ = [];
};

var checkAnsw = function (patern, answ) {
  if (answ.length === patern.length) {
    if (equals(patern, answ)) {
      level += 1;
      $("h1").hide().text(`Level: ${level}`).fadeIn(300);
      paternGen(level);
      setTimeout(function () {
        paternLight();
      }, 100);
    } else {
      $("body").css("background-color", "rgb(168 52 52)");
      $("h1").hide().text(`Level: ${level} Tap HERE to restart`).fadeIn(300);
      $(".scoretable").fadeIn(300);
      if (scoreArr[scoreArr.length - 1].score <= level) {
        $(".inputData").show();
      }
    }
  }
};

$("h1").bind("click", function () {
  level = 0;
  $("body").css("background-color", "rgb(18, 18, 66)");
  $("h1").hide().text(`Level: ${level}`).fadeIn(300);
  $(".scoretable").hide();
  $(".inputData").hide();
  patern = [];
  paternGen(level);
  paternLight();
});

$(".submit").bind("click", function () {
  if (level > 1) {
    $("button")[0].classList.add(color(3));
    setTimeout(function () {
      $("button")[0].classList.remove(color(3));
    }, 100);
    submitScore();
    level = 0;

    $("li").remove();
    ref.on("value", gotData, errData);
    $(".input").hide();
  }
});

$(".green").bind("click", function () {
  answ.push(0);
  blink(0);
  checkAnsw(patern, answ);
});
$(".red").bind("click", function () {
  answ.push(1);
  blink(1);
  checkAnsw(patern, answ);
});

$(".yellow").bind("click", function () {
  answ.push(2);
  blink(2);
  checkAnsw(patern, answ);
});
$(".blue").bind("click", function () {
  answ.push(3);
  blink(3);
  checkAnsw(patern, answ);
});
