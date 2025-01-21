addLayer("pm", {
    name: "prestige-milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        essence: new Decimal(0),
        best: new Decimal(0),
        challengeTimer: new Decimal(0),
    }},
    color: "#f71c50",
    requires(){
		let b=new Decimal(25);
		return b;
	}, // Can be a function that takes requirement increases into account
    resource() {
        if(player[this.layer].best.gte(15)){//unstable
            if(Date.now()%1400<350)return "p███t█ge m██e█to██s.";
            if(Date.now()%1400<700)return "p██s██g█ █i███ton██";
        }
        return "prestige milestones"}, // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    canReset() {
        return player.points.gte(tmp.pm.nextAt)&&player.pm.activeChallenge==undefined
    },
    gain() {
        let gain = new Decimal(0)
        if (player.pm.best.gte(1)) gain=gain.add(tmp.pm.reduce)
        if (player.mp.modeE==true) gain = gain.mul((buyableEffect('mp',22).eff))
        if (player.pm.best.gte(4)) gain = gain.mul(tmp.pm.pMilestone4Effect)
        if (player.pep.buyables[11].gte(1)) gain = gain.mul(tmp.pep.prOneEffect)
        if (player.cp.formatted.gte(1)) gain = gain.mul(corruptEffect())
        let s = new Decimal(1)
        for(var i in player.cp.grid) {
            if (getGridData("cp", i).active==true && getGridData("cp", i).type=='pm') s=(gridEffect('cp',i).gte(s)?gridEffect('cp',i):s)
          }
        if (player.pm.activeChallenge==11) gain = gain.pow(0.3*(player.pm.challengeTimer.add(1).log10().add(1)))
        if (player.pm.activeChallenge==12||player.pm.activeChallenge==13) return player.pm.challengeTimer.add(1).pow(2.75).add(1)
        if (challengeCompletions('pm',11)>=1) gain = gain.mul(challengeEffect('pm',11))
        if (hasUpgrade("sp",51)) gain = gain.mul(upgradeEffect("sp",51))
        return gain.div(s).max(1)
    },
    reduce() {
		let base = 0.5
		if (player.mp.buyables[23].gte(1)) base += buyableEffect('mp',23).toNumber()
		let eff=player.mp.points.add(1).log2().add(1).pow(base)
		if (player.pm.best.gte(3)) eff = eff.mul(5)
        if (player.pep.buyables[11].gte(1)) eff = eff.mul(tmp.pep.prOneEffect.pow(0.5))
        if (player.mp.modeP==true&&tmp.pm.count>=11) eff = eff.div(tmp.pm.pChalReward3)
        if (player.mp.modeE==true&&tmp.pm.count>=11) eff = eff.mul(tmp.pm.pChalReward3)
        return eff
	},
    essenceBoost() {
        let eff = player.pm.essence.add(1).log2().pow(2).mul(0.1)
        eff = eff.mul(buyableEffect('mp',22).eff)
        if (player.mp.modeP==true) eff = eff.mul((buyableEffect('mp',22).eff).div(2).add(3))
        if (player.pm.activeChallenge!=undefined) eff = eff.mul(1.5*(player.pm.challengeTimer.add(1).log10()))
        return eff.max(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    newRow: 0,
    row:0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal(12),
	exponent: function(){
        if (player.pm.points.gte(9)) return player.pm.points.div(10).add(0.31)
        if (player.pm.points.gte(7)) return new Decimal(1.25)
		else return new Decimal(1)
	},
    hotkeys: [
        {key: "ctrl+p", description: "Ctrl+P: Get Prestige Milestone", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (player.mp.activeChallenge==21)},
	resetsNothing(){return true},
	milestones: [
		{
			requirementDescription: "1st Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Get prestige essence/s based on how much points gain was reduced."
			},
        },
        {
			requirementDescription: "2nd Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock more Multiverse Fusioners."
			},
        },
        {
			requirementDescription: "3rd Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Make 1st milestone reducing effect 5.00x stronger."
			},
        },
        {
			requirementDescription: "4th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(3)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Points affects prestige essence gain. Currently: "+format(tmp.pm.pMilestone4Effect)+"x"
			},
        },
        {
			requirementDescription: "5th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(4)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Prestigify Exotic Prestige Points. (Unlock the layer again but with new content)"
			},
            style() {
                if (hasMilestone('pm',4)) return {
                    'background':'#3C2D15',
                    'border-color':'#c89646',
                    'color':'#c89646',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription: "6th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(5)},
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock a new layer."
			},
            style() {
                if (hasMilestone('pm',5)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription: "7th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(6)},
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock 1 more upgrade on row 1 layers."
			},
            style() {
                if (hasMilestone('pm',6)) return {
                    'background':'linear-gradient(to right, #00520b 0%, #3C2D15 50%)',
                    'border-color':'transparent',
                    'background-color':'transparent',
                    'border-image':'linear-gradient(to right, lime 0%, lime 20%,#c89646 50%)',
                    'color':'white',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription: "8th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(7)},
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock 1 more upgrade on row 1 layers."
			},
            style() {
                if (hasMilestone('pm',7)) return {
                    'background':'linear-gradient(to right, #00520b 0%, #3C2D15 50%)',
                    'border-color':'transparent',
                    'background-color':'transparent',
                    'border-image':'linear-gradient(to right, lime 0%, lime 20%,#c89646 50%)',
                    'color':'white',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription: "9th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(8)},
            done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Massively reduce post-15th level Trojan corruption goals and slightly reduce Backdoor corruption goals."
			},
            style() {
                if (hasMilestone('pm',8)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription: "10th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(9)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock Corruption Milestones."
			},
            style() {
                if (hasMilestone('pm',9)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription() {
                if(player[this.layer].best.gte(15)){//unstable
                    if(Date.now()%1400<350)return "11th Pres████ ██l█s██n█.";
                    if(Date.now()%1400<700)return "11th P███████ M███s█o██.";
                }
                return "11th Prestige Milestone"},
            unlocked() {return player[this.layer].best.gte(10)},
            done() {return player[this.layer].best.gte(11)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Unlock 1 more upgrade on row 1 layers."
			},
            style() {
                if (hasMilestone('pm',10)) return {
                    'background':'linear-gradient(to right, #00520b 0%, #3C2D15 50%)',
                    'border-color':'transparent',
                    'background-color':'transparent',
                    'border-image':'linear-gradient(to right, lime 0%, lime 20%,#c89646 50%)',
                    'color':'white',
                    'width': '100%',
                    'border-image-slice': '1'
                }
            },
        },
        {
			requirementDescription() {
                if(player[this.layer].best.gte(15)){//unstable
                    if(Date.now()%1400<350)return "12th Pres████ ██l█s██n█.";
                    if(Date.now()%1400<700)return "12th P███████ M███s█o██.";
                }
                return "12th Prestige Milestone"},
            unlocked() {return player[this.layer].best.gte(11)},
            done() {return player[this.layer].best.gte(12)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Scaled Essence Fusioners starts +"+format(tmp.pm.pMilestone11Effect,3)+" later based on Prestige Essence. Unlock Prestige Universe Challenges."
			},
            style() {
                if (hasMilestone('pm',11)) return {
                    'background':'rgba(208, 56, 0,0.1)',
                    'border-color':'rgb(208, 56, 0)',
                    'color':'rgb(208, 56, 0)',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription() {
                if(player[this.layer].best.gte(15)){//unstable
                    if(Date.now()%1400<350)return "13th Pres████ M███st██e.";
                    if(Date.now()%1400<700)return "13th P███████ M███s██ne.";
                }
                return "13th Prestige Milestone"},
            unlocked() {return player[this.layer].best.gte(12)},
            done() {return player[this.layer].best.gte(13)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Reduce maximum corruption level that can spawn by -"+format(tmp.pm.pMilestone13Effect,3)+" based on Prestige Milestones."
			},
            style() {
                if (hasMilestone('pm',12)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription() {
                                if(player[this.layer].best.gte(15)){//unstable


                    if(Date.now()%1400<350)return "14th Pres████ M█s█o█e.";


                    if(Date.now()%1400<700)return "14th P███████ ███es█o██.";
                }
                return "14th Prestige Milestone"},
            unlocked() {return player[this.layer].best.gte(13)},
            done() {return player[this.layer].best.gte(14)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Reduce corruption goals by /"+format(tmp.pm.pMilestone14Effect,3)+" based on Prestige Milestones and Prestige Essences."
			},
            style() {
                if (hasMilestone('pm',13)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
        {
			requirementDescription: "15th Prestige Milestone",
            unlocked() {return player[this.layer].best.gte(14)},
            done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
                if(player[this.layer].best.gte(15)){//unstable


                    if(Date.now()%1400<350)return "S̖̗̮̖̠̏̈̆̈́õ͖̯͚̗̊m̜̱̎e̹͙̫̬ͥ̌ͦ̓ͪ̔t̲͕̽ͥ͆́ͨͫĥ̳̣̦̟̟͗̄̂ḭ̠̌̎͌ͫn͆͑̽g̓͌ ͙͗̊̒͌ͨ̚î̻̜͓͖͇̝̲̓̿̇ͪͨ͌ṡ͚̼̒̔ͮ ͓̈͑͊̌̇ͨw͕̲̏̿ͣ̈ͭ̿r̞̉o̘̝̱̗͙ͬn̺̜̤͐ͭͯ̽g̖͚̩̓̌̅͋̌̿̽ in Prestige Universe...<br>Prestige Essences effect is applied in Normal Universe (after the softcap).";


                    if(Date.now()%1400<700)return "S̮̠̫̭͉͗͋o͖̤̖̗͎̪͊̍ͬ̏̌̚m̙̰̜ͤ̉̓̈̉͑ͫ̀e̖̪̜ͨ͛ͫ͛ͤt͇̦̥̦̭̳̺ͫ̈ḣ͂͊͗͐i̺̟̳̓͊͋n̩̼̹̠̲̆͒̿ͯg͍͈̅̐͑ͯ̚ͅ ͈̪̠̳͕̣͍̓̈ͯ͐̇̿̽ͭ̐i͚͚͊s̹͇͆̋ ͚̝̺͖̦̐̽̅ͬ̄ͭw̭̾ͣ͂̇͌ͫͅr̺͚̤̞̎̀ͤͥ̚o̬̣͇̱ͮ͒ṉ̮̭̟̍͋ͫͬ͂̾ͥǧ̪̞͇͓̥ͤ́͐̇̏ in Prestige Universe...<br>Prestige Essences effect is applied in Normal Universe (after the softcap).";


                    
                    if(Date.now()%1400<1050)return "S͉̯̦͔̟̬͙ͦ̋̂̓̎ͤ̓ͣ̇̚ͅͅọ͎͎͈͈̙̘ͪ̿̍̋m̳̪̖̮̻̻͔̱̰̦̬͈̦͓̳͚̬̞ͬ̃ͮ͛ͤ̌̍ͮ͐̄ë͙̙̞̼̮̰̩̗͛̂̇̄̓͗̿̏̽̈ͦ͛t̙͈̗̩͛ͧ͂̄͊͗ͮ̂̾̑̌h̬̳͍̥̺̣̙̹̬̤̣͎ͧ̑̾́ͭͩ̊͑ͬ̽̅́́̍̇̔ͭi̘̹̹̙̺̞̠͍̗̖̪̮̽̇͑͆̒ͭ̋͋͑̏ͧͅn̺̙̺̖̬̘̱̠̠̺̻͑̌̅ͪ́̉̒͊ͧ̈́ͦͥͦ̏͊g̠͍̠͖̖͙͉̮͉͍͚͈͎͗͐ͫ̀ͣ̀̿̾ͦ̉͐́ͦ̍̔ͨͥ͆ ̻̫͈̼̣͖̫͕͎̿͛̈́͗̆̍̊̂ͬ̓̍ͥ̄̆̌i̗̞̤͇͎̪͈͙̦͕̟̬͍ͭ͂ͧ́̐̇͆ͅs͓̰͍͖̭̭ͨ͌̎ͭ̊̓̓͐̔ͫ̓̊ͭͅ ͇̗̹̮̪̼̳͎̹̔͂̂̔̉̓ͦ̊͂̋́ͤ̍̂̚̚ẇ̼͙̼̟̪̇̄͑ͫͤ̒ͧ̈́̐͒͑̌̀̉ͤ̓ͮr̞͔̖͔̩͉̻͖̙̺̪̯͙͓̞ͯ̈͛ͮͨͯͪ͐ͨ̅͋̇͑ͫ́̓ͯͪ͆ŏ̞̺͎͍̟̭̞͍̯̩̣͉̦͚͚̥ͭ̊ͮ̈̈́̐̄̚ṅ̬͔̠̫̣̺̫͖̺͕͖̰̗͔̗̌̒̀̏ͬ̏̓͌̊͒̄̉̌̅͆̋͛͗ͅg͈͖̳͉̳͍ͨ̽ͩ̽̑̓ͥ̍̈ͩ̈͐̄͒́͗ͦ in Prestige Universe...<br>Prestige Essences effect is applied in Normal Universe (after the softcap).";


                }
				return "Something is wrong in Prestige Universe...<br>Prestige Essences effect is applied in Normal Universe (after the softcap)."
			},
            style() {
                if (hasMilestone('pm',14)) return {
                    'background':'#00520b',
                    'border-color':'lime',
                    'color':'lime',
                    'width': '100%',
                }
            },
        },
	],
    challenges: {
        11:{
            levelScale() {
                let scale= new Decimal(35).add(new Decimal(challengeCompletions('pm',11)>=3?4:5).mul(challengeCompletions('pm',11)))
                return scale
            },
            onEnter() {
                player.pm.essence=new Decimal(0)
                player.points=new Decimal(0)
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].level<1 && x!=101 && (Math.floor(x/100)<=tmp.cp.grid.rows && (x%10)<=tmp.cp.grid.cols))
                player.cp.grid[slots[0]] = {level: this.levelScale(),active:true,fixed:false,type:"div"}
            },
            onExit() {
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].active==true)
                player.cp.grid[slots[0]] = {level:0,active:false,fixed:false,type:"div"}       
                player.pm.challengeTimer = new Decimal(0)
                player.pm.essence=new Decimal(0)
                player.points=new Decimal(0)
            },
            name: "Corrupted Essences",
            completionLimit: new Decimal(5),
            challengeDescription() {return (player.pm.activeChallenge==11?"You spent "+formatTime(player.pm.challengeTimer)+" in this challenge.":"")+ "<br>You are trapped in Level " + format(this.levelScale()) + " Trojan Corruption, Prestige Essences gain formula is much weaker, but increases over time."+"<br>"+format(challengeCompletions(this.layer, this.id),0)
            +"/5 completions.<br>At 2 completions, unlock a new challenge!"},
            unlocked() { return player.pm.best.gte(12) },
            goal: function(){
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].active==true)
                if(player.pm.activeChallenge==11 && slots.length>0)return gridCost('cp',slots[0])
else return new Decimal(1)
            },
            canComplete(){
                return player.points.gte(tmp.pm.challenges[this.id].goal) && player.pm.activeChallenge==11;
            },
            rewardEffect() {
                let ret = 7.39**(player.pm.challenges[11])
                return ret
            },
            goalDescription() {return "Fix the corruption"+(player.pm.activeChallenge==11?" (Reach "+format(this.goal())+" Points in this challenge)":"")},
            currencyDisplayName: "Points",
            rewardDescription() { return "Multiply Prestige Essences gain.<br>Currently: "+format(challengeEffect('pm',11))+"x" },
            style() {
                    if (!this.canComplete()) return {
                        'border-radius': '0%',
                        'color':'lime',
                        'background-color':'black',
                        'border':'2px solid lime',
                        'height':'330px',
                        'width':'330px',
                        "transition":" border 3s"
                    }
                    else return {
                        'border-radius': '0%',
                        'color':'gold',
                        'background-color':'black',
                        'border':'2px solid gold',
                        'cursor':'pointer',
                        'height':'330px',
                        'width':'330px',
                    }
            },
            buttonStyle() {
                if (!this.canComplete()) return {
                    'border-radius': '0%',
                    'color':'lime',
                    'background-color':'rgba(0,0,0,0)',
                    'border':'2px solid lime',
                    "transition":" all 1s"
                }
                    return {
                    'border-radius': '0%',
                    'color':'gold',
                    'background-color':'rgba(0,0,0,0)',
                    'border':'2px solid gold',
                }
        },
        },
        12:{
            levelScaleTrojan() {
                let scale= new Decimal(30).add(new Decimal(30).mul(challengeCompletions('pm',12)))
                return scale
            },
            levelScalePE() {
                let scale= new Decimal(30).add(new Decimal(20).mul(challengeCompletions('pm',12)))
                return scale
            },
            onEnter() {
                layerDataReset('pp')
                layerDataReset('p')
                layerDataReset('sp')
                layerDataReset('pe')
                layerDataReset('hp')
                layerDataReset('ap',["challenges"])
                layerDataReset('pb')
                layerDataReset('hb')
                layerDataReset('se')
                layerDataReset("ep",[])
                layerDataReset("em",[])
                layerDataReset("mm",[])
                layerDataReset("m",[])
                layerDataReset('t',["challenges"])
                player.m.best = new Decimal(0)
                player.mm.best = new Decimal(1)
                player.pm.essence=new Decimal(0)
                player.points=new Decimal(0)
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].level<1 && x!=101)
                player.cp.grid[slots[0]] = {level: this.levelScaleTrojan(),active:true,fixed:false,type:"div"}
                player.cp.grid[slots[1]] = {level: this.levelScalePE(),active:true,fixed:false,type:"pm"}
            },
            onExit() {
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].active==true)
                player.cp.grid[slots[0]] = {level:0,active:false,fixed:false,type:"div"}       
                player.cp.grid[slots[1]] = {level:0,active:false,fixed:false,type:"pm"}      
                player.pm.challengeTimer = new Decimal(0)
                player.pm.essence=new Decimal(0)
                player.points=new Decimal(0)
                player.m.best = new Decimal(185)
                player.m.points = new Decimal(185)
            },
            name: "Corrupted Normal Universe",
            completionLimit: new Decimal(3),
            challengeDescription() {return (player.pm.activeChallenge==12?"You spent "+formatTime(player.pm.challengeTimer)+" in this challenge.":"")+ "<br>You are trapped in Level " + format(this.levelScaleTrojan()) + " Trojan"+ " and in Level " + format(this.levelScalePE())+" Prestige Essence Corruptions, All upgrades that affect First Milestone are much weaker, you're trapped in Normal Universe."+"<br>"+format(challengeCompletions(this.layer, this.id),0)
            +"/3 completions.<br>At 3 completions, unlock a new challenge!"},
            unlocked() { return challengeCompletions('pm',11)>=2 },
            goal: function(){
                let goal=new Decimal(1e13).pow(new Decimal(challengeCompletions('pm',12)/2.5).add(1))
                return goal
            },
            canComplete(){
                return player.p.points.gte(tmp.pm.challenges[this.id].goal) && player.pm.activeChallenge==12;
            },
            rewardEffect() {
                let ret = 15.46**(player.pm.challenges[12])*(challengeCompletions('pm',12)>=1?player.pm.essence.add(1).log2().add(1).log2().pow(1.5):1)
                return ret*(challengeCompletions("pm",13)>=1?challengeEffect('pm',13):1)
            },
            goalDescription() {let req = " Prestige Points"
                return "Get "+format(this.goal())+req},
            currencyDisplayName: "Points",
            rewardDescription() { return "Multiply Points gain (Affected by Prestige Essences).<br>Currently: "+format(challengeEffect('pm',12))+"x" },
            style() {
                    if (!this.canComplete()) return {
                        'border-radius': '0%',
                        'color':'lime',
                        'background-color':'black',
                        'border':'2px solid lime',
                        'height':'330px',
                        'width':'330px',
                        "transition":" border 3s"
                    }
                    else return {
                        'border-radius': '0%',
                        'color':'gold',
                        'background-color':'black',
                        'border':'2px solid gold',
                        'cursor':'pointer',
                        'height':'330px',
                        'width':'330px',
                    }
            },
            buttonStyle() {
                if (!this.canComplete()) return {
                    'border-radius': '0%',
                    'color':'lime',
                    'background-color':'rgba(0,0,0,0)',
                    'border':'2px solid lime',
                    "transition":" all 1s"
                }
                    return {
                    'border-radius': '0%',
                    'color':'gold',
                    'background-color':'rgba(0,0,0,0)',
                    'border':'2px solid gold',
                }
        },
        },
        13:{
            levelScaleTrojan() {
                let scale= new Decimal(50).add(new Decimal(5).mul(challengeCompletions('pm',13)))
                return scale
            },
            onEnter() {
                layerDataReset('pp')
                layerDataReset('p')
                layerDataReset('sp')
                layerDataReset('pe')
                layerDataReset('hp')
                layerDataReset('ap',["challenges"])
                layerDataReset('pb')
                layerDataReset('hb')
                layerDataReset('se')
                layerDataReset("ep",[])
                layerDataReset("em",[])
                layerDataReset("mm",[])
                layerDataReset("m",[])
                layerDataReset('t',["challenges"])
                player.m.best = new Decimal(0)
                player.mm.best = new Decimal(1)
                player.pm.essence=new Decimal(0)
                player.points=new Decimal(0)
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].level<1 && x!=101)
                player.cp.grid[slots[0]] = {level: this.levelScaleTrojan(),active:true,fixed:false,type:"div"}
            },
            onExit() {
                let slots = Object.keys(player.cp.grid).filter(x => player.cp.grid[x].active==true)
                player.cp.grid[slots[0]] = {level:0,active:false,fixed:false,type:"div"}           
                player.pm.challengeTimer = new Decimal(0)
                player.pm.essence=new Decimal(0)
                player.points=new Decimal(0)
                player.m.best = new Decimal(185)
                player.m.points = new Decimal(185)
            },
            name: "Corrupted Normal Universe II",
            completionLimit: new Decimal(3),
            challengeDescription() {return (player.pm.activeChallenge==13?"You spent "+formatTime(player.pm.challengeTimer)+" in this challenge.":"")+ "<br>You are trapped in Level " + format(this.levelScaleTrojan()) + " Trojan"+ " Corruption, All upgrades that affect First Milestone are much weaker, you're trapped in Normal Universe."+"<br>"+format(challengeCompletions(this.layer, this.id),0)
            +"/3 completions.<br>At 3 completions, unlock a new challenge!"},
            unlocked() { return challengeCompletions('pm',12)>=3 },
            goal: function(){
                let goal=new Decimal(70).div(new Decimal(challengeCompletions('pm',13)).div(4).add(1)).floor()
                return goal
            },
            canComplete(){
                return player.pe.points.gte(tmp.pm.challenges[this.id].goal) && player.pm.activeChallenge==13;
            },
            rewardEffect() {
                let ret = 15.46**(player.pm.challenges[13])*(challengeCompletions('pm',12)>=1?player.pm.essence.add(1).log2().add(1).log2().pow(1.5):1)
                return ret
            },
            goalDescription() {let req = " Prestige Energy"
                return "Get "+format(this.goal())+req},
            currencyDisplayName: "Points",
            rewardDescription() { return "Multiply CNU I reward (Affected by Prestige Essences).<br>Currently: "+format(challengeEffect('pm',13))+"x" },
            style() {
                    if (!this.canComplete()) return {
                        'border-radius': '0%',
                        'color':'lime',
                        'background-color':'black',
                        'border':'2px solid lime',
                        'height':'330px',
                        'width':'330px',
                        "transition":" border 3s"
                    }
                    else return {
                        'border-radius': '0%',
                        'color':'gold',
                        'background-color':'black',
                        'border':'2px solid gold',
                        'cursor':'pointer',
                        'height':'330px',
                        'width':'330px',
                    }
            },
            buttonStyle() {
                if (!this.canComplete()) return {
                    'border-radius': '0%',
                    'color':'lime',
                    'background-color':'rgba(0,0,0,0)',
                    'border':'2px solid lime',
                    "transition":" all 1s"
                }
                    return {
                    'border-radius': '0%',
                    'color':'gold',
                    'background-color':'rgba(0,0,0,0)',
                    'border':'2px solid gold',
                }
        },
        },
    },
    tabFormat: {
        "Main": {
            content:[
                function() { if (player.tab == "pm")  return ["column", [
    				"main-display","prestige-button","resource-display",
                    ["display-text", "1st milestone effect reduces your points gain by <h2 style='color:  #f71c50; text-shadow: #f71c50 0px 0px 10px;'> "+exponentialFormat(tmp.pm.reduce,2)+"x</h2>"],
    ["display-text", "You have <h2 style='color: #f71c50; text-shadow: #f71c50 0px 0px 10px;'>"+format(player.pm.essence)+"</h2> (+" + format(tmp.pm.gain)+ "/s) prestige essences, which multiply points gain by <h2 style='color:  #f71c50; text-shadow: #f71c50 0px 0px 10px;'>"+format(tmp.pm.essenceBoost)+"x</h2>"],
                "blank",
                "milestones",
                "blank",
                ]
            ]
     },
     ]
            },
            "Prestige Universe Challenges": {
                content: [
                    "main-display","prestige-button","resource-display",
                    ["display-text", function(){return "You have "+format(tmp.pm.count)+" Total Prestige Universe challenge completions.</h2>"}],
                    ["display-text", function(){return "Reach "+format(tmp.pm.req)+" Prestige Universe challenge completions to unlock an effect.</h2>"}],
                    "blank",
                    ["display-text",function(){table = '<div style="width:500px;border: 2px solid white;"><h2 style="color:  #f71c50; text-shadow: #f71c50 0px 0px 10px;">Current Unlocked Boosts</h2><br>'
                    if (tmp.pm.count.gte(3)) table+=(player.mp.modeP==true?"Points Mode:<br> Reduce Recharge Fusioner effect by <h3 style='color:#f71c50'>-"+format(tmp.pm.pChalReward1)+"</h3>":"Prestige Essence Mode:<br> Increase Recharge Fusioner effect by <h3 style='color:#f71c50'>+"+format(tmp.pm.pChalReward1)+"</h3>")
                    if (tmp.pm.count.gte(7)) table+=(player.mp.modeP==true?"<br>Corruption Essences effect are boosted by <h3 style='color:#f71c50'>"+format(tmp.pm.pChalReward2)+"x</h3>":"<br> Boost Prestiged-Exotic Fusioner 1st Effect by <h3 style='color:#f71c50'>"+format(tmp.pm.pChalReward2)+"x</h3>")
                        if (tmp.pm.count.gte(11)) table+=(player.mp.modeP==true?"<br>Second Pr-Exotic Fusioner effect is <h3 style='color:#f71c50'>/"+format(tmp.pm.pChalReward3)+"</h3> weaker (boosted by Prestige Essences)":"<br>Second Pr-Exotic Fusioner effect is <h3 style='color:#f71c50'>"+format(tmp.pm.pChalReward3)+"x</h3> better")
                    return table+"</div><br>"}],
                    ["challenges",[1]]
                ],
            unlocked() {return player.pm.best.gte(12)},
            },
		},
        count() {
            let count = new Decimal(0)
            for (i in player.pm.challenges) {
                count=count.add(challengeCompletions('pm',i))
            }
            return count
        },
        req(){
            let count=tmp.pm.count
            let req=new Decimal(1)
            if (count.gte(1)) req=req.mul(3)
            if (count.gte(3)) req=req.add(4)
            if (count.gte(7)) req=req.add(4)     
            if (count.gte(11)) req=req.add(9)  
            return req;
        },
    	pMilestone4Effect(){
            let p=player.points.add(1).log10().mul(1.75);
            return p;
        },
    	pMilestone11Effect(){
            let p=player.pm.essence.add(1).log10().add(1).log(5).mul(1.5);
            return p;
        },
    	pMilestone13Effect(){
            let p=player.pm.points.add(1).log2().add(1);
            return p;
        },
    	pMilestone14Effect(){
            let p=player.pm.points.add(1).pow(5.5).pow(player.pm.points.pow(0.15).mul(player.pm.essence.max(1).log10().pow(0.15)));
            return p;
        },
    	pChalReward1(){
            let base=tmp.pm.count
            let p=player.mp.modeP==true?base.div(2).pow(1.75):base.div(1.25).pow(1.75)
            
            return p;
        },
        pChalReward2(){
            let base=tmp.pm.count
            let p=player.mp.modeP==true?base.pow(1.85).div(1.75):base.pow(1.85).div(3)
            
            return p;
        },
        pChalReward3(){
            let base=tmp.pm.count
            let p=player.mp.modeP==true?base.pow(3.45).div(1.75).mul(player.pm.essence.add(1).pow(0.1).add(1).pow(0.25).mul(1.5)):base.pow(3.85).div(3)
            
            return p;
        },
    update(diff) {
        if (player.pm.best.gte(1) && player.mp.activeChallenge==21) player.pm.essence = player.pm.essence.add(tmp.pm.gain.times(diff))
        if (player.pm.activeChallenge!=undefined) player.pm.challengeTimer = player.pm.challengeTimer.add(diff)
    },
	branches: ["m"],
    resetDescription: "Get ",
	doReset(){},
})