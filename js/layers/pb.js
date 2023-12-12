addLayer("pb", {
    name: "prestige boost", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#70C0A0",
    requires(){
		if(player.ap.activeChallenge==11)return new Decimal(Infinity);
		return new Decimal("1e13760");
	}, // Can be a function that takes requirement increases into account
    resource: "prestige boosts", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for prestige boosts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.best.gte(50)},
	branches: ["p"],
	softcap:new Decimal(Infinity),
	softcapPower:new Decimal(1),
	base: new Decimal("1e13630"),
	exponent: function(x){
		if(x===undefined)x=player.pb.points;
		let p=new Decimal(1.1311);
		if(x.gte(15)){
			let scaling=x.sub(15).pow(2).div(2600);
			if(hasUpgrade("t",24))scaling=scaling.div(1.1);
			if(player.m.points.gte(111))scaling=scaling.div(1.048);
			if(player.m.points.gte(117))scaling=scaling.div(1.02);
			if(hasUpgrade("pb",41))scaling=scaling.div(upgradeEffect("pb",41));
			p=p.add(scaling);
		}
		return p;
	},
	effect(){
		let p=0.5;
		let m=0.05;
		let e=new Decimal(0);
		if(hasUpgrade("pb",11)){
			p+=0.1;
			m+=0.011;
		}
		if(hasUpgrade("pb",12)){
			p+=0.05;
			m+=0.005;
		}
		if(hasUpgrade("pb",13)){
			p+=0.01;
			m+=0.00251;
		}
		if(hasUpgrade("pb",14)){
			p+=0.005;
			m+=0.001;
		}
		if(hasUpgrade("pb",21)){
			p+=0.005;
		}
		if(hasUpgrade("pb",22)){
			m+=0.00275;
		}
		if(hasUpgrade("pb",23)){
			p+=0.01;
			m+=0.001004;
		}
		if(hasUpgrade("pb",24)){
			m+=0.00201;
		}
		if(player.ap.challenges[11]>=1){
			p+=0.01;
		}
		if(player.ap.challenges[11]>=2){
			m+=0.001;
		}
		if(player.ap.challenges[11]>=3){
			p+=0.01;
			m+=0.002*(player.ap.challenges[11]-3);
		}
		m+=0.002*player.ap.challenges[31];
		if(player.ap.challenges[31]>=17){
			m+=0.0003;
		}
		if(hasUpgrade("hb",12)){
			e=e.add(upgradeEffect("hb",12));
		}
		if(hasUpgrade("pb",44)){
			m+=0.002;
		}
		return new Decimal(1).add(player.pb.points.add(e).pow(p).mul(m)).pow(layers.hb.effect());
	},
	effectDescription(){
		return "prestige points is powered by "+format(layers.pb.effect(),4)
	},
	
	upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Prestige Boost Upgrade 11",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(3),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		12: {
			title: "Prestige Boost Upgrade 12",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(7),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		13: {
			title: "Prestige Boost Upgrade 13",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(11),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		14: {
			title: "Prestige Boost Upgrade 14",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(22),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		21: {
			title: "Prestige Boost Upgrade 21",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(31),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		22: {
			title: "Prestige Boost Upgrade 22",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(34),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		23: {
			title: "Prestige Boost Upgrade 23",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(40),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		24: {
			title: "Prestige Boost Upgrade 24",
            description: "Prestige Boost's effect is better.",
            cost: new Decimal(48),
            unlocked() { return true}, // The upgrade is only visible when this is true
        },
		31: {
			title: "Prestige Boost Upgrade 31",
            description: "Prestige Boost affects the 1st Milestone's softcap at a reduced rate.",
            cost: new Decimal(90),
            unlocked() { return player.m.points.gte(111)}, // The upgrade is only visible when this is true
			effect() {
				let e=0.1;
				if(hasUpgrade("pb",32))e+=0.1;
				if(hasUpgrade("pb",33))e+=0.1;
				if(hasUpgrade("pb",34))e+=0.1;
				if(hasUpgrade("pb",43))e+=0.1;
				let p=tmp.pb.effect.pow(e);
				return p;
            },
            effectDisplay() { return format(this.effect(),4)+"x later" },
        },
		32: {
			title: "Prestige Boost Upgrade 32",
            description: "Prestige Boost Upgrade 31 is boosted.",
            cost: new Decimal(92),
            unlocked() { return player.m.points.gte(111)}, // The upgrade is only visible when this is true
        },
		33: {
			title: "Prestige Boost Upgrade 33",
            description: "Prestige Boost Upgrade 31 is boosted.",
            cost: new Decimal(95),
            unlocked() { return player.m.points.gte(111)}, // The upgrade is only visible when this is true
        },
		34: {
			title: "Prestige Boost Upgrade 34",
            description: "Prestige Boost Upgrade 31 is boosted.",
            cost: new Decimal(98),
            unlocked() { return player.m.points.gte(111)}, // The upgrade is only visible when this is true
        },
		41: {
			title: "Prestige Boost Upgrade 41",
            description: "Prestige Boost cost scaling is weaker based on your super-prestige points. You can buy this upgrade while you're in AP challenge 2.",
            cost(){
				if(player.ap.activeChallenge!=12)return new Decimal(Infinity);
				return new Decimal(102);
			},
            unlocked() { return player.m.points.gte(132)}, // The upgrade is only visible when this is true
			effect() {
				let p=player.sp.points.add(1e20).log10().log10().div(200);
				return p.add(1);
            },
            effectDisplay() { return format(this.effect(),4)+"x" },
        },
		42: {
			title: "Prestige Boost Upgrade 42",
            description: "3rd Milestone's effect is boosted based on your prestige boosts. You can buy this upgrade while you're in AP challenge 3.",
            cost(){
				if(player.ap.activeChallenge!=21)return new Decimal(Infinity);
				return new Decimal(109);
			},
            unlocked() { return player.m.points.gte(132)}, // The upgrade is only visible when this is true
			effect() {
				let e=0.01;
				let p=tmp.pb.effect.pow(e);
				return p;
            },
            effectDisplay() { return "^"+format(this.effect(),4) },
        },
		43: {
			title: "Prestige Boost Upgrade 43",
            description: "Prestige Boost Upgrade 31 is boosted. You can buy this upgrade while you're in T challenge 2.",
            cost(){
				if(player.t.activeChallenge!=12)return new Decimal(Infinity);
				return new Decimal(77);
			},unlocked() { return player.m.points.gte(132)}, // The upgrade is only visible when this is true
        },
		44: {
			title: "Super-Prestige Upgrade 44",
            description: "Prestige Boost's effect is better. To buy this upgrade, You need to complete AP challenge 5 18 times.",
            cost(){
				if(player.ap.challenges[31]<18)return new Decimal(Infinity);
				return new Decimal(112);
			},
            unlocked() { return player.m.points.gte(132)}, // The upgrade is only visible when this is true
        },
	},
	
	resetsNothing(){return player.m.points.gte(65)},
		doReset(l){
			if(l=="pb"){return;}
			if(l=="hp")if(player.m.points.gte(70))layerDataReset("pb",["upgrades"]);else layerDataReset("pb",[]);
			if(l=="ap")if(player.m.points.gte(81))layerDataReset("pb",["upgrades"]);else layerDataReset("pb",[]);
			if(l=="t")if(player.m.points.gte(101))layerDataReset("pb",["upgrades"]);else layerDataReset("pb",[]);
			if(l=="hb")if(player.m.points.gte(104))layerDataReset("pb",["upgrades"]);else layerDataReset("pb",[]);
		},
	//autoPrestige(){return player.m.points.gte(80)},
	update(){
		if(player.m.points.gte(80)&&player.ap.activeChallenge!=11){//quick autobuy
			while(true){
				let req=layers.pb.requires().mul(layers.pb.base.pow(Decimal.pow(player.pb.points,layers.pb.exponent())));
				if(player.p.points.gt(req))player.pb.points=player.pb.points.add(1);
				else break;
			}
		}
	}
})