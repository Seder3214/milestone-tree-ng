addLayer("mm", {
    name: "meta-milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#A057B0",
    requires(){
		//if(player.mm.points.gte(20))return new Decimal(Infinity);
		let b=new Decimal(40);
		if(hasUpgrade("t",72))b=b.div(upgradeEffect("t",72));
		return b;
	}, // Can be a function that takes requirement increases into account
    resource: "meta-milestones", // Name of prestige currency
    baseResource: "milestones", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(1.047),
	exponent: function(){
		return new Decimal(1)
	},
    hotkeys: [
        {key: "M", description: "Shift+M: Get Meta-Milestone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(40)&& (player.mp.activeChallenge!=21)},
	resetsNothing(){return true},
	autoPrestige(){return player.em.best.gte(1)},
	milestones: [
		{
			requirementDescription: "1st Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Autoget Milestones."
			},
        },
		{
			requirementDescription: "2nd Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^2"
			},
        },
		{
			requirementDescription: "3rd Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^2"
			},
        },
		{
			requirementDescription: "4th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(3)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^2"
			},
        },
		{
			requirementDescription: "5th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(4)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Third Milestone's effect is better based on your meta-milestones.";
			},
        },
		{
			requirementDescription: "6th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(5)},
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.5"
			},
        },
		{
			requirementDescription: "7th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(6)},
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.5"
			},
        },
		{
			requirementDescription: "8th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(7)},
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.5"
			},
        },
		{
			requirementDescription: "9th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(8)},
            done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "6th Milestone's effect ^1.5"
			},
        },
		{
			requirementDescription: "10th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(9)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Third Milestone's effect is better based on your meta-milestones."
			},
        },
		{
			requirementDescription: "11th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(10)},
            done() {return player[this.layer].best.gte(11)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.2"
			},
        },
		{
			requirementDescription: "12th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(11)},
            done() {return player[this.layer].best.gte(12)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.2"
			},
        },
		{
			requirementDescription: "13th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(12)},
            done() {return player[this.layer].best.gte(13)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "6th Milestone's effect ^1.2"
			},
        },
		{
			requirementDescription: "14th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(13)},
            done() {return player[this.layer].best.gte(14)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "6th Milestone's effect ^1.2"
			},
        },
		{
			requirementDescription: "15th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(14)},
            done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Third Milestone's effect is better based on your meta-milestones."
			},
        },
		{
			requirementDescription: "16th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(15)},
            done() {return player[this.layer].best.gte(16)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.2"
			},
        },
		{
			requirementDescription: "17th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(16)},
            done() {return player[this.layer].best.gte(17)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "6th Milestone's effect ^1.7"
			},
        },
		{
			requirementDescription: "18th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(17)},
            done() {return player[this.layer].best.gte(18)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.8"
			},
        },
		{
			requirementDescription: "19th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(18)},
            done() {return player[this.layer].best.gte(19)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "27th Milestone's effect ^1.9"
			},
        },
		{
			requirementDescription: "20th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(19)},
            done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Third Milestone's effect is better based on your meta-milestones."
			},
        },
		{
			requirementDescription: "21st Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(20)},
            done() {return player[this.layer].best.gte(21)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Transcend Point gain is doubled"
			},
        },
		{
			requirementDescription: "22nd Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(21)},
            done() {return player[this.layer].best.gte(22)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Transcend Point gain is doubled"
			},
        },
		{
			requirementDescription: "23rd Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(22)},
            done() {return player[this.layer].best.gte(23)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Transcend Point gain is doubled"
			},
        },
		{
			requirementDescription: "24th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(23)},
            done() {return player[this.layer].best.gte(24)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Transcend Point gain is doubled"
			},
        },
		{
			requirementDescription: "25th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(24)},
            done() {return player[this.layer].best.gte(25)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Transcend Point gain is boosted based on your meta-milestones. Currently: "+format(tmp.mm.meta25Effect)+"x";
			},
        },
		{
			requirementDescription: "26th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(25)},
            done() {return player[this.layer].best.gte(26)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Prestige Energy gain is doubled";
			},
        },
		{
			requirementDescription: "27th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(26)},
            done() {return player[this.layer].best.gte(27)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Prestige Energy gain is doubled";
			},
        },
		{
			requirementDescription: "28th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(27)},
            done() {return player[this.layer].best.gte(28)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Prestige Energy gain is doubled";
			},
        },
		{
			requirementDescription: "29th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(28)},
            done() {return player[this.layer].best.gte(29)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Prestige Energy gain is doubled";
			},
        },
		{
			requirementDescription: "30th Meta-Milestone",
            unlocked() {return player[this.layer].best.gte(29)},
            done() {return player[this.layer].best.gte(30)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "25th Meta-Milestone's effect ^2, Unlock a new layer.";
			},
        },
	],
    resetDescription: "Get ",
	branches:["m"],
	doReset(){},
	meta25Effect(){
		let ret=player.mm.points.div(10);
		if(player.mm.best.gte(30))ret=ret.pow(2);
		return ret;
	},
})