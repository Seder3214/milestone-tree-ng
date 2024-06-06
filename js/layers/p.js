addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		perkUpgs: [],
		perks: new Decimal(0),
		maxPerks: new Decimal(0),
		totalPerks: new Decimal(0),
		spentPerks: new Decimal(0),
    }},
    color() {
		if (hasMalware("m", 4)) return "#c25757"
		return "#658091"},
    requires(){
		return new Decimal(3000);
	},
    resource() {if (hasMalware("m", 4)) return "<span style='color:red'>infected</span> prestige points"
		return "prestige points"}, // Name of prestige currency
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
		if (hasAchievement('ach',15)) mult = mult.mul(achievementEffect('ach', 15))
		if(hasUpgrade("sp",13))mult=mult.mul(upgradeEffect("sp",13));
		if(hasUpgrade("sp",14))mult=mult.mul(upgradeEffect("sp",14));
		if(hasUpgrade("hp",13))mult=mult.mul(upgradeEffect("hp",13));
		if(hasUpgrade("hp",14))mult=mult.mul(upgradeEffect("hp",14));
		if(hasUpgrade("ap",12))mult=mult.mul(upgradeEffect("ap",12));
		mult=mult.mul(tmp.sp.buyables[11].effect);
		mult=mult.mul(tmp.hp.buyables[11].effect);
		if (hasMalware("m",8)) mult=mult.mul(tmp.m.milestone3Effect.pow(0.1))
        return mult
    },
	perkCost() {
		let eff = new Decimal(`e2e23`)
		let base= player.p.totalPerks.mul(5).max(1).mul(player.p.totalPerks.sub(3).add(1)).mul(player.p.totalPerks.sub(4).mul(10).max(1))
		eff=Decimal.pow(eff,base)
		return eff
	},
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=layers.pb.effect();
		if(hasUpgrade("t",12))m=m.mul(1.005);
		if(hasUpgrade("t",32))m=m.mul(1.005);
		if(player.t.activeChallenge==21||player.t.activeChallenge==31)m=m.mul(tmp.t.dilationEffect);
		m=m.mul(layers.t.getSpecialEffect(21));
		return m;
    },
	effectDescription() {
		if (hasMalware("m",4)) return "You have "+format(player.p.perks.sub(player.p.spentPerks))+" / "+format(player.p.maxPerks)+" Upgrade Perks (Next at "+format(tmp.p.perkCost)+" Prestige Points).<br>" 
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.5,
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.m.best.gte(5) && (player.mp.activeChallenge!=21))||player.pm.activeChallenge==12||player.pm.activeChallenge==13},
	clickables: {
		11: {
            unlocked(){return hasMalware("m",4)},
            title() {return "Respec Perk Upgrades"},
            canClick() {return true},
            onClick() {
				player.points = new Decimal(0)
				tmp.t.doReset
				tmp.mp.doReset
				layerDataReset("se",["upgrades"])
				layerDataReset("pe",["upgrades"])
				layerDataReset("hb",["upgrades"])
				layerDataReset("pb",["upgrades"])
				layerDataReset("sp",["upgrades"])
				layerDataReset("hp",["upgrades"])
				layerDataReset("ap",["upgrades","challenges","buyables"])
				layerDataReset("pp",["upgrades"])
					layerDataReset("t",["challenges","upgrades"])
					layerDataReset("ep",[])
					layerDataReset("p",[])
					player.mp.perkPoints=player.mp.buyables[13]
					player.p.upgrades.push('11','12','13','14','21','22','23','24','31','32','33','34','41','42','43','44')
			},
			style() {
				return {
				"width": "100px",
				"min-height": "60px",
				}
			  },
            },
        },
	upgrades: {
        rows: 5,
        cols: 5,
		11: {
			title: "Prestige Boost I",
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
				if (player.pm.activeChallenge==12||player.pm.activeChallenge==13) ret=ret.add(1).pow(0.85)
                return softcap(ret,new Decimal('e5e16'),0.1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Prestige Boost II",
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
				if (player.pm.activeChallenge==12||player.pm.activeChallenge==13) ret=ret.add(1).pow(0.95)
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		13: {
			title: "Prestige Self-Synergy II",
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
				if(hasUpgrade("p",35))ret=ret.mul(upgradeEffect("p",35));
                return softcap(ret,new Decimal('e1e15'),0.1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		14: {
			title: "Prestige Self-Synergy II",
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
                return softcap(ret,new Decimal('e5e14'),0.1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		15: {
			title: "Prestige Boost II",
            description: "First Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(`e3.85e24`),
			canAfford() {return player.p.spentPerks.lt(player.p.maxPerks)&&player.mp.activeChallenge!=21},
			pay() {
				player.p.spentPerks=player.p.spentPerks.add(1)
				player.p.points=player.p.points.sub(`e3.85e24`)
			},
            unlocked() { return player[this.layer].perkUpgs.includes(Number(this.id))}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=7;
				if (player.ap.activeChallenge==42) return Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).add(1).pow(`1e-10`).pow(0.9).add(1))
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return softcap(ret,new Decimal('e5e16'),0.1);
            },
			perkReq() {return "To get this perk upgrade, get "+format(this.perkCost)+" points in AP Challenge 6."},
			perkCan() {return player.points.gte(`e2.055e20`)&&player.ap.activeChallenge==32},
			perkUnl() {return hasMalware("m", 4) },
			perkCost: new Decimal(`e2.055e20`),
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		21: {
			title: "Exponental Boost I",
            description: "6th Milestone's effect ^1.5",
            cost: new Decimal(1e25),
            unlocked() { return player.m.best.gte(15)}, // The upgrade is only visible when this is true
        },
		22: {
			title: "Exponental Boost II",
            description: "6th Milestone's effect ^1.5",
            cost: new Decimal(1e33),
            unlocked() { return player.m.best.gte(15)}, // The upgrade is only visible when this is true
        },
		23: {
			title: "Prestige Boost III",
            description: "Third Milestone's effect is boosted by your prestige points.",
            cost() { if (inChallenge("pm",13)) return new Decimal(1e57)
                else return new Decimal(1e63)},
            unlocked() { return player.m.best.gte(21)}, // The upgrade is only visible when this is true
        },
		24: {
			title: "Prestige Boost IV",
            description: "Third Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1e80),
            unlocked() { return player.m.best.gte(21)}, // The upgrade is only visible when this is true
        },
		25: {
			title: "Exponential Boost III",
            description: "6th Milestone's effect is better based on your prestige points.",
            cost: new Decimal(`e1.31e24`),
			canAfford() {return player.p.spentPerks.lt(player.p.maxPerks)&&player.mp.activeChallenge!=21},
			pay() {
				player.p.spentPerks=player.p.spentPerks.add(1)
				player.p.points=player.p.points.sub(`e1.31e24`)
			},
			effect(){
				let p=player.p.points.add(1).log10().add(1).log10().add(1).pow(0.25)
				return p.add(1);
			},
            effectDisplay() { return "^"+format(this.effect(),4) }, // Add formatting to the effect
            unlocked() { return player[this.layer].perkUpgs.includes(Number(this.id))}, // The upgrade is only visible when this is true
			perkReq() {return "To get this perk upgrade, get "+format(this.perkCost)+" points in AP Challenge 3."},
			perkCan() {return player.points.gte(`e4.8e21`)&&player.ap.activeChallenge==21},
			perkUnl() {return hasMalware("m", 4) },
			perkCost: new Decimal(`e4.8e21`),
        },
		31: {
			title: "Prestige Scaling Reducer I",
            description: "Milestone Cost Scaling is weaker based on your prestige points.",
            cost: new Decimal("1e6810"),
			effect(){
				let p=player.p.points.add(1e20).log10().log10().div(77);
				if(hasUpgrade("p",32))p=p.mul(2);
				if(hasUpgrade("p",33))p=p.mul(1.5);
				if(hasUpgrade("p",34))p=p.mul(1.2);
				if(hasUpgrade("t",21))p=p.mul(1.1);
				if(hasAchievement('ach',22)) p=p.add(achievementEffect('ach',22))
				return p.add(1);
			},
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
            effectDisplay() { return format(this.effect(),4)+"x weaker" }, // Add formatting to the effect
        },
		32: {
			title: "Prestige Scaling Reducer II",
            description: "Prestige Upgrade 31 is boosted.",
            cost: new Decimal("1e8740"),
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
        },
		33: {
			title: "Prestige Scaling Reducer III",
            description: "Prestige Upgrade 31 is boosted.",
            cost: new Decimal("1e10927"),
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
        },
		34: {
			title: "Prestige Scaling Reducer IV",
            description: "Prestige Upgrade 31 is boosted.",
            cost: new Decimal("1e16335"),
            unlocked() { return player.m.best.gte(45)}, // The upgrade is only visible when this is true
        },
		35: {
			title: "Prestige Upgrade 13 Boost I",
            description: "Prestige Upgrade 13 is boosted by prestige-points.",
            cost: new Decimal(`e3.84e23`),
            unlocked() { return player[this.layer].perkUpgs.includes(Number(this.id))}, // The upgrade is only visible when this is true
			perkReq() {return "To get this perk upgrade, get "+format(this.perkCost)+" Exotic Prestige."},
			canAfford() {return player.p.spentPerks.lt(player.p.maxPerks)&&player.mp.activeChallenge!=21},
			pay() {
				player.p.spentPerks=player.p.spentPerks.add(1)
				player.p.points=player.p.points.sub(`e3.84e23`)
			},
			effect(){
				let p=player.p.points.pow(0.015).pow(0.5);
				return p.add(1);
			},
			effectDisplay() { return format(this.effect(),4)+"x" },
			perkCan() {return player.ep.points.gte(`e3.5e8`)},
			perkUnl() {return hasMalware("m", 4) },
			perkCost: new Decimal(`e3.5e8`), // Add formatting to the effect
        },
		41: {
			title: "Prestige Boost V",
            description: "Same as Prestige Upgrade 23. To buy this upgrade, You need to complete AP challenge 4 19.7 times.",
            cost(){
				if(player.ap.challenges[22]<19.7)return new Decimal(Infinity);
				return new Decimal("e185e9");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
        },
		42: {
			title: "Prestige Boost VI",
            description: "Same as Prestige Upgrade 23. To buy this upgrade, You need to complete AP challenge 3 14.1 times.",
            cost(){
				if(player.ap.challenges[21]<14.1)return new Decimal(Infinity);
				return new Decimal("e210e9");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
        },
		43: {
			title: "Prestige Buyable Boost I",
            description: "First Prestige buyable is boosted. You can buy this upgrade while you're in T challenge 2.",
            cost(){
				if(player.t.activeChallenge!=12)return new Decimal(Infinity);
				return new Decimal("e188e6");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
        },
		44: {
			title: "Prestige Buyable Boost II",
            description: "First Prestige buyable is boosted. You can buy this upgrade while you're in T challenge 4.",
            cost(){
				if(player.t.activeChallenge!=22)return new Decimal(Infinity);
				return new Decimal("e501000");
			},
            unlocked() { return player.m.best.gte(124)}, // The upgrade is only visible when this is true
			currencyDisplayName(){ return "points"},
			currencyInternalName(){ return "points"},
        },
		45: {
			title: "Prestige Upgrade 5th Fusioner Boost I",
            description: "5th Exotic Fusioner effect is better based on prestige points.",
            cost: new Decimal(`e5.125e23`),
            unlocked() { return player[this.layer].perkUpgs.includes(Number(this.id))}, // The upgrade is only visible when this is true
			perkReq() {return "To get this perk upgrade, get "+format(this.perkCost)+" points in Multiverse Challenge 3."},
			canAfford() {return player.p.spentPerks.lt(player.p.maxPerks)&&player.mp.activeChallenge!=21},
			pay() {
				player.p.spentPerks=player.p.spentPerks.add(1)
				player.p.points=player.p.points.sub(`e5.125e23`)
			},
			effect(){
				let p=player.p.points.pow(0.015).add(1).log10().add(1).log10().pow(0.15).div(10);
				return p.add(1);
			},
			effectDisplay() { return format(this.effect(),4)+"x" },
			perkCan() {return player.points.gte(`e1.69e17`)&&player.mp.activeChallenge==13},
			perkUnl() {return hasMalware("m", 4) },
			perkCost: new Decimal(`e1.69e17`), // Add formatting to the effect
        },
	},
	buyables: {
		rows: 1,
		cols: 3,
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
				let a=player[this.layer].buyables[this.id].div(hasUpgrade('ep',13)?upgradeEffect('ep',13):1);
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
				  let b=new Decimal(5);
				  if (hasMalware("m",0)) b=b.pow(milestoneEffect("m",0))
				  let eff=new Decimal(1).add(player[this.layer].buyables[this.id].mul(b).pow(1.05));
				  if (player.m.best.gte(179))eff=eff.mul(tmp.m.milestone179Effect)
				  return eff;
			  },
			  unlocked(){
				  return player.em.best.gte(7);
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
	branches() { if (hasMalware("m",4))return [["m","#c86a6a"]]
		else return ["m"]},
	passiveGeneration(){
		if(player.m.best.gte(135))return 1e10;
		if(player.m.best.gte(20))return 100;
		if(player.pm.activeChallenge==12||player.pm.activeChallenge==13)return 1;
		return 0;
	},
	resetsNothing() {
		return player.pm.activeChallenge==12||player.pm.activeChallenge==13
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
			if (hasMalware("m",4)) {
				layerDataReset("p")
				player.p.upgrades.push('11','12','13','14','21','22','23','24','31','32','33','34','41','42','43','44')
			}
			if(l=="p"){return;}
			if(l=="sp")if(player.m.best.gte(26))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="pb")if(player.m.best.gte(60))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="hp")if(player.m.best.gte(65))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="ap")if(player.m.best.gte(81))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="t")if(player.m.best.gte(100))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
			if(l=="hb")if(player.m.best.gte(104))layerDataReset("p",["upgrades"]);else layerDataReset("p",[]);
		},
		tabFormat: {
			"Main":{
				content:[
					"main-display","prestige-button","resource-display",
					"buyables",
					"upgrades",
					"clickables",
				]
			},
		},
	update(){
		if(player.m.best.gte(124)){
			var target=player.p.points.add(1).div(1).log("ee10").max(0.1).log(2);
			target=target.add(1).floor();
			if(target.gt(player.p.buyables[11])){
				player.p.buyables[11]=target;
			}
		}
		if (player.m.best.gte(124) && player.p.points.gte(layers.p.buyables[12].cost())) player.p.buyables[12] = player.p.points.add(1).div(1).log("e4.7e15").max(0.1).log(2).mul(hasUpgrade('ep',13)?upgradeEffect('ep',13):1).add(1).floor();
		if (hasMalware("m",4)) {
			player.p.maxPerks=player.p.maxPerks.max(player.p.perks)
			if (player.p.points.gte(tmp.p.perkCost)) {
				player.p.perks=player.p.perks.add(1)
				player.p.totalPerks=player.p.totalPerks.add(1)
			}
		}
	}
})