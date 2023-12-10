addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#658091",
    requires(){
		return new Decimal(3000);
	},
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(player.ap.activeChallenge==31 || player.ap.activeChallenge==41 )return new Decimal(0);
		if(player.m.best.gte(6))mult=mult.mul(tmp.m.milestone6Effect);
		if(hasUpgrade("p",13))mult=mult.mul(upgradeEffect("p",13));
		if(hasUpgrade("p",14))mult=mult.mul(upgradeEffect("p",14));
		if(player.m.best.gte(22))mult=mult.mul(22);
		if(hasUpgrade("sp",13))mult=mult.mul(upgradeEffect("sp",13));
		if(hasUpgrade("sp",14))mult=mult.mul(upgradeEffect("sp",14));
		if(hasUpgrade("hp",13))mult=mult.mul(upgradeEffect("hp",13));
		if(hasUpgrade("hp",14))mult=mult.mul(upgradeEffect("hp",14));
		if(hasUpgrade("ap",12))mult=mult.mul(upgradeEffect("ap",12));
		mult=mult.mul(tmp.sp.buyables[11].effect);
		mult=mult.mul(tmp.hp.buyables[11].effect);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=layers.pb.effect();
		if(hasUpgrade("t",12))m=m.mul(1.005);
		if(hasUpgrade("t",32))m=m.mul(1.005);
		if(player.t.activeChallenge==21||player.t.activeChallenge==31)m=m.mul(tmp.t.dilationEffect);
		m=m.mul(layers.t.getSpecialEffect(21));
		return m;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.5,
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(5)},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Prestige Upgrade 11",
            description: "First Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=3;
				if(player.m.best.gte(11))base+=0.5;
				if(player.m.best.gte(31))base+=0.5;
				if(player.m.best.gte(44))base+=0.2;
				if(player.m.best.gte(54))base+=0.3;
				if(player.m.best.gte(64))base+=0.1;
				if(player.m.best.gte(74))base+=0.244;
				if(player.m.best.gte(84))base+=0.156;
				if(player.m.best.gte(94))base+=0.1;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Prestige Upgrade 12",
            description: "First Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(4),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=2;
				if(player.m.best.gte(12))base+=0.4;
				if(player.m.best.gte(32))base+=0.2;
				if(player.m.best.gte(44))base+=0.2;
				if(player.m.best.gte(54))base+=0.2;
				if(player.m.best.gte(64))base+=0.1;
				if(player.m.best.gte(74))base+=0.1;
				if(player.m.best.gte(84))base+=0.1;
				if(player.m.best.gte(94))base+=0.1;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                if (hasUpgrade('pp',12)) ret = ret.pow(upgradeEffect('pp', 12))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		13: {
			title: "Prestige Upgrade 13",
            description: "Prestige Point gain is boosted by your prestige points.",
            cost: new Decimal(100000000),
            unlocked() { return player.m.best.gte(10)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.4;
				if(player.m.best.gte(13))base+=0.1;
				if(player.m.best.gte(33))base+=0.05;
				if(player.m.best.gte(44))base+=0.05;
				if(player.m.best.gte(54))base+=0.1;
				if(player.m.best.gte(64))base+=0.05;
				if(player.m.best.gte(74))base+=0.1;
				if(player.m.best.gte(84))base+=0.05;
				if(player.m.best.gte(94))base+=0.05;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		14: {
			title: "Prestige Upgrade 14",
            description: "Prestige Point gain is boosted by your prestige points.",
            cost: new Decimal(1e11),
            unlocked() { return player.m.best.gte(10)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.2;
				if(player.m.best.gte(14))base+=0.05;
				if(player.m.best.gte(34))base+=0.1;
				if(player.m.best.gte(44))base+=0.05;
				if(player.m.best.gte(54))base+=0.1;
				if(player.m.best.gte(64))base+=0.05;
				if(player.m.best.gte(74))base+=0.1;
				if(player.m.best.gte(84))base+=0.05;
				if(player.m.best.gte(94))base+=0.05;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		21: {
			title: "Prestige Upgrade 21",
            description: "6th Milestone's effect ^1.5",
            cost: new Decimal(1e25),
            unlocked() { return player.m.best.gte(15)}, // The upgrade is only visible when this is true
        },
		22: {
			title: "Prestige Upgrade 22",
            description: "6th Milestone's effect ^1.5",
            cost: new Decimal(1e33),
            unlocked() { return player.m.best.gte(15)}, // The upgrade is only visible when this is true
        },
		23: {
			title: "Prestige Upgrade 23",
            description: "Third Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1e63),
            unlocked() { return player.m.best.gte(21)}, // The upgrade is only visible when this is true
        },
		24: {
			title: "Prestige Upgrade 24",
            description: "Third Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1e80),
            unlocked() { return player.m.best.gte(21)}, // The upgrade is only visible when this is true
        },
		31: {
			title: "Prestige Upgrade 31",
            description: "Milestone Cost Scaling is weaker based on your prestige points.",
            cost: new Decimal("1e6810"),
			effect(){
				let p=player.p.points.add(1e20).log10().log10().div(77);
				if(hasUpgrade("p",32))p=p.mul(2);
				if(hasUpgrade("p",33))p=p.mul(1.5);
				if(hasUpgrade("p",34))p=p.mul(1.2);
				if(hasUpgrade("t",21))p=p.mul(1.1);
				return p.add(1);
			},
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
            effectDisplay() { return format(this.effect(),4)+"x weaker" }, // Add formatting to the effect
        },
		32: {
			title: "Prestige Upgrade 32",
            description: "Prestige Upgrade 31 is boosted.",
            cost: new Decimal("1e8740"),
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
        },
		33: {
			title: "Prestige Upgrade 33",
            description: "Prestige Upgrade 31 is boosted.",
            cost: new Decimal("1e10927"),
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
        },
		34: {
			title: "Prestige Upgrade 34",
            description: "Prestige Upgrade 31 is boosted.",
            cost: new Decimal("1e16335"),
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
        },
		41: {
			title: "Prestige Upgrade 41",
            description: "Same as Prestige Upgrade 23. To buy this upgrade, You need to complete AP challenge 4 19.7 times.",
            cost(){
				if(player.ap.challenges[22]<19.7)return new Decimal(Infinity);
				return new Decimal("e185e9");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
        },
		42: {
			title: "Prestige Upgrade 42",
            description: "Same as Prestige Upgrade 23. To buy this upgrade, You need to complete AP challenge 3 14.1 times.",
            cost(){
				if(player.ap.challenges[21]<14.1)return new Decimal(Infinity);
				return new Decimal("e210e9");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
        },
		43: {
			title: "Prestige Upgrade 43",
            description: "First Prestige buyable is boosted. You can buy this upgrade while you're in T challenge 2.",
            cost(){
				if(player.t.activeChallenge!=12)return new Decimal(Infinity);
				return new Decimal("e188e6");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
        },
		44: {
			title: "Prestige Upgrade 44",
            description: "First Prestige buyable is boosted. You can buy this upgrade while you're in T challenge 4.",
            cost(){
				if(player.t.activeChallenge!=22)return new Decimal(Infinity);
				return new Decimal("e501000");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
			currencyDisplayName(){ return "points"},
			currencyInternalName(){ return "points"},
        },
	},
	buyables: {
		rows: 1,
		cols: 2,
		11:{
			title(){
				return "<h3 class='pr'>Softcap Delayer</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"1st Milestone's softcap starts "+format(data.effect)+"x later<br>"+
				"Cost for Next Level: "+format(data.cost)+" Prestige points";
			},
			cost(){
				let a=player[this.layer].buyables[this.id];
                let cost = new Decimal(1)
				a=Decimal.pow(2,a);
				return cost.mul(Decimal.pow("ee10",a));
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(){
				  if(player.ap.activeChallenge==32 || player.ap.activeChallenge==41 )return new Decimal(1);
				  let b=0.03;
				  if(hasUpgrade("p",43))b+=0.011;
				  if(hasUpgrade("p",44))b+=0.011;
                  if (hasUpgrade('se', 13))b+=upgradeEffect('se', 13)
				  let eff=new Decimal(1).add(player[this.layer].buyables[this.id].mul(b));
				  eff=eff.pow(tmp.ap.challenges[32].rewardEffect);
                  if (hasUpgrade('pp', 13))eff=eff.mul(upgradeEffect('pp', 13))
				  return softcap(eff, new Decimal(17), 0.25);
			  },
			  unlocked(){
				  return player.m.best.gte(123);
			  },
			  style() {
				if (player.p.points.lt(this.cost())) return {
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
		12:{
			title(){
				return "<h3 class='ef'>Exotic</h3> <h3 class='pr'>Booster</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Exotic Prestige Points gain "+format(data.effect)+"x better<br>"+
				"Cost for Next Level: "+format(data.cost)+" Prestige points";
			},
			cost(){
				let a=player[this.layer].buyables[this.id];
                let cost = new Decimal(1)
				a=Decimal.pow(2,a);
				return cost.mul(Decimal.pow("e4.7e15",a));
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(){
				  let b=5;
				  let eff=new Decimal(1).add(player[this.layer].buyables[this.id].mul(b).pow(1.05));
				  return eff;
			  },
			  unlocked(){
				  return player.em.points.gte(7);
			  },
			  style() {
				if (player.p.points.lt(this.cost())) return {
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
	branches: ["m"],
	passiveGeneration(){
		if(player.m.best.gte(135))return 1e10;
		if(player.m.best.gte(20))return 100;
		return 0;
	},
	softcap(){
		if(player.t.activeChallenge==32)return getPointSoftcapStart();
		return new Decimal(Infinity);
	},
	softcapPower(){
		if(player.t.activeChallenge==32)return new Decimal(0);
		return new Decimal(1);
	},
		doReset(l){
			if(l=="p"){return;}
			if(l=="sp")if(player.m.best.gte(26))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="pb")if(player.m.best.gte(60))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="hp")if(player.m.best.gte(65))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="ap")if(player.m.best.gte(81))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="t")if(player.m.best.gte(100))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="hb")if(player.m.best.gte(104))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
		},
	update(){
		if(player.m.best.gte(124)){
			var target=player.p.points.add(1).div(1).log("ee10").max(0.1).log(2);
			target=target.add(1).floor();
			if(target.gt(player.p.buyables[11])){
				player.p.buyables[11]=target;
			}
		}
		if (player.m.best.gte(124) && player.p.points.gte(layers.p.buyables[12].cost())) layers.p.buyables[12].buy()
	}
})