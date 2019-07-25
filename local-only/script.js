function gebi(id){ return document.getElementById(id) }

const DEFINEURL = 'https://duckduckgo.com/?q="define"+'
const items = {}
let solver = undefined

window.onload = function() {
  gebi('solve').onclick = solve

  items.input = gebi('input')
  items.prefix = gebi('prefix')
  items.suffix = gebi('suffix')

  items.input.onkeydown = handleKeydown
  items.prefix.onkeydown = handleKeydown
  items.suffix.onkeydown = handleKeydown

  solver = Solver()
}

function handleKeydown(event) {
  // if the enter key was pressed
  if(event.keyCode === 13) { 
    solve()
    event.preventDefault()
  }
}

function solve() {
  let letters = items.input.value
  let prefix = items.prefix.value
  let suffix = items.suffix.value

  let words = solver.solve(letters, prefix, suffix)
  
  if(words !== undefined) {
    clearWords()
    displayWords(words)
  }
}

function displayWords(words) {
  let results = gebi('results')
  let len = words.length

  // go from end to beginning to display longest first
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
