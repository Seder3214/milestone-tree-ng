addLayer("cm", {
    name: "corrupted-milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        essence: new Decimal(0),
        best: new Decimal(0),
    }},
    nodeStyle() {
        return {
            'border': '5px solid lime',
            'border-style': 'dashed',
            'color':'lime',
        }
    },
    color: "darkgreen",
    requires(){
		let b=new Decimal(40);
		return b;
	}, // Can be a function that takes requirement increases into account
    resource: "corrupted milestones", // Name of prestige currency
    baseResource: "fixed corruptions", // Name of resource prestige is based on
    baseAmount() {return new Decimal(player.cp.totalCorrupt)}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    cMilestone1Effect() {
        let eff = (Math.log2(player.cp.totalCorrupt)**0.25)*(Math.log2(player.cp.totalCorrupt)/50)
        return new Decimal(eff).max(1)
    },
    newRow: 0,
    row:1, // Row the layer is in on the tree (0 is the first row)
	exponent: function(){return new Decimal(0.8)
	},
    hotkeys: [
        {key: "c+m", description: "C+M: Get Corrupted Milestone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.mp.activeChallenge==21 && player.pm.best.gte(10))},
	resetsNothing(){return true},
	milestones: [
		{
			requirementDescription: "1st Corrupted Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Based on total fixed corruptions amount, add +"+format(tmp.cm.cMilestone1Effect,4)+" per prestige milestone to Corruption Upgrade 12 effect"
			},
            style() {
                if (hasMilestone('cm',0)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            }
        },
        {
			requirementDescription: "2nd Corrupted Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Expand disk amount - Add one more column of disks. Prestige Milestone 9 is much better."
			},
            style() {
                if (hasMilestone('cm',1)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            }
        },
        {
			requirementDescription: "3rd Corrupted Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Auto-Fix pre-40th level corruptions. Prestige Milestone 9 is much better on post-50th level corruptions."
			},
            style() {
                if (hasMilestone('cm',2)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            }
        },
        {
			requirementDescription: "4th Corrupted Milestone",
            unlocked() {return player[this.layer].best.gte(3)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Add +20 to auto-fix level range. Unlock Antivirus"
			},
            style() {
                if (hasMilestone('cm',3)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            }
        },
        {
			requirementDescription: "5th Corrupted Milestone",
            unlocked() {return player[this.layer].best.gte(4)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Add +5 to auto-fix level range."
			},
            style() {
                if (hasMilestone('cm',4)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            }
        },
	],
    tabFormat: {
        "Main": {
            content:[
                function() { if (player.tab == "cm")  return ["column", [
    				"main-display","prestige-button","resource-display",
                "blank",
                "milestones",
                "blank",
                ]
            ]
     },
     ]
            },
		},
	branches: ["cp","pm"],
    resetDescription: "Get ",
	doReset(){},
})