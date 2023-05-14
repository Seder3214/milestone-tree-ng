addLayer("ep", {
    name: "exotic prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "lime",
    requires(){
		return new Decimal(1e15);
	},
    resource: "exotic prestige points", // Name of prestige currency
    baseResource: "prestige power", // Name of resource prestige is based on
    baseAmount() {return player.pp.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (player.p.buyables[12].gte(1)) mult = mult.mul(buyableEffect('p', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=new Decimal(1);
		return m;
    },
    oneEffect() {
        let eff = new Decimal(player.ep.points.add(1).pow(player.m.points.gte(165)?4:3.25)).max(1)
		if (player.m.points.gte(167)) eff = eff.pow(1.1)
		if (player.m.points.gte(168)) eff = eff.pow(1.1)
        return eff;
    },
    twoEffect() {
        let eff = player.ep.points.add(1).pow(player.m.points.gte(166)?2.5:2.2).mul(4).max(1)
        return eff;
    },
	threeEffect() {
        let eff = player.ep.points.add(1).log10().pow(0.01).max(1)
		if (player.m.points.gte(171)) eff = eff.mul(1.3)
		if (player.m.points.gte(172)) eff = eff.mul(1.1)
        return eff;
    },
	fourEffect() {
        let eff = player.ep.points.add(1).pow(0.3).max(1)
        return eff;
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.5,
    hotkeys: [
        {key: "x", description: "X: Reset for exotic prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(160)},
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Exotic Prestige Upgrade 11",
            description: "4th Milestone's effect is boosted by your exotic prestige points.<br>Req: Fusion Tier 2",
            cost: new Decimal(25),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.2;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.3).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
	},
	buyables: {
		rows: 1,
		cols: 1,
		11:{
			title(){
				return "<h3 class='ef'>Exotic Fusioner</h3>";
			},
			display(){
				let data = tmp[this.layer].buyables[this.id];
				return "<h4 class='ef'>Tier: "+format(player[this.layer].buyables[this.id],0)+"<br></h4>"+
				"Unlocking "+format(data.effect,0)+" more effects<br>"+
				"Cost for Next Tier: "+format(data.cost,0)+" Exotic Prestige points";
			},
			cost(){
				return [new Decimal("2"),new Decimal("8"),new Decimal("512"),new Decimal("1e55"),new Decimal("1e120"), new Decimal('1e175')][player.ep.buyables[11]]
			},
			canAfford() {
                   return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
               buy() { 
                player.ep.points = player.ep.points.sub(this.cost())
                   player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
               },
			  effect(){
				  let b=1;
                  let eff=new Decimal(0).add(player[this.layer].buyables[this.id].mul(b));
				  return eff;
			  },
			  unlocked(){
				  return true;
			  },
			  style() {
				if (player.ep.points.lt(this.cost())) return {
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
                if (player.ep.buyables[11].gte(1)) table += '1st effect: AP challenge 41 effect is ' + format(tmp.ep.oneEffect) + "x better"
                if (player.ep.buyables[11].gte(2)) table += '<br>2nd effect: Transcend Points gain is ' + format(tmp.ep.twoEffect) + "x better (only outside of T challenges)"
				if (player.ep.buyables[11].gte(3)) table += '<br>3rd effect: Hyper Boost effect base +' + format(tmp.ep.threeEffect,4)
				if (player.ep.buyables[11].gte(4)) table += '<br>3rd effect: Transcend Points hardcap starts ' + format(tmp.ep.fourEffect,4) + "x later"
				return table}],
				"buyables",
                "upgrades"
			]
		},
    },
	branches: ["pp"],
	passiveGeneration(){
		if (player.em.points.gte(6)) return 0.1
		return 0;
	},
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(l=="ep")if(player.m.points.gte(162))layerDataReset("pp",["upgrades", 'buyables']);else layerDataReset("pp",[]);
		},
	update(){
	}
})