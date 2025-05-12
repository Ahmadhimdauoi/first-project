
// Get the input element
var x = document.getElementById("x");

// Set the minimum value
x.min = 100;

// Add event listeners to prevent typing values less than 100
x.addEventListener("keydown", function(event) {
  if (event.target.value > 100) {
    event.preventDefault();
  }
});

x.addEventListener("keyup", function(event) {
  if (event.target.value > 100) {
    event.target.value = 100;
  }
});


// Get the input element
var y = document.getElementById("y");

// Set the minimum value
y.min = 100;

// Add event listeners to prevent typing values less than 100
y.addEventListener("keydown", function(event) {
  if (event.target.value > 100) {
    event.preventDefault();
  }
});

y.addEventListener("keyup", function(event) {
  if (event.target.value > 100) {
    event.target.value = 100;
  }
});
function calculateGrade() {
  var x = parseFloat(document.getElementById("x").value);
  var y = parseFloat(document.getElementById("y").value);
  var total = x * 0.7 + y * 0.3;

  if (total < 59.5) {
    document.getElementById("result").value = "Fail: " + total;
  } else {
    document.getElementById("result").value = "Successful: " + total;
  }
}
  
 
