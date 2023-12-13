addLayer("mp", {
    name: "multiverse prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#d03800",
    requires(){
		return new Decimal('1e20000');
	},
    resource: "multiverse prestige points", // Name of prestige currency
    baseResource: "exotic prestige", // Name of resource prestige is based on
    baseAmount() {return player.ep.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=new Decimal(1);
		return m;
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
	exponent: 7.5,
    hotkeys: [
        {key: "z", description: "Z: Reset for Multiverse Prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(181)},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Multiverse Prestige Upgrade 11",
            description: "Prestige Power Strength boost Prestige Power gain",
            cost: new Decimal(4),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.2;
                let ret = player.pp.power.add(1).div('1e1000').pow(base)
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
	},
    challenges: {
        11:{
            onEnter() {
                player.t.points=new Decimal(0)
                player.p.points=new Decimal(0)
            },
            name: "Ex-Dilation",
            completionLimit: Infinity,
            challengeDescription() {return "4th Exotic Fusioner effect is ^0.15 weaker."+"<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
            unlocked() { return true },
            goal: function(){
                if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.mp.challenges[11]+0.001));
            },
            canComplete(){
                return player.ep.points.gte(tmp.mp.challenges[this.id].goal)&&player.m.points.lt(110);
            },
            completionsAfter120(){
                let p=player.ep.points;
                if(player.m.best.gte(130)){
                    if(p.lte("1e10000"))return 0;
                    return p.log10().div(10000).log(1.1).pow(1/1.1).toNumber();
                }
            },
            rewardEffect() {
                let ret = (player.mp.challenges[11]+1*1.46)**1.75
                return ret;
            },
            goalAfter120(x=player.mp.challenges[11]){
                if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.1,Decimal.pow(x,1.1)).mul(10000));
            },
            currencyDisplayName: "Exotic Prestige Points",
            rewardDescription() { return "6th Exotic Fusioner effect is x"+ format(this.rewardEffect())+" better." },
    },
    },
	buyables: {
		rows: 1,
		cols: 1,
	},
    tabFormat: {
		"Main":{
			content:[
				"main-display","prestige-button","resource-display",
				"challenges"
			]
		},
        "Upgrades": {
			content: [
				"main-display","prestige-button","resource-display",
				"upgrades"
			]
		},
    },
	branches: ["ep"],
	passiveGeneration(){
		return 0;
	},
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(l=="mp") {
                layerDataReset('pp',["upgrades"])
                layerDataReset("ep",["buyables"])};
		},
	update(){
        if(player.m.best.gte(120)){
            if(player.mp.activeChallenge){
                player.mp.challenges[player.mp.activeChallenge]=Math.max(player.mp.challenges[player.mp.activeChallenge],layers.mp.challenges[player.mp.activeChallenge].completionsAfter120());
            }
        }
	}
})