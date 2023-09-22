//GameSounds
function playHarvestSound() {
  var audio = document.getElementById("harvestSound");
  audio.play();
}

function playPlantSound() {
  var audio = document.getElementById("plantSound");
  audio.play();
}

//RESET LOCAL STORAGE
$(document).on("click", "#resetAll", function() {
  localStorage.clear();
  console.log("All LocalStorage Items Clear");
});
//END RESET LOCAL STORAGE

//Set Game Variables
var NumPlots = 0; //a reset for the number of plots a user has
var Money = 140; //the amount of money to start
var PlotCost = 100; //Cost of a Plot of land

var SeedCostT1 = 40; //Cost of seeds to plant
var SeedCostT2 = 100; //Cost of seeds to plant
var SeedCostT3 = 150; //Cost of seeds to plant

var counterLimitT1 = 40; //Time it takes to grow to corn \ MUST BE DIVISIBLE BY 4
var counterLimitT2 = 75; //X amount of the counter limit for other crops
var counterLimitT3 = 130; //X amount of the counter limit for other crops

var ProfitT1 = 41; //Profit per harvest
var ProfitT2 = 102.10; //Profit modifier for other crops
var ProfitT3 = 155.10; //Profit modifier for other crops

var coopProfit = 90; //Profit from the purchased coop

//Get DOM elements
var cropChooserWrapper = $("#cropChooserWrapper");
var cropChooserOptions = $("#cropChooserWrapper > .footer > .crop-type-option");
var plotWrapper = $("#plotWrapper");
var plot = $(".plotBox");
var MoneyBox = $("#moneyBox");
var MoneyBoxMessage = $("#MoneyBoxMessage");
var BottomMessageUI = $("#UIMessageWrapper");
var ConfirmWrapper = $("#ConfirmWrapper");
var ConfirmWrapperOptions = $("#ConfirmWrapper > .buttons > .button");
var tutorialFloaty = $("#tutorialFloat");
var seedSelection = ".seed-selection";

//Purchase Coop
var coopBuyOption = $("#CoopBuyOption");
var coopBuyOptions = $("#CoopExpansionWrapper > .buttons > .button");
var CoopExpansionWrapper = $("#CoopExpansionWrapper");
var Coop = $("#Coop");

//Grab code for spaner plots & remove when done
var spawnSavedPlot = $(".plotBoxSaved").html();
$(".plotBoxSaved").remove();
//Grab code for new plot
var spawnNewPlot = $("<div />")
  .append($(".plotBox").clone())
  .html();

//LOCAL STORAGE VARIABLES
//NUMBER OF PRE-PURCHASED PLOTS
var NumPlotsFromStorage = localStorage.getItem("NumPlots");
if (NumPlotsFromStorage == null || NumPlotsFromStorage == "NaN") {
  //if no saved plots then reset to variable
  NumPlots = NumPlots;
} else {
  //otherwise set the number to what is in storage
  NumPlots = parseInt(NumPlotsFromStorage);
}
console.log("you have " + NumPlots + " purchased plots");

//AMOUNT OF MONEY
var MoneyFromStorage = localStorage.getItem("NumMoney");
if (MoneyFromStorage == null || MoneyFromStorage == "NaN") {
  //same as above
  Money = Money;
} else {
  //same as above
  Money = parseInt(MoneyFromStorage);
}
console.log("you have shiba" + Money);

//SET STUFF
$("#moneyBox").html(Money);

//GET COOP INFO
var CoopFromStorage = localStorage.getItem("CoopPurchased");
if (CoopFromStorage == null || CoopFromStorage == "NaN") {
  //same as above
  //Money = Money;
  console.log("you don't own the coop!");
} else if (CoopFromStorage == "true") {
  //Show the Coop
  showTheCoop();
  //Start the Counter
  runTheCoop();
  //Update Money Stuff
  disableCoopPurchase();
  console.log("you own the coop!");
} else if (CoopFromStorage == "false") {
  console.log("you don't own the coop!");
}

//SET STUFF
$("#moneyBox").html(Money);

//Set HTML on starting elements (cost, time, and profit)
cropChooserWrapper
  .find(".corn")
  .find(".cost")
  .html("Cost: $" + SeedCostT1);
cropChooserWrapper
  .find(".corn")
  .find(".time")
  .html("Time: " + counterLimitT1 + "s");
cropChooserWrapper
  .find(".corn")
  .find(".profit")
  .html("Profit: $" + ProfitT1);

cropChooserWrapper
  .find(".blueberry")
  .find(".cost")
  .html("Cost: $" + SeedCostT2);
cropChooserWrapper
  .find(".blueberry")
  .find(".time")
  .html("Time: " + counterLimitT2 + "s");
cropChooserWrapper
  .find(".blueberry")
  .find(".profit")
  .html("Profit: $" + ProfitT2);

cropChooserWrapper
  .find(".watermelon")
  .find(".cost")
  .html("Cost: $" + SeedCostT3);
cropChooserWrapper
  .find(".watermelon")
  .find(".time")
  .html("Time: " + counterLimitT3 + "s");
cropChooserWrapper
  .find(".watermelon")
  .find(".profit")
  .html("Profit: $" + ProfitT3);

//CREATE SAVED PLOTS
function spawnSavedPlots() {
  var reqPlotsForSpawn = NumPlots; //get number of plots minus 1
  if (reqPlotsForSpawn >= 1 && NumPlots <= 16) {
    //if 1 or more AND less than 16 then spawn purchased plots
    //console.log("you have enough plots to spawn");
    plot.remove();
    tutorialFloaty.hide(); //hide tutorial if player has already played the game
    for (var i = 0; i < NumPlots; i++) {
      plotWrapper.append(spawnSavedPlot); //add the plots the user owns
      //console.log("1 plot appended");
    }
  } else {
    //console.log("NOTHING was spawned");
  }
  //plotWrapper.append(spawnNewPlot);
}
spawnSavedPlots();
makePlotAvailable();
//END CREATE SAVED PLOTS

//RUN STUFF
//TURN OFF TUTORIAL
$(document).on("click", ".tutorialOne", function() {
  tutorialFloaty.fadeOut();
  $(this).removeClass("tutorialOne");
});
//END TURN OFF TUTORIAL

$("#closeChooser").click(function() {
  hideSeedSelectionMenu();
});

$("#closeConfirm").click(function() {
  hideConfirmMenu();
});

$("#closeCoopConfirm").click(function() {
  hideCoopMenu();
});

var currentPlot = "";

//CLICK ON A PLOT
$(document).on("click", ".plotBox", function(event) {
  //console.log("clicked on plot");
  if ($(this).hasClass("available")) {
    //IF PLOT IS AVAILABLE
    currentPlot = $(this);
    hideConfirmMenu();
    function HideShowConfirmMenu() {
      showConfirmMenu();
    }
    // use setTimeout() to execute
    setTimeout(HideShowConfirmMenu, 100);
    //convertPlot($(this));
    //makePlotAvailable();
    //IF PLOT IS READY TO HARVEST
  } else if ($(this).hasClass("ready-to-harvest")) {
    //IF PLOT IS SEEDED
    var cropType = checkCropType($(this));
    harvestPlot($(this), cropType);
  } else if ($(this).hasClass("ready")) {
    hideSeedSelectionMenu();
    function HideShowSelectionMenu() {
      showSeedSelectionMenu();
      playPlantSound();
    }
    // use setTimeout() to execute
    setTimeout(HideShowSelectionMenu, 100);

    //setUpSeed($(this));
    currentPlot = $(this);
  } else {
    //do nothing
  }
});

function checkCropType(plotInfo) {
  var cropType = "";
  if (plotInfo.hasClass("corn")) {
    return "corn";
  } else if (plotInfo.hasClass("blueberry")) {
    return "blueberry";
  } else if (plotInfo.hasClass("watermelon")) {
    return "watermelon";
  } else {
    return "none";
  }
}

function checkCropCost(plotType) {
  if (plotType == "corn") {
    return SeedCostT1;
    //console.log("crop is type corn and the cost is: " + SeedCost);
  } else if (plotType == "blueberry") {
    return SeedCostT2;
    //console.log("crop is type strawberry and the cost is: " + SeedCost * SeedCostModifier);
  } else if (plotType == "watermelon") {
    return SeedCostT3;
    //console.log("crop is type blueberry and the cost is: " + SeedCost * SeedCostModifier);
  } else {
    //do nothing
  }
}

function checkCropProfit(plotType) {
  if (plotType == "corn") {
    return ProfitT1;
  } else if (plotType == "blueberry") {
    return ProfitT2;
  } else if (plotType == "watermelon") {
    return ProfitT3;
  } else {
    //do nothing
  }
}

function checkCropTimerLimit(plotType) {
  if (plotType == "corn") {
    return counterLimitT1;
    //console.log("plot type is corn");
  } else if (plotType == "blueberry") {
    return counterLimitT2;
    //console.log("plot type is blueberry");
  } else if (plotType == "watermelon") {
    return counterLimitT3;
    //console.log("plot type is watermelon");
  } else {
    //do nothing
  }
}

//PLANT SEED NEW
cropChooserOptions.click(function() {
  var cropType = "";
  cropType = $(this)
    .attr("class")
    .split(" ")
    .pop();
  console.log("crop type is " + cropType);
  //Add seed type to parent when planting seed for first time
  currentPlot.addClass(cropType);
  //Get cost of Crop based on type
  var cropCostLocal = checkCropCost(cropType);
  //console.log("this crop will cost you $" + cropCostLocal);
  //Actually plant the seed
  plantSeed(currentPlot, cropType, cropCostLocal);
});

//Click on yes or no option to purchase plot
ConfirmWrapperOptions.click(function() {
  //console.log($(this));
  if ($(this).hasClass("yes")) {
    convertPlot(currentPlot);
    makePlotAvailable();
    hideConfirmMenu();
  } else if ($(this).hasClass("no")) {
    hideConfirmMenu();
  } else {
  }
});

//Function that plants the seed after getting and setting variables
function plantSeed(plotInfo, plotType, cropCost) {
  console.log("You have: $" + Money);
  if (Money >= cropCost) {    
    var cropType = plotType;
    plotInfo.removeClass("plot");
    plotInfo.removeClass("ready");
    plotInfo.addClass("seed-" + cropType);

    console.log("This crop cost you: $" + cropCost);
    Money = Money - cropCost;
    console.log("You now have: $" + Money + "left");
    MoneyBox.html(Money);
    startPlotTimer(plotInfo, cropType);
    hideSeedSelectionMenu();
  } else {
    console.log("You DO NOT have enough money!");
    BottomMessageUI.html("You DO NOT have enough money!");
    animateBottomUITooltip();
  }
} //END PLANT SEED

//MAKES A PLOT AVAILABLE TO USE IF CONDITIONS MET
function makePlotAvailable() {
  var NumPlotsAvail = $("#plotWrapper > .available").length;
  var NumPlotCurrent = $("#plotWrapper > .plotBox").length;
  //console.log(NumPlotsAvail);
  if (Money >= PlotCost && NumPlotsAvail == 0 && NumPlotCurrent <= 15) {
    plotWrapper.append(spawnNewPlot);
    //console.log(spawnNewPlot);
    console.log("a new plot has been added");
  } else {
    //Do Nothing
    console.log("needs more money to spawn new plot");
  }
}

//Converts plot from available to harvestable
function convertPlot(plotInfo) {
  if (Money >= PlotCost) {
    plotInfo.removeClass("available").addClass("plot ready");
    Money = Money - PlotCost;
    SaveMoneyAmmount(Money);
    MoneyBox.html(Money);
    MoneyBoxMessage.html("-$" + PlotCost);
    console.log("> you have used $" + PlotCost);
    console.log(">> you have purchased a plot");
    SaveNumPlots();
    animateMoneyTooltip();
    plotInfo.attr("title", "Ready for Planting!");
  } else {
    console.log("You DO NOT have enough money!");
    BottomMessageUI.html("You DO NOT have enough money!");
    animateBottomUITooltip();
  }
}

//HARVEST PLOT
function harvestPlot(plotInfo, plotType) {
  playHarvestSound();
  console.log("Prior to harvest you have $" + Money);
  var localProfit = 0;

  localProfit = checkCropProfit(plotType);

  //console.log("This Has A Grown Crop!");
  plotInfo.removeClass();
  plotInfo.addClass("plotBox plot ready");
  //animateBottomUITooltip();
  //MAKE MONEY
  Money = Money + localProfit;
  SaveMoneyAmmount(Money);
  MoneyBox.html(Money);
  console.log("> you have made $" + localProfit);
  MoneyBoxMessage.html("+ $" + localProfit);
  console.log("after harvest you now have: $" + Money);
  animateMoneyTooltip();
  makePlotAvailable();
  plotInfo.attr("title", "Ready for Planting!");
  //console.log("new plot has spawned");
} //END HARVEST PLOT

//PLOT TIMER
function startPlotTimer(plotInfo, plotType) {
  var counter = 0;
  var counterFraction = 4;
  var plotTypeFinal = plotType;
  var localCounterLimit = 0;

  localCounterLimit = checkCropTimerLimit(plotType);

  var interval = setInterval(function() {
    plotInfo.removeClass("plot");
    plotInfo.attr(
      "title",
      Math.abs(counter - localCounterLimit) + " Seconds until ready."
    );
    counter++;
    var counterFractioned = localCounterLimit / counterFraction;
    //console.log(counterFractioned);
    //console.log(counter);

    if (counter == counterFractioned * 1) {
      plotInfo
        .removeClass("seed-" + plotTypeFinal)
        .addClass("seedling-" + plotTypeFinal);
    } else if (counter == counterFractioned * 2) {
      plotInfo
        .removeClass("seedling-" + plotTypeFinal)
        .addClass("adolescent-" + plotTypeFinal);
    } else if (counter == counterFractioned * 3) {
      plotInfo
        .removeClass("adolescent-" + plotTypeFinal)
        .addClass("mature-" + plotTypeFinal);
    } else if (counter == localCounterLimit) {
      plotInfo
        .removeClass("mature-" + plotTypeFinal)
        .addClass("ready-to-harvest adult-" + plotTypeFinal);
      //BottomMessageUI.html("Ready to Harvest!");
      plotInfo.attr("title", "Ready to Harvest!");
      clearInterval(interval);
    } else {
      //do nothing
    }
  }, 1000);
} //PLOT TIMER

//ANIMATE THE MONEY TIP
function animateMoneyTooltip() {
  MoneyBoxMessage.animate(
    {
      opacity: "1",
      bottom: "-20px"
    },
    500,
    function() {
      MoneyBoxMessage.animate({
        opacity: "0",
        bottom: "-30px"
      });
    }
  );
}

//ANIMATE THE BOTTOM MESSAGE TIP
function animateBottomUITooltip() {
  BottomMessageUI.animate(
    {
      opacity: "1"
    },
    1000,
    "linear",
    function() {
      BottomMessageUI.animate({
        opacity: "0"
      });
    }
  );
}

function showSeedSelectionMenu() {
  cropChooserWrapper.addClass("show");
  cropChooserWrapper.find(".crop-type-option").addClass("hide");
  if (Money >= SeedCostT3) {
    cropChooserWrapper.find(".corn").removeClass("hide");
    cropChooserWrapper.find(".blueberry").removeClass("hide");
    cropChooserWrapper.find(".watermelon").removeClass("hide");
  } else if (Money >= SeedCostT2) {
    cropChooserWrapper.find(".corn").removeClass("hide");
    cropChooserWrapper.find(".blueberry").removeClass("hide");
    //cropChooserWrapper.find(".watermelon").removeClass("hide");
  } else if (Money >= SeedCostT1) {
    cropChooserWrapper.find(".corn").removeClass("hide");
  }
}

function hideSeedSelectionMenu() {
  cropChooserWrapper.removeClass("show");
}

function showConfirmMenu() {
  ConfirmWrapper.addClass("show");
}

function hideConfirmMenu() {
  ConfirmWrapper.removeClass("show");
}

//Save Plots as they are purchased
function SaveNumPlots() {
  NumPlots = NumPlots + 1;
  localStorage.setItem("NumPlots", NumPlots);
  //console.log("You have " + NumPlots + " purchased plots");
}

//Save Money as it is purchased
function SaveMoneyAmmount(moneyAmount) {
  localStorage.setItem("NumMoney", moneyAmount);
  //console.log("You have shiba" + moneyAmount);
}

//Show Coop Buy Option
function showCoopMenu() {
  CoopExpansionWrapper.addClass("show");
}
//Hide Coop Buy Option
function hideCoopMenu() {
  CoopExpansionWrapper.removeClass("show");
}

//Trigger Coop Buy Option
coopBuyOption.click(function() {
  showCoopMenu();
});

//Buy The Coop
coopBuyOptions.click(function() {
  if ($(this).hasClass("yes")) {
    buyTheCoop();
    hideCoopMenu();
  } else if ($(this).hasClass("no")) {
    hideCoopMenu();
  } else {
  }
});

function buyTheCoop() {
  if (Money >= 10000) {
    //Show the Coop
    showTheCoop();
    //Start the Counter
    runTheCoop();
    //Update Money Stuff
    Money = Money - 10000;
    SaveMoneyAmmount(Money);
    MoneyBox.html(Money);
    MoneyBoxMessage.html("- $" + 10000);
    console.log("You Have Used: 10,000 shiba");
    console.log("You now own the Coop!");
    animateMoneyTooltip();
    //Save Local Storage Boolean
    localStorage.setItem("CoopPurchased", true);
    disableCoopPurchase();
  } else {
    console.log("You DO NOT have enough money!");
    BottomMessageUI.html("You DO NOT have enough money!");
    animateBottomUITooltip();
  }
}

function runTheCoop() {
  setInterval(function() {
    Money = Money + coopProfit;
    MoneyBox.html(Money);
    MoneyBoxMessage.html("+ $" + coopProfit);
    console.log("You Have Made: " + coopProfit + " from the Coop");
    animateMoneyTooltip();
  }, 60 * 1000); // 60 * 1000 milsec
}

function showTheCoop() {
  Coop.addClass("show");
}

function disableCoopPurchase() {
  coopBuyOption.hide();
}

function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + ":" + min + ":" + sec + " " + ap;
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var curWeekDay = days[today.getDay()];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();
    var date = curWeekDay+", "+curDay+" "+curMonth+" "+curYear;
    document.getElementById("date").innerHTML = date;
    
    var time = setTimeout(function(){ startTime() }, 500);
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

const action = document.querySelector('.action');
action.addEventListener('click', ()=> {
  action.classList.toggle('active')
})

const playlist = document.querySelector('.playlist');
playlist.addEventListener('click', ()=> {
  playlist.classList.toggle('active')
})

const normaltopup = document.querySelector('.normaltopup');
normaltopup.addEventListener('click', ()=> {
  normaltopup.classList.toggle('active')
})

const shibaconvert = document.querySelector('.shibaconvert');
shibaconvert.addEventListener('click', ()=> {
  shibaconvert.classList.toggle('active')
})
