const button = document.createElement('button')
button.style.width = '20px'
button.style.height = '20px'
document.body.appendChild(button)

console.log('offsetParent:', button.offsetParent)
console.log('computedStyle.display:', window.getComputedStyle(button).display)
console.log('computedStyle.visibility:', window.getComputedStyle(button).visibility)

const isHidden = button.offsetParent === null || 
  window.getComputedStyle(button).display === 'none' ||
  window.getComputedStyle(button).visibility === 'hidden'

console.log('isHidden:', isHidden)
