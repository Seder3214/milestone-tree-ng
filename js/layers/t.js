addLayer("t", {
    name: "transcend", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
	points: new Decimal(0),
	choose: new Decimal(2),
	dChoose: false,
	sChoose: false,
	pdChoose: false,
	hChoose: false,
	sdChoose: false,
	phChoose: false,
	specialPoints: {
		11: new Decimal(0),
		12: new Decimal(0),
		21: new Decimal(0),
		22: new Decimal(0),
		31: new Decimal(0),
		32: new Decimal(0),
	},
	highestAPC: {
		0: {
			11: 0,
			12: 0,
			21: 0,
			22: 0,
			31: 0,
			32: 0,
			41: 0,
    42:0,
		},
		11: {
			11: 0,
			12: 0,
			21: 0,
			22: 0,
			31: 0,
			32: 0,
			41: 0,
42:0,
		},
		12: {
			11: 0,
			12: 0,
			21: 0,
			22: 0,
			31: 0,
			32: 0,
			41: 0,
42:0,	
	},
		21: {
			11: 0,
			12: 0,
			21: 0,
			22: 0,
			31: 0,
			32: 0,
			41: 0,
42:0,
		},
		22: {
			11: 0,
			12: 0,
			21: 0,
			22: 0,
			31: 0,
			32: 0,
			41: 0,
42:0,
		},
		31: {
			11: 0,
			12: 0,
			21: 0,
			22: 0,
			31: 0,
			32: 0,
			41: 0,
42:0,
		},
		32: {
			11: 0,
			12: 0,
			21: 0,
			22: 0,
			31: 0,
			32: 0,
			41: 0,
42:0,
		},
	}
    }},
    color: "#FFFF00",
    requires1(){
        if(player.m.best.gte(156))return new Decimal("1e400");
		if(player.m.best.gte(137))return new Decimal("1e640");
		return new Decimal("1e850");
	},
    requires(){
		if(player.t.activeChallenge)return new Decimal(Infinity);
		return tmp.t.requires1;
	},
    resource: "transcend points", // Name of prestige currency
    baseResource: "atomic-prestige points", // Name of resource prestige is based on
    baseAmount() {return player.ap.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for transcend points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(99)&& (player.mp.activeChallenge!=21)},
	branches: ["ap"],
	softcap:new Decimal(Infinity),
	softcapPower:new Decimal(1),
	gainMult(){
		let mult=new Decimal(1);
		if(player.mm.best.gte(21))mult=mult.mul(2);
		if(player.mm.best.gte(22))mult=mult.mul(2);
		if(player.mm.best.gte(23))mult=mult.mul(2);
		if(player.mm.best.gte(24))mult=mult.mul(2);
		if(player.mm.best.gte(25))mult=mult.mul(tmp.mm.meta25Effect);
		if(hasUpgrade("pe",21))mult=mult.mul(upgradeEffect("pe",21));
		if(hasUpgrade("t",63))mult=mult.mul(upgradeEffect("t",63));
		if (player.ep.buyables[11].gte(2) && !player.t.activeChallenge) mult = mult.mul(tmp.ep.twoEffect)
		if (player.t.activeChallenge!=undefined) mult= mult.mul(tmp.ep.sixEffect)
		return mult;
	},
	getResetGain() {
		if(player.ap.points.lt(tmp.t.requires1))return new Decimal(0);
		let amt=Decimal.log10(player.ap.points).sub(600).div(250).pow(2).mul(tmp.t.gainMult);
		amt=amt.floor();
		//if(amt.gte(Decimal.sub(4e14,player.t.points)) && !player.t.activeChallenge){
		//	amt=Decimal.sub(4e14,player.t.points).ceil().max(0);
		//}
		return amt;
	},
	getNextAt() {
		if(player.ap.points.lt(tmp.t.requires1))return new Decimal(tmp.t.requires1);
		let amt=Decimal.log10(player.ap.points).sub(600).div(250).pow(2).mul(tmp.t.gainMult);
		amt=amt.floor().plus(1).div(tmp.t.gainMult);
		amt=Decimal.pow(10,amt.pow(1/2).mul(250).add(600));
		return amt;
	},
	getNextSPAt() {
		if(!player.t.activeChallenge)return new Decimal(0);
		let amt=player.t.specialPoints[player.t.activeChallenge].plus(1).div(tmp.t.gainMult);
		amt=Decimal.pow(10,amt.pow(1/2).mul(250).add(600));
		if(amt.lt(tmp.t.requires1))return new Decimal(tmp.t.requires1);
		return amt;
	},
	upgrades: {
        rows: 7,
		cols: 4,
		11: {
			title: "Transcend Upgrade 11",
            description: "Third Milestone's effect ^1.005",
            cost: new Decimal(1),
        },
		12: {
			title: "Transcend Upgrade 12",
            description: "Prestige Point gain ^1.005",
            cost: new Decimal(1),
        },
		13: {
			title: "Transcend Upgrade 13",
            description: "Super-Prestige Point gain ^1.005",
            cost: new Decimal(1),
        },
		14: {
			title: "Transcend Upgrade 14",
            description: "Hyper-Prestige Point gain ^1.005",
            cost: new Decimal(1),
        },
		21: {
			title: "Transcend Upgrade 21",
            description: "Prestige and Super-Prestige Upgrade 31 is boosted.",
            cost: new Decimal(5),
        },
		22: {
			title: "Transcend Upgrade 22",
            description: "Atomic-Prestige Point gain ^1.01",
            cost: new Decimal(10),
        },
		23: {
			title: "Transcend Upgrade 23",
            description: "Third Milestone's effect ^1.005",
            cost: new Decimal(15),
        },
		24: {
			title: "Transcend Upgrade 24",
            description: "Prestige Boost is cheaper",
            cost: new Decimal(20),
        },
		31: {
			title: "Transcend Upgrade 31",
            description: "Third Milestone's effect ^1.005",
            cost: new Decimal(50),
        },
		32: {
			title: "Transcend Upgrade 32",
            description: "Prestige Point gain ^1.005",
            cost: new Decimal(75),
        },
		33: {
			title: "Transcend Upgrade 33",
            description: "Super-Prestige Point gain ^1.005",
            cost: new Decimal(100),
        },
		34: {
			title: "Transcend Upgrade 34",
            description: "Hyper-Prestige Point gain ^1.005",
            cost: new Decimal(125),
        },
		41: {
			title: "Transcend Upgrade 41",
            description(){return "Hyper Boost cost /"+format("1e60000")},
            cost: new Decimal(300),
			unlocked(){return player.m.best.gte(104);}
        },
		42: {
			title: "Transcend Upgrade 42",
            description(){return "Gain an extra Hyper Boost."},
            cost: new Decimal(400),
			unlocked(){return player.m.best.gte(104);}
        },
		43: {
			title: "Transcend Upgrade 43",
            description(){return "Hyper Boost's effect is better."},
            cost: new Decimal(500),
			unlocked(){return player.m.best.gte(104);}
        },
		44: {
			title: "Transcend Upgrade 44",
            description(){return "Unlock a new row of Atomic-Prestige upgrades."},
            cost: new Decimal(600),
			unlocked(){return player.m.best.gte(104);}
        },
		51: {
			title: "Transcend Upgrade 51",
            description(){return "First HP buyable's effect ^2.1"},
            cost: new Decimal(30000),
			unlocked(){return player.m.best.gte(111);}
        },
		52: {
			title: "Transcend Upgrade 52",
            description(){return "Milestone cost scaling starts later based on your transcend points."},
            cost: new Decimal(60000),
			unlocked(){return player.m.best.gte(111);},
			effect(){
				return new Decimal(9).plus(player.t.points.add(10).log10().sqrt().mul(1.2));
			},
            effectDisplay() { return "+"+format(this.effect(),4) },
        },
		53: {
			title: "Transcend Upgrade 53",
            description(){return "Reduce the 1st Milestone's softcap's potency."},
            cost: new Decimal(2e6),
			unlocked(){return player.m.best.gte(111);},
        },
		54: {
			title: "Transcend Upgrade 54",
            description(){return "1st Milestone's softcap starts later based on your transcend points."},
            cost: new Decimal(1e7),
			unlocked(){return player.m.best.gte(111);},
			effect(){
				let p=0.8;
				let m=0.05;
				if(player.m.best.gte(128)){
					p+=0.1;
				}
				let eff=player.t.points.add(10).log10().pow(p).mul(m);
				return new Decimal(1).plus(eff);
			},
            effectDisplay() { return format(this.effect(),4)+"x later" },
        },
		61: {
			title: "Transcend Upgrade 61",
            description(){return "All Dilation Effects +0.05"},
            cost: new Decimal(1e10),
			unlocked(){return player.m.best.gte(125);},
        },
		62: {
			title: "Transcend Upgrade 62",
            description(){return "Atomic-Prestige point gain is boosted based on your transcend points."},
            cost: new Decimal(1e11),
			unlocked(){return player.m.best.gte(125);},
			effect(){
				let base=80;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
			},
            effectDisplay() { return format(this.effect())+"x" },
        },
		63: {
			title: "Transcend Upgrade 63",
            description(){return "Transcend point gain is boosted based on your transcend points."},
            cost: new Decimal(1e12),
			unlocked(){return player.m.best.gte(125);},
			effect(){
				let base=1.05;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
			},
            effectDisplay() { return format(this.effect())+"x" },
        },
		64: {
			title: "Transcend Upgrade 64",
            description(){return "Hyper Boost cost /"+format("1e300000")},
            cost: new Decimal(4e12),
			unlocked(){return player.m.best.gte(125);}
        },
		71: {
			title: "Transcend Upgrade 71",
            description(){return "Hyper Boost cost /"+format("1e30000")},
            cost: new Decimal(1e13),
			unlocked(){return player.m.best.gte(136);}
        },
		72: {
			title: "Transcend Upgrade 72",
            description(){return "Meta-Milestones are cheaper based on Transcend Points."},
            cost: new Decimal(2e13),
			unlocked(){return player.m.best.gte(136);},
			effect(){
				let p=0.5;
				let m=0.01;
				if(hasUpgrade("t",74))m+=0.01;
				let eff=player.t.points.add(10).log10().pow(p).mul(m);
				return new Decimal(1).plus(softcap(eff,new Decimal(1.4),0.25));
			},
            effectDisplay() { return "/"+format(this.effect(),4) },
        },
		73: {
			title: "Transcend Upgrade 73",
            description(){return "1st Milestone's softcap starts later based on AP challenge completions."},
            cost: new Decimal(1e14),
			unlocked(){return player.m.best.gte(136);},
			effect(){
				let c=0;
				for(var i in player.ap.challenges)c+=player.ap.challenges[i];
				let p=2;
				if(hasUpgrade("t",74))p+=0.1;
				let m=1e-5;
				let eff=new Decimal(c).pow(p).mul(m);
				return new Decimal(1).plus(eff);
			},
            effectDisplay() { return format(this.effect(),4)+"x later" },
        },
		74: {
			title: "Transcend Upgrade 74",
            description(){return "Transcend Upgrade 72 and 73 are boosted."},
            cost: new Decimal(4e14),
			unlocked(){return player.m.best.gte(136);},
        },
	},
	clickables: {
        11: {
            unlocked(){return player.mp.activeChallenge==12 || player.mp.buyables[13].gte(1)},
            title() {return (player.mp.activeChallenge!=12)?"Boost Dilated Points":"Choose Dilated Points"},
            display() {return "Status:" + (player.t.dChoose==true?" Choosed":" Not Choosed")},
            canClick() {if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12)return player.mp.perkPoints.gte(1)
				else return player.t.choose.gte(1)},
            onClick() {
				if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12) player.mp.perkPoints= player.mp.perkPoints.sub(1)
				else player.t.choose = player.t.choose.sub(1)
                player.t.dChoose = true
            },
			style: {
				width: "300px",
				minHeight: "30px",
			  },
        },
		12: {
            unlocked(){return player.mp.activeChallenge==12 || player.mp.buyables[13].gte(1)},
            title() {return (player.mp.activeChallenge!=12)?"Boost Softcapped Points":"Choose Softcapped Points"},
            display() {return "Status:" + (player.t.sChoose==true?" Choosed":" Not Choosed")},
            canClick() {if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12)return player.mp.perkPoints.gte(1)
				else return player.t.choose.gte(1)},
            onClick() {
				if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12) player.mp.perkPoints= player.mp.perkPoints.sub(1)
				else player.t.choose = player.t.choose.sub(1)
                player.t.sChoose = true
            },
			style: {
				width: "300px",
				minHeight: "30px",
			  },
        },
		21: {
            unlocked(){return player.mp.activeChallenge==12 || player.mp.buyables[13].gte(1)},
            title() {return (player.mp.activeChallenge!=12)?"Boost Prestige-Dilated Points":"Choose Prestige-Dilated Points"},
            display() {return "Status:" + (player.t.pdChoose==true?" Choosed":" Not Choosed")},
            canClick() {if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12)return player.mp.perkPoints.gte(1)
				else return player.t.choose.gte(1)},
            onClick() {
				if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12) player.mp.perkPoints= player.mp.perkPoints.sub(1)
				else player.t.choose = player.t.choose.sub(1)
                player.t.pdChoose = true
            },
			style: {
				width: "300px",
				minHeight: "30px",
			  },
        },
		22: {
            unlocked(){return player.mp.activeChallenge==12 || player.mp.buyables[13].gte(1)},
            title() {return (player.mp.activeChallenge!=12)?"Boost Hardcapped Points": "Choose Hardcapped Points"},
            display() {return "Status:" + (player.t.hChoose==true?" Choosed":" Not Choosed")},
            canClick() {if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12)return player.mp.perkPoints.gte(1)
				else return player.t.choose.gte(1)},
            onClick() {
				if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12) player.mp.perkPoints= player.mp.perkPoints.sub(1)
				else player.t.choose = player.t.choose.sub(1)
                player.t.hChoose = true
            },
			style: {
				width: "300px",
				minHeight: "30px",
			  },
        },
		31: {
            unlocked(){return player.mp.activeChallenge==12 || player.mp.buyables[13].gte(1)},
            title() {return (player.mp.activeChallenge!=12)?"Boost Super-Dilated Points": "Choose Super-Dilated Points"},
            display() {return "Status:" + (player.t.sdChoose==true?" Choosed":" Not Choosed")},
            canClick() {if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12)return player.mp.perkPoints.gte(1)
				else return player.t.choose.gte(1)},
            onClick() {
				if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12) player.mp.perkPoints= player.mp.perkPoints.sub(1)
				else player.t.choose = player.t.choose.sub(1)
                player.t.sdChoose = true
            },
			style: {
				width: "300px",
				minHeight: "30px",
			  },
        },
		32: {
            unlocked(){return player.mp.activeChallenge==12 || player.mp.buyables[13].gte(1)},
            title() {return (player.mp.activeChallenge!=12)?"Boost Prestige-Hardcapped Points": "Choose Prestige-Hardcapped Points"},
            display() {return "Status:" + (player.t.phChoose==true?" Choosed":" Not Choosed")},
            canClick() {if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12)return player.mp.perkPoints.gte(1)
				else return player.t.choose.gte(1)},
            onClick() {
				if (player.mp.buyables[13].gte(1) && player.mp.activeChallenge!=12) player.mp.perkPoints= player.mp.perkPoints.sub(1)
				else player.t.choose = player.t.choose.sub(1)
                player.t.phChoose = true
            },
			style: {
				width: "300px",
				minHeight: "30px",
			  },
        },
	},
	challenges: {
        rows: 3,
		cols: 2,
		11:{
                name: "Dilation",
                completionLimit: Infinity,
			    challengeDescription() {return "1st milestone's effect ^"+format(tmp.t.dilationEffect)+"<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return true },
                goal: function(){
					let x = (player.t.challenges[11]+1)*(player.t.challenges[11]+1)
					if (hasUpgrade('ep',21)) x = x-upgradeEffect('ep',21)
					if (player.t.challenges[11]>=19) return x*1.15;
					if(player.m.best.gte(110))return x;
					else return 2*Math.pow(3,player.t.challenges[11]);
				},
				canComplete(){
					let c=0;
					for(var i in player.ap.challenges)c+=player.ap.challenges[i];
					if(c>=tmp.t.challenges[this.id].goal)return true;
					return false;
				},
                currencyDisplayName: "AP challenge completions",
                rewardDescription() { return "3rd milestone's effect is better." },
		},
		12:{
                name: "Softcapped",
                completionLimit() {
					if(player.em.points.gte(15)) return new Decimal(20)
					else return Infinity},
			    challengeDescription() {return "1st milestone's softcap starts earlier<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player.m.best.gte(104) },
                goal: function(){
					return (player.t.challenges[12]+1)*(player.t.challenges[12]+1);
				},
				canComplete(){
					let c=0;
					for(var i in player.ap.challenges)c+=player.ap.challenges[i];
					if(c>=tmp.t.challenges[this.id].goal)return true;
					return false;
				},
				rewardEffect() {
		if(player.m.points.lt(112) && player.t.activeChallenge==12)return 1;
                    let ret = 1+player.t.challenges[12]*0.1;
					if(player.em.best.gte(15))ret=ret*1.01
                    return ret;
                },
				rewardDisplay() {
                    return format(this.rewardEffect())+"x later";
                },
                currencyDisplayName: "AP challenge completions",
                rewardDescription() { 
				if(player.m.points.lt(112))return "1st milestone's softcap starts later, but the reward is disabled in this challenge.";
				else return "1st milestone's softcap starts later.";
		 },
		},
		21:{
                name: "Prestige Dilation",
                completionLimit: Infinity,
			    challengeDescription() {return "1st milestone's effect and prestige point gain ^"+format(tmp.t.dilationEffect)+"<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player.m.best.gte(109) },
                goal: function(){
					let x = (player.t.challenges[21]+1)*(player.t.challenges[21]+1)
					if (hasUpgrade('ep',21)) x = x-upgradeEffect('ep',21)
					if (player.t.challenges[21]>=19) return x*1.15
					return x;
				},
				canComplete(){
					let c=0;
					for(var i in player.ap.challenges)c+=player.ap.challenges[i];
					if(c>=tmp.t.challenges[this.id].goal)return true;
					return false;
				},
                currencyDisplayName: "AP challenge completions",
                rewardDescription() { return "3rd milestone's effect is better." },
		},
		22:{
                name: "Hardcapped",
                completionLimit() {
					if(player.em.points.gte(16)) return new Decimal(12)
					else return Infinity},
			    challengeDescription() {return "'Softcapped' is applied, and 1st milestone's softcap is its hardcap.<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player.m.best.gte(115) },
                goal: function(){
					return (player.t.challenges[22]+1)*(player.t.challenges[22]+1);
				},
				canComplete(){
					let c=0;
					for(var i in player.ap.challenges)c+=player.ap.challenges[i];
					if(c>=tmp.t.challenges[this.id].goal)return true;
					return false;
				},
				rewardEffect() {
		            let ret = 1+player.t.challenges[22]*0.1;
					if(player.em.best.gte(16))ret=ret*1.05
                    return ret;
                },
				rewardDisplay() {
                    return format(this.rewardEffect())+"x later";
                },
                currencyDisplayName: "AP challenge completions",
                rewardDescription() { return "1st milestone's softcap starts later." },
		},
		31:{
                name: "Super Dilation",
                completionLimit: Infinity,
			    challengeDescription() {return "1st milestone's effect, prestige point gain and super-prestige point gain ^"+format(tmp.t.dilationEffect)+"<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player.m.best.gte(125) },
                goal: function(){
					let x = (player.t.challenges[31]+1)*(player.t.challenges[31]+1)
					if (hasUpgrade('ep',21)) x = x-upgradeEffect('ep',21)
					if (player.t.challenges[31]>=19) return x*1.15
					return x;
				},
				canComplete(){
					let c=0;
					for(var i in player.ap.challenges)c+=player.ap.challenges[i];
					if(c>=tmp.t.challenges[this.id].goal)return true;
					return false;
				},
                currencyDisplayName: "AP challenge completions",
                rewardDescription() { return "3rd milestone's effect is better." },
		},
		32:{
                name: "Prestige Hardcapped",
                completionLimit() {
					if(player.em.points.gte(17)) return new Decimal(12)
					else return Infinity},
			    challengeDescription() {return "'Hardcapped' is applied, and prestige point gain is affected by 1st Milestone's softcap<br>"+challengeCompletions(this.layer, this.id) +" completions"},
                unlocked() { return player.m.best.gte(137) },
                goal: function(){
					return (player.t.challenges[32]+1)*(player.t.challenges[32]+1);
				},
				canComplete(){
					let c=0;
					for(var i in player.ap.challenges)c+=player.ap.challenges[i];
					if(c>=tmp.t.challenges[this.id].goal)return true;
					return false;
				},
				rewardEffect() {
		            let ret = 1+player.t.challenges[32]*0.1;
					if(player.em.best.gte(17))ret=ret*1.05
                    return ret;
                },
				rewardDisplay() {
                    return format(this.rewardEffect())+"x later";
                },
                currencyDisplayName: "AP challenge completions",
                rewardDescription() { return "1st milestone's softcap starts later." },
		},
	},
	
	passiveGeneration(){
		if(player.t.activeChallenge)return 0;
		if(player.m.best.gte(133))return 1;
		if(player.m.best.gte(130))return 0.8;
		if(player.m.best.gte(127))return 0.6;
		if(player.m.best.gte(123))return 0.45;
		if(player.m.best.gte(120))return 0.3;
		if(player.m.best.gte(119))return 0.2;
		if(player.m.best.gte(118))return 0.1;
		if(player.m.best.gte(117))return 0.05;
		if(player.m.best.gte(116))return 0.02;
		if(player.m.best.gte(115))return 0.01;
		if(player.m.best.gte(113))return 0.005;
		if(player.m.best.gte(110))return 0.002;
		return 0;
	},
	tabFormat: {
		"Main":{
			content:[
				"main-display","prestige-button","resource-display",
				["display-text",function(){		let cap = new Decimal(1e70)
					if (player.m.best.gte(169)) cap = new Decimal(1e90)
							if (player.ep.buyables[11].gte(4)) cap = cap.mul(tmp.ep.fourEffect)
					return "Transcend point is hardcapped at "+format(cap)}],

				["display-text",function(){return "AP challenge is applied after T challenge, softcap is applied after AP challenge"}],
				["display-text",function(){
					let c=0;
					for(var i in player.ap.challenges)c+=player.ap.challenges[i];
					return "AP challenge completions: "+format(c,4)
				}],
				"challenges"
			]
		},
		"Upgrades": {
			content: [
				"main-display","prestige-button","resource-display",
				"upgrades"
			]
		},
		"Special Transcend Points":{
			content:[
				"main-display",
				["display-text",function(){return "Reach "+format(tmp.t.requires1)+" atomic-prestige points in a Transcend Challenge to gain Special Transcend Points!"}],
				function(){if(!player.t.activeChallenge)return ["display-text",""];return "resource-display"},
				["display-text",function(){if(!player.t.activeChallenge || player.t.specialPoints[player.t.activeChallenge].gte(1e6))return "";return "Next "+layers.t.getSpecialTPName(player.t.activeChallenge)+" at "+format(tmp.t.getNextSPAt)+" atomic-prestige points"}],
				["display-text",function(){return "You have "+format(player.t.specialPoints[11])+" Dilated Transcend Points, 3rd Milestone's effect ^"+format(layers.t.getSpecialEffect(11),4)}],["clickable",11],
				["display-text",function(){return "You have "+format(player.t.specialPoints[12])+" Softcapped Transcend Points, 1st Milestone's softcap starts "+format(layers.t.getSpecialEffect(12),4)+"x later"}],["clickable",12],
				["display-text",function(){return "You have "+format(player.t.specialPoints[21])+" Prestige-Dilated Transcend Points, Prestige Point gain ^"+format(layers.t.getSpecialEffect(21),4)}],["clickable",21],
				["display-text",function(){return "You have "+format(player.t.specialPoints[22])+" Hardcapped Transcend Points, 1st Milestone's softcap starts "+format(layers.t.getSpecialEffect(22),4)+"x later"}],["clickable",22],
				["display-text",function(){return "You have "+format(player.t.specialPoints[31])+" Super-Dilated Transcend Points, 154th Milestone effect is ^"+format(layers.t.getSpecialEffect(31),4) + " better"}],["clickable",31],
				["display-text",function(){return "You have "+format(player.t.specialPoints[32])+" Prestige-Hardcapped Transcend Points, 6th Milestone effect is ^"+format(layers.t.getSpecialEffect(32),4) + " better"}],["clickable",32],
			],
			unlocked(){return player.m.best.gte(130);}
		},
	},
	update(){
		if(player.em.best.gte(9)){
			if(player.t.specialPoints[11].lt(layers.t.getResetGain())){
				player.t.specialPoints[11]=layers.t.getResetGain().add(1).log(5).mul('1e35').mul(tmp.ep.sixEffect);
			}
		}
		if(player.em.best.gte(10)){
			if(player.t.specialPoints[12].lt(layers.t.getResetGain())){
				player.t.specialPoints[12]=layers.t.getResetGain().add(1).log(5).mul('1e30').mul(tmp.ep.sixEffect);
			}
		}
		if(player.em.best.gte(11)){
			if(player.t.specialPoints[21].lt(layers.t.getResetGain())){
				player.t.specialPoints[21]=layers.t.getResetGain().add(1).log(7).mul('1e34').mul(tmp.ep.sixEffect);
			}
		}
		if(player.em.best.gte(12)){
			if(player.t.specialPoints[22].lt(layers.t.getResetGain())){
				player.t.specialPoints[22]=layers.t.getResetGain().add(1).log(3).mul('1e35').mul(tmp.ep.sixEffect);
			}
		}
		if(player.em.best.gte(13)){
			if(player.t.specialPoints[31].lt(layers.t.getResetGain())){
				player.t.specialPoints[31]=layers.t.getResetGain().add(1).log(2).mul('1e30').mul(tmp.ep.sixEffect);
			}
		}
		if(player.em.best.gte(14)){
			if(player.t.specialPoints[32].lt(layers.t.getResetGain())){
				player.t.specialPoints[32]=layers.t.getResetGain().add(1).log(2).mul('1e28').mul(tmp.ep.sixEffect);
			}
		}
		let cap = new Decimal(1e70)
		if (player.m.best.gte(169)) cap = new Decimal(1e90)
		if (player.ep.buyables[11].gte(4)) cap = cap.mul(tmp.ep.fourEffect)
				if (player.mp.activeChallenge==13) cap = new Decimal(1e10)
		if(player.t.points.gte(cap))player.t.points=new Decimal(cap);
		if(player.m.best.gte(130) && player.t.activeChallenge){
			if(player.t.specialPoints[player.t.activeChallenge].lt(layers.t.getResetGain())){
				player.t.specialPoints[player.t.activeChallenge]=layers.t.getResetGain();
			}
		}
		if(player.m.best.gte(140)&&player.t.activeChallenge){
			if(layers.t.challenges[player.t.activeChallenge].canComplete()&&(new Decimal(player.t.challenges[player.t.activeChallenge]).lt(tmp.t.challenges[player.t.activeChallenge].completionLimit))){
				player.t.challenges[player.t.activeChallenge]++;
			}
		}
        if (player.m.best.gte(147)){
					let c=0;
for(var i in player.ap.challenges)c+=player.ap.challenges[i];
            if (c >=(tmp.t.challenges[11].goal)){
               return player.t.challenges[11]++
            }
            if (c >=(tmp.t.challenges[12].goal)&&(new Decimal(player.t.challenges[12]).lt(tmp.t.challenges[12].completionLimit))){
                return player.t.challenges[12]++
            }
        }
        if (player.em.best.gte(18)){
			let c=0;
for(var i in player.ap.challenges)c+=player.ap.challenges[i];
	if (c >=(tmp.t.challenges[21].goal)){
	   return player.t.challenges[21]++
	}
}
if (player.em.best.gte(19)){
	let c=0;
for(var i in player.ap.challenges)c+=player.ap.challenges[i];
if (c >=(tmp.t.challenges[31].goal)){
return player.t.challenges[31]++
}
}
	},
	dilationEffect(){
		let eff=0.45;
		if(hasUpgrade("t",61))eff+=0.05;
		return eff;
	},
	getSpecialTPName(x){
		if(x==11)return "Dilated Transcend Point";
		if(x==12)return "Softcapped Transcend Point";
		if(x==21)return "Prestige-Dilated Transcend Point";
		if(x==22)return "Hardcapped Transcend Point";
		if(x==31)return "Super-Dilated Transcend Point";
		if(x==32)return "Prestige-Hardcapped Transcend Point";
	},
	getSpecialEffect(x){
		if(x==11){
			let effect=player.t.specialPoints[11].add(1).log10().div(100).add(1);
			if (player.t.dChoose!=true && player.mp.activeChallenge==12) return new Decimal(1)
			if (player.t.dChoose==true && player.mp.buyables[13].gte(1)&& player.mp.activeChallenge!=12) effect = effect.add(5)
			return softcap(effect,new Decimal(1.4),0.1);
		}
		if(x==12){
			let effect=player.t.specialPoints[12].add(1).log10().div(100).add(1);
			if (player.t.sChoose!=true && player.mp.activeChallenge==12) return new Decimal(1)
			if (player.t.sChoose==true && player.mp.buyables[13].gte(1)&& player.mp.activeChallenge!=12) effect = effect.add(5)
			return softcap(effect,new Decimal(1.4),0.1);
		}
		if(x==21){
			let effect=player.t.specialPoints[21].add(1).log10().div(100).add(1);
			if (player.t.pdChoose!=true && player.mp.activeChallenge==12) return new Decimal(1)
			if (player.t.pdChoose==true && player.mp.buyables[13].gte(1)&& player.mp.activeChallenge!=12) effect = effect.add(0.1)
			return effect;
		}
		if(x==22){
			let effect=player.t.specialPoints[22].add(1).log10().div(100).add(1);
			if (player.t.hChoose!=true && player.mp.activeChallenge==12) return new Decimal(1)
			if (player.t.hChoose==true && player.mp.buyables[13].gte(1)&& player.mp.activeChallenge!=12) effect = effect.add(0.1)
			return softcap(effect,new Decimal(1.35),0.1);
		}
        if(x==31){
			let effect=player.t.specialPoints[31].add(1).log10().div(25).add(1);
if (!hasUpgrade('pp',21)) return new Decimal(1)
if (player.t.sdChoose!=true && player.mp.activeChallenge==12) return new Decimal(1)
if (player.t.sdChoose==true && player.mp.buyables[13].gte(1)&& player.mp.activeChallenge!=12) effect = effect.add(0.1)
			else return effect.max(1);
		}
        if(x==32){
			let effect=player.t.specialPoints[32].add(1).log10().div(100).add(1);
if (!hasUpgrade('pp',22)) return new Decimal(1)
if (player.t.phChoose!=true && player.mp.activeChallenge==12) return new Decimal(1)
if (player.t.phChoose==true && player.mp.buyables[13].gte(1)&& player.mp.activeChallenge!=12) effect = effect.add(0.1)
		else	return effect.max(1);
		}
	}
})