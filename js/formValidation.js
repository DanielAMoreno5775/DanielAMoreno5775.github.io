function checkIfValid() {
	forms = document.querySelectorAll('.needs-validation')
	Array.from(forms).forEach(form => {
		if (!form.checkValidity()) {
		    event.preventDefault()
		    event.stopPropagation()
		}
		
		form.classList.add('was-validated')
	})
}

function resetValidityCheck() {
	forms = document.querySelectorAll('.was-validated')
	Array.from(forms).forEach(form => {
		form.classList.remove('was-validated')
	})
	
	document.getElementById("def").checked = true;
	document.getElementsByClassName('contact-method')[0].classList.add('hide');
	document.getElementsByClassName('phone')[0].classList.add('hide');
	document.getElementsByClassName('email')[0].classList.add('hide');
}

//#626263
//#7e7f7f
//#575b5e