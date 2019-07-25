function l(msg){ console.log(msg) }
function gebi(id){ return document.getElementById(id) }

const RESULT_LIMIT = 10000
const BLANK_LIMIT = 5
const LENGTH_LIMIT = 20
const API = 'http://10.0.1.14:8080/'
const DEFINEURL = 'https://duckduckgo.com/?q="define"+'

window.onload = function() {
  let button = gebi("solve")

	gebi("input").onkeydown = enter
	gebi("prefix").onkeydown = enter
	gebi("suffix").onkeydown = enter

	button.onclick = solve
}

function enter(event) {
	if( event.keyCode === 13 ) {
		solve()
		event.preventDefault()
	}
}

function showError(){
		let p = document.createElement('p')
		p.textContent = "very sorry, problem connecting to the server"
		p.setAttribute("id", "error")
		p.setAttribute("style", "height:8em")
		p.setAttribute("style", "width:10em")
		results.appendChild(p)
}

function removeError(){
	let e = gebi("error")
	if(e !== null) {
		e.parentElement.removeChild(e)
	}
}

function solve() {
	removeError()
	let input = gebi("input")
	let prefix = gebi("prefix")
	let suffix = gebi("suffix")

	let mainLetters = input.value
	let prefixLetters = prefix.value
	let suffixLetters = suffix.value

	if(mainLetters.length > 20) {
		mainLetters = mainLetters.substring(0, LENGTH_LIMIT)
	}

	let blanks = mainLetters.split('?').length - 1
	if(blanks > BLANK_LIMIT) {
		for(let i = 0; i < blanks - BLANK_LIMIT; i++) {
			mainLetters = mainLetters.replace('?', '')
		}
	}

	input.value = mainLetters

	let data = { 
		letters: mainLetters,
		prefix: prefixLetters,
		suffix: suffixLetters
	}

	let request = new XMLHttpRequest();

	request.onload = function () {
		if (request.status !== 200){
			l(request.status + " - something failed")
		}

		let o = ''
		let words = ["problem connecting to the server"]
		try {
			o = JSON.parse(request.response)
		} catch(e) {
			l(e)
		}

		if(o.words !== undefined && o.words.length > 0){
			let words = o.words

			clearWords()
			displayWords(words)
		}
		else {
			showError()
		}
	}

	request.open('POST', API + 'unscrablme', true)
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	request.send(JSON.stringify(data))
}

function displayWords(words){
	results = gebi('results')
	
	let len = words.length

	if( len > RESULT_LIMIT) {
		len = RESULT_LIMIT
	}
	
	for(let i = len-1; i >= 0; i--){
		if(words[i].length === 0) continue
		let p = document.createElement('p')
		p.setAttribute('class', 'word')
		p.textContent = words[i].toLowerCase()
		results.appendChild(p)

		p.onclick = function(event){
			window.open(DEFINEURL + event.target.textContent)
		}
	}
}

function clearWords(){
	wordNodes = document.querySelectorAll(".word")
	for(let i = 0; i < wordNodes.length; i++) {
		w = wordNodes[i]
		w.parentNode.removeChild(w)
	}
}
