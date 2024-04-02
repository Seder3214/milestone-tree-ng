const rarityName = {
    1:"<h3 style='color: gray; filter: drop-shadow(1px 1px black) drop-shadow(0px 0px 1px black);'>Weak</h3>",
    2:"Rare",
    3:"Super Rare",
    4:"Mythic",
    5:"Arcane",
    6:"Stellar"
}

function corruptedEffect() {
    let eff = new Decimal(1)
    eff = eff.add(player.art.formatted.add(1).log10().mul(1.27).pow(1.5))
    if (hasUpgrade('cp',12)) eff = eff.mul(upgradeEffect('cp',12))
    if (player.mp.modeP==true&&tmp.pm.count>=7) eff = eff.mul(tmp.pm.pChalReward2)
    if (player.art.buyables[21].gte(1)) eff = eff.mul(buyableEffect("cp",21))
    return eff
}
addLayer("art", {
    name: "prestige points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ART", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        formatted: new Decimal(0),
        pool: ["div","pm"],
        totalCorrupt:0,
    }},
    tooltip() {
        return format(player.art.points,0)+ " corrupted prestige points"
    },
    nodeStyle() {
        return {
            'border': '5px solid green',
            'border-style': 'dashed',
            'color':'green',
        }
    },
    canReset() {
        return tmp.cp.resetGain>0&&player.pm.activeChallenge!=12
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
        if(l=="art"){
        for (i=0;i<tmp.art.resetGain;i++) {
        let grid = player.art.grid
        let slots = Object.keys(grid).filter(x => grid[x].level==0 && (Math.floor(x/100)<=tmp.art.grid.rows && (x%10)<=tmp.art.grid.cols && x>=201))
        if (slots.length) {
            let slot = slots[Math.floor(Math.random() * slots.length)]
            let ran = 6
            let essenceEff = new Decimal(1)
            let essenceEffPow = new Decimal(1)
            let pointEff = new Decimal(1)
            let pointEffPow = new Decimal(1)
            let runeEff = new Decimal(1)
            let runeEffPow = new Decimal(1)
            let manaEff = new Decimal(1)
            let add = 1
            let maxLevel = 5
            let tier= Math.random() * (1-maxLevel)+maxLevel
            let ranType = Math.random() * (add - ran) + ran;
            let rarityAffect=new Decimal(3.59).pow(ranType*2)
            manaEff=Math.random() *(1-rarityAffect/10)+rarityAffect/10
            if (ranType>=1) {
                pointEff = Math.random() *(1-rarityAffect*2.35)+rarityAffect*2.35
            }
            player.art.grid[101].unlocked=true
            player.art.grid[slot] = { level: tier,rarity:Math.floor(ranType),choosed:false,unlocked:true,pEff:pointEff,pEffExp:pointEffPow,eEff:essenceEff,eEffExp:essenceEffPow,rEff:runeEff,rEffExp:runeEffPow,mEff:manaEff }
            

    }
}
}
},
    requires(){
		let b=new Decimal(2e6);
        if (player.art.points.gte(250)) b=new Decimal(1e29)
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
    row: 0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(12),
	exponent: function(){
		return new Decimal(0.65)
	},
    hotkeys: [
        {key: "ctrl+c", description: "Ctrl+C: Corrupt prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
    11:{
        title(){
            return "Upgrade 1st slot";
        },
        display(){
            let data = tmp[this.layer].buyables[this.id];
            return "Level: "+format(player[this.layer].buyables[this.id],0)+
            ". Cost for Next Level: "+format(data.cost)+" Mana";
        },
        cost(x) {return new Decimal(1500).mul(x.add(1).times(new Decimal(getGridData('art',101).rarity).add(1).pow(2.5)));
        },
        canAfford() {
               return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
        },
           buy() { 
               player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
           },
          effect(x){
            let eff = x.mul(2)
              return eff;
          },
          style() {
            if (player.mp.points.lt(this.cost())) return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'50px',
                'width':'150px',
            }
            else return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'rgb(68, 68, 68)',
                'border':'2px solid',
                'height':'50px',
                'width':'150px',
            }
        }
    },
    12:{
        title(){
            return "Upgrade 2nd slot";
        },
        display(){
            let data = tmp[this.layer].buyables[this.id];
            return "Level: "+format(player[this.layer].buyables[this.id],0)+
            ". Cost for Next Level: "+format(data.cost)+" Mana";
        },
        cost(x) {return new Decimal(1e7).mul(x.add(1).times(1+getGridData('art',102).rarity*1.76));
        },
        canAfford() {
               return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
        },
           buy() { 
               player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
           },
          effect(x){
            let eff = x.mul(2)
              return eff;
          },
          style() {
            if (player.mp.points.lt(this.cost())) return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'50px',
                'width':'150px',
            }
            else return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'rgb(68, 68, 68)',
                'border':'2px solid',
                'height':'50px',
                'width':'150px',
            }
        }
    },
},
    grid: {
        maxRows:7,
        maxCols:7,
        rows() {
        let rows = 5
        return rows},
        cols() {
        let cols = 7
        return cols},
        getStartData(id) {
           if (id==101&&id>200) return {level: 0,rarity:0,unlocked:true,choosed:false,pEff:1,pEffExp:1,eEff:1,eEffExp:1,rEff:1,rEffExp:1,mEff:1}
           else return {level: 0,rarity:0,unlocked:false,choosed:false,pEff:1,pEffExp:1,eEff:1,eEffExp:1,rEff:1,rEffExp:1,mEff:1}
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        getStyle(data,id) {
            if (data.choosed) return {
                'background':'#0f0f0f',
                'border-color':'gold',
                'color':'white',
                'width':'100px',
                'height':'100px',
                'border-radius':'0%'
            }
            if (data.level<1) {
                return {
                    'background':'black',
                    'border-color':'#6495ed',
                    'width':'100px',
                    'color':'white',
                    'height':'100px',
                    'border-radius':'0%'
                }
            }
            else{
                if (data.choosed) return {
                    'background':'#0f0f0f',
                    'border-color':'gold',
                    'color':'white',
                    'width':'100px',
                    'height':'100px',
                    'border-radius':'0%'
                }
                else return {
                    'background':'#0f0f0f',
                    'border-color':'#6495ed',
                    'color':'white',
                    'width':'100px',
                    'height':'100px',
                    'border-radius':'0%'
                }
            }
        },
        getTooltipStyle(data,id) {
            if (data.level<1) return {
                'background':'rgba(0,0,0,0)',
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
        getEssence(data,id) {
            let gain = new Decimal(0)
             gain = new Decimal(1).mul(data.level).pow(1.5).add(1)
            return gain},
        getTooltip(data,id) {
            table=""
            table+=format(getGridData('art',id).mEff)+"x to mana gain.<br>"
            if (data.rarity>=1) {table+=format(getGridData('art',id).pEff)+"x to points gain."}
            if (data.level<1) return table
            return table
        },
        onClick(data, id) { 
            if (id<200 && data.unlocked==true) data.choosed=!data.choosed
            else if (id>200)data.choosed=!data.choosed
            let choosedSlots=Object.keys(player.art.grid).filter(x => player.art.grid[x].choosed==true)
            if (choosedSlots.length>1){ 
                let prevGridable=getGridData('art',choosedSlots[1])
                player.art.grid[choosedSlots[1]]=player.art.grid[choosedSlots[0]]
                player.art.grid[choosedSlots[0]]=prevGridable
                player.art.grid[choosedSlots[0]].choosed=false
                player.art.grid[choosedSlots[1]].choosed=false
            }
            else;
        },
        getDisplay(data, id) {
            table=''
            if (id>101 && id<200) table="This is an artifact slot. To unlock it, reach max. level on previous slot."
            else if (data.level<1) table=""
            else table= `<h3>${data.rarity>0?rarityName[data.rarity]:""}`+ ` Artifact</h3>` +"<br>Level: <h3>"+formatRoman(data.level)+"</h3>"
            for(i=1;i<11;i++){
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
            return table
        },
    },
    layerShown(){return true},
    tabFormat: {
        "Corruptions": {
            content:[
                function() { if (player.tab == "art")  return ["column", [
                    ["display-text", "You caused <h2 style='color:  black; text-shadow: white 0px 0px 10px;'> "+format(player.art.points,0)+"</h2> corruptions, and fixed <h2 style='color:  lime; text-shadow: lime 0px 0px 10px;'>"+format(player.art.totalCorrupt,0)+"</h2> of them"],
    				"prestige-button",
                    ["display-text", "You have <h2 style='color:  green; text-shadow: green 0px 0px 10px;'> "+format(player.art.formatted)+"</h2> corruption essences, which boosts points and Prestige Essences gain by "+ format(corruptEffect())+ "x (points boost works outside of prestige universe)"],
                    ["display-text", "When you do a Corruption Reset, a malware will appear on a random disk.<br>Fix corruptions, get essences and get a boost to prior resources! To activate corruption, click on it.<br>And total corruptions amount will scale up all corruptions goals."],
                     "blank",
                "blank",
                "buyables",
                "grid"
                ]
            ]
     },
     ]
            },
		},

    update(diff) {
        },
    prestigeButtonText() {
        return "CORRUPT"+(player.points.gte(tmp.art.nextAt)?" (You can corrupt "+format(tmp.art.resetGain,0)+" times)":" (Not enough points)")+"<br>Next at: "+format(tmp.art.nextAtDisp)+" points."
    },
})