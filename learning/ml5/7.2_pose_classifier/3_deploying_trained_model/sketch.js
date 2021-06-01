// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

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
    model: 'all2Asanas/model.json',
    metadata: 'all2Asanas/model_meta.json',
    weights: 'all2Asanas/model.weights.bin',
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
  if(poseLabel=="A")    document.getElementById("description").innerHTML = "Siddhasana";
  if(poseLabel=="B")    document.getElementById("description").innerHTML = "Trikonasana";
  if(poseLabel=="C")    document.getElementById("description").innerHTML = "Vajrasana";
  if(poseLabel=="D")    document.getElementById("description").innerHTML = "Veerabhadrasana";
  if(poseLabel=="E")    document.getElementById("description").innerHTML = "Vrukshasana";
  if(poseLabel=="F")    document.getElementById("description").innerHTML = "Standing";
  // else
  //   document.getElementById("description").innerHTML = poseLabel;

  document.getElementById("accuracy").innerHTML = conf*100+"%";
  // if(conf>0.90){
  //   document.getElementById("accuracy").innerHTML = conf;
  // }
}