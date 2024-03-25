addLayer("pm", {
    name: "prestige-milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        essence: new Decimal(0),
        best: new Decimal(0),
        challengeTimer: new Decimal(0),
    }},
    color: "#f71c50",
    requires(){
		let b=new Decimal(25);
		return b;
	}, // Can be a function that takes requirement increases into account
    resource: "prestige milestones", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gain() {
        let gain = new Decimal(0)
        if (player.pm.best.gte(1)) gain=gain.add(tmp.pm.reduce)
        if (player.mp.modeE==true) gain = gain.mul((buyableEffect('mp',22).eff))
        if (player.pm.best.gte(4)) gain = gain.mul(tmp.pm.pMilestone4Effect)
        if (player.pep.buyables[11].gte(1)) gain = gain.mul(tmp.pep.prOneEffect)
        if (player.cp.formatted.gte(1)) gain = gain.mul(corruptEffect())
        let s = new Decimal(1)
        for(var i in player.cp.grid) {
            if (getGridData("cp", i).active==true && getGridData("cp", i).type=='pm') s=(gridEffect('cp',i).gte(s)?gridEffect('cp',i):s)
          }
        if (player.pm.activeChallenge==11) gain = gain.pow(0.3*(player.pm.challengeTimer.add(1).log10()))
        if (challengeCompletions('pm',11)>=1) gain = gain.mul(challengeEffect('pm',11))
        return gain.div(s).max(1)
    },
    reduce() {
		let base = 0.5
		if (player.mp.buyables[23].gte(1)) base += buyableEffect('mp',23).toNumber()
		let eff=player.mp.points.add(1).log2().pow(base)
		if (player.pm.best.gte(3)) eff = eff.mul(5)
        if (player.pep.buyables[11].gte(1)) eff = eff.mul(tmp.pep.prOneEffect.pow(0.5))
        return eff.max(1)
	},
    essenceBoost() {
        let eff = player.pm.essence.add(1).log2().pow(2).mul(0.1)
        eff = eff.mul(buyableEffect('mp',22).eff)
        if (player.mp.modeP==true) eff = eff.mul((buyableEffect('mp',22).eff).div(2).add(3))
        if (player.pm.activeChallenge==11) eff = eff.mul(1.5*(player.pm.challengeTimer.add(1).log10()))
        return eff.max(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    newRow: 0,
    row:0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(12),
	exponent: function(){
        if (player.pm.points.gte(9)) return player.pm.points.div(10).add(0.31)
        if (player.pm.points.gte(7)) return new Decimal(1.25)
		else return new Decimal(1)
	},
    hotkeys: [
        {key: "ctrl+p", description: "Ctrl+P: Get Prestige Milestone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.mp.activeChallenge==21)},
	resetsNothing(){return true},
	milestones: [
		{
			requirementDescription: "1st Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Get prestige essence/s based on how much points gain was reduced."
			},
        },
        {
			requirementDescription: "2nd Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock more Multiverse Fusioners."
			},
        },
        {
			requirementDescription: "3rd Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Make 1st milestone reducing effect 5.00x stronger."
			},
        },
        {
			requirementDescription: "4th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(3)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Points affects prestige essence gain. Currently: "+format(tmp.pm.pMilestone4Effect)+"x"
			},
        },
        {
			requirementDescription: "5th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(4)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Prestigify Exotic Prestige Points. (Unlock the layer again but with new content)"
			},
            style() {
                if (hasMilestone('pm',4)) return {
                    'background':'#3C2D15',
                    'border-color':'#c89646',
                    'color':'#c89646',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription: "6th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(5)},
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock a new layer."
			},
            style() {
                if (hasMilestone('pm',5)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription: "7th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(6)},
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock 1 more upgrade on row 1 layers."
			},
            style() {
                if (hasMilestone('pm',6)) return {
                    'background':'linear-gradient(to right, #00520b 0%, #3C2D15 50%)',
                    'border-color':'transparent',
                    'background-color':'transparent',
                    'border-image':'linear-gradient(to right, lime 0%, lime 20%,#c89646 50%)',
                    'color':'white',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription: "8th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(7)},
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock 1 more upgrade on row 1 layers."
			},
            style() {
                if (hasMilestone('pm',7)) return {
                    'background':'linear-gradient(to right, #00520b 0%, #3C2D15 50%)',
                    'border-color':'transparent',
                    'background-color':'transparent',
                    'border-image':'linear-gradient(to right, lime 0%, lime 20%,#c89646 50%)',
                    'color':'white',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription: "9th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(8)},
            done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Massively reduce post-15th level Trojan corruption goals and slightly reduce Backdoor corruption goals."
			},
            style() {
                if (hasMilestone('pm',8)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription: "10th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(9)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock Corruption Milestones."
			},
            style() {
                if (hasMilestone('pm',9)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription: "11st Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(10)},
            done() {return player[this.layer].best.gte(11)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock 1 more upgrade on row 1 layers."
			},
            style() {
                if (hasMilestone('pm',10)) return {
                    'background':'linear-gradient(to right, #00520b 0%, #3C2D15 50%)',
                    'border-color':'transparent',
                    'background-color':'transparent',
                    'border-image':'linear-gradient(to right, lime 0%, lime 20%,#c89646 50%)',
                    'color':'white',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription: "12nd Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(11)},
            done() {return player[this.layer].best.gte(12)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Scaled Essence Fusioners starts +"+format(tmp.pm.pMilestone11Effect,3)+" later based on Prestige Essence.<br>Unlock Prestige Universe Challenges."
			},
            style() {
                if (hasMilestone('pm',11)) return {
                    'background':'linear-gradient(to right, #00520b 0%, #3C2D15 50%)',
                    'border-color':'transparent',
                    'background-color':'transparent',
                    'border-image':'linear-gradient(to right, lime 0%, lime 20%,#c89646 50%)',
                    'color':'white',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
	],
    challenges: {
        11:{
            levelScale() {
                let scale= new Decimal(35).add(new Decimal(5).mul(challengeCompletions('pm',11)))
                return scale
            },
            onEnter() {
                player.pm.essence=new Decimal(0)
                player.points=new Decimal(0)
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].level<1 && x!=101)
                player.cp.grid[slots[0]] = {level: this.levelScale(),active:true,fixed:false,type:"div"}
            },
            onExit() {
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].active==true)
                player.cp.grid[slots[0]] = {level:0,active:false,fixed:false,type:"div"}       
                player.pm.challengeTimer = new Decimal(0)
            },
            name: "Corrupted Essences",
            completionLimit: new Decimal(5),
            challengeDescription() {return (player.pm.activeChallenge==11?"You spent "+formatTime(player.pm.challengeTimer)+" in this challenge.":"")+ "<br>You are trapped in Level " + format(this.levelScale()) + " Trojan Corruption, Prestige Essences gain formula is much weaker, but increases over time."+"<br>"+format(challengeCompletions(this.layer, this.id)) +"/5 completions"},
            unlocked() { return player.pm.best.gte(12) },
            goal: function(){
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].active==true)
                if(player.m.best.gte(130)&&player.pm.activeChallenge==11 && slots.length>0)return gridCost('cp',slots)
else return new Decimal(1)
            },
            canComplete(){
                return player.points.gte(tmp.pm.challenges[this.id].goal);
            },
            rewardEffect() {
                let ret = 7.39**(player.pm.challenges[11]+1)
                return ret
            },
            goalDescription() {return "Goal: Fix the corruption"+(player.pm.activeChallenge==11?" (Reach "+format(this.goal())+" Points in this challenge)":"")},
            currencyDisplayName: "Points",
            rewardDescription() { return "Multiply Prestige Essences gain.<br>Currently: "+format(challengeEffect('pm',11))+"x" },
        },
    },
    tabFormat: {
        "Main": {
            content:[
                function() { if (player.tab == "pm")  return ["column", [
    				"main-display","prestige-button","resource-display",
                    ["display-text", "1st milestone effect reduces your points gain by <h2 style='color:  #f71c50; text-shadow: #f71c50 0px 0px 10px;'> "+format(tmp.pm.reduce)+"x</h2>"],
    ["display-text", "You have <h2 style='color: #f71c50; text-shadow: #f71c50 0px 0px 10px;'>"+format(player.pm.essence)+"</h2> (+" + format(tmp.pm.gain)+ "/s) prestige essences, which multiply points gain by <h2 style='color:  #f71c50; text-shadow: #f71c50 0px 0px 10px;'>"+format(tmp.pm.essenceBoost)+"x</h2>"],
                "blank",
                "milestones",
                "blank",
                ]
            ]
     },
     ]
            },
            "Prestige Universe Challenges": {
                content: [
                    "main-display","prestige-button","resource-display",
                    ["display-text", function(){return "You have "+format(tmp.pm.count)+" Total Prestige Universe challenge completions.</h2>"}],
                    ["display-text", function(){return "Reach "+format(tmp.pm.req)+" Prestige Universe challenge completions to unlock an effect.</h2>"}],
                    "blank",
                    ["display-text",function(){table = '<div style="width:500px;border: 2px solid white;"><h2 style="color:  #f71c50; text-shadow: #f71c50 0px 0px 10px;">Current Unlocked Boosts</h2><br>'
                    if (tmp.pm.count.gte(1)) table+=(player.mp.modeP==true?"Points Mode:<br> Reduce Recharge Fusioner effect by <h3 style='color:#f71c50'>-"+format(tmp.pm.pChalReward1)+"</h3>":"Prestige Essence Mode:<br> Increase Recharge Fusioner effect by <h3 style='color:#f71c50'>+"+format(tmp.pm.pChalReward1)+"</h3>")
                    return table+"</div>"}],
                    ["challenges",[1]]
                ],
            unlocked() {return player.pm.best.gte(12)},
            },
		},
        count() {
            let count = new Decimal(0)
            for (i in player.pm.challenges) {
                count=count.add(challengeCompletions('pm',i))
            }
            return count
        },
        req(){
            let count=tmp.pm.count
            let req=new Decimal(1)
            if (count.gte(1)) req=req.mul(3)
            if (count.gte(3)) req=req.add(4)
            if (count.gte(7)) req=req.add(7)     
            if (count.gte(14)) req=req.add(9)  
            return req;
        },
    	pMilestone4Effect(){
            let p=player.points.add(1).log10().mul(1.75);
            return p;
        },
    	pMilestone11Effect(){
            let p=player.pm.essence.add(1).log10().add(1).log(5).mul(1.5);
            return p;
        },
    	pChalReward1(){
            let base=tmp.pm.count
            let p=player.mp.modeP==true?base.div(2).pow(1.75):base.div(1.25).pow(1.75)
            
            return p;
        },
    update(diff) {
        if (player.pm.best.gte(1) && player.mp.activeChallenge==21) player.pm.essence = player.pm.essence.add(tmp.pm.gain.times(diff))
        if (player.pm.activeChallenge==11) player.pm.challengeTimer = player.pm.challengeTimer.add(diff)
    },
	branches: ["m"],
    resetDescription: "Get ",
	doReset(){},
})