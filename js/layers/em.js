addLayer("em", {
    name: "extra-milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#B070C0",
    requires(){
		let b=new Decimal(30);
		return b;
	}, // Can be a function that takes requirement increases into account
    resource: "extra-milestones", // Name of prestige currency
    baseResource: "meta-milestones", // Name of resource prestige is based on
    baseAmount() {return player.mm.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(1.03),
	exponent: function(){
		return new Decimal(1)
	},
    hotkeys: [
        {key: "ctrl+m", description: "Ctrl+M: Get Extra-Milestone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.mm.best.gte(30)},
	resetsNothing(){return true},
	autoPrestige(){return player.m.best.gte(170)},
	milestones: [
		{
			requirementDescription: "1st Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Autoget Meta-Milestones."
			},
        },
        {
			requirementDescription: "2nd Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "^1.01 3rd milestone effect."
			},
        },
        {
			requirementDescription: "3rd Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Passively gain 1% of Prestige Power."
			},
        },
        {
			requirementDescription: "4th Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(3)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Passively gain 100% of Prestige Power."
			},
        },
        {
			requirementDescription: "5th Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(4)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Passively gain 10000% of Prestige Power."
			},
        },
        {
			requirementDescription: "6th Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(5)},
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Passively gain 10% of Exotic Prestige Points."
			},
        },
        {
			requirementDescription: "7th Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(6)},
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock Prestige buyable."
			},
        },
        {
			requirementDescription: "8th Extra-Milestone",
            unlocked() {return player[this.layer].best.gte(7)},
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Automate [Reduced Points] Challenge."
			},
        },
	],
	branches: ["mm"],
    resetDescription: "Get ",
	doReset(){},
})