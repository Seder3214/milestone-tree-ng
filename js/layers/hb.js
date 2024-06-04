addLayer("hb", {
    name: "hyper boost", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#90FFC0",
    requires(){
		r = new Decimal("1e473950");
		if(hasUpgrade("t",41))r=r.div("1e60000");
		if(hasUpgrade("t",64))r=r.div("1e300000");
		if(hasUpgrade("t",71))r=r.div("1e30000");
        return r
	}, // Can be a function that takes requirement increases into account
    resource: "hyper boosts", // Name of prestige currency
    baseResource: "hyper-prestige points", // Name of resource prestige is based on
    baseAmount() {return player.hp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "B", description: "Shift+B: Reset for hyper boosts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(104)&& (player.mp.activeChallenge!=21)||player.pm.activeChallenge==12||player.pm.activeChallenge==13},
	branches: ["hp","pb"],
	softcap:new Decimal(Infinity),
	softcapPower:new Decimal(1),
	base: new Decimal("1e100000"),
	exponent: function(x){
		if(x===undefined)x=player.hb.points;
		let p=new Decimal(1.25);
		if(x.gte(10)){
			let scaling=x.sub(10).pow(2).div(1000);
			if(player.m.best.gte(119))scaling=scaling.div(1.2);
			p=p.add(scaling);
		}
		return p;
	},
	effect(){
		let p=0.5;
		let m=0.02;
		let e=0;
		let extra=0;
		if(hasUpgrade("t",42))e++;
		if(hasUpgrade("t",43)){
			m+=0.02;
		}
		if(hasUpgrade("hb",13)){
			m+=0.004;
		}
		if(hasUpgrade("hb",14)){
			m+=0.003;
		}
        if(hasUpgrade("hp",42)){
			m+=0.003;
		}
		if(hasUpgrade("hb",32)){
			m+=0.001;
		}
		if (player.ep.buyables[11].gte(3)){
			m+=tmp.ep.threeEffect
		}
		if(hasUpgrade("hb",34)){
			m+=0.02;
		}
		if (hasMalware("m",7)) extra=15
		return new Decimal(1).add(player.hb.points.add(extra).add(e).pow(p).mul(m)).add(hasAchievement('ach',28)?0.015:0);
	},
	effectDescription(){
		return "hyper-prestige points and prestige boost effect is powered by "+format(layers.hb.effect(),4)
	},
	
	upgrades: {
        rows: 3,
		cols: 4,
		11: {
			title: "Hyper Boost Upgrade 11",
            description: "Hyper Boost effect affects the 1st Milestone's softcap.",
            cost: new Decimal(7),
			effect() {
				let p=tmp.hb.effect;
				return p;
            },
            effectDisplay() { return format(this.effect(),4)+"x later" },
        },
		12: {
			title: "Hyper Boost Upgrade 12",
            description: "Non-Extra Hyper Boosts provide extra Prestige Boosts.",
            cost: new Decimal(12),
			effect() {
				let exp=0.7;
				if(hasUpgrade("hb",21))exp+=0.05;
				if(hasUpgrade("hb",22))exp+=0.05;
				if(hasUpgrade("hb",23))exp+=0.05;
				if(hasUpgrade("hb",24))exp+=0.05;
				if(hasUpgrade("hb",31))exp+=tmp.hb.upgrades[31].effect;
				let p=player.hb.points.pow(exp).mul(hasUpgrade("hb",33)?upgradeEffect("hb",33):1);
				return p;
            },
            effectDisplay() { return "+"+format(this.effect(),4) },
        },
		13: {
			title: "Hyper Boost Upgrade 13",
            description: "Hyper Boost's effect is better.",
            cost: new Decimal(20),
        },
		14: {
			title: "Hyper Boost Upgrade 14",
            description: "Hyper Boost's effect is better.",
            cost: new Decimal(26),
        },
		21: {
			title: "Hyper Boost Upgrade 21",
            description: "Hyper Boost Upgrade 12 is boosted.",
            cost: new Decimal(33),
        },
		22: {
			title: "Hyper Boost Upgrade 22",
            description: "Hyper Boost Upgrade 12 is boosted.",
            cost: new Decimal(35),
        },
		23: {
			title: "Hyper Boost Upgrade 23",
            description: "Hyper Boost Upgrade 12 is boosted.",
            cost: new Decimal(40),
        },
		24: {
			title: "Hyper Boost Upgrade 24",
            description: "Hyper Boost Upgrade 12 is boosted.",
            cost: new Decimal(42),
        },
		31: {
			title: "Hyper Boost Upgrade 31",
			unlocked(){return player.m.best.gte(178)},
            description: "Hyper Boost Upgrade 12 is boosted by Hyper Boosts effect. To buy this upgrade, complete 8th AP Challenge 10 times.",
			effect() {
				let exp=0.3;
				let p=layers.hb.effect().pow(exp).sub(1);
				return p.toNumber();
            },
			effectDisplay() { return "+"+format(this.effect(),4) },
            cost(){
				if(player.ap.challenges[41]<10)return new Decimal(Infinity);
				else return new Decimal(78);
			},
        },
		32: {
			title: "Hyper Boost Upgrade 32",
            description: "Hyper Boosts effect is better. You can buy this upgrade while you're in AP challenge 8<br> and reached 1e790 Points.",
            cost(){
				if(player.ap.activeChallenge!=42)return new Decimal(Infinity);
				else if (player.points.gte('1e790')) return new Decimal(79)
				else return new Decimal(Infinity);
			},
			unlocked(){return player.m.best.gte(178)}, // The upgrade is only visible when this is true
        },
		33: {
			title: "Hyper Boost Upgrade 33",
            description: "Hyper Boost Upgrade 12 is boosted. To buy this upgrade, complete 8th AP Challenge 15.8 times.",
            cost(){
				if(player.ap.challenges[42]<15.8)return new Decimal(Infinity);
				else return new Decimal(80);
			},
			effect() {
				let exp=1.05;
				let p=layers.hb.effect().pow(exp);
				return p;
            },
			effectDisplay() { return "x"+format(this.effect(),4) },
			unlocked(){return player.m.best.gte(178)}, // The upgrade is only visible when this is true
        },
		34: {
			title: "Hyper Boost Upgrade 34",
            description: "Hyper Boosts effect is better. You can buy this upgrade while you're in AP challenge 8<br> and reached 1e875 Points.",
            cost(){
				if(player.ap.activeChallenge!=42)return new Decimal(Infinity);
				else if (player.points.gte('1e875')) return new Decimal(83)
				else return new Decimal(Infinity);
			},
			unlocked(){return player.m.best.gte(178)}, // The upgrade is only visible when this is true
        },
	},
	resetsNothing(){return player.m.best.gte(111)||player.pm.activeChallenge==12||player.pm.activeChallenge==13},
		doReset(l){
			if(l=="hb"){return;}
			if(l=="t")if(player.m.best.gte(134))layerDataReset("hb",["upgrades"]);else layerDataReset("hb",[]);
		},
	//autoPrestige(){return player.m.best.gte(116)},
	update(){
		if(player.m.best.gte(116)){//quick autobuy
			while(true){
				let req=layers.hb.requires().mul(layers.hb.base.pow(Decimal.pow(player.hb.points,layers.hb.exponent())));
				if(player.hp.points.gt(req))player.hb.points=player.hb.points.add(1);
				else break;
			}
		}
	},
	
})