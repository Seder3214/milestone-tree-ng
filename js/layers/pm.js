addLayer("pm", {
    name: "prestige-milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        essence: new Decimal(0),
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
        if (player.pm.best.gte(1)) gain=gain.add(player.mp.points.log2().pow(0.5))
        return gain
    },
    essenceBoost() {
        let eff = player.pm.essence.add(1).log2().pow(2).mul(0.1)
        return eff.max(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(12),
	exponent: function(){
		return new Decimal(1)
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
	],
    tabFormat: {
        "Main": {
            content:[
                function() { if (player.tab == "pm")  return ["column", [
    				"main-display","prestige-button","resource-display",
    ["display-text", "You have <h2 style='color:  #f71c50; text-shadow: #f71c50 0px 0px 10px;'>"+format(player.pm.essence)+"</h2> (+" + format(tmp.pm.gain)+ "/s) prestige essences,that multiply points gain by "+format(tmp.pm.essenceBoost)+"x"],
                "blank",
                "milestones",
                "blank",
                ]
            ]
     },
     ]
            },
		},
    update(diff) {
        if (player.pm.best.gte(1) && player.mp.activeChallenge==21) player.pm.essence = player.pm.essence.add(tmp.pm.gain.times(diff))
    },
	branches: ["m"],
    resetDescription: "Get ",
	doReset(){},
})