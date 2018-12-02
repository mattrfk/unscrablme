function l(msg){ 
	console.log(msg) }
function gebi(id){ return document.getElementById(id)}

const RESULT_LIMIT = 100000

window.onload = function() {
  let button = gebi("solve")
	button.onclick = solve
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

	var request = new XMLHttpRequest();

	request.onload = function () {
		if (request.status !== 200){
			input.value = request.status + " - something failed"
		}
		let o = ""

		try {
			o = JSON.parse(request.response)
		} catch(e) {
			l(e)
		}

		l(o)

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

	request.open('POST', 'http://localhost:8080/unscrablme', true)
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	request.send(JSON.stringify(data))
}

function displayWords(words){
	let p = document.createElement('p')
	//let c = document.createTextNode('d')
	//p.appendChild(c)
	p.setAttribute('id', 'words')
	p.setAttribute('class', 'word')
	document.body.appendChild(p)
	for(let i = words.length-1; i >= 0; i--){
		p.textContent += " " + words[i]
	}
}

function clearWords(){
	wordNodes = document.querySelectorAll(".word")
	for(let i = 0; i < wordNodes.length; i++) {
		w = wordNodes[i]
		w.parentNode.removeChild(w)
	}
}
