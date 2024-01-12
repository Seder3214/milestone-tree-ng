let modInfo = {
	name: "The Milestone Tree NG+",
	id: "c2nv4in9eusojg59bmo",
	author: "Seder3214",
	pointsName: "points",
	modFiles: ["/layers/m.js","/layers/p.js","/layers/sp.js","/layers/hp.js","/layers/pb.js","/layers/hb.js","/layers/ap.js",
	"/layers/t.js","/layers/mm.js","/layers/em.js","/layers/pe.js","/layers/se.js","/layers/pp.js","/layers/ep.js","/layers/mp.js",,"/layers/pm.js", "tree.js",'modal.js'],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "2.002",
	name: "Prestige Multiverse",
}

let changelog = `<h3>Changelog:</h3><br><br>
Note: v<h3 style="color: green">A</h3>.<h3 style='color: blue'>B</h3><h3 style='color: yellow'>C</h3>  <br>
<h3 style='color: green'>A</h3> is a number of <h3 style='color:yellow'>major</h3> updates like <h3 style='color: #f71c50;'>Prestige Milestone Tree</h3>, <br>
<h3 style='color: blue'>B</h3> is a number of <h3 style="color:#793784">milestones</h3> in current version, <br>
<h3 style='color: yellow'>C</h3> is a letter that used to show <h3 style='color: cyan'>bugfix/rebalance</h3> updates<br><br>
<h3 style='color: #f71c50;'>v2.002 - Prestige Milestones</h3><br>
<span style='color: #808080'> - Prestige Milestone Tree is here!<br></span>
<br><h3 class='mr'>v1.185 - Multiverse Fusioners</h3><br>
<span style='color: #808080'> - Added four new fusioners! <i>Almost the end, huh?</i><br>
- Added two more challenges</span><br><br>
<span style='color: gold;'>There was many many updates before...</span><br>
<span style='color: #808080'> ...........<br></span>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`
// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
return true
}

function getPointGen() {
var b=getPointGenBeforeSoftcap();var sc=getPointSoftcapStart().log10();
if(b.gte(getPointSoftcapStart())){
	if(player.t.activeChallenge==22||player.t.activeChallenge==32){
		return getPointSoftcapStart();
	}
	while(b.log10().gte(sc)){
		let potency=0.4;
		if(hasUpgrade("t",53))potency=potency*0.9;
		b=Decimal.pow(10,b.log10().div(sc).pow(1-potency).mul(sc));
		sc=sc.mul(20);
	}
}
return b
}


function getPointGenBeforeSoftcap() {
var b=new Decimal(0)
if(player.m.best.gte(1))b=b.add(3);
if(player.m.best.gte(2))b=b.mul(3);
if(player.m.best.gte(3))b=b.mul(tmp.m.milestone3Effect);
if(hasUpgrade("p",11))b=b.mul(upgradeEffect("p",11));
if(hasUpgrade("p",12))b=b.mul(upgradeEffect("p",12));
if(hasUpgrade("sp",11))b=b.mul(upgradeEffect("sp",11));
if(hasUpgrade("sp",12))b=b.mul(upgradeEffect("sp",12));
if(hasUpgrade("hp",11))b=b.mul(upgradeEffect("hp",11));
if(hasUpgrade("hp",12))b=b.mul(upgradeEffect("hp",12));
if(hasUpgrade("ap",11))b=b.mul(upgradeEffect("ap",11));
if(player.t.activeChallenge==11||player.t.activeChallenge==21||player.t.activeChallenge==31)b=b.pow(tmp.t.dilationEffect);
if(player.ap.activeChallenge==22 ||player.ap.activeChallenge==41||player.ap.activeChallenge==42 )b=b.add(1).log10().pow(player.m.best.gte(122)?player.m.points:100);
if (player.mp.activeChallenge==21) b = new Decimal(1).div(player.mp.points.log2().pow(0.5))
if (player.pm.essence.gte(1) && player.mp.activeChallenge==21) b = b.mul(tmp.pm.essenceBoost)
return b.div(player.m.best.gte(180)?2:1)
}

function getPointGenString(){
return "("+format(getPointGen())+"/sec)";
}

function getPointSoftcapStart(){
var sc=new Decimal("ee9");
if(player.m.best.gte(105))sc=sc.pow(tmp.m.milestone105Effect);
if(player.t.activeChallenge==12||player.t.activeChallenge==22||player.t.activeChallenge==32)sc=sc.pow(0.0001);
sc=sc.pow(tmp.t.challenges[12].rewardEffect);
sc=sc.pow(tmp.t.challenges[22].rewardEffect);
sc=sc.pow(tmp.t.challenges[32].rewardEffect);
if(hasUpgrade("ap",32))sc=sc.pow(upgradeEffect("ap",32));
if(hasUpgrade("hb",11))sc=sc.pow(upgradeEffect("hb",11));
if(hasUpgrade("pb",31))sc=sc.pow(upgradeEffect("pb",31));
if(hasUpgrade("t",54))sc=sc.pow(upgradeEffect("t",54));
sc=sc.pow(tmp.p.buyables[11].effect);
if(hasUpgrade("pe",11))sc=sc.pow(upgradeEffect("pe",11));
sc=sc.pow(tmp.sp.buyables[12].effect);
sc=sc.pow(layers.t.getSpecialEffect(12));
if(hasUpgrade("t",73))sc=sc.pow(upgradeEffect("t",73));
if(hasUpgrade("se",11))sc=sc.pow(upgradeEffect("se",11));
sc=sc.pow(layers.t.getSpecialEffect(22));
if(hasUpgrade("se",22))sc=sc.pow(upgradeEffect("se",22));
if(hasUpgrade("pp",11))sc=sc.pow(upgradeEffect("pp",11));
return sc;
}

function getCostOverflowStart(){
	if(player.ap.activeChallenge==42){
		return new Decimal(player.points.log(10).pow(0.585))
	}
	var sc=new Decimal(170);
	if (player.m.best.gte(174)) sc = sc.add(2)
	return sc;
	}
	function getCostOverflowScale(){
		var sc=new Decimal(172);
		if (player.m.best.gte(176)) sc = sc.add(1)
		if (player.m.best.gte(177)) sc = sc.add(1)
		return sc;
		}
	function getCostOverflowEff(){
		let eff=new Decimal(1).add(player.m.points.sub(getCostOverflowStart()).add(1.15).div(10)).pow(1.075).sub(hasUpgrade("mp",12)?upgradeEffect("mp",12):1)
		if (player.m.points.gte(getCostOverflowScale())){
		eff=new Decimal(1).add(player.m.points.sub(getCostOverflowStart()).add(1.15).div(10)).pow(player.m.points.gte(181)?new Decimal(1.7).add(player.m.points.sub(181).div(10)):1.2).sub(hasUpgrade("mp",12)?upgradeEffect("mp",12):1)
		}
		return eff;
		}
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
"Mod Author: Seder3214 / qq1010903229 (loader3229)",
function(){let table = ''
	if(getPointGen().gte(getPointSoftcapStart().sqrt())){
		table += "1st milestone's effect ^"+format(getPointGen().log(getPointGenBeforeSoftcap()),4)+" because of softcap.<br>1st milestone's softcap starts at "+format(getPointSoftcapStart());
	}
	if(player.m.best.gte(getCostOverflowStart())){
		table += "<br>Milestone cost exponent is x"+format(getCostOverflowEff(),4)+" because of overflow.<br> Starts at "+format(getCostOverflowStart()) + " milestones, scales at " +format(getCostOverflowScale()) + " milestones";
   }
	return table
}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e1e45"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}