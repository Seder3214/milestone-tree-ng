function checkFeatureDot(dot="") {
if (dot==`(${tmp.ex.xGoal};${tmp.ex.yGoal})`) {
	switch(player.ex.zone){
		case "a":
			player.ex.dotUnl+=1
			break
		case "a-02":
			player.ex.a2Unl+=1
			break
	}
}
}
function checkPortalEnterDot(dot="") {
	dot=[]
	dot2=[]
	zone=player.ex.zone
	switch(zone){
		case "a": 
		dot=["(11;5)","a-02"]
		break
		case "a-02": 
		dot=["(7;3)","b-01"]
		dot2=["(6;5)","c-01"]
		break
	}
	if (dot[0]==`(${player.ex.buyables[11]};${player.ex.buyables[12]})`) {
		player.ex.zone=dot[1]
		player.ex.buyables[11]=new Decimal(0)
		player.ex.buyables[12]=new Decimal(0)
	}
	else if (dot2[0]==`(${player.ex.buyables[11]};${player.ex.buyables[12]})`) {
		player.ex.zone=dot2[1]
	}
	}
addLayer("ex", {
    name: "exploration points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EX", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		zone: "a",
        dotUnl:0,
		a2Unl:0,
		b1Unl:0,
		c1Unl:0,
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
        x=x.mul(player.ex.points.add(1).pow(0.37).mul(1.5)).floor()
        return x
    },
    yLimit() {
        let x= new Decimal(10)
        x=x.mul(player.ex.points.div(2).mul(1.75)).floor()
        return x
    },
	xGoal(x=new Decimal(player.ex.dotUnl)) {
		let goal=new Decimal(8)
			switch(player.ex.zone){
				case "a":
					goal=new Decimal(8)
					if (x<2)goal=goal.add(x)
					if (x>=2) goal=goal.add(x.add(1).mul(1.15)).floor()
					break
				case "a-02":
					x=player.ex.a2Unl
					goal=new Decimal(3)
					goal=goal.add(x)
					break
			}
		return goal
	},
	yGoal(x=new Decimal(player.ex.dotUnl)) {
		let goal=new Decimal(4)
			switch(player.ex.zone){
				case "a":
					if (x<2)goal=goal.add(x)
					if (x>=2) goal=goal.add(x.add(1).mul(1.25)).floor()
					break
				case "a-02":
					x=player.ex.a2Unl
					goal=new Decimal(2)
					goal=goal.add(x.add(1))
					break
			}
		return goal
	},
    exOneEffect() {
        let eff= new Decimal(1)
        if (player.ex.dotUnl>=1)eff=eff.mul(player.ex.points.add(1).pow(2.674))
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
			title: "Explore Upgrade 11",
            description: "slog(points)*Square root of current coordinates summa<br>Exponents Prestige Essence effect outside Prestige Universe at boosted rate",
            cost: new Decimal(2),
            unlocked() { return hasMalware("m",14)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=100;
				let xPos=player.ex.buyables[11]
				let yPos=player.ex.buyables[12]
				let ret = (new Decimal(player.points).add(1).slog(2)).mul(xPos.add(yPos).pow(0.5).mul(base))
                return ret;
            },
			pay() {
			},
            effectDisplay() { return "^"+format(this.effect(),4) }, // Add formatting to the effect
        },
	},
	buyables: {
        respec() {
for (i in player.ex.buyables){
player.ex.buyables[i] = new Decimal(0)}
        },
        respecMessage() {return "Are you sure you want to respec Multiversal Fusioners? This will reset your current position ("+format(player.ex.buyables[11],0)+";"+format(player.ex.buyables[12],0)+") to (0,0)!"},
        respecText: "Respec Position",
		showRespec() {return player.ex.points.gte(1)},
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
				switch(player.ex.zone){
					case "a":
						cost = Decimal.pow(10,x.add(1).mul(11.76))
						break
					case "a-02":
						cost = Decimal.pow(27,x.add(1).mul(27.6))
				}
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
				  return player.mp.activeChallenge==21&&player.ex.points.gte(1);
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
				switch(player.ex.zone){
					case "a":
						cost = Decimal.pow(2,x.add(1).mul(3.76))
						break
					case "a-02":
						cost = Decimal.pow(7,x.add(1).mul(2.96))
				}
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
				  return player.mp.activeChallenge==21&&player.ex.points.gte(1);
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
                ["display-text",function(){table=""
					if (player.ex.points.gte(1))table = 'Your exploration points are increasing your exploration area limits. For now, your area limits are: X axis - '+format(tmp.ex.xLimit)+", Y axis - "+format(tmp.ex.yLimit)+".<br>By reaching some of positions in the area you can unlock new features.<br>New feature is at "+`(${tmp.ex.xGoal};${tmp.ex.yGoal})`+"."
                    return table}],
				"buyables",
				["display-text",function(){table=""
					if (player.ex.points.gte(1))table = `Green circle is current position, the yellow star is a position for a new feature.<br><svg width="${((tmp.ex.xLimit)*20)+60}" height="${((tmp.ex.yLimit)*20)+90}" version="1.1">
					<text x="0" y="40" fill="white" font-size="12px">0</text>
					<line x1="20" x2="20" y1="50" y2="${((tmp.ex.yLimit)*20)+50}" stroke="white" stroke-width="4"/>
					<line x1="20" x2="${((tmp.ex.xLimit)*20)+20}" y1="50" y2="50" stroke="white" stroke-width="4"/>`
					for (xPos=1; xPos<=Math.floor(tmp.ex.xLimit);xPos++) {
						for (y=1; y<=Math.floor(tmp.ex.yLimit);y++) {
						 table+=`
						 <text x="4" y="${Math.floor(Math.floor(tmp.ex.yLimit)*20)+75}" fill="white" font-size="12px">Y</text>
						 <text x="${Math.floor(Math.floor(tmp.ex.xLimit)*20)+35}" y="40" fill="white" font-size="12px">X</text>
						 <text x="${Math.floor(xPos*20)+15}" y="40" fill="white" font-size="12px">${format(xPos,0)}</text>
						 <text x="0" y="${Math.floor(y*20)+55}" fill="white" font-size="12px">${format(y,0)}</text>
						 <line x1="${Math.floor(xPos*20)+20}" x2="20" y1="${Math.floor(y*20)+50}" y2="${Math.floor(y*20)+50}" stroke="#262626" stroke-width="1"/>
							 <line x1="${Math.floor(xPos*20)+20}" x2="${Math.floor(xPos*20)+20}" y1="50" y2="${Math.floor(y*20)+50}" stroke="#262626" stroke-width="1"/>`
						}							
					}
					zone=player.ex.zone
					dot=[0,0]
					switch(zone){
						case "a": 
						dot=[11,5]
						break
						case "a-02": 
						dot=[7,3]
						break
					}
					if (player.ex.points.gte(1))table+=`
					<line x1="${((tmp.ex.xLimit)*20)+20}" x2="${((tmp.ex.xLimit)*20)+20}" y1="50" y2="${((tmp.ex.yLimit)*20)+50}" stroke="#909090" stroke-width="3"/>
					<line x2="${((tmp.ex.xLimit)*20)+20}" x1="20" y1="${((tmp.ex.yLimit)*20)+50}" y2="${((tmp.ex.yLimit)*20)+50}" stroke="#909090" stroke-width="3"/>
					<text x="${player.ex.buyables[11].mul(20).add(11)}" y="${player.ex.buyables[12].mul(20).add(55)}" fill="#46a364" font-size="12px">🟢</text>
					<text x="${tmp.ex.xGoal.mul(20).add(11)}" y="${tmp.ex.yGoal.mul(20).add(55)}" fill="yellow" font-size="20px">★</text>`
					if (hasMalware('m',14)) table+=`<text x="${new Decimal(dot[0]).mul(20).add(6)}" y="${new Decimal(dot[1]).mul(20).add(55)}" fill="yellow" font-size="20px">🌀</text>`
					return table+"</svg>"}]
			]
		},
		"Upgrades": {
			content:[
				function() { if (player.tab == "ex")  return ["column", [
					"main-display","prestige-button","resource-display",
				"upgrades",
				]
			]
	 },
	 ]
			},
	"Rewards": {
				content:[
						["display-text",function(){let tableA=hasMalware("m",14)?"<br>Zone A Rewards:":""
							let tableB=player.ex.a2Unl>=1?"<br>Zone A-2 Rewards:":""
							if (player.ex.dotUnl>=1) tableA+="<br>(8;4) - [ Corruptions rewards are "+format(tmp.ex.exOneEffect)+"x better.<br>Unlock one Super Prestige Upgrade in Normal Universe. ]"
							if (player.ex.dotUnl>=2) tableA+="<br>(9;5) - [ Unlock more Malware Milestones. ]"
							if (player.ex.a2Unl>=1) tableB+= "<br>Zone A-2 (3;2) - [ Unlock Security Algorithms. ]"
							table = "Currently unlocked:"+tableA+tableB
							return table}],
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
		if (player.ex.zone==undefined) player.ex.zone="a"
        checkFeatureDot(dot=`(${player.ex.buyables[11]};${player.ex.buyables[12]})`)
		if (hasMalware('m',14))checkPortalEnterDot(dot=`(${player.ex.buyables[11]};${player.ex.buyables[12]})`)
	}
})