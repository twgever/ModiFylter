console.log("Page loaded succesfully");

// amazonq-ignore-next-line

const bucketName = "modifylterbucket"
const identityPoolID = 'us-east-1:3ea70217-9f6a-4835-8008-d81168f24b9c'
const region = 'us-east-1'

var imageSelected=false;
var filterSelected=false;
var filter = "ciao"
var modiFyBtn = document.getElementById("modiFyBtn")
var downloadBtn = document.getElementById("downloadBtn")
var fileSize = 0
var file =0
var imageJSON
var userID
var fileName
var extension
var s3
var userIDReady = 0

//initial config for the identity pool
AWS.config.update({
  region: region,
  apiVersion: 'latest',
  credentials:  new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolID
  })
});

//fetching credentals from identity pool
AWS.config.credentials.get(function(err) {
  if (err) {
    console.error("Error fetching credentials:", err);
    return;
  }
  console.log("Cognito Identity Id:", AWS.config.credentials.identityId);
  userID = AWS.config.credentials.identityId
  s3 = new AWS.S3();
  userIDReady = 1
});

// function to load the loaded image on screen, extract the name and the extension of the file
// amazonq-ignore-next-line
var loadFile = function(event) {

  var image = document.getElementById("original");

  // Validate file extension
  fileName  = event.target.files[0].name.toLowerCase();
  extension = fileName.substring( fileName.lastIndexOf(".")+1 );
  if (!fileName.endsWith('.png') && !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
    alert('Only .png and .jpg files are allowed!');

    //delete previous selections so that user cannot load empty image
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
  if(filterSelected & imageSelected & userIDReady){
    modiFyBtn.hidden=false
    processImage();
  }
};

// Function to process image and create the object to put in the s3 bucket
var processImage = function() {
  var reader = new FileReader();
  alert(extension)
  reader.onload = function(e) {
    var dataURL = e.target.result;
    var base64String = dataURL.split(',')[1];
    imageJSON = {
      filename: file.name,
      size: file.size,
      type: file.type,
      base64: base64String,
      chosenFilter: filter,
      extension: extension
    };
    //console.log(JSON.stringify(imageJSON, null, 2));
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
const filterBtn = document.querySelector(".dropBtn");
const selections =document.querySelectorAll('selection')
selections.forEach(function(selection) {
    selection.addEventListener('click', function() {
      filter = this.innerText;
      filterBtn.innerText = filter
      filterSelected=true;
        if(filterSelected & imageSelected & userIDReady){

          modiFyBtn.hidden=false
          processImage();
          
        }
    });
});

//AWS lambda invocation -> no more, not it is s3 upload and subscription to bucket!

const filterify= async function(){
  const image = document.getElementById('filtered');

  image.hidden = true;
  var lambda = new AWS.Lambda();

  if (!imageJSON) {
    console.error("Image data is not ready.");
    return;
  }

  //uploading image to s3 bucket
  var s3UploadParams = {Bucket: bucketName,
                        Key: userID + "/" + fileName,
                        Body: JSON.stringify(imageJSON)
                      };

  s3.upload(s3UploadParams, function(err, data) {
    console.log(err, data);
    });
    
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
