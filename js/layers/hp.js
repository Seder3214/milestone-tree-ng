addLayer("hp", {
    name: "hyper-prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#80C0D0",
    requires: new Decimal("1e13820"), // Can be a function that takes requirement increases into account
    resource: "hyper-prestige points", // Name of prestige currency
    baseResource: "super-prestige points", // Name of resource prestige is based on
    baseAmount() {return player.sp.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("hp",22))mult=mult.mul(upgradeEffect("hp",22));
		if(hasUpgrade("ap",14))mult=mult.mul(upgradeEffect("ap",14));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = layers.hb.effect()
		if(hasUpgrade("t",14))mult=mult.mul(1.005);
		if(hasUpgrade("t",34))mult=mult.mul(1.005);
		if (player.ep.buyables[11].gte(5) && player.hp.points.gte(tmp.ep.fiveEffect.start)) mult = mult.pow(tmp.ep.fiveEffect.eff)
        return mult
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.001,
    hotkeys: [
        {key: "h", description: "H: Reset for hyper-prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(60)},
	branches: ["sp"],
	softcap:new Decimal(Infinity),
	softcapPower:new Decimal(1),
	
	upgrades: {
        rows: 4,
		cols: 4,
		11: {
			title: "Hyper-Prestige Upgrade 11",
            description: "First Milestone's effect is boosted by your hyper-prestige points.",
            cost: new Decimal(1),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1e20;
				if(player.m.best.gte(69))base+=1e30;
				if(player.m.best.gte(79))base+=1e45;
				if(player.m.best.gte(89))base+=1e60;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Hyper-Prestige Upgrade 12",
            description: "First Milestone's effect is boosted by your hyper-prestige points.",
            cost: new Decimal(2),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1e10;
				if(player.m.best.gte(69))base+=3e20;
				if(player.m.best.gte(79))base+=1e35;
				if(player.m.best.gte(89))base+=1e50;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		13: {
			title: "Hyper-Prestige Upgrade 13",
            description: "Prestige Point gain is boosted by your hyper-prestige points.",
            cost: new Decimal(3e38),
            unlocked() { return player.m.best.gte(65)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1e15;
				if(player.m.best.gte(69))base+=1e20;
				if(player.m.best.gte(79))base+=1e30;
				if(player.m.best.gte(89))base+=1e40;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret.mul("1e450");
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		14: {
			title: "Hyper-Prestige Upgrade 14",
            description: "Prestige Point gain is boosted by your hyper-prestige points.",
            cost: new Decimal(1e93),
            unlocked() { return player.m.best.gte(65)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1e12;
				if(player.m.best.gte(69))base+=1e15;
				if(player.m.best.gte(79))base+=1e25;
				if(player.m.best.gte(89))base+=1e30;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		21: {
			title: "Hyper-Prestige Upgrade 21",
            description: "Super-Prestige Point gain is boosted by your hyper-prestige points.",
            cost: new Decimal(1e160),
            unlocked() { return player.m.best.gte(70)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1e18;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret.mul("1e965");
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		22: {
			title: "Hyper-Prestige Upgrade 22",
            description: "Super-Prestige Point and Hyper-Prestige Point gain is boosted by your hyper-prestige points.",
            cost: new Decimal(1e173),
            unlocked() { return player.m.best.gte(70)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=3;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret.mul("1e91");
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		23: {
			title: "Hyper-Prestige Upgrade 23",
            description: "Milestone Cost Scaling is weaker based on your hyper-prestige points.",
            cost: new Decimal("1e496"),
            unlocked() { return player.m.best.gte(70)}, // The upgrade is only visible when this is true
			effect() {
				let p=player.hp.points.add(1e20).log10().log10().div(56.17);
				if(hasUpgrade("hp",24))p=p.mul(2);
				if(hasUpgrade("hp",33))p=p.mul(1.5);
				if(hasUpgrade("hp",34))p=p.mul(1.2);
				return p.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x weaker" }, // Add formatting to the effect
        },
		24: {
			title: "Hyper-Prestige Upgrade 24",
            description: "Hyper-Prestige Upgrade 23 is boosted.",
            cost: new Decimal("1e751"),
            unlocked() { return player.m.best.gte(70)}, // The upgrade is only visible when this is true
        },
		31: {
			title: "Hyper-Prestige Upgrade 31",
            description: "The first Super-Prestige buyable's effect ^1.05",
            cost: new Decimal("1e11540"),
            unlocked() { return player.m.best.gte(85)}, // The upgrade is only visible when this is true
        },
		32: {
			title: "Hyper-Prestige Upgrade 32",
            description: "The first Hyper-Prestige buyable's effect ^1.1",
            cost: new Decimal("1e12800"),
            unlocked() { return player.m.best.gte(85)}, // The upgrade is only visible when this is true
        },
		33: {
			title: "Hyper-Prestige Upgrade 33",
            description: "Hyper-Prestige Upgrade 23 is boosted.",
            cost: new Decimal("1e20000"),
            unlocked() { return player.m.best.gte(85)}, // The upgrade is only visible when this is true
        },
		34: {
			title: "Hyper-Prestige Upgrade 34",
            description: "Hyper-Prestige Upgrade 23 is boosted.",
            cost: new Decimal("1e27000"),
            unlocked() { return player.m.best.gte(85)}, // The upgrade is only visible when this is true
        },
		41: {
			title: "Hyper-Prestige Upgrade 41",
            description: "First Hyper-Prestige buyable is cheaper. You can buy this upgrade while you're in AP challenge 6.",
            cost(){
				if(player.ap.activeChallenge!=32)return new Decimal(Infinity);
				return new Decimal("e176e7");
			},
            unlocked() { return player.m.best.gte(142)}, // The upgrade is only visible when this is true
        },
        42: {
			title: "Hyper-Prestige Upgrade 42",
            description: "Hyper Boost effect is boosted. To buy this upgrade, you need to complete AP challenge 5 20.96 times.",
            cost(){
				if(player.ap.challenges[31]<20.96)return new Decimal(Infinity);
				return new Decimal("e235e8");
			},
            unlocked() { return player.m.best.gte(142)}, // The upgrade is only visible when this is true
        },
		43: {
			title: "Hyper-Prestige Upgrade 43",
            description: "The second Hyper-Prestige buyable's effect base is boosted.",
            cost: new Decimal("e450e11"),
			effect() {
				let p=player.hp.points.log10().log(2);
				if (hasUpgrade('hp',44)) return p.mul(hasUpgrade('hp',44)?tmp.hp.upgrades[44].effect:0)
				else return softcap(p,new Decimal(15),0.25);
            },
			effectDisplay() { return "^"+format(this.effect()) },
            unlocked() { return player.m.best.gte(142)}, // The upgrade is only visible when this is true
        },
		44: {
			title: "Hyper-Prestige Upgrade 44",
            description: "Remove Previous upgrade's effect softcap and the effect is stronger.",
            cost: new Decimal("e149e12"),
			effect() {
				let p=player.hp.points.max(1).log10().max(1).log(10).add(1).log(2).max(1);
				return p;
            },
			effectDisplay() { return "x"+format(this.effect()) },
            unlocked() { return player.m.best.gte(142)}, // The upgrade is only visible when this is true
        },
	},
	
	buyables: {
		rows: 1,
		cols: 2,
		11:{
			title(){
				return "<h3 class='hr'>Prestige Multiplier</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Prestige Point is multiplied by "+format(data.effect)+"<br>"+
				"Cost for Next Level: "+format(data.cost)+" Hyper-Prestige points";
			},
			cost(){
				let a=player[this.layer].buyables[this.id];
				if(a.gte(3)){
					let p=1.5;
					if(hasUpgrade("hp",41))p-=0.1;
					a=a.div(3).pow(p).mul(3);
				}
				return new Decimal("1e8150").mul(Decimal.pow("1e500",a));
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(){
				  if(player.ap.activeChallenge==32 || player.ap.activeChallenge==41 )return new Decimal(1);
				  let eff=new Decimal("1e50000").pow(player[this.layer].buyables[this.id]);
				  if(hasUpgrade("hp",32))eff=eff.pow(1.1);
				  if(hasUpgrade("t",51))eff=eff.pow(2.1);
				  eff=eff.pow(tmp.ap.challenges[32].rewardEffect);
				  return eff;
			  },
			  unlocked(){
				  return player.m.best.gte(85);
			  },
			  style() {
				if (player.hp.points.lt(this.cost())) return {
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
				return "<h3 class='hr'>Super-Multiplier</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Super-Prestige Point is multiplied by "+format(data.effect)+"<br>"+
				"Cost for Next Level: "+format(data.cost)+" Hyper-Prestige points";
			},
			cost(){
				let a=player[this.layer].buyables[this.id];
				if(a.gte(3))a=a.div(3).pow(1.5).mul(3);
				return new Decimal("1e690000").mul(Decimal.pow("1e10000",a));
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(){
				  if(player.ap.activeChallenge==32 || player.ap.activeChallenge==41 )return new Decimal(1);
				  let eff=new Decimal("1e1000000").pow(hasUpgrade("hp",43)?tmp.hp.upgrades[43].effect:1).pow(player[this.layer].buyables[this.id]);
				  if(hasUpgrade("ap",31))eff=eff.pow(1.5);
				  eff=eff.pow(tmp.ap.challenges[32].rewardEffect);
				  return eff;
			  },
			  unlocked(){
				  return player.m.best.gte(104);
			  },
			  style() {
				if (player.hp.points.lt(this.cost())) return {
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
	passiveGeneration(){
		if(player.m.best.gte(135))return 1e10;
		if(player.m.best.gte(75))return 100;
		return 0;
	},
		doReset(l){
			if(l=="hp"){return;}
			if(l=="ap")if(player.m.best.gte(82))layerDataReset("hp",["upgrades"]);else layerDataReset("hp",[]);
			if(l=="t")if(player.m.best.gte(101))layerDataReset("hp",["upgrades"]);else layerDataReset("hp",[]);
			if(l=="hb")if(player.m.best.gte(104))layerDataReset("hp",["upgrades"]);else layerDataReset("hp",[]);
		},
	update(){
		if(player.m.best.gte(95)){
			var target=player.hp.points.add(1).div("1e8150").log("1e500");
			if(target.gte(3)){
				let p=1.5;
				if(hasUpgrade("hp",41))p-=0.1;
				target=target.div(3).pow(1/p).mul(3);
			}
			target=target.add(1).floor();
			if(target.gt(player.hp.buyables[11])){
				player.hp.buyables[11]=target;
			}
		}
		if(player.m.best.gte(107)){
			var target=player.hp.points.add(1).div("1e690000").log("1e10000");
			if(target.gte(3))target=target.div(3).pow(1/1.5).mul(3);
			target=target.add(1).floor();
			if(target.gt(player.hp.buyables[12])){
				player.hp.buyables[12]=target;
			}
		}
	}
})