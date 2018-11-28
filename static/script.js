function l(msg){ console.log(msg)}
function gebi(id){ return document.getElementById(id)}

const RESULT_LIMIT = 1000

window.onload = function() {
  let button = gebi("solve")
	button.onclick = solve
}

function solve() {
	let input = gebi("input")

	letters = input.value

	let data = { 
		letters: letters,
		otherstuff: "what"
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

		if(o.words !== undefined && o.words.length > 1){
			let words = o.words
			input.value = words.length

			//TODO: set limit of how many to display
			
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
	for(let i = 0; i < words.length && i < RESULT_LIMIT; i++){
		let p = document.createElement('p')
		let c = document.createTextNode(words[i])
		p.appendChild(c)
		p.setAttribute('id', i)
		p.setAttribute('class', 'word')
		document.body.appendChild(p)
	}
}

function clearWords(){
	wordNodes = document.querySelectorAll(".word")
	for(let i = 0; i < wordNodes.length; i++) {
		w = wordNodes[i]
		w.parentNode.removeChild(w)
	}
}
