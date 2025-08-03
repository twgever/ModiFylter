console.log("Page loaded succesfully");

var imageSelected=false;
var filterSelected=false;
var filter = "ciao"
var modiFyBtn = document.getElementById("modiFyBtn")
var downloadBtn = document.getElementById("downloadBtn")
var fileSize = 0
var file =0
var imageJSON

AWS.config.update({
  region: 'us-east-1',
  credentials:  new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:3ea70217-9f6a-4835-8008-d81168f24b9c'
  })
});

AWS.config.credentials.get(function(err) {
  if (err) {
    console.error("Error fetching credentials:", err);
    return;
  }
  console.log("Cognito Identity Id:", AWS.config.credentials.identityId);
});

// function to load the loaded image on screen
var loadFile = function(event) {

  var image = document.getElementById("original");

  // Validate file extension
  const fileName = event.target.files[0].name.toLowerCase();
  if (!fileName.endsWith('.png') && !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
    alert('Only .png and .jpg files are allowed!');
    event.target.value = '';
    imageSelected=false;
    file = 0
    hideEverything()
    return;
  }
  
  file = event.target.files[0];
	image.src = URL.createObjectURL(file);
  fileSize=file.size

  image.hidden=false
  imageSelected=true;
  downloadBtn.hidden=true
  if(filterSelected & imageSelected){
    modiFyBtn.hidden=false
    processImage();
  }
};

// Function to process image
var processImage = function() {
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
          processImage();
          
        }
    });
});

//AWS lambda invocation

const filterify= async function(){
  const image = document.getElementById('filtered');

  image.hidden = true;
  var lambda = new AWS.Lambda();

  if (!imageJSON) {
    console.error("Image data is not ready.");
    return;
  }

  const input = { // InvocationRequest
    FunctionName: "arn:aws:lambda:us-east-1:058264230330:function:filterify",
    InvocationType:"RequestResponse",
    LogType: "Tail",
    Payload: JSON.stringify(imageJSON),
  };
  
  try {
    const data = await lambda.invoke(input).promise();
    const response = JSON.parse(data.Payload);
    console.log(response)
    const processedImageBase64 = response.body.processed_image_base64; 
    var format = response.body.format;
    format = format.toLowerCase();
  
      // Create the data URL for the image
    const dataURL = `data:image/${format};base64,${processedImageBase64}`;
    image.src = dataURL;
    image.hidden = false;
    } catch (err) {
      console.error("Error invoking Lambda: ", err.code, err.message, err);
    }

    downloadBtn.hidden=false
}

//trigger download of fie upon click on download button
const download = function(){

  const image = document.getElementById('filtered');
  const a = document.createElement('a');

  a.href = image.src;
  a.download = filter.replace(" ","_") + "_" + file.name
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

}

//function to hide what was hidden since the beginning
var hideEverything = function(){
  var image = document.getElementById("original");
  var filtered = document.getElementById("filtered");
  var filterify = document.getElementById("filterify");

  image.hidden=true;
  filtered.hidden=true;
  filterify.hidden=true;
  downloadBtn.hidden=true;
  
  return
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
