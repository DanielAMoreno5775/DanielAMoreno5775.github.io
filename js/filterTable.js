function filterBookTable() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue, numDisplayed;
  numDisplayed = 0;
  input = document.getElementById("inputFilterPlaceholderTable");
  filter = input.value.toUpperCase();
  table = document.getElementById("placeholderTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
		numDisplayed = numDisplayed + 1;
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  
  //handle error message if nothing is found
  if (numDisplayed <= 0) {
  	document.getElementById("placeholderTableErrorMsg").style.display = "block";
  }
  if (numDisplayed > 0) {
  	document.getElementById("placeholderTableErrorMsg").style.display = "none";
  }
}