addLayer("pp", {
    name: "prestige power", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        power: new Decimal(0),
    }},
    color: "#652021",
    requires(){
		return new Decimal('e7e13');
	},
    resource: "prestige power", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m= new Decimal(1)
		return m;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.00000000000001,
    hotkeys: [
        {key: "W", description: "W: Reset for prestige power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(151)},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Prestige Power Upgrade 11",
            description: "First Milestone's softcap starts later by your prestige power strength.",
            cost: new Decimal(23),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.51;
                let ret = Decimal.mul(base,Decimal.log10(player[this.layer].power.add(1)).pow(0.01).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x later" }, // Add formatting to the effect
        },
        12: {
			title: "Prestige Power Upgrade 12",
            description: "Prestige Upgrade 11 is boosted by your prestige power strength.",
            cost: new Decimal(1600),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.30;
                let ret = Decimal.mul(base,Decimal.log10(player[this.layer].power.add(1)).add(1))
                return ret;
            },
            effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
        },
        13: {
			title: "Prestige Power Upgrade 13",
            description: "Prestige Upgrade Buyable effect is boosted by your prestige power strength.",
            cost: new Decimal(10000),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.05;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].power.add(1)).add(1))
                return ret;
            },
            effectDisplay() { return "+"+format(this.effect()) }, // Add formatting to the effect
        },
        21: {
			title: "Prestige Power Upgrade 21",
            description: "Unlock Super-Dilated Prestige Points effect.",
            cost: new Decimal(100000),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
        22: {
			title: "Prestige Power Upgrade 22",
            description: "Unlock Prestige-Hardcapped Prestige Points effect.<br>Req: Power Scaler -<br> [11 Lvl]",
            cost: new Decimal(3600000),
            canAfford() {return player.pp.buyables[11].gte(11) && player.pp.power.gte(3600000)},
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
	},
    buyables: {
		rows: 1,
		cols: 1,
		11:{
			title(){
				return "Power Scaler";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Strenghens Prestige Power by "+format(data.effect)+" Hz/s (based on milestones)<br>"+
				"Cost for Next Level: "+format(data.cost)+" Prestige power";
			},
			cost(){
				let a=player[this.layer].buyables[this.id];
				a=Decimal.pow(2,a);
				return new Decimal(3).mul(a.pow(1.4).ceil());
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                player.pp.points = player.pp.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
               },
			  effect(){
				  let b=0.23;
				  let eff=new Decimal(0).add(player[this.layer].buyables[this.id].mul(b).mul(player.m.points.pow(0.15)));
                  if (player.m.points.gte(154)) eff = eff.times(tmp.m.milestone154Effect)
				  return eff;
			  },
			  unlocked(){
				  return player.m.points.gte(123);
			  }
		},
	},
    tabFormat: {
		"Main":{
			content:[
				"main-display","prestige-button","resource-display",
				["display-text",function(){return "Your Prestige Power is "+format(player.pp.power) + " Hz powerful"}],
                'buyables',
                'upgrades',

			]
		},
	},
	branches: ["p"],
	passiveGeneration(){
        if (player.m.points.gte(157)) return 0.3
        if (player.em.points.gte(3)) return 0.1
		return 0;
	},
		doReset(l){
			if(l=="pp")if(player.m.points.gte(153))layerDataReset("p",["upgrades",[4]]);else layerDataReset("p",[]);
		},
	update(diff){
        if (player.pp.buyables[11].gte(1)) player.pp.power = player.pp.power.add(buyableEffect('pp', 11).times(diff))
	}
})