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
    softcap: new Decimal('e28000000'),
    softcapPower() {
       return new Decimal(0.015)
    },
    resource: "prestige power", // Name of prestige currency
    baseResource() {if (hasMalware("m", 4)) return "<span style='color:red'>infected</span> prestige points"
		return "prestige points"},// Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade(this.layer, 32)) mult = mult.mul(upgradeEffect(this.layer, 32))
        if (hasUpgrade('mp', 11)) mult = mult.mul(upgradeEffect('mp', 11))
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
    layerShown(){return player.m.best.gte(151)&& (player.mp.activeChallenge!=21)||player.pm.activeChallenge==12||player.pm.activeChallenge==13},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Prestige Power Softcap Delayer I",
            description: "First Milestone's softcap starts later by your prestige power strength.",
            cost: new Decimal(23),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.51;
                if (hasUpgrade('pp', 23)) base += 0.15
                let ret = Decimal.mul(base,Decimal.log10(player[this.layer].power.add(1)).pow(0.5).add(1))
                return softcap(ret,new Decimal(1.05),0.1);
            },
            effectDisplay() { return format(this.effect(),4)+"x later" }, // Add formatting to the effect
        },
        12: {
			title: "Prestige Power Prestige Upgrade 11 Boost I",
            description: "Prestige Upgrade 11 is boosted by your prestige power strength.",
            cost: new Decimal(1600),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.30;
                let ret = Decimal.mul(base,Decimal.log10(player[this.layer].power.add(1)).pow(0.5).add(1)).add(0.1).max(1)
                ret = softcap(ret, new Decimal(1.25).add(player.mp.challenges[13]>0?challengeEffect('mp',13):0), new Decimal(0.001))
                if (hasMalware("m",3))ret=ret.add(milestoneEffect("m",3))
                return ret;
            },
            effectDisplay() { return "^"+format(this.effect(),4) }, // Add formatting to the effect
        },
        13: {
			title: "Prestige Power Prestige Buyable 2 Boost I",
            description: "Prestige Softcap Delayer effect is boosted by your prestige power strength.",
            cost: new Decimal(10000),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp",
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.05;
                let effAfter1000 = player.pp.points.max(1).slog(10).max(1).pow(6)
                if (hasUpgrade('pp', 31)) base += 0.15
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].power.add(1)).add(1))
                ret = softcap(ret, new Decimal(3), new Decimal(0.001))
                ret = softcap(ret, new Decimal(4.5), new Decimal(0.001))
                ret = ret.min(1000)
                if (ret.gte(1000)) ret = ret.add(effAfter1000)
                return ret;
            },
            effectDisplay() { return "x"+format(this.effect()) }, // Add formatting to the effect
        },
        21: {
unlocked() {return player.m.best.gte(155)},
			title: "Transcend Special Points Unlock I",
            description: "Unlock Super-Dilated Transcend Points effect.",
            cost: new Decimal(100000),
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp", // The upgrade is only visible when this is true
        },
        22: {
unlocked() {return player.m.best.gte(155)},

			title: "Transcend Special Points Unlock II",
            description: "Unlock Prestige-Hardcapped Transcend Points effect.<br>Req: Power Scaler -<br> [11 Lvl]",
            cost: new Decimal(3600000),
            canAfford() {return player.pp.buyables[11].gte(11) && player.pp.power.gte(3600000)},
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
            currencyLayer: "pp", // The upgrade is only visible when this is true
        },
        23: {
            unlocked() {return player.m.best.gte(155)},
            
                        title: "Prestige Power Upgrade 11 Boost I",
                        description: "Prestige Power 11 upgrade is better.<br>Req: Power Scaler -<br> [12 Lvl]",
                        cost: new Decimal(50000000),
                        canAfford() {return player.pp.buyables[11].gte(12) && player.pp.power.gte(20000000)},
                        currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
                        currencyInternalName: "power", // Use if using a nonstandard currency
                        currencyLayer: "pp", // The upgrade is only visible when this is true
                    },
        31: {
        unlocked() {return player.m.best.gte(159)},
                        
         title: "Prestige Power Upgrade 13 Boost I",
        description: "Prestige Power 13 upgrade is better.<br>Req: Power Scaler - [17 Lvl]",
        cost: new Decimal(1e10),
         canAfford() {return player.pp.buyables[11].gte(17) && player.pp.power.gte(1e10)},
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
             currencyLayer: "pp", // The upgrade is only visible when this is true
                                },
        32: {
        unlocked() {return player.m.best.gte(159)},
                        
         title: "Prestige Power Exotic Prestige Boost I",
        description: "Exotic Prestige Points boosts Prestige Power gain.<br>Req: Power Scaler - [35 Lvl]",
        cost: new Decimal(1e21),
         canAfford() {return player.pp.buyables[11].gte(35) && player.pp.power.gte(1e21)},
            currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
            currencyInternalName: "power", // Use if using a nonstandard currency
             currencyLayer: "pp", // The upgrade is only visible when this is true
             effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = player.ep.points.add(1).pow(hasUpgrade('pp', 33)?0.8:0.75).mul(1.5).add(1)
                ret=softcap(ret,new Decimal('1e800'),0.1)
                ret=softcap(ret,new Decimal('1e20000'),0.1)
                return softcap(ret,new Decimal('ee10'),0.0000067);
            },
            effectDisplay() { return "x"+format(this.effect()) },
                                },
         33: {
         unlocked() {return player.m.best.gte(159)},
                                                    
        title: "Prestige Power Upgrade 32 Boost I",
        description: "Prestige Power upgrade 32 is better.",
         cost: new Decimal('1e1910'),
        currencyDisplayName: "Hz of Prestige Power", // Use if using a nonstandard currency
        currencyInternalName: "power", // Use if using a nonstandard currency
        currencyLayer: "pp", // The upgrade is only visible when this is true
       },
	},
    buyables: {
		rows: 1,
		cols: 1,
		11:{
			title(){
				return "<h3 class='ps'>Power Scaler</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Strenghens Prestige Power by "+format(data.effect)+" Hz/s (based on milestones)<br>"+
				"Cost for Next Level: "+format(data.cost)+" Prestige power";
			},
			cost(x){
				return Decimal.pow(2,x.pow(1.03))
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
				  let eff=new Decimal(0).add(player[this.layer].buyables[this.id].mul(b).mul(player.m.points.pow(0.15))).mul(2);
                  if (hasUpgrade('ep',14))eff=(player[this.layer].buyables[this.id].mul(player.m.points.pow(0.35))).pow(player[this.layer].buyables[this.id].pow(0.75));
                  if (player.m.best.gte(154)) eff = eff.times(tmp.m.milestone154Effect)
                  if (player.m.best.gte(163)) eff= eff.pow(1.5)
                  if (player.m.best.gte(164)) eff= eff.pow(1.5)
                  eff=softcap(eff,new Decimal('e10000000'),0.1);
                  eff=softcap(eff,new Decimal('e13000000'),0.1)
				  return softcap(eff,new Decimal('e20000000'),0.1);
			  },
			  unlocked(){
				  return player.m.best.gte(123);
			  },
			  style() {
				if (player.pp.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px',
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'100px'
				}
			  },
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
        if (player.em.best.gte(5)) return 100
        if (player.em.best.gte(4)) return 1
        if (player.m.best.gte(157)) return 0.3
        if (player.em.best.gte(3)) return 0.1
		return 0;
	},
		doReset(l){
			if(l=="pp")if(player.m.best.gte(153))layerDataReset("p",["upgrades",[4]]);else layerDataReset("p",[]);
		},
	update(diff){
        let a=player.pp.buyables[11];
        x=new Decimal(a.add(1).log(2));
        if (player.pp.buyables[11].gte(1)) player.pp.power = player.pp.power.add(buyableEffect('pp', 11).times(diff))
        if (player.m.best.gte(162)) player.pp.buyables[11] = player.pp.points.add(1).log(2).pow(1/1.03).add(1).floor()
	}
})