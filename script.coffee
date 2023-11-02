document.addEventListener "DOMContentLoaded", ->
  position = 0
  moving = false
  interval = null
  speed = 5
  backwardMove = false
  backwardMoveDone = false

  showAlert = (message, callback) ->
    alertBox = document.createElement 'div'
    alertBox.className = 'alert-box'
    closeButton = document.createElement 'button'
    closeButton.textContent = 'Close'
    closeButton.onclick = ->
      callback() if callback?
      alertBox.remove()
    alertContent = document.createElement 'div'
    alertContent.className = 'alert-content'
    alertContent.innerHTML = "<p>#{message}</p>"
    alertContent.appendChild closeButton
    alertBox.appendChild alertContent
    document.body.appendChild alertBox

  document.getElementById("playButton").addEventListener "click", ->
    gameMode = document.getElementById("gameMode").value
    backwardMove = false
    backwardMoveDone = false
    if gameMode is 'easy'
      speed = Math.random() * 50 + 10
    else if gameMode is 'normal'
      speed = Math.random() * 85 + 10
    else
      speed = Math.random() * 95 + 10
      backwardMove = true

    document.getElementById("startScreen").classList.add "hidden"
    document.getElementById("gameScreen").classList.remove "hidden"

  train = document.querySelector('.train')

  moveTrain = ->
    train.classList.add 'smooth'
    if backwardMove and position > 300 and not backwardMoveDone
      speed = -100
      backwardMoveDone = true
    else
      speed = Math.abs speed
    position += speed
    train.style.left = "#{position}px"
    if position >= window.innerWidth - 100
      clearInterval interval
      moving = false
      showAlert "You lost. The train went past the station.", ->
        location.reload()

  document.getElementById("startButton").addEventListener "click", ->
    unless moving
      moving = true
      interval = setInterval moveTrain, 50

  stopTrain = ->
    train.classList.remove 'smooth'
    if moving
      clearInterval interval
      moving = false
      if position >= window.innerWidth - 200 and position <= window.innerWidth - 100
        showAlert "You won. The train stopped at the station.", ->
          location.reload()
      else
        showAlert "You lost. The train did not stop at the station."

  document.getElementById("stopButton").addEventListener "click", stopTrain

  document.addEventListener "keydown", (event) ->
    stopTrain() if event.code is "Space"
