{
  const API_URL = 'https://opentdb.com/api.php?amount=10';

  class Quiz {
    constructor(quizData) {
      this.quizzes = quizData.results;
      this.correctAnswerNum = 0;
    }

    getQuizCategory(index) {
      return this.quizzes[index - 1].category;
    }

    getQuizDifficulty(index) {
      return this.quizzes[index - 1].difficulty;
    }
  
    getNumOfQuiz() {
      return this.quizzes.length;
    }

    getQuizQuestion(index) {
      return this.quizzes[index - 1].question;
    }
  
    getCorrectAnswer(index) {
      return this.quizzes[index - 1].correct_answer;
    }

    getIncorrectAnswers(index) {
      return this.quizzes[index - 1].incorrect_answers;
    }
  
    countCorrectAnswerNum(index, answer) {
      const correctAnswer = this.quizzes[index - 1].correct_answer;
      if(answer === correctAnswer) {
        return this.correctAnswerNum++;
      }
    }
  
    getCorrectAnswerNum() {
      return this.correctAnswerNum;
    }
  }

  const titleElement = document.getElementById('head');
  const questionElement = document.getElementById('sentence');
  const answerContainer = document.getElementById('button__area');
  const startButton = document.getElementById('start-button');
  const categoryElement = document.getElementById('category');
  const difficultyElement = document.getElementById('difficulty');

  startButton.addEventListener('click', async () => {
    startButton.hidden = true;
    await fetchQuizDate(1);
  });

  const fetchQuizDate = async (index) => {
    titleElement.textContent = '取得中';
    questionElement.textContent = '少々お待ちください';

    const response = await fetch(API_URL);
    const quizData = await response.json();
    const quizInstance = new Quiz(quizData);

    setNextQuiz(quizInstance, index);
  };

  const setNextQuiz = (quizInstance, index) => {
    while(answerContainer.firstChild) {
      answerContainer.removeChild(answerContainer.firstChild);
    }

    if(index <= quizInstance.getNumOfQuiz()) {
      makeQuiz(quizInstance, index);
    } else {
      finishQuiz(quizInstance);
    }
  }

  const makeQuiz = (quizInstance, index) => {
    titleElement.innerHTML = `問題${index}`;
    categoryElement.innerHTML = `[ジャンル] ${quizInstance.getQuizCategory(index)}`;
    difficultyElement.innerHTML = `[難易度] ${quizInstance.getQuizDifficulty(index)}`;
    questionElement.innerHTML = quizInstance.getQuizQuestion(index);

    const answers = buildAnswers(quizInstance, index);

    answers.forEach((answer) => {
      const buttonElement = document.createElement('button');
      buttonElement.innerHTML = answer;
      answerContainer.appendChild(buttonElement);

      buttonElement.addEventListener('click', () => {
        quizInstance.countCorrectAnswerNum(index, answer);
        index++;
        setNextQuiz(quizInstance, index)
      });
    });
  };

  const finishQuiz = (quizInstance) => {
    titleElement.textContent = `アナタの正解数は${quizInstance.getCorrectAnswerNum()}です！！`;
    categoryElement.textContent = '';
    difficultyElement.textContent = '';
    questionElement.textContent = '再度チャレンジたい場合は以下をクリック！！';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'ホームに戻る';
    answerContainer.appendChild(restartButton);
    restartButton.addEventListener('click', () => {
      location.reload();
    });
  };

  const buildAnswers = (quizInstance, index) => {
    const answers = [
      quizInstance.getCorrectAnswer(index),
      ...quizInstance.getIncorrectAnswers(index)
    ];

    return shuffleArray(answers);
  };

  const shuffleArray = ([...array]) => {
    for(let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
}

