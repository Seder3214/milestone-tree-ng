addLayer("pe", {
    name: "prestige energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF8800",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige energy", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Collect Prestige Energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(125)&& (player.mp.activeChallenge!=21)||player.pm.activeChallenge==12||player.pm.activeChallenge==13},
	branches: ["p"],
	base: function(){
		let b=new Decimal("10");
		if(player.mm.best.gte(26))b=b.sqrt();
		if(player.mm.best.gte(27))b=b.sqrt();
		if(player.mm.best.gte(28))b=b.sqrt();
		if(player.mm.best.gte(29))b=b.sqrt();
		return b;
	},
	exponent: function(){
        let b = new Decimal(1)
        if (player.ep.buyables[11].gte(8)) b = b.sub(tmp.ep.eightEffect)
        return b
	},
	resetsNothing:true,
	doReset(l){},
	canBuyMax:true,
	autoPrestige(){return player.m.best.gte(126)},
	upgrades: {
        rows: 2,
        cols: 4,
		11: {
			title: "Prestige Energy Upgrade 11",
            description: "1st Milestone's softcap starts later based on your prestige energy.",
            cost: new Decimal(2.48e11),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let b=player.pe.points.add(1).log10().div(100);
				if(hasUpgrade("pe",13))b=b.mul(1.5);
				if(hasUpgrade("pe",23))b=b.mul(1.5);
				return b.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x later" }, // Add formatting to the effect
        },
		12: {
			title: "Prestige Energy Upgrade 12",
            description: "Milestone Cost Scaling is weaker based on your prestige energy.",
            cost: new Decimal(2.77e11),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let b=player.pe.points.add(1).log10().div(200);
				if(hasUpgrade("pe",14))b=b.mul(1.5);
				if(hasUpgrade("pe",22))b=b.mul(1.5);
				return b.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x" }, // Add formatting to the effect
        },
		13: {
			title: "Prestige Energy Upgrade 13",
            description: "Prestige Energy Upgrade 11 is boosted.",
            cost: new Decimal(5.98e11),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		14: {
			title: "Prestige Energy Upgrade 14",
            description: "Prestige Energy Upgrade 12 is boosted.",
            cost: new Decimal(7.94e11),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		21: {
			title: "Prestige Energy Upgrade 21",
            description: "Transcend point gain is boosted based on your prestige energy.",
            cost: new Decimal(1.34e12),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let base=1.1;
				if(hasUpgrade("pe",24))base+=0.05;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect(),4)+"x" }, // Add formatting to the effect
        },
		22: {
			title: "Prestige Energy Upgrade 22",
            description: "Prestige Energy Upgrade 12 is boosted.",
            cost: new Decimal(1.42e12),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		23: {
			title: "Prestige Energy Upgrade 23",
            description: "Prestige Energy Upgrade 11 is boosted.",
            cost: new Decimal(3.38e12),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		24: {
			title: "Prestige Energy Upgrade 24",
            description: "Prestige Energy Upgrade 21 is boosted.",
            cost: new Decimal(6.86e12),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
	},
	
    resetDescription: "Collect ",
	tabFormat: [
		"main-display",
		"prestige-button",
		["display-text",function(){
			let peroom=new Decimal(10).log(tmp.pe.base);
			let power=new Decimal(1).div(tmp.pe.exponent);
			return "("+format(peroom)+" per OoM of prestige points, then raised to a power of "+format(power)+")";
		}],
		"upgrades"
	],
})