function l(msg){ 
	console.log(msg) }
function gebi(id){ return document.getElementById(id)}

const RESULT_LIMIT = 100000
const API = 'http://10.0.1.14:8080/'

window.onload = function() {
  let button = gebi("solve")

	gebi("input").onkeydown = enter
	gebi("prefix").onkeydown = enter
	gebi("suffix").onkeydown = enter

	button.onclick = solve
}

function enter(event) {
		l("---solving...")
	if( event.keyCode === 13 ) {
		l("solving...")
		solve()
		event.preventDefault()
	}
}

function solve() {
	let input = gebi("input")
	let prefix = gebi("prefix")
	let suffix = gebi("suffix")

	let mainLetters = input.value
	let prefixLetters = prefix.value
	let suffixLetters = suffix.value

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

		let o = ""
		try {
			o = JSON.parse(request.response)
		} catch(e) {
			l(e)
		}

		if(o.words !== undefined && o.words.length > 0){
			let words = o.words
			//input.value = ''

			clearWords()
			displayWords(words)
		}
		else {
			// do something?
		}
	}

	request.open('POST', API + 'unscrablme', true)
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	request.send(JSON.stringify(data))
}

function displayWords(words){
	results = gebi('results')
	
	for(let i = words.length-1; i >= 0; i--){
		//p.setAttribute('id', 'words')
		let p = document.createElement('p')
		p.setAttribute('class', 'word')
		p.textContent += " " + words[i]
		results.appendChild(p)
	}
}

function clearWords(){
	wordNodes = document.querySelectorAll(".word")
	for(let i = 0; i < wordNodes.length; i++) {
		w = wordNodes[i]
		w.parentNode.removeChild(w)
	}
}
