const Solver = () => {
  //const DICT = "http://10.0.1.5:8000/local-only/SOWPODS.txt"
  const DICT = "http://cyberpixels.net/anagram/SOWPODS.txt"
  const api = {
    solve: solve
  }

  let dict = undefined
  fetch(DICT)
    .then(response => response.text())
    .then(text => dict = text.split('\n'))

  function solve(letters, prefix, suffix) {
    if(dict === undefined) {
      console.log("still loading the dictionary")
      return
    }

    let matches = []
    
    for(let i = 0; i < dict.length; i++) {
      if(dict[i].length > letters.length + prefix.length + suffix.length) {
        break
      }

      if(wordMatches(dict[i], letters, prefix, suffix)) {
        matches.push(dict[i])
      }
    }

    console.log(matches.length + " words found")
    return matches
  }

  function isCapital(l) {
    return l !== l.toLowerCase()
  }

  function wordMatches(word, letters, prefix, suffix) {
    if(prefix && prefix.length > 0) {
      if(word.startsWith(prefix)) {
        word = word.slice(prefix.length)
      } else {
        return false
      }
    }

    if(suffix && suffix.length > 0) {
      if(word.endsWith(suffix)) {
        word = word.slice(0, word.length - suffix.length)
      } else {
        return false
      }
    }

    for(let i = 0; i < letters.length; i++) {
      if(isCapital(letters[i])) {
        if(word[i] !== letters[i].toLowerCase()) return false
      }
    }

    let numblanks = letters.split('?').length - 1
    letters = letters.toLowerCase().replace('?', '').split('')

    for(let i = 0; i < word.length; i++) {
      let n = letters.indexOf(word[i])
      if(n < 0) {
        if(numblanks > 0) {
          numblanks--
        } else {
          return false
        }
      }
      letters[n] = null
    }

    return true
  }

  return api
}
