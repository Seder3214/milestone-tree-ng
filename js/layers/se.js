addLayer("se", {
    name: "super energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF6600",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "super energy", // Name of prestige currency
    baseResource: "super-prestige points", // Name of resource prestige is based on
    baseAmount() {return player.sp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let b = new Decimal(1)
        return b
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "E", description: "Shift+E: Collect Super Energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(140)&& (player.mp.activeChallenge!=21)},
	branches: ["sp"],
	base: function(){
		let b=new Decimal("10");
        if(player.m.best.gte(148))b=b.sqrt();
        if(player.m.best.gte(149))b=b.sqrt();
        if(player.m.best.gte(152))b=b.sqrt(tmp.m.milestone152Effect);
		return b;
	},
	exponent: function(){
		let b = new Decimal(1)
        return b
	},
	resetsNothing:true,
	doReset(l){},
	canBuyMax:true,
	autoPrestige(){return player.m.best.gte(140)},
	upgrades: {
        rows: 2,
        cols: 4,
		11: {
			title: "Super Energy Upgrade 11",
            description: "1st Milestone's softcap starts later based on your super energy.",
            cost: new Decimal(1.11e12),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let b=player.se.points.add(1).log10().div(100);
				return b.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x later" }, // Add formatting to the effect
        },
		12: {
			title: "Super Energy Upgrade 12",
            description: "Milestone Cost Scaling is weaker based on your super energy.",
            cost: new Decimal(1.53e12),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let b=player.se.points.add(1).log10().div(200);
				return b.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x later" }, // Add formatting to the effect
        },
        21: {
			title: "Super Energy Upgrade 21",
            unlocked() {return player.m.best.gte(146)},
            description: "4th Milestone's effect is better based on your super energy..",
            cost: new Decimal(2.89e12),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let b=player.se.points.add(1).log10().mul(1.5);
				return b.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x" }, // Add formatting to the effect
        },
        22: {
			title: "Super Energy Upgrade 22",
            unlocked() {return player.m.best.gte(146)},
            description: "1st Milestone's softcap starts later based on your super energy.",
            cost: new Decimal(3.1e13),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let b=player.se.points.add(1).log10().div(120);
				return b.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x later" }, // Add formatting to the effect
        },
	},
	
    resetDescription: "Collect ",
	tabFormat: [
		"main-display",
		"prestige-button",
		["display-text",function(){
			let peroom=new Decimal(10).log(tmp.se.base);
			let power=new Decimal(1).div(tmp.se.exponent);
			return "("+format(peroom)+" per OoM of super-prestige points, then raised to a power of "+format(power)+")";
		}],
		"upgrades"
	],
})