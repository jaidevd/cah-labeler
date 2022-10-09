function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function makeAnswer(question, answers, matches) {
  let answer = ''
  if (answers.length == 1) {
    if (matches.length == 1) {
      if (matches[0].index + answers[0].length < question.length) {
        answers[0] = answers[0].replace(/\.+$/, '')
      }
      answer = question.replace('_', answers[0])
    } else {
      answer = question + ` ${answers[0]}`
    }
  } else {
    answer = question
    for (i=0; i<answers.length; i++) {
      answer = answer.replace('_', answers[i])
    }
  }
  return answer.replace(/\.+$/, '.')
}

Vue.createApp({
  data() {
    return {
      question: "",
      answer: "",
      text: "",
      funny: false,
      results: []
    }
  },
  methods: {
    getQA() {
      let question = QUESTIONS.pop()
      matches = [...question.matchAll(/_+/g)]
      let n_matches = matches.length
      let n_ans = n_matches <= 1 ? 1 : n_matches
      let answers = []
      for (i=0; i< n_ans; i++) {
        answers.push(ANSWERS.pop())
      }
      this.question = question
      this.answer = makeAnswer(question, answers, matches)
    },
    toggleQA() {
      this.text = this.text == this.question ? this.answer : this.text
    },
    nextQ(event) {
      // record the current question
      this.results.push({q: this.question, a: this.answer, label: event.target.id})
      this.getQA()
      this.text = this.question
    },
    exportData() {
      let data = JSON.stringify(this.results)
      var win = window.open()
      let url = "data:application/json;charset=utf-8," + encodeURIComponent(data)
      win.document.write(
        '<iframe src="' + url  +
        `" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px;
        right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      )
    }
  },
  mounted() {
    window.addEventListener('keyup', (ev) => {
      if (ev.key == 'Enter') {
        this.toggleQA()
      } else if (ev.key == 'ArrowRight') {
        this.nextQ({target: {id: 'funny'}})
      } else if (ev.key == 'ArrowLeft') {
        this.nextQ({target: {id: 'notfunny'}})
      }
    })
    shuffle(QUESTIONS)
    shuffle(ANSWERS)
    this.getQA()
    this.text = this.question

  }
}).mount('.container')
