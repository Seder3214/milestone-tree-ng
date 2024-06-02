addLayer("ep", {
    name: "exotic prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color() {return "#648c11"},
    requires(){
		return new Decimal(1e15);
	},
    resource() {return "exotic prestige points"},
    baseResource() {return "prestige power"}, // Name of resource prestige is based on
    baseAmount() {return player.pp.points}, // Get the current amount of baseResource
    type() {return 'normal'}, // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (player.p.buyables[12].gte(1)&& player.mp.activeChallenge!=21) mult = mult.mul(buyableEffect('p', 12))
		if (player.mp.buyables[11].gte(1) && player.mp.activeChallenge!=21) mult = mult.mul(buyableEffect('mp',11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=new Decimal(1);
		return m;
    },
	exponent: function(){
		return new Decimal(1)
	},
    oneEffect() {
        let eff = new Decimal(player.ep.points.add(1).pow(player.m.best.gte(165)?4:3.25)).max(1)
		if (player.m.best.gte(167)) eff = eff.pow(1.1)
		if (player.m.best.gte(168)) eff = eff.pow(1.1)
		if (player.mp.activeChallenge==13) return new Decimal(1)
		eff=softcap(eff,new Decimal('1e1000000'),0.075)
		eff=softcap(eff,new Decimal('1e2500000'),0.075)
        return softcap(eff,new Decimal('1e5000000'),0.015);
    },
    twoEffect() {
        let eff = player.ep.points.add(1).pow(player.m.best.gte(166)?2.5:2.2).mul(4).max(1)
		eff=softcap(eff,new Decimal('1e100'),0.075)
		soft = player.mp.buyables[12].gte(1)?new Decimal('1e25000').mul(new Decimal('1e25000').mul(player.mp.buyables[12]).max(1)):new Decimal('1e25000')
		if (player.mp.activeChallenge==13) return new Decimal(1)
		eff = softcap(eff,soft,0.075)
		eff=softcap(eff,new Decimal('1e100000'),0.22)
        return softcap(eff,new Decimal('1e200000'),0.02);
    },
	threeEffect() {
        let eff = player.ep.points.add(1).log10().max(1).pow(0.01).div(500)
		if (player.m.best.gte(171)) eff = eff.mul(1.075)
		if (player.m.best.gte(172)) eff = eff.mul(1.1)
		if (player.mp.buyables[12].gte(2)) eff = eff.mul(4)
		if (player.mp.activeChallenge==13) return new Decimal(0)
        return eff.toNumber();
    },
	fourEffect() {
        let eff = player.ep.points.add(1).pow(0.35).max(1)
		if (player.m.best.gte(173)) eff = eff.pow(1.05)
		if (player.mp.activeChallenge==13) return new Decimal(1)
		if (player.mp.activeChallenge==11) {eff = eff.pow(0.15)
			eff=softcap(eff,new Decimal('1e40000'),0.275)}		
			eff=softcap(eff,new Decimal('1e100000'),0.075)
        return softcap(eff,new Decimal('1e600000'),0.005);
    },
	fiveEffect() {
        let eff = player.ep.points.add(1).log10().add(1).log(10).pow(0.5).max(1)
		if (player.mp.buyables[12].gte(3)) eff = eff.mul(2)
		let start = new Decimal('e5.6e12').mul(player.ep.points.add(1).log10().add(1).log(10).pow(0.5))
		if (player.m.best.gte(174)) start = start.pow(0.1)
		if (player.mp.activeChallenge==13) eff = new Decimal(1)
		start=start.add(tmp.ap.challenges[42].effect)
        return {eff: softcap(eff,new Decimal(2.75),0.5), start: start};
    },
	sixEffect() {
		let eff=player.ep.points.add(1).log(1.1).pow(2.15)
		if (player.mp.challenges[11]>0) eff=eff.mul(tmp.mp.challenges[11].rewardEffect)
			if (player.mp.buyables[12].gte(3)) eff = eff.pow(2.5)
		if (player.mp.activeChallenge==13) return new Decimal(1)
		return eff.max(1)
	},
	sevenEffect() {
        let eff = player.ep.points.add(1).log10().max(1).pow(0.1).mul(0.382).div(20)
		if (player.mp.challenges[12]>0) eff=eff.add(tmp.mp.challenges[12].rewardEffect)
		if (player.mp.activeChallenge==13) return new Decimal(0)
        return eff;
    },
	eightEffect() {
        let eff = player.ep.points.add(1).log10().max(1).pow(0.1).div(10)
		if (player.mp.activeChallenge==13) return new Decimal(0)
    return softcap(eff,new Decimal(0.5),0.1);
    },
    row: 3,
	newRow: 1, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.5,
    hotkeys: [
        {key: "x", description: "X: Reset for exotic prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.m.best.gte(160)&& (player.mp.activeChallenge!=21))||player.pm.activeChallenge==12||player.pm.activeChallenge==13},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Exotic Prestige Upgrade 11",
            description: "4th Milestone's effect is boosted by your exotic prestige points.<br>Req: Fusion Tier 2",
            cost: new Decimal(25),
            unlocked() { return player.mp.activeChallenge!=21}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.2;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.275).add(1)).max(1)
                return softcap(ret,new Decimal(1e9),0.1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Exotic Prestige Upgrade 12",
            description: "179th milestone effect is better based on Exotic Booster level",
            cost: new Decimal('e890360'),
            unlocked() { return player.mp.buyables[21].gte(1)&& player.mp.activeChallenge!=21}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.82;
                let ret = player.p.buyables[12].mul(100).pow(base)
                return ret;
            },
            effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
        },
		13: {
			title: "Exotic Prestige Upgrade 13",
            description: "Apply weaker Challenge Slayer effect to Exotic Booster cost base.",
            cost: new Decimal('e1560000'),
            unlocked() { return player.mp.buyables[21].gte(1)&& player.mp.activeChallenge!=21},
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = buyableEffect('ap',11).max(1).div(150).add(0.4)
                return ret;
            },
            effectDisplay() { return "/"+format(this.effect()) },
        },
		14: {
			title: "Exotic Prestige Upgrade 14",
            description: "Change the formula for Power Scaler.",
            cost: new Decimal('e4650000'),
            unlocked() { return player.mp.buyables[21].gte(2)&& player.mp.activeChallenge!=21},
        },
		21: {
			title: "Exotic Prestige Upgrade 21",
            description: "Reduce goal scaling of <b>Dilation</b> challenges by sum of this challenge completions and Exotic Prestige Points",
            cost: new Decimal('e7490000'),
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = (player.t.challenges[11]*2)+(player.t.challenges[21]*10)+(player.t.challenges[31]*10)+(player.ep.points.add(1).log(10).add(1).pow(0.5).toNumber())
                return ret;
            },
			effectDisplay() { return "-"+format(this.effect()) },
            unlocked() { return player.mp.buyables[21].gte(2)&& player.mp.activeChallenge!=21},
        },
	},
	buyables: {
		rows: 2,
		cols: 2,
		11:{
			title(){
				return "<h3 class='ef'>Exotic Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "<h4 class='ef'>Tier: "+format(player[this.layer].buyables[this.id],0)+"<br></h4>"+
				"Unlocking "+format(data.effect,0)+" more effects<br>"+
				"Cost for Next Tier: "+format(data.cost,0)+" Exotic Prestige points";
			},
			cost(){
				return [new Decimal("2"),new Decimal("8"),new Decimal("512"),new Decimal("1e55"),new Decimal("1e170"), new Decimal('1e2000'),new Decimal('1e150000'),new Decimal('1e3330000'),Decimal.dInf][player.ep.buyables[11]]
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                player.ep.points = player.ep.points.sub(this.cost())
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(){
				  let b=1;
                  let eff=new Decimal(0).add(player[this.layer].buyables[this.id].mul(b));
				  return eff;
			  },
			  unlocked(){
				  return true;
			  },
			  style() {
				if (player.ep.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
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
				["display-text",function(){table = ''
                if (player.ep.buyables[11].gte(1)) table += '1st effect: AP challenge 41 effect is ' + format(tmp.ep.oneEffect) + "x better"
                if (player.ep.buyables[11].gte(2)) table += '<br>2nd effect: Transcend Points gain is ' + format(tmp.ep.twoEffect) + "x better (only outside of T challenges)"
				if (player.ep.buyables[11].gte(3)) table += '<br>3rd effect: Hyper Boost effect base +' + format(tmp.ep.threeEffect,4)
				if (player.ep.buyables[11].gte(4)) table += '<br>4th effect: Transcend Points hardcap starts ' + format(tmp.ep.fourEffect,4) + "x later"
				if (player.ep.buyables[11].gte(5)) table += '<br>5th effect: Add an Hyper-Prestige Points inflation (^' + format(tmp.ep.fiveEffect.eff,4) + " to gain), that starts at "+ format(tmp.ep.fiveEffect.start,4) + " Hyper-Prestige Points"
				if (player.ep.buyables[11].gte(6)) table += '<br>6th effect: Transcend Points gain in Transcend Challenges is x' + format(tmp.ep.sixEffect,4) + " better."
				if (player.ep.buyables[11].gte(7)) table += "<br>7th effect: Softcap of Prestige Boost's effect starts +" + format(tmp.ep.sevenEffect,4) + " later."
				if (player.ep.buyables[11].gte(8)) table += "<br>8th effect: Add +" + format(tmp.ep.eightEffect,4) + " to prestige energy gain exponent."
				return table}],
				"buyables",
                "upgrades"
			]
		},
    },
	branches: ["pp"],
	passiveGeneration(){
		if (player.em.best.gte(6)) return 0.1
		return 0;
	},
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(l=="ep")if(player.m.best.gte(162))layerDataReset("pp",["upgrades", 'buyables']);else layerDataReset("pp",[])
		},
	update(){
	}
})