addLayer("m", {
    name: "milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		pseudoBuys:[],
		points: new Decimal(0),
    }},
	color() {
		if (hasMalware("m", 4)) return "#9f2846"
		return "#793784"},
    requires(){
		//if(player.m.best.gte(99))return new Decimal(Infinity);
		return new Decimal(10);
	},
    resource: "milestones", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(1.5),
	milestonePopups() {
		return (player.mp.activeChallenge!=21)
	},
	exponent: function(){
		if(player.m.points.lt(5))return new Decimal(1.7);
		var base=new Decimal(2);
		var firstScaling=player.m.points.sub(tmp.m.getScalingStart).max(0);
		if(tmp.m.getScalingStart.lte(25)){
			if(firstScaling.gte(Decimal.sub(25,tmp.m.getScalingStart))){
				firstScaling=Decimal.pow(1.03,firstScaling.sub(Decimal.sub(25,tmp.m.getScalingStart))).sub(1).mul(100).add(Decimal.sub(25,tmp.m.getScalingStart));
			}
			firstScaling=firstScaling.div(100);
		}else{
			firstScaling=Decimal.pow(1.03,firstScaling).sub(1);
		}
		if(hasUpgrade("p",31))firstScaling=firstScaling.div(upgradeEffect("p",31));
		if(hasUpgrade("sp",31))firstScaling=firstScaling.div(upgradeEffect("sp",31));
		if(hasUpgrade("hp",23))firstScaling=firstScaling.div(upgradeEffect("hp",23));
		if(hasUpgrade("ap",23))firstScaling=firstScaling.div(upgradeEffect("ap",23));
		if(hasUpgrade("pe",12))firstScaling=firstScaling.div(upgradeEffect("pe",12));
		if(hasUpgrade("se",12))firstScaling=firstScaling.div(upgradeEffect("se",12));
		if(player.m.points.gte(185))return new Decimal(5).mul(getCostOverflowEff());
		return new Decimal(2).add(firstScaling).add(player.m.points.gte(145)&&player.m.points.lte(170)?0.5:0).mul(player.m.points.gte(getCostOverflowStart())?getCostOverflowEff():1).div(hasUpgrade('p',53)?upgradeEffect('p',53):1);
	},
    getScalingStart(){
        let start=new Decimal(14);
		if (hasAchievement('ach',13)) start = start.add(achievementEffect('ach',13))
		if(hasUpgrade("t",52))start=start.add(upgradeEffect("t",52));
		return start;
    },
    hotkeys: [
        {key: "m", description: "M: Get Milestone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.mp.activeChallenge!=21)||player.pm.activeChallenge==12||player.pm.activeChallenge==13},
	resetsNothing(){return true},
	autoPrestige(){return player.mm.best.gte(1)},
	milestones: [
		{
			requirementDescription: "1st Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				let table="Gain "+format(new Decimal(1).max(getPointGen()))+" points per second."
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Exotic Booster effect base is ^"+format(tmp.m.milestones[0].effect)+" better based on points gain."
				return table
			},
			effect() {
				let eff = new Decimal(1)
				eff=getPointGen().add(1).log10().add(1).pow(0.35)
				return eff
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {return player.points.gte(`e1.31e21`)},
			pseudoCost: new Decimal(`e1.31e21`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "2nd Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription() {let table= "Triple the first Milestone's effect."
			if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>First Milestone's second effect applies to point gain after softcap at greatly boosted rate.<br>Currently: x"+format(tmp.m.milestones[1].effect)+" to points gain (reduced when in challenge)"
			return table
			},
			effect() {
				let eff = new Decimal(1)
				if (player.ap.activeChallenge!=undefined || player.t.activeChallenge!=undefined ||player.mp.activeChallenge!=undefined||player.pm.activeChallenge!=undefined) return new Decimal(10).pow(tmp.m.milestones[0].effect.add(1).pow(0.2))
				eff=new Decimal(`ee20`).pow(tmp.m.milestones[0].effect.add(1).pow(0.2))
				return eff
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {return player.points.gte(`e1.3505e21`)},
			pseudoCost: new Decimal(`e1.3505e21`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "3rd Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table="First Milestone's effect is boosted by your points. Currently: "+format(tmp.m.milestone3Effect)+"x"
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Points boosts Challenge Slayer effect. Currently: "+format(tmp.m.milestones[2].effect)+"x"
				return table
			},
			effect() {
				let eff = new Decimal(1)
				eff=player.points.add(1).pow(0.1).add(1).log10().add(1).log2().add(1).pow(0.15)
				return eff
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {return player.points.gte(`e6.755e21`)},
			pseudoCost: new Decimal(`e6.755e21`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "4th Milestone",
            unlocked() {return player[this.layer].best.gte(3)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table= "Third Milestone's effect is better based on your milestones. Currently: 3rd Milestone's base effect base +"+format(tmp.m.milestone4Effect);
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Add +"+format(tmp.m.milestones[3].effect)+" to Prestige Power Upgrade 12 after softcap (based on best milestones and points).<br>Auto-complete Multiverse Challenges outside."
				return table
			},
			effect() {
				let eff = new Decimal(1)
				eff=player.m.best.add(1).pow(0.5).div(100).add(player.points.add(1).log10().add(1).log10().add(1).pow(0.15).div(5))
				return eff
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {return player.points.gte(`e7.605e21`)},
			pseudoCost: new Decimal(`e7.605e21`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "5th Milestone",
            unlocked() {return player[this.layer].best.gte(4)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table=  "Unlock the next layer. Milestones don't reset on all resets.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Unlock Prestige Perk Upgrades."
				return table
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."},
			pseudoCan() {return player.points.gte(`e8.011e21`)},
			pseudoCost: new Decimal(`e8.011e21`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "6th Milestone",
            unlocked() {return player[this.layer].best.gte(5)},
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table= "Prestige Point gain is boosted by your milestones. Currently: "+format(tmp.m.milestone6Effect)+"x";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>This milestone's effect is greately stronger."
				return table
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e8.18e21`)},
			pseudoCost: new Decimal(`e8.18e21`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "7th Milestone",
            unlocked() {return player[this.layer].best.gte(6)},
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "6th Milestone's effect is powered by 1.5";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>6th Milestone's effect is powered by 1.35.<br>Exotic Prestige no longer resets on row 5 reset."
				return table
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e1.57e22`)},
			pseudoCost: new Decimal(`e1.57e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "8th Milestone",
            unlocked() {return player[this.layer].best.gte(7)},
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "6th Milestone's effect is powered by 1.2";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Add 15 free Hyper Boosts."
				return table
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e2.175e22`)},
			pseudoCost: new Decimal(`e2.175e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
					'color':"white",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "9th Milestone",
            unlocked() {return player[this.layer].best.gte(8)},
            done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "6th Milestone's effect is powered by 1.1.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>3rd Milestone applies to Prestige Points gain at reduced rate."
				return table
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e2.395e22`)},
			pseudoCost: new Decimal(`e2.395e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "10th Milestone",
            unlocked() {return player[this.layer].best.gte(9)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "Unlock 2 new Prestige Upgrades.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Unlock a new layer in Prestige Universe."
				return table
			},
			pseudoUnl() {return hasUpgrade("mp",21)},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e2.53e22`)},
			pseudoCost: new Decimal(`e2.53e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "11th Milestone",
            unlocked() {return player[this.layer].best.gte(10)},
            done() {return player[this.layer].best.gte(11)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "Prestige Upgrade 11's effect is better.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Prestige Upgrade 35's effect is better."
				return table
			},
			pseudoUnl() {return player.ex.dotUnl>=2},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e2.655e22`)},
			pseudoCost: new Decimal(`e2.655e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "12th Milestone",
            unlocked() {return player[this.layer].best.gte(11)},
            done() {return player[this.layer].best.gte(12)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "Prestige Upgrade 12's effect is better.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Prestige Upgrade 45's effect is better."
				return table
			},
			pseudoUnl() {return player.ex.dotUnl>=2},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e2.68e22`)},
			pseudoCost: new Decimal(`e2.68e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "13th Milestone",
            unlocked() {return player[this.layer].best.gte(12)},
            done() {return player[this.layer].best.gte(13)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "Prestige Upgrade 13's effect is better.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Prestige Upgrade 25's effect is better."
				return table
			},
			pseudoUnl() {return player.ex.dotUnl>=2},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e3.325e22`)},
			pseudoCost: new Decimal(`e3.325e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "14th Milestone",
            unlocked() {return player[this.layer].best.gte(13)},
            done() {return player[this.layer].best.gte(14)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "Prestige Upgrade 14's effect is better.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Prestige Upgrade 15's effect is better."
				return table
			},
			pseudoUnl() {return player.ex.dotUnl>=2},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e3.465e22`)},
			pseudoCost: new Decimal(`e3.465e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "15th Milestone",
            unlocked() {return player[this.layer].best.gte(14)},
            done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let table = "Unlock 2 new Prestige Upgrades.";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Unlock Exploration Upgrades and Portals.<br>Add +5 to [Corrupted Essence] Challenge Completions"
				return table
			},
			pseudoUnl() {return player.ex.dotUnl>=2},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e3.69e22`)},
			pseudoCost: new Decimal(`e3.69e22`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "16th Milestone",
            unlocked() {return player[this.layer].best.gte(15)},
            done() {return player[this.layer].best.gte(16)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				table = "3rd Milestone's effect ^1.016";
				if (player.m.pseudoBuys.includes(this.id)) table+="<hr color='darkred' size='3'>Unlock Milestone Ambers (in Super Prestige)."
				return table
			},
			pseudoUnl() {return player.ex.dotUnl>=3},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e9.3e23`)},
			pseudoCost: new Decimal(`e9.3e23`),
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "17th Milestone",
            unlocked() {return player[this.layer].best.gte(16)},
            done() {return player[this.layer].best.gte(17)}, 
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=1))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e6.215e23`)},
			pseudoCost: new Decimal(`e6.215e23`),
            effectDescription:  function(){
				table= "3rd Milestone's effect ^1.017";
				if (player.m.pseudoBuys.includes(this.id)) table+=`<hr color='darkred' size='3'>Reduce Milestone Overflow effect by amount of Spark Milestones and points.<br>Currently: -${format(this.effect())} to overflow effect`
				return table
			},
			effect() {
				let eff = player.sp.sparkMilestones.max(1).div(4.37).add(1).mul(player.points.max(1).slog(20).max(1).log(6).add(1))
				return eff
			},
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "18th Milestone",
            unlocked() {return player[this.layer].best.gte(17)},
            done() {return player[this.layer].best.gte(18)}, 
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=2))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e1.605e24`)},
			pseudoCost: new Decimal(`e1.605e24`),// Used to determine when to give the milestone
            effectDescription:  function(){
				table= "3rd Milestone's effect ^1.018";
				if (player.m.pseudoBuys.includes(this.id)) table+=`<hr color='darkred' size='3'>Boost [Prestige Essence Boost I] by unspent super prestige points.<br>Currently: ^${format(this.effect())}`
				return table
			},
			effect() {
				let eff = player.sp.points.max(1).log10().max(1).log10().max(1).log10()
				return eff
			},
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "19th Milestone",
            unlocked() {return player[this.layer].best.gte(18)},
            done() {return player[this.layer].best.gte(19)},
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=3))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e5.555e25`)},
			pseudoCost: new Decimal(`e5.555e25`), // Used to determine when to give the milestone
            effectDescription:  function(){
				table= "3rd Milestone's effect ^1.019";
				if (player.m.pseudoBuys.includes(this.id)) table+=`<hr color='darkred' size='3'>Increase Maximum Unlockable Spark Milestones by +1.`
				return table
			},
			style() {
				if (player.m.pseudoBuys.includes(this.id)) return {
                    'background':'red',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running inf_milestone",
                    'width': '100%',
                }
			},
        },
		{
			requirementDescription: "20th Milestone",
            unlocked() {return player[this.layer].best.gte(19)},
            done() {return player[this.layer].best.gte(20)},
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=4))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e5e26`)},
			pseudoCost: new Decimal(`e5e26`), // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player[this.layer].best.gte(135))return "Gain 1e12% of Prestige Point gain per second.";
				return "Gain 10000% of Prestige Point gain per second.";
			},
        },
		{
			requirementDescription: "21st Milestone",
            unlocked() {return player[this.layer].best.gte(20)},
            done() {return player[this.layer].best.gte(21)},
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=5))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e9e27`)},
			pseudoCost: new Decimal(`e9e27`), // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock 2 new Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "22nd Milestone",
            unlocked() {return player[this.layer].best.gte(21)},
            done() {return player[this.layer].best.gte(22)},
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=6))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e2.39e28`)},
			pseudoCost: new Decimal(`e2.39e28`), // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige Point Gain is multiplied by 22";
			},
        },
		{
			requirementDescription: "23rd Milestone",
            unlocked() {return player[this.layer].best.gte(22)},
            done() {return player[this.layer].best.gte(23)},
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=7))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e1.28e29`)},
			pseudoCost: new Decimal(`e1.28e29`), // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige Upgrade 23's effect is better.";
			},
        },
		{
			requirementDescription: "24th Milestone",
            unlocked() {return player[this.layer].best.gte(23)},
            done() {return player[this.layer].best.gte(24)},
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=8))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e1e33`)},
			pseudoCost: new Decimal(`e1e33`), // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige Upgrade 24's effect is better.";
			},
        },
		{
			requirementDescription: "25th Milestone",
            unlocked() {return player[this.layer].best.gte(24)},
            done() {return player[this.layer].best.gte(25)},
			pseudoUnl() {return (hasMilestone('sp',2)&&(milestoneEffect('sp',2)>=9))},
			pseudoReq() {return "To infect a milestone, get "+format(this.pseudoCost)+" points."
			},
			pseudoCan() {return player.points.gte(`e3.838e38`)},
			pseudoCost: new Decimal(`e3.838e38`), // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer.";
			},
        },
		{
			requirementDescription: "26th Milestone",
            unlocked() {return player[this.layer].best.gte(25)},
            done() {return player[this.layer].best.gte(26)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Prestige upgrades on Super-Prestige.";
			},
        },
		{
			requirementDescription: "27th Milestone",
            unlocked() {return player[this.layer].best.gte(26)},
            done() {return player[this.layer].best.gte(27)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Super-Prestige Point gain is boosted by your milestones. Currently: "+format(tmp.m.milestone27Effect)+"x";
			},
        },
		{
			requirementDescription: "28th Milestone",
            unlocked() {return player[this.layer].best.gte(27)},
            done() {return player[this.layer].best.gte(28)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "27th Milestone's effect is powered by 1.5";
			},
        },
		{
			requirementDescription: "29th Milestone",
            unlocked() {return player[this.layer].best.gte(28)},
            done() {return player[this.layer].best.gte(29)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "27th Milestone's effect is powered by 1.2";
			},
        },
		{
			requirementDescription: "30th Milestone",
            unlocked() {return player[this.layer].best.gte(29)},
            done() {return player[this.layer].best.gte(30)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock 2 new Super-Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "31st Milestone",
            unlocked() {return player[this.layer].best.gte(30)},
            done() {return player[this.layer].best.gte(31)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige and Super-Prestige Upgrade 11's effect is better.";
			},
        },
		{
			requirementDescription: "32nd Milestone",
            unlocked() {return player[this.layer].best.gte(31)},
            done() {return player[this.layer].best.gte(32)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige and Super-Prestige Upgrade 12's effect is better.";
			},
        },
		{
			requirementDescription: "33rd Milestone",
            unlocked() {return player[this.layer].best.gte(32)},
            done() {return player[this.layer].best.gte(33)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige and Super-Prestige Upgrade 13's effect is better.";
			},
        },
		{
			requirementDescription: "34th Milestone",
            unlocked() {return player[this.layer].best.gte(33)},
            done() {return player[this.layer].best.gte(34)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige and Super-Prestige Upgrade 14's effect is better.";
			},
        },
		{
			requirementDescription: "35th Milestone",
            unlocked() {return player[this.layer].best.gte(34)},
            done() {return player[this.layer].best.gte(35)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock 2 new Super-Prestige Upgrades, 6th Milestone's effect ^3.5.";
			},
        },
		{
			requirementDescription: "36th Milestone",
            unlocked() {return player[this.layer].best.gte(35)},
            done() {return player[this.layer].best.gte(36)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's effect ^1.036";
			},
        },
		{
			requirementDescription: "37th Milestone",
            unlocked() {return player[this.layer].best.gte(36)},
            done() {return player[this.layer].best.gte(37)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's effect ^1.037";
			},
        },
		{
			requirementDescription: "38th Milestone",
            unlocked() {return player[this.layer].best.gte(37)},
            done() {return player[this.layer].best.gte(38)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's effect ^1.038";
			},
        },
		{
			requirementDescription: "39th Milestone",
            unlocked() {return player[this.layer].best.gte(38)},
            done() {return player[this.layer].best.gte(39)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's effect ^1.039";
			},
        },
		{
			requirementDescription: "40th Milestone",
            unlocked() {return player[this.layer].best.gte(39)},
            done() {return player[this.layer].best.gte(40)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer. Unlock 2 new Super-Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "41st Milestone",
            unlocked() {return player[this.layer].best.gte(40)},
            done() {return player[this.layer].best.gte(41)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.003";
			},
        },
		{
			requirementDescription: "42nd Milestone",
            unlocked() {return player[this.layer].best.gte(41)},
            done() {return player[this.layer].best.gte(42)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "6th Milestone's effect ^(1+(meta-milestones)).";
			},
        },
		{
			requirementDescription: "43rd Milestone",
            unlocked() {return player[this.layer].best.gte(42)},
            done() {return player[this.layer].best.gte(43)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "44th Milestone",
            unlocked() {return player[this.layer].best.gte(43)},
            done() {return player[this.layer].best.gte(44)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "45th Milestone",
            unlocked() {return player[this.layer].best.gte(44)},
            done() {return player[this.layer].best.gte(45)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new row of Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "46th Milestone",
            unlocked() {return player[this.layer].best.gte(45)},
            done() {return player[this.layer].best.gte(46)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.001";
			},
        },
		{
			requirementDescription: "47th Milestone",
            unlocked() {return player[this.layer].best.gte(46)},
            done() {return player[this.layer].best.gte(47)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "27th Milestone's effect ^(1+(meta-milestones^0.25)).";
			},
        },
		{
			requirementDescription: "48th Milestone",
            unlocked() {return player[this.layer].best.gte(47)},
            done() {return player[this.layer].best.gte(48)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "49th Milestone",
            unlocked() {return player[this.layer].best.gte(48)},
            done() {return player[this.layer].best.gte(49)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Super-Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "50th Milestone",
            unlocked() {return player[this.layer].best.gte(49)},
            done() {return player[this.layer].best.gte(50)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer.";
			},
        },
		{
			requirementDescription: "51st Milestone",
            unlocked() {return player[this.layer].best.gte(50)},
            done() {return player[this.layer].best.gte(51)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.00175";
			},
        },
		{
			requirementDescription: "52nd Milestone",
            unlocked() {return player[this.layer].best.gte(51)},
            done() {return player[this.layer].best.gte(52)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "6th Milestone's effect ^(1+(meta-milestones^0.1)).";
			},
        },
		{
			requirementDescription: "53rd Milestone",
            unlocked() {return player[this.layer].best.gte(52)},
            done() {return player[this.layer].best.gte(53)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "54th Milestone",
            unlocked() {return player[this.layer].best.gte(53)},
            done() {return player[this.layer].best.gte(54)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "55th Milestone",
            unlocked() {return player[this.layer].best.gte(54)},
            done() {return player[this.layer].best.gte(55)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new row of Super-Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "56th Milestone",
            unlocked() {return player[this.layer].best.gte(55)},
            done() {return player[this.layer].best.gte(56)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.00078";
			},
        },
		{
			requirementDescription: "57th Milestone",
            unlocked() {return player[this.layer].best.gte(56)},
            done() {return player[this.layer].best.gte(57)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player[this.layer].best.gte(135))return "Gain 1e12% of Super-Prestige Point gain per second.";
				return "Gain 100% of Super-Prestige Point gain per second.";
			},
        },
		{
			requirementDescription: "58th Milestone",
            unlocked() {return player[this.layer].best.gte(57)},
            done() {return player[this.layer].best.gte(58)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "59th Milestone",
            unlocked() {return player[this.layer].best.gte(58)},
            done() {return player[this.layer].best.gte(59)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Super-Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "60th Milestone",
            unlocked() {return player[this.layer].best.gte(59)},
            done() {return player[this.layer].best.gte(60)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer. Keep Prestige upgrades on Prestige Boost.";
			},
        },
		{
			requirementDescription: "61st Milestone",
            unlocked() {return player[this.layer].best.gte(60)},
            done() {return player[this.layer].best.gte(61)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.0005";
			},
        },
		{
			requirementDescription: "62nd Milestone",
            unlocked() {return player[this.layer].best.gte(61)},
            done() {return player[this.layer].best.gte(62)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "6th Milestone's effect ^(meta-milestones^0.129).";
			},
        },
		{
			requirementDescription: "63rd Milestone",
            unlocked() {return player[this.layer].best.gte(62)},
            done() {return player[this.layer].best.gte(63)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "64th Milestone",
            unlocked() {return player[this.layer].best.gte(63)},
            done() {return player[this.layer].best.gte(64)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "65th Milestone",
            unlocked() {return player[this.layer].best.gte(64)},
            done() {return player[this.layer].best.gte(65)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige Boost doesn't reset anything. Keep Prestige and Super-Prestige upgrades on Hyper-Prestige. Unlock 2 new Hyper-Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "66th Milestone",
            unlocked() {return player[this.layer].best.gte(65)},
            done() {return player[this.layer].best.gte(66)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.0005";
			},
        },
		{
			requirementDescription: "67th Milestone",
            unlocked() {return player[this.layer].best.gte(66)},
            done() {return player[this.layer].best.gte(67)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "27th Milestone's effect ^(meta-milestones^0.147).";
			},
        },
		{
			requirementDescription: "68th Milestone",
            unlocked() {return player[this.layer].best.gte(67)},
            done() {return player[this.layer].best.gte(68)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "69th Milestone lol",
            unlocked() {return player[this.layer].best.gte(68)},
            done() {return player[this.layer].best.gte(69)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Super-Prestige and Hyper-Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "70th Milestone",
            unlocked() {return player[this.layer].best.gte(69)},
            done() {return player[this.layer].best.gte(70)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Prestige Boost upgrades on Hyper-Prestige. Unlock a new row of Hyper-Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "71st Milestone",
            unlocked() {return player[this.layer].best.gte(70)},
            done() {return player[this.layer].best.gte(71)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.001236";
			},
        },
		{
			requirementDescription: "72nd Milestone",
            unlocked() {return player[this.layer].best.gte(71)},
            done() {return player[this.layer].best.gte(72)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "6th Milestone's effect ^(meta-milestones^0.1).";
			},
        },
		{
			requirementDescription: "73rd Milestone",
            unlocked() {return player[this.layer].best.gte(72)},
            done() {return player[this.layer].best.gte(73)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "74th Milestone",
            unlocked() {return player[this.layer].best.gte(73)},
            done() {return player[this.layer].best.gte(74)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "75th Milestone",
            unlocked() {return player[this.layer].best.gte(74)},
            done() {return player[this.layer].best.gte(75)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player[this.layer].best.gte(135))return "Gain 1e12% of Hyper-Prestige Point gain per second.";
				return "Gain 10000% of Hyper-Prestige Point gain per second.";
			},
        },
		{
			requirementDescription: "76th Milestone",
            unlocked() {return player[this.layer].best.gte(75)},
            done() {return player[this.layer].best.gte(76)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.00157";
			},
        },
		{
			requirementDescription: "77th Milestone",
            unlocked() {return player[this.layer].best.gte(76)},
            done() {return player[this.layer].best.gte(77)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a Super-Prestige buyable.";
			},
        },
		{
			requirementDescription: "78th Milestone",
            unlocked() {return player[this.layer].best.gte(77)},
            done() {return player[this.layer].best.gte(78)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "79th Milestone",
            unlocked() {return player[this.layer].best.gte(78)},
            done() {return player[this.layer].best.gte(79)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Super-Prestige and Hyper-Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "80th Milestone",
            unlocked() {return player[this.layer].best.gte(79)},
            done() {return player[this.layer].best.gte(80)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer. Autoget Prestige Boosts.";
			},
        },
		{
			requirementDescription: "81st Milestone",
            unlocked() {return player[this.layer].best.gte(80)},
            done() {return player[this.layer].best.gte(81)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.0005. You keep Prestige, Super-Prestige and Prestige Boost Upgrades on Atomic-Prestige.";
			},
        },
		{
			requirementDescription: "82nd Milestone",
            unlocked() {return player[this.layer].best.gte(81)},
            done() {return player[this.layer].best.gte(82)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "6th Milestone's effect ^(meta-milestones^0.2). You keep Hyper-Prestige Upgrades on Atomic-Prestige.";
			},
        },
		{
			requirementDescription: "83rd Milestone",
            unlocked() {return player[this.layer].best.gte(82)},
            done() {return player[this.layer].best.gte(83)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted. Autobuy the first Super-Prestige buyable.";
			},
        },
		{
			requirementDescription: "84th Milestone",
            unlocked() {return player[this.layer].best.gte(83)},
            done() {return player[this.layer].best.gte(84)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Prestige and Atomic-Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "85th Milestone",
            unlocked() {return player[this.layer].best.gte(84)},
            done() {return player[this.layer].best.gte(85)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a Hyper-Prestige buyable. Unlock a new row of Hyper-Prestige upgrades.";
			},
        },
		{
			requirementDescription: "86th Milestone",
            unlocked() {return player[this.layer].best.gte(85)},
            done() {return player[this.layer].best.gte(86)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.0005.";
			},
        },
		{
			requirementDescription: "87th Milestone",
            unlocked() {return player[this.layer].best.gte(86)},
            done() {return player[this.layer].best.gte(87)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "27th Milestone's effect ^(meta-milestones^0.3).";
			},
        },
		{
			requirementDescription: "88th Milestone",
            unlocked() {return player[this.layer].best.gte(87)},
            done() {return player[this.layer].best.gte(88)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "89th Milestone",
            unlocked() {return player[this.layer].best.gte(88)},
            done() {return player[this.layer].best.gte(89)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Super-Prestige and Hyper-Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "90th Milestone",
            unlocked() {return player[this.layer].best.gte(89)},
            done() {return player[this.layer].best.gte(90)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player[this.layer].best.gte(135))return "Gain 1e12% of Atomic-Prestige Point gain per second.";
				return "Gain 500% of Atomic-Prestige Point gain per second.";
			},
        },
		{
			requirementDescription: "91st Milestone",
            unlocked() {return player[this.layer].best.gte(90)},
            done() {return player[this.layer].best.gte(91)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.0005.";
			},
        },
		{
			requirementDescription: "92nd Milestone",
            unlocked() {return player[this.layer].best.gte(91)},
            done() {return player[this.layer].best.gte(92)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "6th Milestone's effect ^(meta-milestones^0.3).";
			},
        },
		{
			requirementDescription: "93rd Milestone",
            unlocked() {return player[this.layer].best.gte(92)},
            done() {return player[this.layer].best.gte(93)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "94th Milestone",
            unlocked() {return player[this.layer].best.gte(93)},
            done() {return player[this.layer].best.gte(94)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Prestige and Atomic-Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "95th Milestone",
            unlocked() {return player[this.layer].best.gte(94)},
            done() {return player[this.layer].best.gte(95)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock an Atomic-Prestige Challenge. Autobuy the first Hyper-Prestige buyable.";
			},
        },
		{
			requirementDescription: "96th Milestone",
            unlocked() {return player[this.layer].best.gte(95)},
            done() {return player[this.layer].best.gte(96)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.0005.";
			},
        },
		{
			requirementDescription: "97th Milestone",
            unlocked() {return player[this.layer].best.gte(96)},
            done() {return player[this.layer].best.gte(97)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "27th Milestone's effect ^(meta-milestones^0.4).";
			},
        },
		{
			requirementDescription: "98th Milestone",
            unlocked() {return player[this.layer].best.gte(97)},
            done() {return player[this.layer].best.gte(98)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "99th Milestone",
            unlocked() {return player[this.layer].best.gte(98)},
            done() {return player[this.layer].best.gte(99)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer.";
			},
        },
		{
			requirementDescription: "100th Milestone",
            unlocked() {return player[this.layer].best.gte(99)},
            done() {return player[this.layer].best.gte(100)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Prestige and Super-Prestige upgrades on Transcend";
			},
        },
		{
			requirementDescription: "101st Milestone",
            unlocked() {return player[this.layer].best.gte(100)},
            done() {return player[this.layer].best.gte(101)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Hyper-Prestige and Prestige Boost upgrades on Transcend";
			},
        },
		{
			requirementDescription: "102nd Milestone",
            unlocked() {return player[this.layer].best.gte(101)},
            done() {return player[this.layer].best.gte(102)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Atomic-Prestige upgrades on Transcend";
			},
        },
		{
			requirementDescription: "103rd Milestone",
            unlocked() {return player[this.layer].best.gte(102)},
            done() {return player[this.layer].best.gte(103)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Autocomplete AP challenge 1-5 3 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
			},
        },
		{
			requirementDescription: "104th Milestone",
            unlocked() {return player[this.layer].best.gte(103)},
            done() {return player[this.layer].best.gte(104)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted. Unlock a new layer. Unlock 4 new Transcend upgrades. Unlock a Hyper-Prestige buyable. Unlock a Transcend challenge.";
			},
        },
		{
			requirementDescription: "105th Milestone",
            unlocked() {return player[this.layer].best.gte(104)},
            done() {return player[this.layer].best.gte(105)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "1st milestone's softcap starts later based on your milestones. Currently: "+format(tmp.m.milestone105Effect)+"x later";
			},
        },
		{
			requirementDescription: "106th Milestone",
            unlocked() {return player[this.layer].best.gte(105)},
            done() {return player[this.layer].best.gte(106)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "6th and 27th milestone's effect ^(meta-milestones^0.5).";
			},
        },
		{
			requirementDescription: "107th Milestone",
            unlocked() {return player[this.layer].best.gte(106)},
            done() {return player[this.layer].best.gte(107)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Milestone's base effect exponent ^1.002. Autobuy the second Hyper-Prestige buyable.";
			},
        },
		{
			requirementDescription: "108th Milestone",
            unlocked() {return player[this.layer].best.gte(107)},
            done() {return player[this.layer].best.gte(108)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Autocomplete AP challenge 1-5 6 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
			},
        },
		{
			requirementDescription: "109th Milestone",
            unlocked() {return player[this.layer].best.gte(108)},
            done() {return player[this.layer].best.gte(109)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is boosted. Unlock a Transcend challenge.";
			},
        },
		{
			requirementDescription: "110th Milestone",
            unlocked() {return player[this.layer].best.gte(109)},
            done() {return player[this.layer].best.gte(110)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain 0.2% of Transcend Point gain per second. Transcend challenge 1's base goal is decreased to x^2. You can complete an AP challenge without exiting it.";
			},
        },
		{
			requirementDescription: "111th Milestone",
            unlocked() {return player[this.layer].best.gte(110)},
            done() {return player[this.layer].best.gte(111)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Hyper Boost doesn't reset anything. Prestige boost is cheaper, and Unlock a new row of Prestige Boost upgrades. Unlock a new row of Transcend upgrades.";
			},
        },
		{
			requirementDescription: "112th Milestone",
            unlocked() {return player[this.layer].best.gte(111)},
            done() {return player[this.layer].best.gte(112)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Transcend Challenge 2's reward is enabled while you're in Transcend Challenge 2.";
			},
        },
		{
			requirementDescription: "113th Milestone",
            unlocked() {return player[this.layer].best.gte(112)},
            done() {return player[this.layer].best.gte(113)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 0.3% of Transcend Point gain per second (total 0.5%). 6th and 27th milestone's effect ^(meta-milestones^0.3).";
			},
        },
		{
			requirementDescription: "114th Milestone",
            unlocked() {return player[this.layer].best.gte(113)},
            done() {return player[this.layer].best.gte(114)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Autocomplete AP challenge 1-5 9 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
			},
        },
		{
			requirementDescription: "115th Milestone",
            unlocked() {return player[this.layer].best.gte(114)},
            done() {return player[this.layer].best.gte(115)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 0.5% of Transcend Point gain per second (total 1%). Unlock a Transcend challenge.";
			},
        },
		{
			requirementDescription: "116th Milestone",
            unlocked() {return player[this.layer].best.gte(115)},
            done() {return player[this.layer].best.gte(116)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 1% of Transcend Point gain per second (total 2%). Autoget Hyper Boosts.";
			},
        },
		{
			requirementDescription: "117th Milestone",
            unlocked() {return player[this.layer].best.gte(116)},
            done() {return player[this.layer].best.gte(117)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 3% of Transcend Point gain per second (total 5%). Prestige boost is cheaper.";
			},
        },
		{
			requirementDescription: "118th Milestone",
            unlocked() {return player[this.layer].best.gte(117)},
            done() {return player[this.layer].best.gte(118)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 5% of Transcend Point gain per second (total 10%). 4th Milestone is boosted.";
			},
        },
		{
			requirementDescription: "119th Milestone",
            unlocked() {return player[this.layer].best.gte(118)},
            done() {return player[this.layer].best.gte(119)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 10% of Transcend Point gain per second (total 20%). Hyper boost is cheaper.";
			},
        },
		{
			requirementDescription: "120th Milestone",
            unlocked() {return player[this.layer].best.gte(119)},
            done() {return player[this.layer].best.gte(120)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 10% of Transcend Point gain per second (total 30%). AP challenge 1-5 goals are reduced, and you can complete an AP challenge a non-integer number of times.";
			},
        },
		{
			requirementDescription: "121st Milestone",
            unlocked() {return player[this.layer].best.gte(120)},
            done() {return player[this.layer].best.gte(121)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Autocomplete AP challenge 1-5 12 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
			},
        },
		{
			requirementDescription: "122nd Milestone",
            unlocked() {return player[this.layer].best.gte(121)},
            done() {return player[this.layer].best.gte(122)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "AP challenge 4 (Reduced Points)'s formula is changed. AP challenge 2 (No Super-Prestige) completions past-5 add the reward by 0.015 each instead of 0.01.";
			},
        },
		{
			requirementDescription: "123rd Milestone",
            unlocked() {return player[this.layer].best.gte(122)},
            done() {return player[this.layer].best.gte(123)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 15% of Transcend Point gain per second (total 45%). Unlock a Prestige buyable.";
			},
        },
		{
			requirementDescription: "124th Milestone",
            unlocked() {return player[this.layer].best.gte(123)},
            done() {return player[this.layer].best.gte(124)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new row of Prestige upgrades. Autobuy the first Prestige buyable.";
			},
        },
		{
			requirementDescription: "125th Milestone",
            unlocked() {return player[this.layer].best.gte(124)},
            done() {return player[this.layer].best.gte(125)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer. Reset on this layer doesn't reset anything. This layer doesn't reset on all resets except 7th row reset. Unlock a Transcend Challenge. Unlock a new row of Transcend upgrades.";
			},
        },
		{
			requirementDescription: "126th Milestone",
            unlocked() {return player[this.layer].best.gte(125)},
            done() {return player[this.layer].best.gte(126)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Auto-collect Prestige Energy.";
			},
        },
		{
			requirementDescription: "127th Milestone",
            unlocked() {return player[this.layer].best.gte(126)},
            done() {return player[this.layer].best.gte(127)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 15% of Transcend Point gain per second (total 60%). Unlock a new row of Super-Prestige upgrades.";
			},
        },
		{
			requirementDescription: "128th Milestone",
            unlocked() {return player[this.layer].best.gte(127)},
            done() {return player[this.layer].best.gte(128)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Transcend Upgrade 54 is boosted. Unlock an AP challenge.";
			},
        },
		{
			requirementDescription: "129th Milestone",
            unlocked() {return player[this.layer].best.gte(128)},
            done() {return player[this.layer].best.gte(129)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a Super-Prestige buyable.";
			},
        },
		{
			requirementDescription: "130th Milestone",
            unlocked() {return player[this.layer].best.gte(129)},
            done() {return player[this.layer].best.gte(130)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 20% of Transcend Point gain per second (total 80%). Autobuy the second Super-Prestige buyable. AP challenge 1-3 and 6 goals are reduced. Unlock a new tab in Transcend.";
			},
        },
		{
			requirementDescription: "131st Milestone",
            unlocked() {return player[this.layer].best.gte(130)},
            done() {return player[this.layer].best.gte(131)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Autocomplete AP challenge 1-5 15 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
			},
        },
		{
			requirementDescription: "132nd Milestone",
            unlocked() {return player[this.layer].best.gte(131)},
            done() {return player[this.layer].best.gte(132)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "The second Super-Prestige buyable's effect is better. Unlock a new row of Prestige Boost upgrades.";
			},
        },
		{
			requirementDescription: "133rd Milestone",
            unlocked() {return player[this.layer].best.gte(132)},
            done() {return player[this.layer].best.gte(133)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Gain additional 20% of Transcend Point gain per second (total 100%). The 105th milestone's effect ^1.2";
			},
        },
		{
			requirementDescription: "134th Milestone",
            unlocked() {return player[this.layer].best.gte(133)},
            done() {return player[this.layer].best.gte(134)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Hyper Boost upgrades on Transcend.";
			},
        },
		{
			requirementDescription: "135th Milestone",
            unlocked() {return player[this.layer].best.gte(134)},
            done() {return player[this.layer].best.gte(135)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "20th Milestone, 57th Milestone, 75th Milestone and 90th Milestone's effects are 1e12%.";
			},
        },
		{
			requirementDescription: "136th Milestone",
            unlocked() {return player[this.layer].best.gte(135)},
            done() {return player[this.layer].best.gte(136)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new row of Transcend Upgrades. AP challenge 5's goal is reduced.";
			},
        },
		{
			requirementDescription: "137th Milestone",
            unlocked() {return player[this.layer].best.gte(136)},
            done() {return player[this.layer].best.gte(137)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a Transcend Challenge. Transcend's requirement is 1e640 instead of 1e850 (doesn't affect Transcend Point gain).";
			},
        },
		{
			requirementDescription: "138th Milestone",
            unlocked() {return player[this.layer].best.gte(137)},
            done() {return player[this.layer].best.gte(138)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "AP challenge 2 (No Super-Prestige) completions past-5 add the reward by 0.02 each instead of 0.015.";
			},
        },
		{
			requirementDescription: "139th Milestone",
            unlocked() {return player[this.layer].best.gte(138)},
            done() {return player[this.layer].best.gte(139)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Base effect formulas of 4th, 6th and 27th milestones are better (linear -> exponential).";
			},
        },
		{
			requirementDescription: "140th Milestone",
            unlocked() {return player[this.layer].best.gte(139)},
            done() {return player[this.layer].best.gte(140)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep AP challenge completions on Transcend (per T challenge, AP challenge completions will reset on 7th row reset). You can complete a T challenge without exiting it. Unlock a new layer.";
			},
        },
		{
			requirementDescription: "141st Milestone",
            unlocked() {return player[this.layer].best.gte(140)},
            done() {return player[this.layer].best.gte(141)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "AP challenge 6's goal is reduced.";
			},
        },
		{
			requirementDescription: "142nd Milestone",
            unlocked() {return player[this.layer].best.gte(141)},
            done() {return player[this.layer].best.gte(142)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new row of Hyper-Prestige Upgrades.";
			},
        },
		{
			requirementDescription: "143rd Milestone",
            unlocked() {return player[this.layer].best.gte(142)},
            done() {return player[this.layer].best.gte(143)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "The 105th milestone's effect ^1.1";
			},
        },
		{
			requirementDescription: "144th Milestone",
            unlocked() {return player[this.layer].best.gte(143)},
            done() {return player[this.layer].best.gte(144)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "AP challenge 2 (No Super-Prestige) completions past-5 add the reward by 0.025 each instead of 0.02.";
			},
        },
		{
			requirementDescription: "145th Milestone",
            unlocked() {return player[this.layer].best.gte(144)},
            done() {return player[this.layer].best.gte(145)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "You can complete AP Challenge 1-3 outside of it.";
			},
        },
        {
			requirementDescription: "146th Milestone",
            unlocked() {return player[this.layer].best.gte(145)},
            done() {return player[this.layer].best.gte(146)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock more Super Energy upgrades.";
			},
        },
        {
			requirementDescription: "147th Milestone",
            unlocked() {return player[this.layer].best.gte(146)},
            done() {return player[this.layer].best.gte(147)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "You can complete T Challenge 1-2 outside of it.";
			},
        },
        {
			requirementDescription: "148th Milestone",
            unlocked() {return player[this.layer].best.gte(147)},
            done() {return player[this.layer].best.gte(148)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Double Super-Energy gain.";
			},
        },
        {
			requirementDescription: "149th Milestone",
            unlocked() {return player[this.layer].best.gte(148)},
            done() {return player[this.layer].best.gte(149)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Double Super-Energy gain.";
			},
        },
        {
			requirementDescription: "150th Milestone",
            unlocked() {return player[this.layer].best.gte(149)},
            done() {return player[this.layer].best.gte(150)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "You can complete AP Challenge 5-6 outside of it.";
			},
        },
        {
			requirementDescription: "151st Milestone",
            unlocked() {return player[this.layer].best.gte(150)},
            done() {return player[this.layer].best.gte(151)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer.";
			},
        },
        {
			requirementDescription: "152nd Milestone",
            unlocked() {return player[this.layer].best.gte(151)},
            done() {return player[this.layer].best.gte(152)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Double Super-Energy gain.";
			},
        },
        {
			requirementDescription: "153rd Milestone",
            unlocked() {return player[this.layer].best.gte(152)},
            done() {return player[this.layer].best.gte(153)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Prestige upgrades on PP reset.";
			},
        },
        {
			requirementDescription: "154th Milestone",
            unlocked() {return player[this.layer].best.gte(153)},
            done() {return player[this.layer].best.gte(154)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Power Scaler's effect is boosted by Prestige Power amount.<br>Currently: " + format(tmp.m.milestone154Effect) + "x";
			},
        },
        {
			requirementDescription: "155th Milestone",
            unlocked() {return player[this.layer].best.gte(154)},
            done() {return player[this.layer].best.gte(155)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock More Prestige Power upgrades";
			},
        },
        {
			requirementDescription: "156th Milestone",
            unlocked() {return player[this.layer].best.gte(155)},
            done() {return player[this.layer].best.gte(156)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Requirement for Special Points is 1e400";
			},
        },
        {
			requirementDescription: "157th Milestone",
            unlocked() {return player[this.layer].best.gte(156)},
            done() {return player[this.layer].best.gte(157)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Passively generate 30% of Prestige Power gain";
			},
        },
         {
			requirementDescription: "158th Milestone",
            unlocked() {return player[this.layer].best.gte(157)},
            done() {return player[this.layer].best.gte(158)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock an Atomic Prestige challenge.";
			},
        },
		{
			requirementDescription: "159th Milestone",
            unlocked() {return player[this.layer].best.gte(158)},
            done() {return player[this.layer].best.gte(159)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock last row of Prestige Power upgrades.";
			},
        },
		{
			requirementDescription: "160th Milestone",
            unlocked() {return player[this.layer].best.gte(159)},
            done() {return player[this.layer].best.gte(160)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer.";
			},
        },
		{
			requirementDescription: "161st Milestone",
            unlocked() {return player[this.layer].best.gte(160)},
            done() {return player[this.layer].best.gte(161)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock an Atomic Prestige buyable.";
			},
        },
		{
			requirementDescription: "162nd Milestone",
            unlocked() {return player[this.layer].best.gte(161)},
            done() {return player[this.layer].best.gte(162)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Keep Prestige Power upgrades on Exotic Prestige reset.";
			},
        },
		{
			requirementDescription: "163rd Milestone",
            unlocked() {return player[this.layer].best.gte(162)},
            done() {return player[this.layer].best.gte(163)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Power Scaler is ^1.5 better.";
			},
        },
		{
			requirementDescription: "164th Milestone",
            unlocked() {return player[this.layer].best.gte(163)},
            done() {return player[this.layer].best.gte(164)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Power Scaler is ^1.5 better.";
			},
        },
		{
			requirementDescription: "165th Milestone",
            unlocked() {return player[this.layer].best.gte(164)},
            done() {return player[this.layer].best.gte(165)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "1st Exotic Effect is better.";
			},
        },
		{
			requirementDescription: "166th Milestone",
            unlocked() {return player[this.layer].best.gte(165)},
            done() {return player[this.layer].best.gte(166)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "2nd Exotic Effect is better.";
			},
        },
		{
			requirementDescription: "167th Milestone",
            unlocked() {return player[this.layer].best.gte(166)},
            done() {return player[this.layer].best.gte(167)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "1st Exotic Effect is better.";
			},
        },
		{
			requirementDescription: "168th Milestone",
            unlocked() {return player[this.layer].best.gte(167)},
            done() {return player[this.layer].best.gte(168)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "1st Exotic Effect is better.";
			},
        },
		{
			requirementDescription: "169th Milestone",
            unlocked() {return player[this.layer].best.gte(168)},
            done() {return player[this.layer].best.gte(169)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Increase the hardcap of Transcend Points 1e70 => 1e90.";
			},
        },
		{
			requirementDescription: "170th Milestone",
            unlocked() {return player[this.layer].best.gte(169)},
            done() {return player[this.layer].best.gte(170)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Autoget Extra-Milestones.";
			},
        },
		{
			requirementDescription: "171st Milestone",
            unlocked() {return player[this.layer].best.gte(170)},
            done() {return player[this.layer].best.gte(171)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Exotic Effect is x1.3 better.";
			},
        },
		{
			requirementDescription: "172nd Milestone",
            unlocked() {return player[this.layer].best.gte(171)},
            done() {return player[this.layer].best.gte(172)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "3rd Exotic Effect is x1.1 better.";
			},
        },
		{
			requirementDescription: "173rd Milestone",
            unlocked() {return player[this.layer].best.gte(172)},
            done() {return player[this.layer].best.gte(173)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Exotic Effect is ^1.05 better.";
			},
        },
		{
			requirementDescription: "174th Milestone",
            unlocked() {return player[this.layer].best.gte(173)},
            done() {return player[this.layer].best.gte(174)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Hyper-Prestige inflation starts ^0.1 earlier, Milestone Overflow starts 2 later.";
			},
        },
		{
			requirementDescription: "175th Milestone",
            unlocked() {return player[this.layer].best.gte(174)},
            done() {return player[this.layer].best.gte(175)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Automate Challenge Slayer buyable.";
			},
        },
		{
			requirementDescription: "176th Milestone",
            unlocked() {return player[this.layer].best.gte(175)},
            done() {return player[this.layer].best.gte(176)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Milestone Overflow Scale starts 1 later.";
			},
        },
		{
			requirementDescription: "177th Milestone",
            unlocked() {return player[this.layer].best.gte(176)},
            done() {return player[this.layer].best.gte(177)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Milestone Overflow Scale starts 1 later.";
			},
        },
		{
			requirementDescription: "178th Milestone",
            unlocked() {return player[this.layer].best.gte(177)},
            done() {return player[this.layer].best.gte(178)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock last Atomic Prestige Challenge and a row of Hyper Boost Upgrades.";
			},
        },
        {
			requirementDescription: "179th Milestone",
            unlocked() {return player[this.layer].best.gte(178)},
            done() {return player[this.layer].best.gte(179)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Exotic Booster effect is better by Milestones amount<b> After Overflow</b> and Exotic Prestige Points amount.<br>Currently: " + format(tmp.m.milestone179Effect) + "x";
			},
        },
        {
			requirementDescription: "180th Milestone",
            unlocked() {return player[this.layer].best.gte(179)},
            done() {return player[this.layer].best.gte(180)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "<b>Challenge Slayer'</b> effect is better.";
			},
        },
        {
			requirementDescription: "181st Milestone",
            unlocked() {return player[this.layer].best.gte(180)},
            done() {return player[this.layer].best.gte(181)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a new layer.";
			},
        },
        {
			requirementDescription: "182nd Milestone",
            unlocked() {return player[this.layer].best.gte(181)},
            done() {return player[this.layer].best.gte(182)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Add Exotic Fusioner Tier to 179th milestone effect.";
			},
        },
        {
			requirementDescription: "183rd Milestone",
            unlocked() {return player[this.layer].best.gte(182)},
            done() {return player[this.layer].best.gte(183)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock a Multiverse Challenge.";
			},
        },
        {
			requirementDescription: "184th Milestone",
            unlocked() {return player[this.layer].best.gte(183)},
            done() {return player[this.layer].best.gte(184)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "<b>Unlock another Multiverse Challenge.";
			},
        },
        {
			requirementDescription: "185th Milestone",
            unlocked() {return player[this.layer].best.gte(184)},
            done() {return player[this.layer].best.gte(185)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "<b>Unlock Prestige Milestone Tree.";
			},
        },
	    {
			requirementDescription: "186th Milestone",
            unlocked() {return hasMalware('m',16)},
            done() {return player[this.layer].best.gte(186)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return `<b>Prestige Ashes boosts Prestige Essences effect.<br>Currently: ^${format(this.effect())}`;
			},
			effect() {
				let eff = player.sp.ambers.max(1).log(10).pow(0.675).add(1)
				return eff
			},
    	},
	    {
			requirementDescription: "187th Milestone",
            unlocked() {return player[this.layer].best.gte(187)},
            done() {return player[this.layer].best.gte(187)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return `<b>Unlock a new layer in Prestige Universe.`;
			},
						style() {
				if (player[this.layer].best.gte(187)) return {
                    'background':'green',
					'color':"white",
					'animation':" 3s cubic-bezier(0.4, 0, 1, 1) 0s infinite normal none running rank_milestone",
                    'width': '100%',
                }
			},
    	},
	],
	milestone4EffectExponent(){
		if(player.m.best.gte(118))return 0.8;
		if(player.m.best.gte(109))return 0.76;
		if(player.m.best.gte(104))return 0.75;
		if(player.m.best.gte(98))return 0.72;
		if(player.m.best.gte(93))return 0.7;
		if(player.m.best.gte(88))return 0.67;
		if(player.m.best.gte(83))return 0.66;
		if(player.m.best.gte(78))return 0.6426;
		if(player.m.best.gte(73))return 0.62;
		if(player.m.best.gte(68))return 0.61;
		if(player.m.best.gte(63))return 0.5875;
		if(player.m.best.gte(58))return 0.57;
		if(player.m.best.gte(53))return 0.5687;
		if(player.m.best.gte(48))return 0.55;
		if(player.m.best.gte(43))return 0.533;
		return 0.5;
	},
	milestone4Effect(){
		if(player.m.best.gte(139)){
			return Decimal.pow(1.05,player.m.best).pow(layers.m.milestone4EffectExponent()).mul(hasUpgrade('se', 21)?upgradeEffect('se', 21):1).mul(hasUpgrade('ep', 11)?upgradeEffect('ep', 11):1);
		}
		return player.m.best.sub(2).pow(layers.m.milestone4EffectExponent());
	},
	milestone3Effect(){
		if(player.ap.activeChallenge==21 || player.ap.activeChallenge==41 ||((player.mp.activeChallenge==21)&&(player.pm.activeChallenge==11)))return new Decimal(1);
		var m=Decimal.log10(player.points.add(20)).pow(0.9);
		if(player.m.best.gte(41))m=m.pow(1.003);
		if(player.m.best.gte(46))m=m.pow(1.001);
		if(player.m.best.gte(51))m=m.pow(1.00175);
		if(player.m.best.gte(56))m=m.pow(1.00078);
		if(player.m.best.gte(61))m=m.pow(1.0005);
		if(player.m.best.gte(66))m=m.pow(1.0005);
		if(player.m.best.gte(71))m=m.pow(1.001236);
		if(player.m.best.gte(76))m=m.pow(1.00157);
		if(player.m.best.gte(81))m=m.pow(1.0005);
		if(player.m.best.gte(86))m=m.pow(1.0005);
		if(player.m.best.gte(91))m=m.pow(1.0005);
		if(player.m.best.gte(96))m=m.pow(1.0005);
		if(player.m.best.gte(107))m=m.pow(1.002);//0.91298476860857272607902105461039
        if(player.em.best.gte(2))m=m.pow(1.01);
		var b=new Decimal(2);
		if(player.m.best.gte(4)){
			b=b.add(layers.m.milestone4Effect());
		}
		if(player.m.best.gte(16))m=m.mul(1.016);
		if(player.m.best.gte(17))m=m.mul(1.017);
		if(player.m.best.gte(18))m=m.mul(1.018);
		if(player.m.best.gte(19))m=m.mul(1.019);
		if(player.m.best.gte(36))m=m.mul(1.036);
		if(player.m.best.gte(37))m=m.mul(1.037);
		if(player.m.best.gte(38))m=m.mul(1.038);
		if(player.m.best.gte(39))m=m.mul(1.039);
		if(hasUpgrade("t",11))m=m.mul(1.005);
		if(hasUpgrade("t",23))m=m.mul(1.005);
		if(hasUpgrade("t",31))m=m.mul(1.005);
		m=m.mul(layers.t.getSpecialEffect(11));
		if(hasUpgrade("pb",42))m=m.mul(upgradeEffect("pb",42));
		if(hasUpgrade("p",23)){
			b=b.mul(player.p.points.add(1e20).log10().add(1).log10().div(player.m.best.gte(23)?28:30).add(1));
		}
		if(hasUpgrade("p",24)){
			b=b.mul(player.p.points.add(1e20).log10().log10().div(player.m.best.gte(24)?20:30).add(1));
		}
		if(hasUpgrade("sp",24)){
			b=b.mul(player.sp.points.add(1e20).log10().log10().div(30).add(1));
		}
		if(player.mm.best.gte(5)){
			b=b.mul(player.mm.best.sub(2).max(1).pow(0.5).div(75).add(1));
		}
		if(player.mm.best.gte(10)){
			b=b.mul(player.mm.best.sub(2).max(1).pow(0.5).div(100).add(1));
		}
		if(player.mm.best.gte(15)){
			b=b.mul(player.mm.best.sub(2).max(1).pow(0.5).div(125).add(1));
		}
		if(player.mm.best.gte(20)){
			b=b.mul(player.mm.best.sub(2).max(1).pow(0.5).div(150).add(1));
		}
	b=b.mul(Decimal.pow(1.05,player.ap.challenges[21]+player.ap.challenges[22]+player.t.challenges[11]+player.t.challenges[21]+player.t.challenges[31]));
		if(player.ap.challenges[21]>=1)b=b.mul(1.1/1.05);
		if(player.ap.challenges[22]>=1)b=b.mul(1.06/1.05);
		if(player.ap.challenges[21]>=5)b=b.mul(1.1/1.05);
		if(player.t.challenges[11]>=3)b=b.mul(1.05);
		if(player.ap.challenges[21]>=10)b=b.mul(1.1);
		if(player.ap.challenges[22]>=9)b=b.mul(1.1);
		if(hasUpgrade("p",41)){
			b=b.mul(player.p.points.add(1e20).log10().log10().div(30).add(1));
		}
		if(hasUpgrade("p",42)){
			b=b.mul(player.p.points.add(1e20).log10().log10().div(30).add(1));
		}
		if(hasUpgrade("sp",41)){
			b=b.mul(player.sp.points.add(1e20).log10().log10().div(30).add(1));
		}
		if(hasUpgrade("sp",42)){
			b=b.mul(player.sp.points.add(1e20).log10().log10().div(30).add(1));
		}
		if (player.pm.activeChallenge==12||player.pm.activeChallenge==13) b=b.add(1).log2().add(1).log(5).pow(1.5)
			if(hasUpgrade("p",23)&&(inChallenge("pm",13))){
				b=b.mul(player.p.points.add(1e50).log2().add(1).log2().div(player.m.best.gte(23)?28:30).add(1));
			}
		return Decimal.pow(b,m);
	},
	milestone6Effect(){
		var p=player.m.best;
		if(player.m.best.gte(139)){
			p=Decimal.pow(1.05,p);
		}
		if(player.m.best.gte(7))p=p.pow(1.5);
		if(player.m.best.gte(8))p=p.pow(1.2);
		if(player.m.best.gte(9))p=p.pow(1.1);
		if(hasUpgrade("p",21))p=p.pow(1.5);
		if(hasUpgrade("p",22))p=p.pow(1.5);
		if(player.m.best.gte(35))p=p.pow(3.5);
		if(hasUpgrade("sp",23))p=p.pow(player.mm.best.add(2+(hasAchievement('ach',21)?achievementEffect('ach',21):0)));
		if(player.m.best.gte(42))p=p.pow(player.mm.best.add(1));
		if(player.m.best.gte(52))p=p.pow(player.mm.best.pow(0.1).add(1));
		if(player.mm.best.gte(9))p=p.pow(1.5);
		if(player.m.best.gte(62))p=p.pow(player.mm.best.pow(0.129));
		if(player.mm.best.gte(13))p=p.pow(1.2);
		if(player.m.best.gte(72))p=p.pow(player.mm.best.pow(0.1));
		if(player.mm.best.gte(14))p=p.pow(1.2);
		if(player.m.best.gte(82))p=p.pow(player.mm.best.pow(0.2));
		if(player.mm.best.gte(17))p=p.pow(1.7);
		if(player.m.best.gte(92))p=p.pow(player.mm.best.pow(0.3));
		if(player.m.best.gte(106))p=p.pow(player.mm.best.pow(0.5));
		if(player.m.best.gte(113))p=p.pow(player.mm.best.pow(0.3));
        if (player.m.best.gte(156))p=p.pow(player.mm.best.pow(layers.t.getSpecialEffect(32)))
			if (hasMalware("m",5)) p=p.pow(1e10)
			if(hasUpgrade("p",25))p=p.pow(upgradeEffect("p",25));
		if(hasMalware("m",6))p=p.pow(1.35);
		return softcap(p,new Decimal('ee10'), 0.15);
	},
	milestone27Effect(){
		var p=player.m.best;
		if(player.m.best.gte(139)){
			p=Decimal.pow(1.05,p);
		}
		if(player.m.best.gte(28))p=p.pow(1.5);
		if(player.m.best.gte(29))p=p.pow(1.2);
		if(hasUpgrade("sp",23))p=p.pow(player.mm.best.add(2));
		if(player.mm.best.gte(2))p=p.pow(2);
		if(player.mm.best.gte(3))p=p.pow(2);
		if(player.mm.best.gte(4))p=p.pow(2);
		if(player.m.best.gte(47))p=p.pow(player.mm.best.pow(0.25).add(1));
		if(player.mm.best.gte(6))p=p.pow(1.5);
		if(player.mm.best.gte(7))p=p.pow(1.5);
		if(player.mm.best.gte(8))p=p.pow(1.5);
		if(player.mm.best.gte(11))p=p.pow(1.2);
		if(player.mm.best.gte(12))p=p.pow(1.2);
		if(player.m.best.gte(67))p=p.pow(player.mm.best.pow(0.147));
		if(player.mm.best.gte(16))p=p.pow(1.2);
		if(player.m.best.gte(87))p=p.pow(player.mm.best.pow(0.3));
		if(player.mm.best.gte(18))p=p.pow(1.8);
		if(player.mm.best.gte(19))p=p.pow(1.9);
		if(player.m.best.gte(97))p=p.pow(player.mm.best.pow(0.4));
		if(player.m.best.gte(106))p=p.pow(player.mm.best.pow(0.5));
		if(player.m.best.gte(113))p=p.pow(player.mm.best.pow(0.3));
		return p;
	},
	milestone105Effect(){
		var p=player.m.best.div(100);
		if(player.m.best.gte(133))p=p.pow(1.2);
		if(player.m.best.gte(143))p=p.pow(1.1);
		return p;
	},
    milestone154Effect(){
		var p=player.pp.points;
		if(player.m.best.gte(152)){
			p=Decimal.mul(0.1,p).add(1).pow(0.85);
		}
        if (hasUpgrade('pp', 21)) {
            p=p.pow(layers.t.getSpecialEffect(31));   
        }
		p=p.mul(tmp.ap.challenges[41].rewardEffect).max(1);
		p = softcap(p,new Decimal('1e800'),0.1)
		return softcap(p,new Decimal('1e1000'),0.01);
	},
    milestone179Effect(){
		var p=player.m.best.add(player.m.best.gte(182)?player.ep.buyables[11]:0).sub(getCostOverflowStart()).pow(25).pow(player.ep.points.add(1).log10().add(1).log(2)).max(1);
		if((player.ap.activeChallenge==42)) return new Decimal(1)
		if (hasUpgrade('ep',12)) p = p.pow(upgradeEffect('ep',12))
		p = softcap(p,new Decimal('1e800'),0.1)
		
		return softcap(p,new Decimal('1e1000'),0.01);
	},
    resetDescription: "Get ",
	doReset(){},
	tabFormat: ["main-display","prestige-button","resource-display",
				["display-text",function(){if (!hasUpgrade('mp',14)) return "Milestone cost scaling starts at "+format(tmp.m.getScalingStart,4)}],
				["display-text",function(){return "Milestone cost exponent is "+format(tmp.m.exponent,4)}],
				["display-text",function(){if (player.pm.essence.gte(1)&&player.pm.best.gte(15)){
					let prEsEffect=tmp.pm.essenceBoost.pow(1e19).pow(hasUpgrade("ex",11)?upgradeEffect("ex",11):1)
					if (hasMilestone('m',185)) prEsEffect = prEsEffect.pow(milestoneEffect('m',185))
					return "Prestige Essences boosts points after softcap by "+format(prEsEffect,4)+"x"}}],
				"milestones"
				],
})