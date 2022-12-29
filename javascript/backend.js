var numSelected = 0;
var wordList = [];
var wordListUnchanged = [];
var foundWordList = [];
var row;
var col;
var table;
var wordSearch =[];
var numWords = -1;
var innerHints;
var innerWrods;
var startTime;
var elapsedTime;
var timerInterval;
var finalTime;
var puzzleLoaded =false;
var sfxSlider;
var musicSlider;
var pauseGame = false;


var wordAndHint = {

}


/**
 * This functino is used to read a wordsearch file
 */
function readFile(){
  document.getElementById("load").onclick = () =>{
    const file  = document.getElementById("file");
    console.log(file);
  }

}

/**
 * This function is used to hightlight letter that are selected in the wordsearch
 * @param {} node 
 */
function highlight(node){
    "use strict";

  if(node.className == ""){
        node.className = "selected";
       playSound("select");
        
  }
  else if(node.className == "selected"){
    node.className = "";
    playSound("deselect");
  }

}


function playSound(sound){
  switch(sound){
    case "select":{
      const sound = document.getElementById("selectSound");
        sound.play();
        break;

    } case "deselect":{
        const sound = document.getElementById("deselectSound");
        sound.play();
        break;
    } case "clear":{
      const sound = document.getElementById("clearSound");
      sound.play();
      break;
    } case "wordFound":{
      const sound = document.getElementById("wordFoundSound");
      sound.play();
      break;
    } case "winner":{
      const sound = document.getElementById("winnerSound");
      sound.play();
      break;
    } case "background":{
      const sound = document.getElementById("backgroundMusic");
      sound.play();

      break;
    }
  }
}

function resetSound(sound){
  switch(sound){
    case "background":{
      const background = document.getElementById("backgroundMusic");
      background.pause();
      background.currentTime =0;
      break;
    }
  }
}


/**
 * This function is used to crate the tags for the wordserach table
 */
function createTable(){
  table = document.getElementById("table");
  let t ='';
  for(let i =0; i<row; i++){
    t +='<tr>'
    for(let j =0; j<col; j++){
      t+='<td style="font-size:20px">';
      t+=wordSearch[i][j];
      t+='</td>';

    }
    t+= '</tr>';
  }

  table.innerHTML = t;

  console.log(table);

}

/**
 * This fucntion is used to clear all the highlighed words
 */
function clearHighlights(){
  console.log("Clearning");
  for(let node of document.querySelectorAll("td")){
    node.className="";
  }
  numSelected =0;
}

function clearAll(){
  clearHighlights();
  unStrikeThrough();
  setWordsHidden();
  wordList = [...wordListUnchanged];
  foundWordList=[];
  playSound("clear");
  pauseTime();

  
  startTime =0;
  elapsedTime =0;
  timerInterval =null;
  let display = document.getElementById("display").innerHTML = `00:00:00` ;
  if(puzzleLoaded === true){
  startTimer();
  resetSound("background");
  playSound("background");
  }
}

function zerofy(){
   wordList = [];
   wordListUnchanged = [];
   foundWordList = [];
   wordSearch =[];
   numWords = -1;
   wordAndHint = {
  
  }
  
  var hints = document.getElementById("hints");
  var wordsFound = document.getElementById("found");
 // document.getElementById("pause_play").src = "pause.png"; 

  hints.innerHTML = innerHints;
  wordsFound.innerHTML = innerWrods;
}

/**
 * This function is used to look for words in every directino of the words search
 */
 function findwords(){
  "use strict";

        //when we have something selected can we check adjacent
        for(let i =0; i<table.rows.length; i++){
          for(let j =0; j<table.rows[i].cells.length; j++){
            for(let x =-1; x<=1; x++){
              for(let y =-1; y<=1; y++){
                 for(let word of wordList){
                    if((table.rows[i].cells[j].className == "selected" || table.rows[i].cells[j].className == "found")  && table.rows[i].cells[j].innerHTML == word[0]){
                       matchLetters(word,i,j,x,y)               
                         
                     }
               
              }
            }
           }
          }       
    }
}

/**
 * This function is a helper function for "findWords." It checks if a words matches the one being seeked.
 * @param {*} word
 * @param {*rows} i 
 * @param {*colums j}
 * @param {*row offset} x 
 * @param {*colum offset} y 
 * 
 * @returns 
 */
function matchLetters(word,i,j,x,y){
  console.log(`table rows:${table.rows.length} table colums:${table.rows[0].cells.length}` );
  "use strict";
  

    for(let p = 1; p<word.length; p++){ // start at 1 since were checking second letter first 
     
     console.log(`i: ${i}  x: ${x} j: ${j} y: ${y}`);
      if(i+x > table.rows.length-1 || i+x<0 || j+y>table.rows[0].cells.length-1 || j+y<0||!(word[p] === table.rows[i+x].cells[j+y].innerHTML)||table.rows[i+x].cells[j+y].className==""){ // check if letters don't match and if values are out of bounds
       
          return false;
      }
      i+=x;
      j+=y;
    }


    // mark each letter as found, which changes the square colour to 'tomato'
    for(let p=0; p<word.length;p++){
      table.rows[i].cells[j].className="found";
      i-=x;
      j-=y;
    }
    let index = wordList.indexOf(word);
    foundWordList.push(word);
    wordList.splice(index,1);
    // console.log(wordList);
    // console.log(foundWordList);
    // console.log(`Found the word: ${word}`);
    playSound("wordFound");
    strikeThrough(word);
    wordFound(word);
    return true;
  
}

/**
 * This functions checks if a words is found in the wordseach
 * @param {*} word 
 */
function wordFound(word){
  let element = document.getElementById("found").querySelectorAll("li");

  for(let e of element){
    if(word == e.firstChild.innerHTML)
      e.firstChild.style.visibility="visible";
      congratulations();
  }
  
  console.log(`has "${element.length}"" elements`);
}

function setWordsHidden(){
  let element = document.getElementById("found").querySelectorAll("li");
  for(let e of element){
    e.firstChild.style.visibility="hidden";
  }

}

/**
 * This function applies the strikethrough style to words that are found 
 * @param {*} word 
 */
function strikeThrough(word){
  console.log("strikeThrough");
  let hint = wordAndHint[word];
  let element = document.getElementById("hints").querySelectorAll("span");
  for(let h of element){
    if(hint === h.innerHTML)
     h.style="text-decoration:line-through";
     console.log(`${hint}: ${h.innerHTML}`);
  }
}

function unStrikeThrough(){
  let element = document.getElementById("hints").querySelectorAll("span");
  for(let h of element){
     h.style="";
  }

}



/**
 * Thuis functions creates and loads teh hhint and words found table.
 */
function loadHintsAndWords(){
  var hints = document.getElementById("hints");
  var wordsFound = document.getElementById("found");
  var hintText = hints.innerHTML;
  var wordsText = wordsFound.innerHTML;


  // creates the tags for the for the words and hints and adds the words to the table
  for(word in wordAndHint){
    
    wordsText +=`<li><div>${word}</div></li>`
    hintText+=`<li><span>${wordAndHint[word]}</span>    <img class="showHints" src="../image/exclamMark.png" onclick="showHint(event)"> <span class="showWord">${word}</span></img></li>`
  }


  hints.innerHTML = hintText;
  wordsFound.innerHTML = wordsText;

}

function showHint(event){
  var value = event.target.nextElementSibling;

  if(value.style.visibility =="hidden"){
    value.style.visibility="visible";
  }

  else{
    value.style.visibility="hidden";
  }
}

/**
 * This function is used to fill the rest of the wordsearch with random letters.
 */
function fillTable(){
  for(let node of document.querySelectorAll("td")){
    node.onclick = function(){
    highlight(node);
    
    if(node.className == "selected")
        findwords();
    }

    if(node.textContent != ".") continue;
    let charCode = Math.round(65 + Math.random()*25);
    node.textContent = String.fromCharCode(charCode);
  }
}

/**
 * This function is used to display a congratulations sign when 
 * the user completes the wordsearch
 */
function congratulations(){
 
  if(foundWordList.length === numWords){
    resetSound("background");
    pauseTime();
    finalTime = document.getElementById("display").innerHTML;
    document.getElementById("finalTime").innerHTML = `Time taken: ${finalTime}`;
    playSound("winner");
    let popup = document.getElementById("victory");
    popup.classList.add("popupVis");
  }
  
}

function closePopup(){
  let popup = document.getElementById("victory");
  popup.classList.remove("popupVis");
}

/**
 * This function formats the stop watch, and displays the time.
 * @param {time in miliseconds} time 
 */
function timeToString(time){
  let display = document.getElementById("display");
  let dh = time/3600000; // difference in hours  
  let hh = Math.floor(dh);// hours
  let dm = (dh-hh)*60; // difference in minutes
  let mm = Math.floor(dm); // minutes
  let ds = (dm - mm)*60;// difference in seconds 
  let ss = Math.floor(ds); // seconds

  let fhh = hh.toString().padStart(2,'0');
  let fmm = mm.toString().padStart(2,'0');
  let fss = ss.toString().padStart(2,'0');

  let timer = `${fhh}:${fmm}:${fss}`;
  display.innerHTML= timer;
}

function startTimer(){
  startTime = Date.now()-elapsedTime;
  timerInterval =  setInterval(function printTime(){
    elapsedTime = Date.now() - startTime;
    timeToString(elapsedTime);
  }, 1000);

}

function pauseTime(){

  clearInterval(timerInterval);

}


function pauseGame(){
 

}

function disableClicks(e){

  if(pauseGame === true){
    e.stopPropagation();
    e.preventDefault();
    console.log("dclicks")
   }

}

window.onload = function(){
  document.addEventListener("click",disableClicks, true);
   
  document.addEventListener("keypress", function(e){
 
    if(e.key == "p" || e.key == "P"){
      if (pauseGame === false){
       document.getElementById("pause_play").src ="../image/pause.png";
        pauseGame = true;
        // puase timer
        pauseTime();
        // pause music
        const background = document.getElementById("backgroundMusic");
        background.pause();
        // disables mouse clicks
        
      }
    
      else if(pauseGame === true){
        document.getElementById("pause_play").src ="../image/play.png";
        pauseGame = false
        // resume timer
        startTimer();

        // resume music
        const background = document.getElementById("backgroundMusic");
        background.play();
        
        // enable mouse clicks
      }
    }
  });
    sfxSlider = document.getElementById("sfxSlider");
    musicSlider = document.getElementById("musicSlider");
    sfxSlider.value = document.getElementById("selectSound").volume*100;
    musicSlider.value = document.getElementById("backgroundMusic").volume*100;
    sfxSlider.addEventListener("change", function(){
     var sounds = document.getElementsByClassName("sound");
     var input= sfxSlider.value/100;


     for(s of sounds){
        s.volume = input;
     }
    });

    musicSlider.addEventListener("change", function(){
      var input = musicSlider.value/100;
      var sound=  document.getElementById("backgroundMusic");

     sound.volume = input;

    });
    musicSlider = document.getElementById("musicSlider");
    console.log(sfxSlider);
    console.log(musicSlider);
    table = document.getElementById("table");
    innerHints = document.getElementById("hints").innerHTML;
    innerWrods = document.getElementById("found").innerHTML;
    console.log(`innerHints: ${innerHints}, innerWords${innerWrods}`);

   document.getElementById("load").onclick = () =>{
    zerofy();
    const file  = document.getElementById("input");
    //create a file reader object
    let reader = new FileReader();
    // register onload function
      reader.onload = (e)=>{ 
        document.getElementById("pause_play").src = "../image/play.png";
          puzzleLoaded = true;
          startTime =0;
          elapsedTime =0;
          let display = document.getElementById("display").innerHTML = `00:00:00` ;
          startTimer();
      
        var hints = [];
        const file = e.target.result;
        const lines = file.split(/\n/);
         numWords = parseInt(lines[0]);
         wordList = lines[1].split(/\s/);

        wordList.pop(); // removes the last value which is ""
        wordListUnchanged = [...wordList];
        console.log(numWords);
        console.log(lines[1].split(/\s/));

        for(let i =0; i< numWords; i++){ // stores the hints read from the file
          hints[i] = lines[2+i].replace(/^\s+|\s+$/,'');
          console.log(hints[i]);
        }
       for(let i =0; i< wordList.length; i++){ // adds the hints to the object wordAndHints
         wordAndHint[wordList[i]] =  hints[i];
       }
       let position = 2+numWords;
       row = parseInt(lines[position].split(/\s/)[0]);
       col = parseInt(lines[position].split(/\s/)[1]);
       position++;

       //console.log(`rows: ${row}  colums: ${col}`);

       for(let i=0; i< row; i++){
        wordSearch[i] = lines[position+i].replace(/^\s+|\s+$/,'').split(/\s/);
       }

       createTable();
       fillTable();
       loadHintsAndWords();
       resetSound("background");
       playSound("background");

       //console.log(wordAndHint);
    }
    // read the file
    reader.readAsText(file.files[0]);
  }

  document.getElementById("clear").onclick = ()=>{
    clearAll();
  }

}