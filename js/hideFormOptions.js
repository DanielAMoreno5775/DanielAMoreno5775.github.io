document.getElementById('yesUpdate').onchange = function(){
  var option = document.getElementsByClassName('contact-method')[0];
  
  if (this.checked) {
	  option.classList.remove('hide');
  }
  else {
	  document.getElementById("def").checked = true;
	  option.classList.add('hide');
	  document.getElementsByClassName('phone')[0].classList.add('hide');
	  document.getElementsByClassName('email')[0].classList.add('hide');
  }
}

document.getElementById('def').onchange = function(){
  if (this.checked) {
	  document.getElementsByClassName('phone')[0].classList.add('hide');
	  document.getElementsByClassName('email')[0].classList.add('hide');
  }
}

document.getElementById('phoneRadio').onchange = function(){
  var option = document.getElementsByClassName('phone')[0];
  
  if (this.checked) {
	  option.classList.remove('hide');
	  document.getElementsByClassName('email')[0].classList.add('hide');
  }
  else option.classList.add('hide');
}

document.getElementById('emailRadio').onchange = function(){
  var option = document.getElementsByClassName('email')[0];
  
  if (this.checked) {
	  option.classList.remove('hide');
	  document.getElementsByClassName('phone')[0].classList.add('hide');
  }
  else option.classList.add('hide');
}