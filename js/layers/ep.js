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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=new Decimal(1);
		return m;
    },
    oneEffect() {
        let eff = player.ep.points.add(1).pow(3.25).max(1)
        return eff;
    },
    twoEffect() {
        let eff = player.ep.points.add(1).pow(1.5).mul(2).max(1)
        return eff;
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.5,
    hotkeys: [
        {key: "e", description: "e: Reset for exotic prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
				let base=3;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
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
				return "<h4 class='ef'>Tier: "+format(player[this.layer].buyables[this.id])+"<br></h4>"+
				"Unlocking "+format(data.effect)+" more effects<br>"+
				"Cost for Next Tier: "+format(data.cost)+" Exotic Prestige points";
			},
			cost(){
				let a=player[this.layer].buyables[this.id];
                let cost = new Decimal(1)
				a=Decimal.pow(3,a);
				return cost.mul(Decimal.pow(2,a));
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
                if (player.ep.buyables[11].gte(2)) table += '<br>2nd effect: Transcend Points gain is ' + format(tmp.ep.twoEffect) + "x better"
                 return table}],
				"buyables",
                "upgrades"
			]
		},
    },
	branches: ["pp"],
	passiveGeneration(){
		return 0;
	},
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(l=="ep")if(player.m.points.gte(162))layerDataReset("pp",["upgrades"]);else layerDataReset("pp",[]);
		},
	update(){
	}
})