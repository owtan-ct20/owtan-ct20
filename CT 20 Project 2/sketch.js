let data;
let dbs;
let pokemonInput;
let pokePicked = false;
let selectedPokemon;
let msg;
let displayedMsg;
let displayedImg1;
let pkmnCry;
let pkmnImg;
let pokeName;

let stepTwo = false;
let berryPicked = false;
let berryInput;
let randBerry;
let selectedBerry;
let berryName = "Oran";
let berryImg;
let berryTasteValues = [0, 0, 0, 0, 0]; //meant for perhaps if I had more time, I could add the flavor values of the berries extracted from the data to this array, then adjust the adjectives of the recipes based on the which berry was chosen and what its flavor profile is
let displayedImg2;

let stepThree = false;
let recipe = "";
let recipeType = 7; //1 (Soup) for Water, 2 (Pie) for Fairy/Psychic/Ice, 3 (Boil) for Rock/Steel/Ground, 4 (Chili) for Electric/Fire/Poison, 5 (Salad) for Bug/Grass, 6 (Roast) for everything else.
let displayedRecipe;

function preload(){
  soundFormats(".ogg");
}

function setup() {
  //create an input for people to type in their Pokemon and highlight it when the input box is clicked
  pokemonInput = createInput("Please enter a Pokemon and press Enter.");
  pokemonInput.position(50,20);
  pokemonInput.size(500);
  pokemonInput.elt.addEventListener('focus', function() {
    this.select();
  });
  msg = "Some Pokemon with multiple forms won't work unless you specifically type it in like oricorio-sensu. <br> Regional forms will need you to do the same for example zigzagoon-galar."
  displayedMsg = createP(msg);
  displayedMsg.position(50, 50);
  
  //create the images that will be displayed of the pokemon and berry chosen
  pkmnImg = "dachsbun.png";
  berryImg = "https://bulbapedia.bulbagarden.net/wiki/File:Curry_Ingredient_Kee_Berry_Sprite.png"
  displayedImg1 = createImg(pkmnImg, "food");
  displayedImg2 = createImg(berryImg, "berry");
  
  //create the input where people can type in the berry they want to use and a button to pick one randomly
  berryInput = createInput("Enter your favorite berry!").size(500);
  randBerry = createButton("Random Berry");
  
  //hide the images and berry picker button until they are necessary
  displayedImg1.hide();
  displayedImg2.hide();
  berryInput.hide();
  randBerry.hide();
  
  //create an empty recipe tag for use later
  displayedRecipe = createP("");
}

function draw() {
  //update the message at the top when input is made
  displayedMsg.html(msg);
  displayedMsg.style("color","white");
  displayedMsg.style("font-size", "20px")
  
  //updates the images, it loads a little slowly on my computer i'm not sure how to fix it. I have to swap tabs for the image to refresh and I don't really know why it's doing that.
  updateImg();
  
  
  //checks if a valid input for Pokemon has been made and reveals the image of it with the berry input section if so.
  if(stepTwo){
    stepTwo = false;
    berryInput.show();
    randBerry.show();
    berryInput.elt.addEventListener('focus', function() {
    this.select();
  });
    randBerry.mousePressed(pickRandomBerry);
  }
  
  //updates the recipe text when the next step happens
  displayedRecipe.html(recipe);
  displayedRecipe.style("color", "white");
  
  //picks one of the recipes based on type of the pokemon chosen and displays it along with a little bit of modifications based on berry chosen
  if(stepThree){
    makeRecipe(recipeType);
    drawRecipe();
    stepThree = false;
  }
}

//calls a function to check if the input is valid when the enter key is pressed
function keyPressed(){
  if(keyCode === ENTER && !pokePicked){
    let smolInput = "https://pokeapi.co/api/v2/pokemon/" + pokemonInput.value().toLowerCase();
    findPokemon(smolInput);
  } else if(keyCode === ENTER && !berryPicked){
    let smolBerry = "https://pokeapi.co/api/v2/berry/" + berryInput.value().toLowerCase()
    findBerry(smolBerry);
  }
}

//loads the data and then runs a function depending on whether or not the load was successful
async function findPokemon(data){
  selectedPokemon = loadJSON(data, pokemonSuccess, pokemonFailed);
}

//does a buncha stuff and moves to step two if the data is successful
function pokemonSuccess(data){
  selectedPokemon = data;
  loadSoundandPlay(selectedPokemon.cries.latest);
  loadImageandDraw(selectedPokemon.sprites.other["official-artwork"].front_default);
  msg = "Alright! Let's start making a delicious " + capitalize(selectedPokemon.name.replace("-", " ")) +"!";
  pokeName = capitalize(selectedPokemon.name.replace("-", " "));
  assignType(selectedPokemon.types["0"].type.name);
  //console.log(selectedPokemon);
  pokemonInput.hide();
  displayedImg1.show();
  pokePicked = true;
  stepTwo = true;
}

//prompts the user again if the pokemon input is invalid
function pokemonFailed(error){
  msg = pokemonInput.value() + " is not a Pokemon, did you perhaps misspell it?"
  //console.log(selectedPokemon);
}

//picks a berry randomly from the source I'm using, the source is missing 3 or 4 berries though so those will not work if you search for them directly
function pickRandomBerry(){
  findBerry("https://pokeapi.co/api/v2/berry/" + int(random(1, 64)));
}

//same thing as the findPokemon function but for berries
async function findBerry(data){
  selectedBerry = loadJSON(data, berrySuccess, berryFailed);
}

//same thing as the pokemonSuccess function but for berries and moves to step three
function berrySuccess(data){
  selectedBerry = data;
  msg = "Nice choice! " + capitalize(selectedBerry.name.replace("-", " ")) +" berries go great with " + pokeName+ "!";
  berryName = capitalize(selectedBerry.name.replace("-", " "));
  console.log(selectedBerry);
  randBerry.hide();
  berryInput.hide();
  loadBerryandDraw();
  displayedImg2.show();
  
  //print(berryImg);
  berryPicked = true;
  stepThree = true;
  stepTwo = false;
}

//prompts the user to enter another berry if invalid
function berryFailed(error){
  msg = berryInput.value() + " is not a Berry, did you perhaps misspell it?"
  console.log(selectedBerry);
}

function loadSoundandPlay(data){
  pkmnCry = loadSound(data, successSound);
}

function successSound(sound){
  pkmnCry = sound;
  sound.play();
}

function loadImageandDraw(data){
  pkmnImg = data;
}

function loadBerryandDraw(){
  berryImg = "https://www.serebii.net/itemdex/sprites/sv/"+berryName.toLowerCase()+"berry.png";
}

//assigns a type to one of the type groups for deciding which recipe to use
function assignType(type){
  if(type == "water"){
    recipeType = 1;
  } else if(type == "fairy" || type == "psychic" || type == "ice"){
    recipeType = 2;
  } else if(type == "rock" || type == "steel" || type == "ground"){
    recipeType = 3;
  } else if(type == "electric" || type == "poison" || type == "fire"){
    recipeType = 4;
  } else if(type == "bug" || type == "grass"){
    recipeType = 5;
  } else {
    recipeType = 6;
  }
}

//updates the image source and puts them in line with each other
function updateImg(){
  displayedImg1.attribute('src', pkmnImg);
  displayedImg2.attribute('src', berryImg);
  displayedImg1.style('display', 'inline-block');
  displayedImg2.style('display', 'inline-block');
}

function capitalize(string) {
  let words = string.toLowerCase().split(' ');

  let capWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
  });
  //print(capWords[1]);
  
  //handles regional forms
  if(capWords[1] == "Galar"){
    return "Galarian " + capWords[0];
  } else if (capWords[1] == "Alola"){
    return "Alolan " + capWords[0];
  } else if (capWords[1] == "Paldea"){
    return "Paldean " + capWords[0];
  } else if (capWords[1] == "Hisui"){
    return "Hisuian " + capWords[0];
  }

  return capWords.join(' ');
}

//creates the image associated with the recipe
function drawRecipe(){
  if(recipeType == 1){
      createImg("https://natashaskitchen.com/wp-content/uploads/2017/09/Clam-Chowder-Soup-Recipe-3.jpg", "chowda").style('transform', 'scale(0.5)').style('transform-origin', 'top left');
    } else if(recipeType == 2){
      createImg("https://littlespoonfarm.com/wp-content/uploads/2021/08/Homemade-Apple-Pie-Recipe-7.jpg", "pie").style('transform', 'scale(0.5)').style('transform-origin', 'top left')
    } else if(recipeType == 3){
      createImg("https://www.butterbeready.com/wp-content/uploads/2023/06/DK6A2444-680x1020.jpg", "boil").style('transform-origin', 'top left')
    } else if(recipeType == 4){
      createImg("https://i.ytimg.com/vi/ecM5vKL2lG8/maxresdefault.jpg", "chimkin").style('transform', 'scale(0.7)').style('transform-origin', 'top left')
    } else if (recipeType == 5){
      createImg("https://www.allrecipes.com/thmb/oOHkypziScaf11c_9Yie4jzjvMQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cobb-salad-allrecipes-video-4x3-eeb57f8c3bdf44c894e973d353762800.jpg", "salad").style('transform', 'scale(0.5)').style('transform-origin', 'top left')
    } else{
      createImg("https://www.simplyrecipes.com/thmb/PqyqIIHeJSi7rx6rzSYSvlDA48U=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Classic-Roast-Beef-LEAD-6-f0ac8372bb9a4a598e7b5509ca235c1a.jpg", "roast").style('transform-origin', 'top left')
    }
}

//creates the html code to for the recipe that gets run in the draw function
function makeRecipe(type){
  if(type == 1){
    recipe = "<h2>"+pokeName+" Chowder Ingredients</h2><h4>A classic Galarian dish with a unique "+pokeName+" twist.</h4><ol><li>Lechonk Bacon – Traditional Galarian clam chowder uses salted Paldean Lechonk (ironic I know), but Lechonk bacon is easier to find.</li><li>Carrots, celery, and onions – finely chopped, this combination of veggies used at the base of many soups is called mirepoix. </li><li>Flour – thickens the soup. You can also use a gluten-free flour or a slurry of cornstarch and water.</li><li>Combusken stock (I use low-sodium), or substitute Grass type stock.</li><li>"+pokeName+" – 3 cans of "+pokeName+" – drain the "+pokeName+", but keep the juice. If using fresh, clean the "+pokeName+" well, and then steam them until the meat darkens. Remove the meat and chop finely so they don’t become rubbery.</li><li>Circhestershire, Artazon, Johtonian soy sauce – adds great depth of flavor – look for gluten free if needed. The Scovillian hot sauce is optional but so good!</li><li>Bayleef or Sprigatito pickings – Flavors the broth and add salt to taste since the sodium will change depending on your "+pokeName+". You can replace Sprigatito with Leafeon, fresh Pansage, or Old Kala'e Bay seasoning.</li><li>Potatoes – waxy potatoes like Postwick gold or red potatoes are a great choice, but Eterna also work.</li><li>Miltank Milk and Cream – adds a rich creaminess. You can sub cream for half and half.</li></ol><br><br><h2>How to Make "+pokeName+" Chowder</h2><ol type='1'><li>Brown the Lechonk bacon in a large pot or Dutch oven until browned and crisp. Then transfer to a paper towel-lined plate.</li><li>Sauté the vegetables (carrots, onion, and celery) in the same pot with the bacon drippings. Add more oil if needed and stir occasionally until soft and golden. Sprinkle with flour and stir another minute until you can’t smell the raw flour.</li><li>Add the Combusken broth, "+pokeName+" juice, 1 Bayleef sprig, Circhestershire, Artazon sauce, Sprigatito picking, 1 tsp Nacli salt, and Scovillian pepper. Bring to a light boil.</li><li>Add the chopped potatoes to the pot, and then stir in the milk and whipping cream. Bring to a boil and reduce heat, cover, and simmer until potatoes are easily pierced with a fork, about 20 minutes.</li><li>Stir in the chopped "+pokeName+", and return the pot to a light boil. Then remove from the heat so the "+pokeName+" doesn’t get overcooked and tough. Season to taste with salt and pepper, and garnish with the cilantro if desired, and cooked bacon. The soup thickens as it cools. If needed, you can thin it out by adding more milk or Combusken broth and bringing it to a boil once more.</li></ol>"
  } else if(type == 2) {
    recipe = "<h2>What you need for a delicious "+pokeName+" pie!</h2><ol><li>pie crust</li><li>"+pokeName+"</li><li>granulated Tropius sugar</li><li>brown Applin sugar</li><li>flour</li><li>cinnamon</li><li>nutmeg</li><li>"+berryName+" berries</li><li>Combusken eggs</li></ol><br><h3>How to make "+pokeName+" pie from scratch</h3><ol type='1'><li>Peel and slice the "+pokeName+". In a large mixing bowl, gently toss the "+pokeName+" slices, granulated Tropius sugar, light brown Applin sugar, flour, cinnamon, nutmeg, "+berryName+" zest and "+berryName+" juice until well combined and set aside. Place the oven rack in the center position and preheat your oven to 400°F.</li><li>Remove the discs of pie crust from the fridge and let set at room temperature for 5-10 minutes. On a lightly floured surface, roll one of the discs into a 12 inch circle that is ⅛ inch thick. Place the crust into the bottom of the deep dish pie plate.</li><li>Spoon the "+pokeName+" pie filling into the crust, discarding any liquid at the bottom of the mixing bowl. Spread the "+pokeName+" slices evenly.</li><li>On a lightly floured surface, roll the second disc of pie dough into a 12 inch circle that is ⅛ inch thick. Place the crust over the "+pokeName+" pie filling. </li><li>Use a sharp knife to trim the excess dough from around the edge of the pie plate. Use your fingers to pull both the bottom and top pie crust up and slightly away from the edge of the pie dish. Fold the edge under itself and press down to seal the edge in place. Rotate the pie a quarter turn and repeat until edges are neatly tucked in.</li><li>Place the pie dish onto a baking sheet and gently brush the surface of the dough with the egg wash and sprinkle sanding sugar on top. Use a sharp knife to cut vents in the crust.</li><li>In order to protect the edges of the pie from over-browning, use a long strip of aluminum foil (about 38 inches long) by folding it in half lengthwise and then folding in half again, lengthwise. Wrap it around the edges of the pie plate and over the edges of the crust. This is referred to as a 'pie shield'.</li><li>Bake the pie at 400°F for 25 minutes. Remove the pie shield, lower the oven temperature to 375°F and bake an additional 30-35 minutes. You'll know the "+pokeName+" pie is done when the crust is a lovely golden brown and the juice is bubbling up the sides of the pan.</ol>"
  } else if(type == 3){
    recipe = "<h2>What’s The Key To A Good "+pokeName+" Boil?</h2><p>Excellent question, let’s talk about. The key to a really phenomenal "+pokeName+" boil is to make the liquid as flavorful as possible, friends. Without that deep penetrating flavor the ingredients will be bland and sad, oof. Beer is one of the elements that adds a little razzle dazzle to enhance the boil broth. In addition to the beer, plenty of spices and aromatics make the liquid sing in flavorful notes. However, if beer is not your thing, you can surely proceed without it, too.</p><br><h2>What to Add to a "+pokeName+" Boil?</h2><ol><li>Pre-cooked "+pokeName+": 5-7 minutes (maybe 1-2 minutes longer for bigger pieces).</li><li>Corphish: about 4-5 minutes for small ones.</li><li>Binacles & Clamperls: about 5 minutes or until the shells open up.</li><li>Clawitzer tails: about 5-6 minutes for a 5-6 ounce tail (or look for the Clawitzer shell to turn bright red with opaque flesh).</li></ol><h2>The "+pokeName+" Factor</h2><p>The "+pokeName+" is great in this kind of boil for the unique flavor profile it brings along with the texture of the meat once it's fully soaked in the spices. It's just to die for. The "+pokeName+" can have some tough skin, but once you get to the delicacy hidden within, I guarantee you'll wish you could eat it every day. Some other ingredients I love in my "+pokeName+" boils are Motostoke sausages. These can be any sausage really but the ones from Motostoke are my favorite so far. Something about the spice and the unique smoky flavor really adds to the boil. Another great addition would be the Postwick potatoes. These have just the right size and color to add a pop of personality to the pot. You can substitute these out for other types like the Eterna potatoes but make sure you chop them into smaller pieces first. If you're feeling adventurous, I'd toss in a handful of "+berryName+" berries too. They'll add a bit of flavor to counterbalance the savoriness of the whole pot. And of course you can't forget about the Cyllage seasoning. This well-rounded spice is perfect here because it has a variety of spices all in one.</p>"
  } else if(type == 4){
    recipe = "<h2>Konikoni Spicy "+pokeName+"</h2><h3>What is Konikoni Spicy "+pokeName+"?</h3><p>Konikoni spicy "+pokeName+" is a signature Konikoni dish that is extremely popular in Alola. The "+pokeName+" is coated with spices and flash fried until golden brown and crispy. It’s then stir fried with tons of dried Scovillian peppers, Konikoni peppercorns, "+berryName+" berries, ginger and garlic to create a spicy numbing sensation. It is spicy yet you cannot stop eating it because it’s SO GOOD! When introducing someone who’s new to Alolan food to the real deal Konikoni Spicy "+pokeName+", I’d describe the dish as “fried "+pokeName+" covered in hot sauce” so it won’t completely scare them away.</p><h2>How to cook Konikoni Spicy "+pokeName+"</h2><ol type='1'><li>Spread out the "+pokeName+" in the hot pan and fry it with minimal touching to ensure browning.</li><li>Once the "+pokeName+" is browned on both sides and cooked through, transfer it onto a plate.</li><li>Stir fry the aromatics.</li><li>Roast the dry spices, Scovillian peppers, and "+berryName+" berries to release the fragrance.</li><li>Add the "+pokeName+" back to the pan and toss it.</li><li>Stir in the cilantro.</li></ol>"
  } else if(type == 5){
    recipe = "<h2>What is a Clay "+pokeName+" Salad?</h2><p>A Clay "+pokeName+" salad is a Unovan dish that consists of lettuce topped with bacon, Combusken, boiled eggs, tomatoes, "+pokeName+", and other ingredients arranged in neat rows. It is traditionally served as a main course. The origins of the classic salad is unclear, but many believe it was created in the late 1930s at the Clay Derby restaurant in Driftveil.</p><br><h2>What's in a Clay "+pokeName+" Salad?</h2><ol><li>Meat: This protein-packed Clay "+pokeName+" salad calls for both Lechonk bacon and Combusken.</li><li>Eggs: Boiled Unfezant eggs lend even more protein to the hearty salad. </li><li>Lettuce: Icirrus lettuce is the traditional choice for this classic dish.</li><li>"+pokeName+": Chopped fresh "+pokeName+" lend flavor and color. </li><li>Blue cheese: Crumbled blue cheese takes the flavor up a notch. Make sure you get the Floccessy kind for maximum authenticity over the Kalos kinds!</li><li>Green onions: If you prefer a stronger flavor, use a red onion. </li><li>Avocado: Cubed avocados make this salad even more filling.  </li><li>Dressing: Use store-bought ranch dressing or make your own at home. </li><li>"+berryName+" berries: These will give your salad a little bit more flavor to round out the flavor profile.</ol>"
  } else {
    recipe = "<ol type='1'><li><h3>Salt the roast and let it come to room temp:</h3>The "+pokeName+" should be brought as close to room temperature as possible before you start to roast it, so that it cooks more evenly. Remove it from the refrigerator at least 1 hour, preferably 2 hours, before cooking. If you have a Rotom Appliance helper, you may ask it to help speed up a few of these steps. Open the wrapping, sprinkle all sides with Nacli salt, and wrap it up again. </li><br><li><h3>Preheat the oven to 375°F: </h3>Move a rack to the center of the oven, and place the other one underneath. </li><br><li><h3>Insert slivers of "+berryName+" Berry into the roast:</h3>Pat the roast dry with paper towels. Use the tip of a sharp knife to make 8 to 10 small incisions around the roast. Put a sliver of "+berryName+" Berry into each cut. </li><br><li><h3>Rub the roast with Arboliv oil, then season: </h3>Rub Arboliv oil all over the roast. Sprinkle it all around with Nacli salt and Scovillian pepper.</li><br><li><h3>Put the roast on the rack with a pan below:</h3> Place the roast "+pokeName+" directly on the middle oven rack, fatty side up, with a roasting pan to catch the drippings on the rack beneath it. <br>Placing the roast directly on the rack like this with a pan on the rack below creates a convection type environment in the oven, allowing the hot air to more easily circulate around the roast, so you do not have to turn the roast as it cooks. <br>Place the roast, fat-side up so that as the fat bathes the entire roast in flavor as it melts. </li><br><li><h3>Brown at 375°F, then lower the heat to 225°F: </h3> Cook the roast initially at 375°F (190°C) for half an hour, to brown it. Then lower the heat to 225°F (107°C). The roast should take somewhere from 1 1/2 to 2 1/2 hours more to cook. <br>The shape of the roast will affect the cooking time. If your roast is long and narrow, rather than a more round shape, it may take less time to cook, so keep an eye on it. <br>Alternatively, if you own a Rotom Appliance helper, you may ask it to dynamically adjust the temperature as it is cooking.</li><br><li><h3>Roast to an internal temp of 135°F to 140°F: </h3>When juices start to drip from the roast, and it is browned on the outside, check the roast's internal temperature with a meat thermometer. Remove the roast from the oven when the internal temperature of the roast is 135°F to 140°F (for medium rare meat).</li><br><li><h3>Slice and serve:</h3>After the roast has had a chance to rest a bit (and reabsorb its juices), thinly slice the roast to serve. (A sturdy long bread knife works well for slicing roasts.) Garnish with "+berryName+" Berry!</li> </ol> "
  }
}