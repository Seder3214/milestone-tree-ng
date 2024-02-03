addLayer("pm", {
    name: "prestige-milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        essence: new Decimal(0),
        best: new Decimal(0),
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
        if (player.mp.modeE==true) gain = gain.mul(buyableEffect('mp',22))
        if (player.pm.best.gte(4)) gain = gain.mul(tmp.pm.pMilestone4Effect)
        if (player.pep.buyables[11].gte(1)) gain = gain.mul(tmp.pep.prOneEffect)
        if (player.cp.formatted.gte(1)) gain = gain.mul(corruptEffect())
        let s = new Decimal(1)
        for(var i in player.cp.grid) {
            if (getGridData("cp", i).active==true && getGridData("cp", i).type=='pm') s=(gridEffect('cp',i).gte(s)?gridEffect('cp',i):s)
          }
        return gain.div(s)
    },
    reduce() {
		let base = 0.5
		if (player.mp.buyables[23].gte(1)) base += buyableEffect('mp',23).toNumber()
		let eff=player.mp.points.log2().pow(base)
		if (player.pm.best.gte(3)) eff = eff.mul(5)
        if (player.pep.buyables[11].gte(1)) eff = eff.mul(tmp.pep.prOneEffect.pow(0.5))
        return eff
	},
    essenceBoost() {
        let eff = player.pm.essence.add(1).log2().pow(2).mul(0.1)
        eff = eff.mul(buyableEffect('mp',22))
        if (player.mp.modeP==true) eff = eff.mul(buyableEffect('mp',22).div(2).add(3))
        return eff.max(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    newRow: 0,
    row:0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(12),
	exponent: function(){
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
            
               return {
                    'background':'#0f0f0f',
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
				return "Unlock 1 more upgrade on row 2 layers."
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
				return "Unlock 1 more upgrade on row 2 layers."
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
				return "Half post-10th level corruption goals."
			},
            style() {
                if (hasMilestone('pm',8)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            
               return {
                    'background':'#0f0f0f',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
	],
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
		},

    	pMilestone4Effect(){
            let p=player.points.add(1).log10().mul(1.75);
            return p;
        },
    update(diff) {
        if (player.pm.best.gte(1) && player.mp.activeChallenge==21) player.pm.essence = player.pm.essence.add(tmp.pm.gain.times(diff))
    },
	branches: ["m"],
    resetDescription: "Get ",
	doReset(){},
})