console.log("Page loaded succesfully");

// Define a function to initialize AWS SDK and perform operations
function initializeAWS() {
  // Check if AWS SDK is already loaded
  if (typeof AWS !== 'undefined') {
      // AWS SDK is already loaded, proceed with AWS operations
      AWS.config.region = 'us-east-1'; // Replace with your AWS region

  } else {
      // AWS SDK is not yet loaded, wait and try again
      console.warn('AWS SDK is not loaded yet. Waiting...');
      setTimeout(initializeAWS, 100); // Retry after 100 milliseconds
  }
}

// Load AWS SDK script dynamically
initializeAWS(); // Initialize AWS SDK and perform operations
// Call function to load AWS SDK

var imageSelected=false;
var filterSelected=false;
var filter = "ciao"
var modiFyBtn = document.getElementById("modiFyBtn")
var fileSize = 0
var file =0



// function to load the loaded image on screen
var loadFile = function(event) {
	var image = document.getElementById("original");
  file= event.target.files[0]
	image.src = URL.createObjectURL(file);
  fileSize=file.size

  image.hidden=false
  imageSelected=true;
  if(filterSelected & imageSelected){
    modiFyBtn.hidden=false
  }
};

const btn = document.querySelector(".uploadBtn"); // Get the button from the page
if (btn) { // Detect clicks on the button
  btn.onclick = function () {
    btn.classList.toggle("dipped");
  };
}

//grants the ability to change the selected filter to all selections
const selections =document.querySelectorAll('selection')
selections.forEach(function(selection) {
    selection.addEventListener('click', function() {
      filter = this.innerText;
      filterSelected=true;
        if(filterSelected & imageSelected){
          modiFyBtn.hidden=false
        }
    });
});

//AWS lambda invocation

const filterify= function(){
  var imageJSON
  var reader = new FileReader();

  reader.onload = function(e) {
    var dataURL = e.target.result;
    var base64String = dataURL.split(',')[1];

    imageJSON = {
        filename: file.name,
        size: file.size,
        type: file.type,
        base64: base64String,
        chosenFilter: filter
    };

  console.log(JSON.stringify(imageJSON, null, 2));
  };

  reader.readAsDataURL(file);

  const input = { // InvocationRequest
  FunctionName: "filterify",
  InvocationType:"RequestResponse",
  LogType: "Tail",
  ClientContext: "",
  Payload: JSON.stringify(imageJSON),
  };
  
  try{
    const command = new InvokeCommand(input);
    const response = client.send(command);
  } catch (error) {
    console.error("Error invoking Lambda:", error);
  }

  var image = document.getElementById("filtered");
  imageJSON = JSON.parse(jsonString);
  const dataURL = `data:${imageJSON.type};base64,${imageJSON.base64}`;
  const img = document.createElement('img');
  img.src = dataURL;
  img.alt = imageJSON.filename;
  
  image.src = URL.createObjectURL(img);
  image.hidden=false
}



// ----- GLITCH STARTER PROJECT HELPER CODE -----

// Open file when the link in the preview is clicked
let goto = (file, line) => {
  window.parent.postMessage(
    { type: "glitch/go-to-line", payload: { filePath: file, line: line } }, "*"
  );
};
// Get the file opening button from its class name
const filer = document.querySelectorAll(".fileopener");
filer.forEach((f) => {
  f.onclick = () => { goto(f.dataset.file, f.dataset.line); };
});
