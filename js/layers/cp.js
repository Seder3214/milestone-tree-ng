
const typeName = {
    div: "Trojan",
    pm: "Backdoor",
}
function formatRoman(num) {
    var roman = {
        M̅̅:1000000000,L̅̅M̅̅:900000000,L̅̅:500000000,C̅̅L̅̅:400000000, C̅̅:100000000, L̅̅C̅̅:90000000,L̅̅:50000000,X̅̅L̅̅:40000000, X̅̅:10000000,M̅X̅̅:9000000,V̅̅:5000000,M̅V̅̅:4000000,M̅:1000000,C̅M̅:900000,D̅:500000,C̅D̅:400000,C̅: 100000,X̅C̅:90000,L̅:50000,X̅L̅:40000, X̅: 10000,MX̅: 9000,V̅:5000,MV̅:4000,M: 1000, CM: 900, D: 500, CD: 400,
      C: 100, XC: 90, L: 50, XL: 40,
      X: 10, IX: 9, V: 5, IV: 4, I: 1
      
    };
    var str = '';
  
    for (var i of Object.keys(roman)) {
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
  
    return str;
}
function activeCorruptions() {
            let grid = player.cp.grid
            let slots = Object.keys(grid).filter(x => grid[x].active==true)
return slots}
function corruptEffect() {
    let eff = new Decimal(1)
    eff = eff.add(player.cp.formatted.add(1).log10().mul(1.27).pow(1.5))
    return eff
}
addLayer("cp", {
    name: "prestige points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        formatted: new Decimal(0),
        pool: ["div","pm"],
        totalCorrupt:0,
    }},
    tooltip() {
        return format(player.cp.points,0)+ " corrupted prestige points"
    },
canBuyMax() {return true},
    nodeStyle() {
        return {
            'border': '5px solid green',
            'border-style': 'dashed',
            'color':'green',
        }
    },
    color: "black",
    componentStyles: {
        "prestige-button"() { return {
            'background-image':'url("resources/corrupt_active.png")',
            'width':'255px',
            'height':'55px',
            'color': 'lime',
            'border-radius':'0%'
        } }
    },
    doReset(l) {
        if(l=="cp"){
        for (i=0;i<tmp.cp.resetGain;i++) {
        let grid = player.cp.grid
        let slots = Object.keys(grid).filter(x => grid[x].level<1)
        if (slots.length) {
            let slot = slots[Math.floor(Math.random() * slots.length)]
            let rangeMul = Math.floor(player.cp.totalCorrupt/4)*4
            let addLevel = Math.floor(player.cp.totalCorrupt/4)*2
            let ranType = Math.floor(Math.random()*2)
            let range = 10+rangeMul
   
            let tier = Math.floor(Math.random() * range)+addLevel
            if (tier==0) tier = 1
            player.cp.grid[slot] = { level: tier,active:false,fixed:false,type:player.cp.pool[ranType] }
    }
}
}
},
    requires(){
		let b=new Decimal(2e6);
		return b;
	}, // Can be a function that takes requirement increases into account
    resource: " prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(12),
	exponent: function(){
		return new Decimal(0.75)
	},
    hotkeys: [
        {key: "ctrl+c", description: "Ctrl+C: Corrupt prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        rows: 4,
        cols: 4,
		11: {
			title: "Corrupted Upgrade 11",
            description: "You can fix 2 corruptions at the same time.<br>(Point divider will be the highest from active ones).",
            unlocked() {return player.pm.best.gte(7)},
            cost: new Decimal(100),
            currencyDisplayName: "corruption essences",
            currencyInternalName: "formatted",
            currencyLayer:"cp",
            style() {
                    if (hasUpgrade('cp',11)) return {
                        'background':'#00520b',
                        'border-color':'lime',
                        'color':'lime',
                        'border-radius':'0%',
                    }
                    
                    else if (player.cp.formatted.gte(this.cost)) return {
                        'background':'#444',
                        'border-color':'lime',
                        'color':'lime',
                        'border-radius':'0%',
                        'cursor':'pointer',
                    }
                   else return {
                        'background':'#0f0f0f',
                        'border-color':'lime',
                        'color':'lime',
                        'border-radius':'0%',
                    }
            },
        },
		12: {
			title: "Corrupted Upgrade 12",
            description: "Prestige Milestones boosts Corruption's Reward.",
            costDescription() {return "Cost: 370 corruption essences<br>1e14 Points"},
            unlocked() {return player.pm.best.gte(7)},
            cost: new Decimal(370),
            effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=2;
				let ret = player.pm.best.div(20).add(1)
                return ret;
            },
			canAfford() {
				return player.points.gte(1e14)
			},
			pay() {
				player.cp.formatted = player.cp.formatted.sub(this.cost)
				player.points = player.points.sub(1e14)
			},
            effectDisplay() { return format(this.effect())+"x" },
        style() {
            if (hasUpgrade('cp',12)) return {
                'background':'#00520b',
                'border-color':'lime',
                'color':'lime',
                'border-radius':'0%'
            }
            
            if (player.cp.formatted.gte(this.cost)) return {
                'background':'#444',
                'border-color':'lime',
                'color':'lime',
                'border-radius':'0%',
                'cursor':'pointer',
            }
           return {
                'background':'#0f0f0f',
                'border-color':'lime',
                'color':'lime',
                'border-radius':'0%',
            }
        },
    },

	},
    grid: {
        rows: 4, // If these are dynamic make sure to have a max value as well!
        cols: 4,
        getStartData(id) {
            return {level: 0,active: false,fixed: false,type:"div"}
        },
        getUnlocked(id) { // Default
            return (player.cp.grid[id].fixed==false)
        },
        getCanClick(data, id) {
            return true
        },
        getStyle(data,id) {

            if (data.level<1) {
                return {
                    'background':'#3b3939',
                    'width':'100px',
                    'height':'100px',
                    'border-radius':'0%'
                }
            }
            else if (data.active==true) {
                return {
                    'background':'#0f0f0f',
                    'border-color':'yellow',
                    'color':'lime',
                    'width':'100px',
                    'height':'100px',
                    'border-radius':'0%',
                }
            }
            else{
                return {
                    'background':'#0f0f0f',
                    'border-color':'lime',
                    'color':'lime',
                    'width':'100px',
                    'height':'100px',
                    'border-radius':'0%'
                }
            }
        },
        getTooltipStyle(data,id) {
            if (data.level<1) return {
                'background-color':"rgba(0,0,0,0)"
            }
               else {
                switch (options.changeCorruptTooltipPlace) {
                    case "right":
                        return {  
                        'border':'2px solid transparent',
                        'border-image':'linear-gradient(to right, lime 0%, #52f552 50%,lime 100%)',
                        'background':'#0f0f0f',
                        'right': '0%',
                        'left':'260%',
                        'bottom': '5%',
                        'width':'300px',
                        'border-image-slice': '1'
                    };
                    case "left":
                        return {  
                            'border':'2px solid lime',
                            'border-image':'linear-gradient(to right, lime 0%, #52f552 50%,lime 100%)',
                            'background':'#0f0f0f',
                            'right': '0%',
                            'left':'-160%',
                            'bottom': '5%',
                            'width':'300px',
                            'border-image-slice': '1'
                        };
                    case "bottom":
                        return {  
                            'border':'2px solid lime',
                            'border-image':'linear-gradient(to right, lime 0%, #52f552 50%,lime 100%)',
                            'background':'#0f0f0f',
                            'right': '0%',
                            'bottom': '-100%',
                            'width':'300px',
                            'border-image-slice': '1'
                        };
                    case "top":
                        return {  
                            'border':'2px solid lime',
                            'border-image':'linear-gradient(to right, lime 0%, #52f552 50%,lime 100%)',
                            'background':'#0f0f0f',
                            'right': '0%',
                            'bottom': '100%',
                            'width':'300px',
                            'border-image-slice': '1'
                        };
                }
                }
        },
        getCost(data,id) {
            let eff = 1
            eff = new Decimal(5e12).div(data.level).pow(0.5).pow(new Decimal(player.cp.totalCorrupt).div(75).add(1)).pow(new Decimal(data.level/100).add(data.level%100).div(50).add(1))
            if (data.type=='pm') eff = new Decimal(1e16).mul(data.level).pow(0.75)
            return eff
        },
        getEssence(data,id) {
            let gain = 0
            if (data.type=='pm') gain = new Decimal(1).mul(data.level).pow(1.2).add(1)
            else gain = new Decimal(1).mul(data.level).add(1)
        if (hasUpgrade('cp',12)) gain = gain.mul(upgradeEffect('cp',12))
            return gain
        },
        getTooltip(data,id) {
            if (data.level<1) return
            else return "<h5>To fix, get "+format(gridCost('cp',id))+(data.type=="pm"?" prestige essences":" points")+" while corruption is active.<br>When active, " + "/"+ format(gridEffect('cp',id),5)+" to" +(data.type=="pm"?" prestige essences":" points") +"  gain.<br>"+"Reward: Get " + format(gridEssence('cp',id),0)+" corruption essences on fix."
        },

        getEffect(data,id) {
            let eff = 1
           if (data.type=='div') eff = new Decimal(data.level).add(1).mul(3).pow(1+data.level/10)
           if (data.type=='pm') eff = new Decimal(data.level).add(1).mul(1.5).pow(1+data.level/10)
            return eff
        },
        onClick(data, id) { 
            if (data.level>=1) {player[this.layer].grid[id].active=!player[this.layer].grid[id].active
             if (data.type=='pm') player.pm.essence=new Decimal(0)
             if (data.type=='div')player.points=new Decimal(0)
            let slots = activeCorruptions()
            let activeNum = 1
            if (hasUpgrade('cp',11)) activeNum++
            for (i=0;i<slots.length;i++){
            if (slots[i]!=id && activeNum!=slots.length) {
                player.cp.grid[slots[i]] = {level: getGridData('cp',slots[i]).level,active:false,fixed:false,type: getGridData('cp',slots[i]).type}
            }
        }
        }
        },
        getDisplay(data, id) {
            table=''
            if (data.level<1) table="This hard drive is stable. No corruptions detected."
            else table= `<h3>${typeName[data.type]}</h3> Corruption <br>Level: <h3>`+formatRoman(data.level)+"</h3><br>Progress to fix: [==========]"
            for(i=1;i<10;i++){
                if (data.active==true && data.type=='div') {
                if (player.points.gte(gridCost('cp',id).mul(new Decimal(0.1).mul(i)))) {
                    table = table.replace('=','█')        
                 }
            }
            else if (data.active==true && data.type=='pm') {
                if (player.pm.essence.gte(gridCost('cp',id).mul(new Decimal(0.1).mul(i)))) {
                    table = table.replace('=','█')        
                 }
            }
            }
            if (data.active==true&& data.type=='div'){
                table+="<br>-< "+format(player.points.div(gridCost('cp',id)).mul(100))+"% >-" 
            }
            if (data.active==true&& data.type=='pm'){
                table+="<br>-< "+format(player.pm.essence.div(gridCost('cp',id)).mul(100))+"% >-" 
            }
            return table
        },
    },
    layerShown(){return (player.mp.activeChallenge==21)&&(player.pm.best.gte(5))},
    tabFormat: {
        "Corruptions": {
            content:[
                function() { if (player.tab == "cp")  return ["column", [
                    ["display-text", "You caused <h2 style='color:  black; text-shadow: white 0px 0px 10px;'> "+format(player.cp.points,0)+"</h2> corruptions, and fixed <h2 style='color:  lime; text-shadow: lime 0px 0px 10px;'>"+format(player.cp.totalCorrupt,0)+"</h2> of them"],
    				"prestige-button",
                    ["display-text", "You have <h2 style='color:  green; text-shadow: green 0px 0px 10px;'> "+format(player.cp.formatted)+"</h2> corruption essences, which boosts points and Prestige Essences gain by "+ format(corruptEffect())+ "x (points boost works outside of prestige universe)"],
                    ["display-text", "When you do a Corruption Reset, a malware will appear on a random disk.<br>Fix corruptions, get essences and get a boost to prior resources! To activate corruption, click on it.<br>And total corruptions amount will scale up all corruptions goals."],
                     "blank",
                "blank",
                "grid"
                ]
            ]
     },
     ]
            },
            "Upgrades": {
                unlocked() {return player.pm.best.gte(7)},
                content:[
                    function() { if (player.tab == "cp")  return ["column", [
                        ["display-text", "You caused <h2 style='color:  black; text-shadow: white 0px 0px 10px;'> "+format(player.cp.points,0)+"</h2> corruptions."],
                        "prestige-button",
                        ["display-text", "You have <h2 style='color:  green; text-shadow: green 0px 0px 10px;'> "+format(player.cp.formatted)+"</h2> corruption essences, which boosts points and Prestige Essences gain by "+ format(corruptEffect())+ "x (points boost works outside of prestige universe)"],
                        ["display-text", "When you do a Corruption Reset, a malware will appear on a random disk.<br>Fix corruptions, get essences and get a boost to prior resources! To activate corruption, click on it."],
                         "blank",
                    "upgrades",
                    "blank",
                    ]
                ]
         },
         ]
                },
		},
	branches: ["pm"],
    update(diff) {
        if (player.cp.pool.includes("pow")) player.cp.pool = ["div","pm"]
    let slots=activeCorruptions()
        for (i=0;i<slots.length;i++) {
                setTimeout(100000)
                if (player.points.gte(gridCost('cp',slots[i])) && getGridData('cp',slots[i]).type=='div') {
                    player.cp.formatted = player.cp.formatted.add(gridEssence('cp',slots[i]))
                    player.cp.grid[slots[i]]={level: 0,active:false,fixed:false}
                    doPopup("none","Corruption was fixed!","Corruption Info",3,"black","lime")
                    player.cp.totalCorrupt += 1
                } 
                setTimeout(100000)
                if (player.pm.essence.gte(gridCost('cp',slots[i])) && getGridData('cp',slots[i]).type=='pm') {
                    player.cp.formatted = player.cp.formatted.add(gridEssence('cp',slots[i]))
                    player.cp.grid[slots[i]]={level: 0,active:false,fixed:false}
                    doPopup("none","Corruption was fixed!","Corruption Info",3,"black","lime")
                    player.cp.totalCorrupt += 1
                } 
            }
        },
    prestigeButtonText() {
        return "CORRUPT"+(player.points.gte(tmp.cp.nextAt)?" (You can corrupt "+format(tmp.cp.resetGain,0)+ " times)":" (Not enough points)")+"<br>Next at: "+format(tmp.cp.nextAtDisp)+" points."
    },
})