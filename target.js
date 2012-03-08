var asymHumanoidBodyParts = [["head", 3],
    ["left-eye", 1],
    ["left-ear", 1],
    ["mouth", 1],
    ["nose", 1],
    ["neck", 2],
    ["left-shoulder", 3],
    ["left-upper-arm", 3],
    ["chest", 10],
    ["back", 10],
    ["left-forearm", 3],
    ["abdomen", 6],
    ["left-kidney", 1],
    ["left-hand", 2],
    ["left-knee", 2],
    ["left-thigh", 4],
    ["left-lower-leg", 3],
    ["left-achilles", 1],
    ["left-foot", 2]]

var symmetrizeBodyParts = function(bodyParts) {
  var finalParts = [];
  
  var partAndMatch = function(part) {
    finalParts.push(part)
    if (part[0].indexOf("left") > -1) {
      finalParts.push([part[0].replace("left", "right"), part[1]]);
    }
  }

  var addMatchingParts = function(parts) {
    if(parts.length) {
      return addMatchingParts(parts.slice(1, parts.length), partAndMatch(parts[0]));
    }
    else {
      return finalParts;
    }
  }
  
  return addMatchingParts(bodyParts);
}

var targetsSum = function(bodyParts) {
  var sum = 0;
  for(i = 0; i < bodyParts.length; i++) {
    sum += bodyParts[i][1];
  }
  return sum;
}

var attack = function(bodyParts) {
  var targetHit = targetHitFunction(target(bodyParts));
  for(i = 0; i < bodyParts.length; i++) {
    if(targetHit(bodyParts[i][1])) {
      return bodyParts[i];
    }
  }
}

var target = function(bodyParts) {
  return Math.floor(Math.random() * targetsSum(bodyParts));
}

var targetHitFunction = function(target) {
  var currentPosition = 0;
  return function(increment) {
    currentPosition += increment;
    return currentPosition > target;
  }
}

var setup = function() {
  document.getElementById("initiate-attack").onclick = function() {
    var partHit = attack(symmetrizeBodyParts(asymHumanoidBodyParts))[0].replace("-", " ")
    document.getElementById("attack-message").innerHTML = "You hit the giant's " + partHit + "!";
  }
}

window.onload = setup;
