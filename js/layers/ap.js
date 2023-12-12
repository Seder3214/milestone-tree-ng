addLayer("ap", {
    name: "atomic-prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#A0E0E0",
    requires: new Decimal("1e1997"), // Can be a function that takes requirement increases into account
    resource: "atomic-prestige points", // Name of prestige currency
    baseResource: "hyper-prestige points", // Name of resource prestige is based on
    baseAmount() {return player.hp.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("ap",21))mult=mult.mul(upgradeEffect("ap",21));
		if(hasUpgrade("t",62))mult=mult.mul(upgradeEffect("t",62));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        m = new Decimal(1)
		if(hasUpgrade("t",22))m=m.mul(1.01);
		return m;
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.005,
    hotkeys: [
        {key: "a", description: "A: Reset for atomic-prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(80)},
	branches: ["hp"],
	softcap:new Decimal(Infinity),
	softcapPower:new Decimal(1),
	
	upgrades: {
        rows: 3,
		cols: 4,
		11: {
			title: "Atomic-Prestige Upgrade 11",
            description: "First Milestone's effect is boosted by your atomic-prestige points.",
            cost: new Decimal(1),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=new Decimal("1e2000");
				if(player.m.best.gte(84))base=base.mul("1e4000");
				if(player.m.best.gte(94))base=base.mul("1e4000");
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret.mul("1e48000").mul(Decimal.pow("1e500",player[this.layer].points.min(140)));
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Atomic-Prestige Upgrade 12",
            description: "Prestige Point gain is boosted by your atomic-prestige points.",
            cost: new Decimal(4),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=new Decimal("1e1000");
				if(player.m.best.gte(84))base=base.mul("1e2000");
				if(player.m.best.gte(94))base=base.mul("1e2000");
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret.mul("1e39000").mul(Decimal.pow("1e150",player[this.layer].points.min(500)));
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		13: {
			title: "Atomic-Prestige Upgrade 13",
            description: "Super-Prestige Point gain is boosted by your atomic-prestige points.",
            cost: new Decimal(5000),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=new Decimal("1e5000");
				if(player.m.best.gte(84))base=base.mul("1e1000");
				if(player.m.best.gte(94))base=base.mul("1e1000");
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret.mul("1e20000").mul(Decimal.pow("1e30",player[this.layer].points.sqrt().min(2300)));
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		14: {
			title: "Atomic-Prestige Upgrade 14",
            description: "Hyper-Prestige Point gain is boosted by your atomic-prestige points.",
            cost: new Decimal(50000),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=new Decimal("1e15");
				if(player.m.best.gte(84))base=base.mul("1e10");
				if(player.m.best.gte(94))base=base.mul("1e10");
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		21: {
			title: "Atomic-Prestige Upgrade 21",
            description: "Atomic-Prestige Point gain is boosted by your atomic-prestige points.",
            cost: new Decimal(200000),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.4;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		22: {
			title: "Atomic-Prestige Upgrade 22",
            description: "Each upgrade in this row unlocks an Atomic-Prestige challenge.",
            cost: new Decimal(2e9),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		23: {
			title: "Atomic-Prestige Upgrade 23",
            description: "Milestone Cost Scaling is weaker based on your atomic-prestige points.",
            cost: new Decimal(3e18),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() {
				let p=player.ap.points.add(1e20).log10().log10().div(200);
				if(hasUpgrade("ap",24))p=p.mul(4);
				if(hasUpgrade("ap",33))p=p.mul(2);
				if(hasUpgrade("ap",34))p=p.mul(1.2);
				return p.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x weaker" }, // Add formatting to the effect
        },
		24: {
			title: "Atomic-Prestige Upgrade 24",
            description: "Atomic-Prestige Upgrade 23 is boosted.",
            cost: new Decimal(2e35),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		31: {
			title: "Atomic-Prestige Upgrade 31",
            description: "The Second Hyper-Prestige buyable's effect ^1.5.",
            cost: new Decimal("1e5470"),
            unlocked() { return hasUpgrade("t",44);}, // The upgrade is only visible when this is true
        },
		32: {
			title: "Atomic-Prestige Upgrade 32",
            description: "1st Milestone's softcap starts later based on your atomic-prestige points.",
            cost: new Decimal("1e5613"),
            unlocked() { return hasUpgrade("t",44);}, // The upgrade is only visible when this is true
			effect() {
				let p=player.ap.points.add(1e20).log10().log10().div(57);
				if(hasUpgrade("ap",33))p=p.mul(2);
				if(hasUpgrade("ap",34))p=p.mul(1.2);
				return p.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x later" },
        },
		33: {
			title: "Atomic-Prestige Upgrade 33",
            description: "Atomic-Prestige Upgrade 23 and 32 are boosted.",
            cost: new Decimal("3e6045"),
            unlocked() { return hasUpgrade("t",44);}, // The upgrade is only visible when this is true
        },
		34: {
			title: "Atomic-Prestige Upgrade 34",
            description: "Atomic-Prestige Upgrade 23 and 32 are boosted.",
            cost: new Decimal("3e6951"),
            unlocked() { return hasUpgrade("t",44);}, // The upgrade is only visible when this is true
        },
	},
	
	challenges: {
        rows: 4,
		cols: 2,
		11:{
                name: "No Prestige Boost",
                completionLimit: Infinity,
			    challengeDescription() {return "You can't gain prestige boosts.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
                unlocked() { return hasUpgrade("ap",22) && hasUpgrade("ap",21) },
                goal: function(){
					if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.ap.challenges[11]+0.001));
					if(player.ap.challenges[11]>=5)return new Decimal("1e46730000").pow(Decimal.pow(1.3,Decimal.pow(player.ap.challenges[11]-5,1.5)));
					return [new Decimal("1e1960000"),new Decimal("1e3550000"),new Decimal("1e4950000"),new Decimal("1e8150000"),new Decimal("e21640000")][player.ap.challenges[11]]
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { return "Prestige Boost's effect is better." },
		completionsAfter120(){
			let p=player.points;
			if(player.m.best.gte(130)){
				if(p.lte("1e1000000"))return 0;
				return p.log10().div(1000000/ buyableEffect('ap', 11)).log(1.3).pow(1/1.3).toNumber();
			}
			if(p.lte("1e1400000"))return 0;
			return p.log10().div(1400000/ buyableEffect('ap', 11)).log(1.32).pow(1/1.3).toNumber();
		},
		goalAfter120(x=player.ap.challenges[11]){
			if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.3,Decimal.pow(x,1.3)).mul(1000000/ buyableEffect('ap', 11)));
			return Decimal.pow(10,Decimal.pow(1.32,Decimal.pow(x,1.3)).mul(1400000/ buyableEffect('ap', 11)));
		},
		canComplete(){
			return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
		},
		
		},
		12:{
                name: "No Super-Prestige",
                completionLimit: Infinity,
			    challengeDescription() {return "You can't gain super-prestige points.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
                unlocked() { return hasUpgrade("ap",22) && hasUpgrade("ap",22) },
                goal: function(){
					if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.ap.challenges[12]+0.001));
					if(player.ap.challenges[12]>=5)return new Decimal("1e60560000").pow(Decimal.pow(1.3,Decimal.pow(player.ap.challenges[12]-5,1.5)));
					return [new Decimal("1e2300000"),new Decimal("1e4870000"),new Decimal("1e7000000"),new Decimal("e12500000"),new Decimal("e28880000")][player.ap.challenges[12]]
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
				rewardEffect() {
                    let ret = 1+player.ap.challenges[12]*0.05;
					if(player.ap.challenges[12]>=5){
						ret=1.2+player.ap.challenges[12]*0.01;
						if(player.m.best.gte(122))ret=1.175+player.ap.challenges[12]*0.015;
						if(player.m.best.gte(138))ret=1.15+player.ap.challenges[12]*0.02;
						if(player.m.best.gte(144))ret=1.125+player.ap.challenges[12]*0.025;
					}
                    return ret;
                },
                rewardDisplay() { return "Super-Prestige points ^"+format(this.rewardEffect()) },
                rewardDescription() { return "Super-Prestige points is boosted based on this challenge's completions." },
		completionsAfter120(){
			let p=player.points;
			if(player.m.best.gte(130)){
				if(p.lte("1e1500000"))return 0;
				return p.log10().div(1500000/ buyableEffect('ap', 11)).log(1.31).pow(1/1.3).toNumber();
			}
			if(p.lte("1e1700000"))return 0;
			return p.log10().div(1700000/ buyableEffect('ap', 11)).log(1.32).pow(1/1.3).toNumber();
		},
		goalAfter120(x=player.ap.challenges[12]){
			if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.31,Decimal.pow(x,1.3)).mul(1500000/ buyableEffect('ap', 11)));
			return Decimal.pow(10,Decimal.pow(1.32,Decimal.pow(x,1.3)).mul(1700000/ buyableEffect('ap', 11)));
		},
		canComplete(){
			return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
		},
		
		},
		21:{
                name: "No Self-Boost",
                completionLimit: Infinity,
			    challengeDescription() {return "3rd milestone's effect is always 1.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
                unlocked() { return hasUpgrade("ap",22) && hasUpgrade("ap",23) },
                goal: function(){
					if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.ap.challenges[21]+0.001));
					if(player.ap.challenges[21]>=5)return new Decimal("1e57090000").pow(Decimal.pow(1.3,Decimal.pow(player.ap.challenges[21]-5,1.5)));
					return [new Decimal("1e1615000"),new Decimal("1e4130000"),new Decimal("1e7150000"),new Decimal("e18060000"),new Decimal("e34850000")][player.ap.challenges[21]]
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { return "3rd milestone's effect is better." },
		completionsAfter120(){
			let p=player.points;
			if(player.m.best.gte(130)){
				if(p.lte("1e1000000"))return 0;
				return p.log10().div(1000000/ buyableEffect('ap', 11)).log(1.3).pow(1/1.34).toNumber();
			}
			if(p.lte("1e1140000"))return 0;
			return p.log10().div(1140000/ buyableEffect('ap', 11)).log(1.3).pow(1/1.36).toNumber();
		},
		goalAfter120(x=player.ap.challenges[21]){
			if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.3,Decimal.pow(x,1.34)).mul(1000000/ buyableEffect('ap', 11)));
			return Decimal.pow(10,Decimal.pow(1.3,Decimal.pow(x,1.36)).mul(1140000/ buyableEffect('ap', 11)));
		},
		canComplete(){
			return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
		},
		
		},
		22:{
                name: "Reduced Points",
                completionLimit: Infinity,
			    challengeDescription() {
			if(player.m.best.gte(122))return "1st milestone's effect is replaced by (log10(1st milestone's effect+1))^(milestones)<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions";
			return "1st milestone's effect is replaced by (log10(1st milestone's effect+1))^100<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions";
		},
                unlocked() { return hasUpgrade("ap",22) && hasUpgrade("ap",24) },
                goal: function(){
					if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.ap.challenges[22]+0.001));
					if(player.ap.challenges[22]>=5)return new Decimal("1e740").pow(Decimal.pow(1.035,player.ap.challenges[22]-5));
					return [new Decimal("1e614"),new Decimal("1e627"),new Decimal("1e671"),new Decimal("1e713"),new Decimal("1e725")][player.ap.challenges[22]]
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { return "3rd milestone's effect is better, again." },
		completionsAfter120(){
			let p=player.points.add(10).log10().div(600/ buyableEffect('ap', 11)).log(player.ap.challenges[22]>=50?1.475:1.035);
			if(p.lte(3)){
				return p.toNumber()/2+3;
			}
			return p.toNumber();
		},
		goalAfter120(x=player.ap.challenges[22]){
			if(player.ap.challenges[22]>=50){
				return Decimal.pow(10,Decimal.pow(1.475,x).mul(600/ buyableEffect('ap', 11)));
			}
			if(player.ap.challenges[22]<=3){
				return Decimal.pow(10,Decimal.pow(1.035,x*2-3).mul(600/ buyableEffect('ap', 11)));
			}
			return Decimal.pow(10,Decimal.pow(1.035,x).mul(600/ buyableEffect('ap', 11)));
		},
		canComplete(){
			return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
		},
		
		},
		31:{
                name: "No Prestige",
                completionLimit: Infinity,
			    challengeDescription() {return "You can't gain prestige points.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
                unlocked() { return player.m.best.gte(95) },
                goal: function(){
					if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.ap.challenges[31]+0.001));
					if(player.ap.challenges[31]>=5)return new Decimal("1e18040000").pow(Decimal.pow(1.3,Decimal.pow(player.ap.challenges[31]-5,1.5)));
					return [new Decimal("1e3891000"),new Decimal("1e4171000"),new Decimal("1e6322000"),new Decimal("1e8035000"),new Decimal("1e9196000")][player.ap.challenges[31]]
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { return "Prestige Boost's effect is better." },
		completionsAfter120(){
			let p=player.points;
			if(player.m.best.gte(136)){
				if(p.lte("1e1600000"))return 0;
				return p.log10().div(1600000/ buyableEffect('ap', 11)).log(1.2).pow(1/1.35).toNumber();
			}
			if(p.lte("1e1700000"))return 0;
			return p.log10().div(1700000/ buyableEffect('ap', 11)).log(1.2).pow(1/1.36).toNumber();
		},
		goalAfter120(x=player.ap.challenges[31]){
			if(player.m.best.gte(136))return Decimal.pow(10,Decimal.pow(1.2,Decimal.pow(x,1.35)).mul(1600000/ buyableEffect('ap', 11)));
			return Decimal.pow(10,Decimal.pow(1.2,Decimal.pow(x,1.36)).mul(1700000/ buyableEffect('ap', 11)));
		},
		canComplete(){
			return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
		},
		
		},
		32:{
                name: "Disabled Buyables",
                completionLimit: Infinity,
			    challengeDescription() {return "All Prestige, Super-Prestige and Hyper-Prestige buyables have no effect.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
                unlocked() { return player.m.best.gte(128) },
                goal: function(){
					return this.goalAfter120(Math.ceil(player.ap.challenges[32]+0.002));
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
				rewardEffect() {
                    let ret = 1+player.ap.challenges[32]*0.05;
                    return ret;
                },
                rewardDisplay() { return "Effect of All Prestige, Super-Prestige and Hyper-Prestige Buyables ^"+format(this.rewardEffect()) },
                rewardDescription() { return "Effect of All Prestige, Super-Prestige and Hyper-Prestige Buyables is better." },
		completionsAfter120(){
			let p=player.points;
			if(player.m.best.gte(141)){
				if(p.lte("e1e10"))return 0;
				return p.log10().div(1e10/ buyableEffect('ap', 11)).log(1.2).pow(1/1.5).toNumber();
			}
			if(player.m.best.gte(130)){
				if(p.lte("e2e10"))return 0;
				return p.log10().div(2e10/ buyableEffect('ap', 11)).log(1.2).pow(1/1.5).toNumber();
			}
			if(p.lte("e3e10"))return 0;
			return p.log10().div(3e10/ buyableEffect('ap', 11)).log(1.2).pow(1/1.5).toNumber();
		},
		goalAfter120(x=player.ap.challenges[31]){
			if(player.m.best.gte(141))return Decimal.pow(10,Decimal.pow(1.2,Decimal.pow(x,1.5)).mul(1e10/ buyableEffect('ap', 11)));
			if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.2,Decimal.pow(x,1.5)).mul(2e10/ buyableEffect('ap', 11)));
			return Decimal.pow(10,Decimal.pow(1.2,Decimal.pow(x,1.5)).mul(3e10/ buyableEffect('ap', 11)));
		},
		canComplete(){
			return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
		},
		
		},
		41:{
			name: "Hyper Dilation",
			completionLimit: Infinity,
			challengeDescription() {return "All Atomic-Prestige challenges at once.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
			unlocked() { return player.m.best.gte(158) },
			goal() {
				return this.goalAfter120(Math.ceil(player.ap.challenges[41]+0.002));
			},
			currencyDisplayName: "points",
			currencyInternalName: "points",
			rewardEffect() {
				let ret = new Decimal(player.ap.challenges[41]).add(1).times(2.42).pow(1.65).max(1);
				if (player.ep.buyables[11].gte(1)) ret=ret.times(tmp.ep.oneEffect)
				ret = softcap(ret,new Decimal('1e520'), 0.05)
				return softcap(ret,new Decimal('1e1000'), 0.05);
			},
			rewardDisplay() { return "154th Milestone effect is x"+format(this.rewardEffect())+ " better" },
			rewardDescription() { return "154th Milestone effect is better." },
	completionsAfter120(){
		let p=player.points;
		if(player.m.best.gte(141)){
			if(p.lte("e1820"))return 0;
			return p.log10().div(1820 / buyableEffect('ap', 11)).log(1.02).pow(1/1.15).toNumber();
		}
		if(player.m.best.gte(130)){
			if(p.lte("e1860"))return 0;
			return p.log10().div(1860 / buyableEffect('ap', 11)).log(1.02).pow(1/1.15).toNumber();
		}
		if(p.lte("e1950"))return 0;
		return p.log10().div(1950 / buyableEffect('ap', 11)).log(1.02).pow(1/1.15).toNumber();
	},
	goalAfter120(x=player.ap.challenges[41]){
		if(player.m.best.gte(141))return Decimal.pow(10,Decimal.pow(1.02,Decimal.pow(x,1.15)).mul(1820 / buyableEffect('ap', 11)));
		if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.02,Decimal.pow(x,1.15)).mul(1860 / buyableEffect('ap', 11)));
		return Decimal.pow(10,Decimal.pow(1.02,Decimal.pow(x,1.15)).mul(1950 / buyableEffect('ap', 11)));
	},
	canComplete(){
		return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
	},
	
	},
	42:{
		name: "Over-overflowed Milestones",
		completionLimit: Infinity,
		challengeDescription() {return "[No Self-Boost] and Milestone Overflow starts immediately, but its effect is weaker. Also on enter sets milestones and points to 0.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
		unlocked() { return player.m.best.gte(178) },
		onEnter() {
			player.m.points=new Decimal(0)
		},
		goal() {
			return this.goalAfter120(Math.ceil(player.ap.challenges[42]+0.002));
		},
		currencyDisplayName: "points",
		currencyInternalName: "points",
		rewardEffect() {
			let ret = new Decimal(player.ap.challenges[42]).add(1).pow(0.15).sub(1);
			return softcap(ret,new Decimal('1e1500'), 0.05);
		},
		rewardDisplay() { return "5th Exotic Fusioner <br> effect is +"+format(this.rewardEffect())+ " better" },
		rewardDescription() { return "5th Exotic Fusioner effect is better." },
		completionsAfter120(){
			let p=player.points;
				if(p.lte("e1490"))return 0;
				return p.log10().div(6300 / buyableEffect('ap', 11)).log(1.025).pow(1/1.2).toNumber();
		},
		goalAfter120(x=player.ap.challenges[42]){
			return Decimal.pow(10,Decimal.pow(1.025,Decimal.pow(x,1.2)).mul(6300 / buyableEffect('ap', 11)));
		},
canComplete(){
	return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.best.lt(110);
},

},
	},
	buyables: {
	11:{
		title(){
			return "<h3 class='hr'>Challenge Slayer</h3>";
		},
		display(){
			let data = tmp[this.layer].buyables[this.id];
			return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
			"Reduce Challenges base costs by /"+format(data.effect,4)+" (based on exotic prestige points)<br>"+
			"Cost for Next Level: "+format(data.cost)+" Prestige points";
		},
		cost(){
			let a=player[this.layer].buyables[this.id];
			let cost = new Decimal(1)
			a=Decimal.pow(1.65,a);
			return cost.mul(Decimal.pow("e1.5e10",a));
		},
		canAfford() {
			   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
		},
		   buy() { 
			   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
		   },
		  effect(){
			  let b=0.135;
			  let eff=new Decimal(1).add(player[this.layer].buyables[this.id].mul(b)).pow(player.ep.points.log10().log10().pow(0.5));
			  return eff;
		  },
		  unlocked(){
			  return player.m.best.gte(161);
		  },
		  style() {
			if (player.ap.points.lt(this.cost())) return {
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
		if(player.m.best.gte(90))return 5;
		return 0;
	},
		doReset(l){
			if(l=="ap"){return;}
			if(l=="t")if(player.m.best.gte(102))layerDataReset("ap",["upgrades"]);else layerDataReset("ap",[]);
		},
		update(){
			if(player.m.best.gte(103)&&!player.t.activeChallenge){
				let keep=3;
				if(player.m.best.gte(108))keep=6;
				if(player.m.best.gte(114))keep=9;
				if(player.m.best.gte(121))keep=12;
				if(player.m.best.gte(131))keep=15;
				player.ap.challenges[11]=Math.max(player.ap.challenges[11],keep);
				player.ap.challenges[12]=Math.max(player.ap.challenges[12],keep);
				player.ap.challenges[21]=Math.max(player.ap.challenges[21],keep);
				player.ap.challenges[22]=Math.max(player.ap.challenges[22],keep);
				player.ap.challenges[31]=Math.max(player.ap.challenges[31],keep);
			}
			if(player.m.best.gte(110)&&player.m.best.lt(120)){
				if(player.ap.activeChallenge){
					if(player.points.gte(layers.ap.challenges[player.ap.activeChallenge].goal())){
						player.ap.challenges[player.ap.activeChallenge]++;
					}
				}
			}
			if(player.m.best.gte(120)){
				if(player.ap.activeChallenge){
					player.ap.challenges[player.ap.activeChallenge]=Math.max(player.ap.challenges[player.ap.activeChallenge],layers.ap.challenges[player.ap.activeChallenge].completionsAfter120());
				}
			}
			if(player.m.best.gte(140)){
				for(var i in player.ap.challenges){
					player.t.highestAPC[player.t.activeChallenge||0][i]=Math.max(player.t.highestAPC[player.t.activeChallenge||0][i],player.ap.challenges[i]);
					player.ap.challenges[i]=Math.max(player.t.highestAPC[player.t.activeChallenge||0][i],player.ap.challenges[i]);
				}
			}
            if (player.m.best.gte(145)){
                if (player.points.gte(tmp.ap.challenges[11].goal)){
                    player.ap.challenges[11]=Math.max(player.ap.challenges[11],layers.ap.challenges[11].completionsAfter120());
                }
                if (player.points.gte(tmp.ap.challenges[12].goal)){
                    player.ap.challenges[12]=Math.max(player.ap.challenges[12],layers.ap.challenges[12].completionsAfter120());
                }
                if (player.points.gte(tmp.ap.challenges[21].goal)){
                    player.ap.challenges[21]=Math.max(player.ap.challenges[21],layers.ap.challenges[21].completionsAfter120());
                }
            }
            if (player.m.best.gte(150)){
                if (player.points.gte(tmp.ap.challenges[31].goal)){
                    player.ap.challenges[31]=Math.max(player.ap.challenges[31],layers.ap.challenges[31].completionsAfter120());
                }
                if (player.points.gte(tmp.ap.challenges[32].goal)){
                    player.ap.challenges[32]=Math.max(player.ap.challenges[32],layers.ap.challenges[32].completionsAfter120());
                }
                }
				if (player.em.best.gte(8)){
					if (player.points.gte(tmp.ap.challenges[22].goal)){
						player.ap.challenges[22]=Math.max(player.ap.challenges[22],layers.ap.challenges[22].completionsAfter120());
					}
					}
					if (player.m.best.gte(175) && player.ap.points.gte(layers.ap.buyables[11].cost())) layers.ap.buyables[11].buy()
            }
})