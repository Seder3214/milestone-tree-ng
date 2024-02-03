addLayer("pep", {
    name: "prestiged-exotic prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PEP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color() {return '#c89646'},
    requires(){
		return new Decimal(20000000).pow(player.pep.points.sub(3).div(3).add(1).max(1));
	},
    resource() {return 'prestiged-exotic prestige points'},
    baseResource() {return 'prestige essence'}, // Name of resource prestige is based on
    baseAmount() {return player.pm.essence}, // Get the current amount of baseResource
    type() {return "static"}, // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=new Decimal(0.3);
		return m;
    },
	exponent: function(){
         return new Decimal(1)
	},
	prOneEffect() {
        let eff = player.pep.points.add(1).mul(3).pow(1.5)
		if (hasUpgrade('cp',11)) eff = eff.mul(upgradeEffect('pep',11))
        return eff;
    },
	prTwoEffect() {
        let eff = player.pep.points.add(1).mul(2).pow(0.6)
        return eff;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.5,
    hotkeys: [
        {key: "ctrl+x", description: "Ctrl+X: Reset for prestiged-exotic prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.pm.best.gte(5))&&(player.mp.activeChallenge==21)},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Prestiged-Exotic Prestige Upgrade 11",
            description: "Prestige Milestones boosts 1st effect at reduced rate",
            cost: new Decimal(6),
			costDescription() {return "Cost: 6 pr-exotic prestige points<br>1e13 Prestige Essences"},
            unlocked() { return player.pm.best.gte(7)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.5;
				let ret = player.pm.best.log(5).pow(base)
                return ret;
            },
			canAfford() {
				return player.pm.essence.gte(1e13)
			},
			pay() {
				player.pep.points = player.pep.points.sub(this.cost)
				player.pm.essence = player.pm.essence.sub(1e13)
			},
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
	},
	buyables: {
		rows: 1,
		cols: 1,
		11:{
			title(){
				return "<h3 class='pef'>(Pr) Exotic Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "<h4 class='pef'>Tier: "+format(player[this.layer].buyables[this.id],0)+"<br></h4>"+
				"Unlocking "+format(data.effect,0)+" more effects<br>"+
				"Cost for Next Tier: "+format(data.cost,0)+" Exotic Prestige points";
			},
			cost(){
				return [new Decimal("1"),new Decimal("2"),Decimal.dInf][player.pep.buyables[11]]
			},
			canAfford() {
                   return player.pep.points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                player.pep.points = player.pep.points.sub(this.cost())
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(){
				  let b=1;
                  let eff=new Decimal(0).add(player[this.layer].buyables[this.id].mul(b));
				  return eff;
			  },
			  unlocked(){
				  return player.mp.activeChallenge==21;
			  },
			  style() {
				if (player.pep.points.lt(this.cost())) return {
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
    tabFormat: {
		"Main":{
			content:[
				"main-display","prestige-button","resource-display",
				["display-text",function(){table = ''
				if (player.pep.buyables[11].gte(1)) table += '1st effect: Boost points gain by ' + format(tmp.pep.prOneEffect) + "x, but boost 1st milestone reducing effect by "+ format(tmp.pep.prOneEffect.pow(0.5))+ "x."
                if (player.pep.buyables[11].gte(2)) table += '<br>2nd effect: Multiply points gain <b>before</b> 1st milestone reduce by ' + format(tmp.pep.prTwoEffect) + "x."
				return table}],
				"buyables"
			]
		},
		"Upgrades": {
			unlocked() {return player.pm.best.gte(7)},
			content:[
				function() { if (player.tab == "pep")  return ["column", [
					"main-display","prestige-button","resource-display",
				"upgrades",
				]
			]
	 },
	 ]
			},
    },
	branches: ["pm"],
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(player.mp.activeChallenge==21) player.pm.essence = new Decimal(0)
		},
	update(){
	}
})