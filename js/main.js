document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-button');
  const sentence = document.getElementById('sentence');
  const head = document.getElementById('head');
  const category = document.getElementById('category');
  const difficulty = document.getElementById('difficulty');

  
  startButton.addEventListener('click', function(){
  
  firstDisplayQuiz(startButton);
      
  });
  
});

async function firstDisplayQuiz(startButton) {
  
  sentence.innerText = '少々お待ちください';
  head.innerText = '取得中';
  const response = await fetch('https://opentdb.com/api.php?amount=10');
  const json = await response.json();
  const results = await json.results;
  
  let i = 0;
  const correctNumber = 0;
  head.innerText = `問題${i + 1}`;
  category.innerText = `[ジャンル] ${results[i].category}`;
  difficulty.innerText = `[難易度] ${results[i].difficulty}`;
  sentence.innerText = results[i].question;
  startButton.remove();
  const answerButton = results[i].incorrect_answers;
  answerButton.push(results[i].correct_answer);
  
  for(let x = 0; x < answerButton.length; x++) {
    const buttonArea = document.getElementById('button__area');
    const button = document.createElement('button');
    button.innerText = answerButton[x];
    button.addEventListener('click' , function(e) {
      displayQuiz(e,i,results,correctNumber);
    }, false);
    buttonArea.appendChild(button);
  }
}

function startHome() {
  const buttonArea = document.getElementById('button__area');
  sentence.innerText = '以下のボタンをクリック';
  head.innerText = 'ようこそ';
  if(!document.getElementById('start-button')) {
    document.querySelector('button').remove();
    const button = document.createElement('button');
    button.innerText = '開始';
    button.addEventListener('click', function(){
      firstDisplayQuiz(button);
    }, false);
    buttonArea.appendChild(button);
  }
}

function displayQuiz(e, index, results, correctNumber) {
  const clickText = e.target.innerText; 
  if(clickText === results[index].correct_answer) {
    correctNumber = correctNumber + 1;
  }
  const i = index + 1;
  const prevButton = document.querySelectorAll('button');
  const buttonArea = document.getElementById('button__area');
    if(i === results.length) {
      category.innerText = '';
      difficulty.innerText = '';
      for(let y = 0; y < prevButton.length; y++) {
        prevButton[y].remove();
      }
      sentence.innerText = '再度チャレンジたい場合は以下をクリック！！';
      head.innerText = `アナタの正解数は${correctNumber}です！！`;
      const button = document.createElement('button');
      button.innerText = 'ホームへ戻る';
      button.addEventListener('click' , startHome, false);
      buttonArea.appendChild(button);
      return;
    }
    head.innerText = `問題${i + 1}`;
    category.innerText = `[ジャンル] ${results[i].category}`;
    difficulty.innerText = `[難易度] ${results[i].difficulty}`;
    sentence.innerText = results[i].question;
    for(let y = 0; y < prevButton.length; y++) {
      prevButton[y].remove();
    }
    const answerButton = results[i].incorrect_answers;
    answerButton.push(results[i].correct_answer);
    for(let x = 0; x < answerButton.length; x++) {
      const button = document.createElement('button');
      button.innerText = answerButton[x];
      button.addEventListener('click' , function(e) {
        displayQuiz(e, i, results, correctNumber);
      }, false);
      buttonArea.appendChild(button);
    }
}
