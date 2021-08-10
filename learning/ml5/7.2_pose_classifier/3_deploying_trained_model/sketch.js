let video;
let poseNet;
let pose;
let skeleton;
let conf;
let brain;
let poseLabel = "";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'AtoH/model.json',
    metadata: 'AtoH/model_meta.json',
    weights: 'AtoH/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  if (results[0].confidence > 0.75) {
    conf = results[0].confidence;
    poseLabel = results[0].label.toUpperCase();
    console.log(poseLabel)
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(75);
  textAlign(CENTER, CENTER);
  // if(poseLabel == ''){
  //   text("perform asana", width / 2, height / 2);
  // }
  // else if(poseLabel == 'Y'){
  //   text("y asana", width / 2, height / 2);
  // }
  // else if(poseLabel == ''){
  //   text("m asana", width / 2, height / 2);
  // }
  // else if(poseLabel == 'C'){
  //   text("c asana", width / 2, height / 2);
  // }
  // else if(poseLabel == 'A'){
  //   text("a asana", width / 2, height / 2);
  // }
  if(poseLabel=="A")    
  {
    document.getElementById("description").innerHTML = "Siddhasana";
    document.getElementById("referenceImg").innerHTML = "<img src='100/Sid.png' width=\"350px\" height=\"250px\">";
  }
  if(poseLabel=="B")    
  {
    document.getElementById("description").innerHTML = "Trikonasana";
    document.getElementById("referenceImg").innerHTML = "<img src='100/Trikonasana.png' width=\"350px\" height=\"250px\">";
  }
  
  if(poseLabel=="C")  {
    document.getElementById("description").innerHTML = "Vajrasana";
    document.getElementById("referenceImg").innerHTML = "<img src='100/vjr.PNG' width=\"350px\" height=\"250px\">";
  }
  if(poseLabel=="D")    {
    document.getElementById("description").innerHTML = "Veerabhadrasana";
    document.getElementById("referenceImg").innerHTML = "<img src='100/vbd.png' width=\"350px\" height=\"250px\">";
  }
  if(poseLabel=="E")    {
    document.getElementById("description").innerHTML = "Vrukshasana"; 
    document.getElementById("referenceImg").innerHTML = "<img src='100/vrk.png' width=\"350px\" height=\"250px\">";
  }
  if(poseLabel=="F")    {
    document.getElementById("description").innerHTML = "Standing";
    document.getElementById("referenceImg").innerHTML = "<img src='100/asanas.png' width=\"400px\" height=\"300px\">";
  }
  if(poseLabel=="G")    {
    document.getElementById("description").innerHTML = "Anjaneyasana";
    document.getElementById("referenceImg").innerHTML = "<img src='100/Anj.PNG' width=\"350px\" height=\"250px\">";
  }
  if(poseLabel=="H")    {
    document.getElementById("description").innerHTML = "Dandasana";
    document.getElementById("referenceImg").innerHTML = "<img src='100/dandasana.png' width=\"350px\" height=\"250px\">";
  }

  // else
  //   document.getElementById("description").innerHTML = poseLabel;

  document.getElementById("accuracy").innerHTML = conf*100+"%";
  // if(conf>0.90){
  //   document.getElementById("accuracy").innerHTML = conf;
  // }
}