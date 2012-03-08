// We're calling this "asymHumanoidBodyParts" for two reason:
// * it only contains the left-side body parts
// * in the future we might want to include creatures like spiders or
//   wolves or whatever
//
// The first element of the nested array is the name of the body part,
// and the second element is its relative weight - how likely it is
// that it will be hit relative to the other parts.
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

// This is used to return a nested array of symmetrical body parts.
// For example, if the source array of body parts contains
// ["left-elbow", 2]
// then the array returned by this function will also include
// ["right-elbow", 2]
// This allows us to reduce replication, as a left elbow is just as
// likely to be hit as a right elbow.
var symmetrizeBodyParts = function(bodyParts) {
  var finalParts = [];
  
  // Add the part to the final list of parts.
  // Also add the right-side version if we're dealing with a left-side part.
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


// The logic of the targeting system is as follows:
// 1. Sum up the weights of all the body parts
// 2. Pick a random number between 0 and the sum - the +target+
// 3. Iterate through the list of body parts, incrementing a +counter+
//    by the weight of the body part.
// 4. When the +counter+ is greater than the +target+, then the
//    corresponding body part has been hit.
// 5. Return that body part.

// This is used to sum the weights of all the body parts.
// It's used in conjunction with the target function to return a
// number which will be used to determine which  body part has been  hit.
var targetsSum = function(bodyParts) {
  var sum = 0;
  for(i = 0; i < bodyParts.length; i++) {
    sum += bodyParts[i][1];
  }
  return sum;
}

// Return a number between 0 and the sum of all body part weights.
var target = function(bodyParts) {
  return Math.floor(Math.random() * targetsSum(bodyParts));
}

// This uses the target function to get a number which we can use to 
// determine which body part has been hit. We must then call the
// function returned by targetHitFunction in order to actually
// determine the body part.
var attack = function(bodyParts) {
  var targetHit = targetHitFunction(target(bodyParts));
  for(i = 0; i < bodyParts.length; i++) {
    if(targetHit(bodyParts[i][1])) {
      return bodyParts[i];
    }
  }
}

// This function returns a function which is used to test whether a
// body part corresponds to a given target.
// Notice that a closure is created which includes both
//  +target+ and +currentPosition+.
var targetHitFunction = function(target) {
  var weightAccumulator = 0;
  return function(increment) {
    weightAccumulator += increment;
    return weightAccumulator > target;
  }
}

// This is merely to set up the event handlers on the dom objects.
var setup = function() {
  document.getElementById("initiate-attack").onclick = function() {
    var partHit = attack(symmetrizeBodyParts(asymHumanoidBodyParts))[0].replace(/-/g, " ")
    document.getElementById("attack-message").innerHTML = "You hit the giant's " + partHit + "!";
  }
}

// Assign the setup function to the onload event handler. Notice that
// we're not using the parentheses; we're assigning the function
// object, not the result of a call to the function.
window.onload = setup;
