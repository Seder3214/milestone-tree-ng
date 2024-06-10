function checkDot(dot="") {
if (dot==player.ex.exploreDots[player.ex.dotUnl]) {
    player.ex.dotUnl+=1
}
}
addLayer("ex", {
    name: "exploration points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EX", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        dotUnl:0,
        exploreDots: ["(8;4)","(9;5)","(12;8)","(15;10)"],
    }},
    color() {return '#46a364'},
    requires(){
		return new Decimal(1e100)
	},
    resource() {return 'exploration points'},
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
    xLimit() {
        let x= new Decimal(10)
        x=x.mul(player.ex.points.add(1).pow(0.37))
        return x
    },
    yLimit() {
        let x= new Decimal(10)
        x=x.mul(player.ex.points.div(2).mul(1.75))
        return x
    },
    exOneEffect() {
        let eff= new Decimal(1)
        if (player.ex.dotUnl>=1)eff=eff.mul(player.ex.points.pow(2.674))
        return eff
    },
	exponent: function(){
         return new Decimal(3)
	},
    row: 2, // Row the layer is in on the tree (0 is the first row)
	exponent: 5,
    hotkeys: [
        {key: "ctrl+e", description: "Ctrl+E: Reset for exploration points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (hasMalware("m",9))&&(player.mp.activeChallenge==21)},
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
				let base=5;
				let ret = player.pm.best.div(10).mul(base).add(1)
                return ret;
            },
			canAfford() {
				return player.pm.essence.gte(1e13)&&player.pep.points.gte(this.cost)
			},
			pay() {
				player.pep.points = player.pep.points.sub(this.cost)
				player.pm.essence = player.pm.essence.sub(1e13)
			},
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
	},
	buyables: {
        respec() {
for (i in player.ex.buyables){
player.ex.buyables[i] = new Decimal(0)}
        },
        respecMessage() {return "Are you sure you want to respec Multiversal Fusioners? This will reset your current position ("+format(player.ex.buyables[11],0)+";"+format(player.ex.buyables[12],0)+") to (0,0)!"},
        respecText: "Respec Position",
		rows: 2,
		cols: 2,
		11:{
			title(){
				return "<h3 class='exf'>Increase X</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Currently: "+format(player[this.layer].buyables[this.id],0)+"<br>"+
				"Cost: "+format(data.cost,0)+" Prestige Essences";
			},
			cost(x){
                let cost = Decimal.pow(10,x.add(1).mul(11.76))
				return cost
			},
			canAfford() {
                   return player.pm.essence.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                player.pm.essence = player.pm.essence.sub(this.cost())
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
				if (player.pm.essence.lt(this.cost())) return {
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
        12:{
			title(){
				return "<h3 class='exf'>Increase Y</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "Currently: "+format(player[this.layer].buyables[this.id],0)+"<br>"+
				"Cost: "+format(data.cost,0)+" Corruption Essences";
			},
			cost(x){
                let cost = Decimal.pow(2,x.add(1).mul(3.76))
				return cost
			},
			canAfford() {
                   return player.cp.formatted.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
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
				if (player.cp.formatted.lt(this.cost())) return {
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
                ["display-text",function(){table = 'Your exploration points are increasing your exploration area limits. For now, your area limits are: X axis - '+format(tmp.ex.xLimit)+", Y axis - "+format(tmp.ex.yLimit)+".<br>By reaching some of positions in the area you can unlock new features.<br>New feature is at "+player.ex.exploreDots[player.ex.dotUnl]+"."
                    return table}],
                    ["display-text",function(){table = "Currently unlocked:"
                        if (player.ex.dotUnl>=1) table+= "<br>(8;4) - [ Corruptions rewards are "+format(tmp.ex.exOneEffect)+"x better.<br>Unlock one Super Prestige Upgrade in Normal Universe. ]"
                        if (player.ex.dotUnl>=2) table+= "<br>(9;5) - [ Unlock more Malware Milestones. ]"
                        return table}],
				"buyables"
			]
		},
		"Upgrades": {
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
	branches: ["pep","cp"],
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(player.mp.activeChallenge==21) player.pm.essence = new Decimal(0)
		},
	update(diff){
        checkDot(dot=`(${player.ex.buyables[11]};${player.ex.buyables[12]})`)
	}
})