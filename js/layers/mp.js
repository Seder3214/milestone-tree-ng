addLayer("mp", {
    name: "multiverse prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        perkPoints: new Decimal(0),
        totalF: new Decimal(0),
		modeE: true,
		modeP: false,
    }},
    color: "#d03800",
    requires(){
		return new Decimal('1e20000');
	},
    resource: "multiverse prestige points", // Name of prestige currency
    baseResource: "exotic prestige", // Name of resource prestige is based on
    baseAmount() {return player.ep.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=new Decimal(1);
		return m;
    },
    row: 4,
	newRow: 2, // Row the layer is in on the tree (0 is the first row)
	exponent: 7.5,
    hotkeys: [
        {key: "v", description: "V: Reset for Multiverse Prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(181)},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Multiverse Prestige Upgrade 11",
            description: "Prestige Power Strength boost Prestige Power gain",
            cost: new Decimal(5),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.2;
                let ret = player.pp.power.add(1).div('1e1000').pow(base)
                return ret.max(1);
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Multiverse Prestige Upgrade 12",
            description: "Multiverse Prestige Points reduces Milestone Overflow effect",
            cost: new Decimal(6),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.15;
                let ret = player.mp.best.add(1).pow(base).sub(1)
                return ret.add(hasUpgrade('mp',13)?upgradeEffect('mp',13):0);
            },
            effectDisplay() { return "-"+format(this.effect()) }, // Add formatting to the effect
        },
        13:  {
			title: "Multiverse Prestige Upgrade 13",
            description: "Unlock Multiverse Fusioners. Previous upgrade is better based on Multiverse Points",
            cost: new Decimal(7),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=0.05;
                let ret = player.mp.best.add(1).pow(base).sub(1)
				if (hasUpgrade('mp',14)) ret = ret.mul(2)
                return ret.max(0);
            },
            effectDisplay() { return "+"+format(this.effect()) }, // Add formatting to the effect
        },
        14:  {
			title: "Multiverse Prestige Upgrade 14",
            description: "Milestone Cost Scaling is disabled, and double prev. upgrade effect",
            cost: new Decimal(13),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
	},
    challenges: {
        11:{
            onEnter() {
                player.t.points=new Decimal(0)
                player.p.points=new Decimal(0)
            },
            name: "Ex-Dilation",
            completionLimit: Infinity,
            challengeDescription() {return "4th Exotic Fusioner effect is ^0.15 weaker."+"<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
            unlocked() { return true },
            goal: function(){
                if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.mp.challenges[11]+0.001));
            },
            canComplete(){
                return player.ep.points.gte(tmp.mp.challenges[this.id].goal)&&player.m.points.lt(110);
            },
            completionsAfter120(){
                let p=player.ep.points;
                if(player.m.best.gte(130)){
                    if(p.lte("1e10000"))return 0;
                    return p.log10().div(10000).log(1.1).pow(1/1.1).toNumber();
                }
            },
            rewardEffect() {
                let ret = (player.mp.challenges[11]+1*1.46)**1.75
                return ret;
            },
            goalAfter120(x=player.mp.challenges[11]){
                if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.1,Decimal.pow(x,1.1)).mul(10000));
            },
            currencyDisplayName: "Exotic Prestige Points",
            rewardDescription() { return "6th Exotic Fusioner effect is x"+ format(this.rewardEffect())+" better." },
    },
    12:{
        onEnter() {
            layerDataReset("t",['challenges','upgrades'])
            layerDataReset("ep",["buyables"])
            doReset("hp")
            player.t.choose = new Decimal(2)
        },
        onExit() {
            player.t.dChoose = false
            player.t.sChoose = false
            player.t.pdChoose = false
            player.t.hChoose = false
            player.t.sdChoose = false
            player.t.phChoose = false
            player.mp.perkPoints = player.mp.buyables[13]
        },
        name: "Weaker Transcend",
        completionLimit: Infinity,
        challengeDescription() {return "While entering this challenge, you should choose 2 Special Transcend Points (others will be unable to get)."+"<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions.<br>At 35 completions, unlock a <b>New Challenge</b>."},
        unlocked() { return player.m.best.gte(183) },
        goal: function(){
            if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.mp.challenges[12]+0.001));
        },
        canComplete(){
            return player.ep.points.gte(tmp.mp.challenges[this.id].goal)&&player.m.points.lt(110);
        },
        completionsAfter120(){
            let p=player.ep.points;
            if(player.m.best.gte(130)){
                if(p.lte("1e28000"))return 0;
                return p.log10().div(28000).log(1.1).pow(1/1.1).toNumber();
            }
        },
        rewardEffect() {
            let ret = (player.mp.challenges[12]+1)/5000
            return ret;
        },
        goalAfter120(x=player.mp.challenges[12]){
            if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.1,Decimal.pow(x,1.1)).mul(28000));
        },
        currencyDisplayName: "Exotic Prestige Points",
        rewardDescription() { return "7th Exotic Fusioner effect is +"+ format(this.rewardEffect())+" better." },
},
13:{
	onEnter() {
		player.t.points=new Decimal(0)
		player.p.points=new Decimal(0)
		player.ep.points = new Decimal(0)
		player.pp.points = new Decimal(0)
	},
	name: "Exotic-less and No Transcend",
	completionLimit: Infinity,
	challengeDescription() {return "All of Exotic Fusioner effects are useless, Transcend Points hardcap is always at 1e10."+"<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
	unlocked() { return player.mp.challenges[12]>=35 },
	goal: function(){
		if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.mp.challenges[13]+0.001));
	},
	canComplete(){
		return player.pep.points.gte(tmp.mp.challenges[this.id].goal)&&player.m.points.lt(110);
	},
	completionsAfter120(){
		let p=player.ep.points;
		if(player.m.best.gte(130)){
			if(p.lte("1e950000"))return 0;
			return p.log10().div(950000).log(1.01).pow(1/2.5).toNumber();
		}
	},
	rewardEffect() {
		let ret = (player.mp.challenges[13])*0.5
ret = softcap(new Decimal(ret), new Decimal(7),0.25)
		return softcap(new Decimal(ret),new Decimal(7.5),0.5);
	},
	goalAfter120(x=player.mp.challenges[13]){
		if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.01,Decimal.pow(x,2.5)).mul(950000));
	},
	currencyDisplayName: "Exotic Prestige Points",
	rewardDescription() { return "Prestige Power Upgrade 12 softcap starts "+ format(this.rewardEffect())+" later." },
},
21:{
	onEnter() {
		layerDataReset('pp',["upgrades"])
		layerDataReset('p',["upgrades"])
		layerDataReset('sp',["upgrades"])
		layerDataReset('pe',["upgrades"])
		layerDataReset('hp',["upgrades"])
		layerDataReset('ap',["upgrades","challenges"])
		layerDataReset('pb',["upgrades"])
		layerDataReset('hb',["upgrades"])
		layerDataReset('se',["upgrades"])
		layerDataReset("ep",[])
		layerDataReset("em",[])
		layerDataReset("mm",[])
		layerDataReset("m",[])
	},
	name: "Enter The Prestige Multiverse",
	completionLimit: new Decimal(1),
	challengeDescription() {return "On enter resets all progress except for Milestones, 1st Milestone now divides points gain based on Multiverse Points."+"<br>"+format(challengeCompletions(this.layer, this.id)) +"/1 completions"},
	unlocked() { return player.m.best.gte(185) },
	goal: function(){
		if(player.m.best.gte(120))return this.goalAfter120(Math.ceil(player.mp.challenges[13]+0.001));
	},
	canComplete(){
		return player.pep.points.gte(tmp.mp.challenges[this.id].goal)&&player.m.points.lt(110);
	},
	completionsAfter120(){
		let p=player.ep.points;
		if(player.m.best.gte(130)){
			if(p.lte("1e20"))return 0;
			return p.log10().div(20).log(1.01).pow(1/1.01).toNumber();
		}
	},
	rewardEffect() {
		let ret = (player.mp.challenges[13])*4
		return softcap(new Decimal(ret),new Decimal(5),0.25);
	},
	goalAfter120(x=player.mp.challenges[13]){
		if(player.m.best.gte(130))return Decimal.pow(10,Decimal.pow(1.01,Decimal.pow(x,1.01)).mul(20));
	},
	goalDescription() {return "Goal: "+format(this.goalAfter120())+" Exotic Prestige Points in this challenge"},
	currencyDisplayName: "Exotic Prestige Points",
	rewardDescription() { return "Unlock Ascensions<br><hr color='black'><i>You've reached the limit of Milestones Power. Travel into <b>Prestige Dimension</b> to get some kind of better Milestones... <br>Or even <b>Ascend</b>?</i>" },
},
    },
	buyables: {
		rows: 2,
		cols: 3,
        respec() {
            player.mp.points = new Decimal(7)
player.mp.perkPoints = new Decimal(0)
for (i in player.mp.buyables){
player.mp.buyables[i] = new Decimal(0)}
player.mp.totalF = new Decimal(0)
player.t.dChoose = false
            player.t.sChoose = false
            player.t.pdChoose = false
            player.t.hChoose = false
            player.t.sdChoose = false
            player.t.phChoose = false
player.t.choose = new Decimal(0)
        },
        respecMessage: "Are you sure you want to respec Multiversal Fusioners? This will reset all of multiversal progress to pre-Fusioners stage!",
        respecText: "Respec Multiversal Fusioners",
        11:{
			title(){
				return "<h3 class='mr'>Milestone Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Based on Milestones, get a boost to Exotic Prestige Points. <br>Effect: x"+format(data.effect)+"<br>"+
				"Cost for Next Level: "+format(data.cost)+" Multiversal Prestige Points";
			},
			cost(x) {
				return new Decimal(6).add(x).add(player.mp.totalF.div(2));
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                   player.mp.totalF = player.mp.totalF.add(1)
               },
			  effect(x){
                let eff = x.add(1).pow(player.m.best.pow(2.5)).pow(new Decimal(2).pow(x))
				  return eff;
			  },
			  unlocked(){
				  return hasUpgrade('mp',13);
			  },
			  style() {
				if (player.mp.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'125px'
				}
            }
        },
        12:{
			title(){
				return "<h3 class='mr'>Exotic Fusioner II</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Per level, change Exotic Fusioner's effect's formulas or make effect's softcaps weaker. <br>Currently: "+format(data.effect)+" effects boosted (starting at second).<br>"+
				"Cost for Next Level: "+format(data.cost)+" Multiversal Prestige Points";
			},
			cost(x) {
				return new Decimal(7).add(x.div(5)).add(player.mp.totalF.mul(2).div(1.75));
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                   player.mp.totalF = player.mp.totalF.add(1)
               },
			  effect(x){
                let eff = x
				  return eff;
			  },
			  unlocked(){
				  return hasUpgrade('mp',13);
			  },
			  style() {
				if (player.mp.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'125px'
				}
            }
        },
        13:{
			title(){
				return "<h3 class='mr'>Transcend Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Per level, get a Perk Point, that can be used to strenghen Special Transcend Points's effect (chosen ones resets on enter Weaker Transcend). <br>Currently: "+format(data.effect)+" more Perk Points.<br>"+
				"Cost for Next Level: "+format(data.cost)+" Multiversal Prestige Points";
			},
			cost(x) {
				return new Decimal(7).add(x.mul(2)).add(player.mp.totalF.div(2));
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                   player.mp.perkPoints = player.mp.perkPoints.add(1)
                   player.mp.totalF = player.mp.totalF.add(1)
               },
			  effect(x){
                let eff = x
				  return eff;
			  },
			  unlocked(){
				  return hasUpgrade('mp',13);
			  },
			  style() {
				if (player.mp.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'125px'
				}
            }
        },
        21:{
			title(){
				return "<h3 class='mr'>Upgrading Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"(This fusioner's cost is not affected by amount of buyed Fusioners) Per level, unlock 2 more Exotic Prestige upgrades. <br>Currently: "+format(data.effect)+" more upgrades.<br>"+
				"Cost for Next Level: "+format(data.cost)+" Multiversal Prestige Points";
			},
			cost(x) {if (x.gte(1)) return new Decimal(10).mul(x)
				else return new Decimal(8);
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(x){
                let eff = x.mul(2)
				  return eff;
			  },
			  unlocked(){
				  return hasUpgrade('mp',13);
			  },
			  style() {
				if (player.mp.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'125px'
				}
            }
        },
        22:{
			title(){
				return "<h3 class='pmr'>Essence Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				(player.mp.modeE==true?"Triple Prestige Essence gain and its effect.":"1.50x Points gain and double Prestige Essence effect.")+"<br>Currently: "+format(data.effect)+"x.<br>"+
				"Cost for Next Level: "+format(data.cost)+" Prestige Essence";
			},
			cost(x) {return new Decimal(500).mul(x.max(1)).pow(x.div(5).add(1)).mul(x.sub(5).add(1).mul(5).max(1));
			},
			canAfford() {
                   return player.pm.essence.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				   player.pm.essence=player.pm.essence.sub(cost)
               },
			  effect(x){
				let base = new Decimal(player.mp.modeE==true?3:1.5)
                let eff = base.pow(x)
				  return eff;
			  },
			  unlocked(){
				  return player.pm.best.gte(2);
			  },
			  style() {
				if (player.pm.essence.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'125px'
				}
            }
        },
        23:{
			title(){
				return "<h3 class='pmr'>Recharge Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Level: "+format(player[this.layer].buyables[this.id])+"<br>"+
				"Add +"+format(player.mp.modeE==true?0.25:0.05)+" to exponent of 1st milestone reducing effect. <br>Currently: +"+format(data.effect)+".<br>"+
				"Cost for Next Level: "+format(data.cost)+" Prestige Essence";
			},
			cost(x) {return new Decimal(5500).mul(x.max(1)).pow(x.div(2).add(1));
			},
			canAfford() {
                   return player.pm.essence.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				   player.pm.essence=player.pm.essence.sub(cost)
               },
			  effect(x){
				let base = new Decimal(player.mp.modeE==true?0.25:0.05)
                let eff = base.mul(x)
				  return eff;
			  },
			  unlocked(){
				  return player.pm.best.gte(2);
			  },
			  style() {
				if (player.pm.essence.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'125px'
				}
            }
        },
	},
	clickables: {
		11: {
			display: "Change Essence & Recharge mode to Prestige Essence boost, but lose ^0.5 of Prestige Essences.",
			canClick() {return player.mp.modeE==false},
			onClick() {
				player.mp.modeP=false
				player.mp.modeE=true
				player.pm.essence = player.pm.essence.pow(0.5)
			},
			style() {
				if (player.mp.modeE==true) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'50px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(68, 68, 68)',
					'border':'2px solid',
					'height':'50px'
				}
            },
			unlocked(){
				return player.pm.best.gte(2);
			},	
		},
		12: {
			canClick() {return player.mp.modeP==false},
		display: "Change Essence & Recharge mode to Points boost, but ^0.85 Prestige Essences.",
		onClick() {
			player.mp.modeP=true
			player.mp.modeE=false
			player.pm.essence = player.pm.essence.pow(0.85)
		},
		style() {
			if (player.mp.modeP==true) return {
				'border-radius': '0%',
				'color':'white',
				'background-color':'black',
				'border':'2px solid',
				'height':'50px'
			}
			else return {
				'border-radius': '0%',
				'color':'white',
				'background-color':'rgb(68, 68, 68)',
				'border':'2px solid',
				'height':'50px'
			}
		},
		unlocked(){
			return player.pm.best.gte(2);
		},
	},
	},
    tabFormat: {
		"Main":{
			content:[
				"main-display","prestige-button","resource-display",
				"challenges"
			]
		},
        "Upgrades": {
			content: [
				"main-display","prestige-button","resource-display",
				"upgrades",
			]
		},
        "Fusioners": {
			content: [
				"main-display","prestige-button","resource-display",
                "buyables",
				"clickables",
			],
        unlocked() {return hasUpgrade('mp',13)},
		},
    },
	branches: ["ep",'pm'],
	passiveGeneration(){
		return 0;
	},
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(l=="mp") {
                layerDataReset('pp',["upgrades"])
                layerDataReset('p',["upgrades"])
				layerDataReset('sp',["upgrades"])
				layerDataReset('pe',["upgrades"])
				layerDataReset('hp',["upgrades"])
				layerDataReset('ap',["upgrades","challenges"])
				layerDataReset('pb',["upgrades"])
				layerDataReset('hb',["upgrades"])
				layerDataReset('se',["upgrades"])
                layerDataReset("ep",["buyables"])};
		},
	update(){
        if(player.m.best.gte(120)){
            if(player.mp.activeChallenge){
                player.mp.challenges[player.mp.activeChallenge]=Math.max(player.mp.challenges[player.mp.activeChallenge],layers.mp.challenges[player.mp.activeChallenge].completionsAfter120());
            }
        }
	}
})