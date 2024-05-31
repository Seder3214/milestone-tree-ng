addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "★", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "gold", // Can be a function that takes requirement increases into account
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    tooltip() {return format(player.ach.achievements.length,0)+" Achievements."},
    canReset() {
        return player.points.gte(tmp.pm.nextAt)&&player.pm.activeChallenge==undefined
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    achBoost() {
        let eff = new Decimal(player.ach.achievements.length).add(1).pow(1.275)
        return eff
    },
    newRow: 0,
    row:'side', // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
	resetsNothing(){return true},
	achievements: {
        tooltipStyle() {
            return {'border':'2px solid lime',
            'border-image':'linear-gradient(to right, gold 0%, rgb(252, 241, 94) 50%,gold 100%)',
            'width':'300px',
            'border-image-slice': '1'}
        },
		11:{
			name: "Where it all begins",
            done() {return getPointGen().gte(1)}, // Used to determine when to give the milestone   
            tooltip() {return "Start generating points!"},
        },
        12:{
			name: "Not the prestige points again!",
            done() {return player.m.best.gte(5)}, // Used to determine when to give the milestone   
            tooltip() {return "Unlock Prestige Layer.<br>Reward: 1st mlestone is "+format(this.effect())+"x better by prestige points."},
            effect() {return player.p.points.add(1).log10().pow(0.5).add(1)},
        },
        13:{
            name: "Softcapped already?",
            done() {return player.m.best.gte(tmp.m.getScalingStart)}, // Used to determine when to give the milestone   
            tooltip() {return "Reach the start of Milestone Scaling.<br>Reward: Milestone Scaling starts +"+format(this.effect())+" later based on best milestones."},
            effect() {return softcap(player.m.best.div(tmp.m.getScalingStart).pow(1.05),new Decimal(3.5),0.1)},
        },
        14:{
            name: "Would you rather be automated?",
            done() {return player.m.best.gte(20)}, // Used to determine when to give the milestone   
            tooltip() {return "Automate the Prestige Points gain."},
        },
        15:{
			name: "Prestige points again? Wait, it's super ones!",
            done() {return player.m.best.gte(25)}, // Used to determine when to give the milestone   
            tooltip() {return "Unlock Super Prestige Layer.<br>Reward: Prestige Points are "+format(this.effect())+"x better by itself."},
            effect() {return player.p.points.add(1).log2().pow(0.5).add(1)},
        },
        16:{
            name: "Getting rich!",
            done() {return player.points.gte('1e1000')}, // Used to determine when to give the milestone   
            tooltip() {return "Get 1e1000 points"},
        },
        17:{
			name: "Not the another milestones...",
            done() {return player.mm.best.gte(1)}, // Used to determine when to give the milestone   
            tooltip() {return "Get Meta-Milestone"},
        },
        18:{
            name: "Getting richer?",
            done() {return player.points.gte('1e10000')}, // Used to determine when to give the milestone   
            tooltip() {return "Get 1e10000 points"},
        },
        19:{
            name: "Get boosted for your prestige!",
            done() {return player.pb.points.gte(1)}, // Used to determine when to give the milestone   
            tooltip() {return "Get a Prestige Boost.<br>Reward: Super Prestige Points are "+format(this.effect())+"x better by prestige boosts."},
            effect() {return player.pb.points.add(1).pow(2)},
        },
        21:{
            name: "I can handle it without you :)",
            done() {return player.p.upgrades.length==0 && player.p.points.gte('1e12500')}, // Used to determine when to give the milestone   
            tooltip() {return "Get 1e12500 Prestige Points without prestige upgrades.<br>Reward: Super Prestige Upgrade 23 base is +"+format(this.effect(),4)+" better by prestige points."},
            effect() {return player.p.points.add(1).log10().add(1).log2().add(1).div(1000)},
        },
        22:{
            name: "Would you rather be automated too?",
            done() {return player.m.best.gte(57)}, // Used to determine when to give the milestone   
            tooltip() {return "Automate the Super Prestige Points gain."},
        },
        23:{
            name: "Wooohoooo!!!",
            done() {return player.ap.activeChallenge==11 && player.p.points.gte('e3500000')}, // Used to determine when to give the milestone   
            tooltip() {return "Get e3,500,000 Prestige Points in Atomic Challenge 11.<br>Reward: Prestige Upgrade 31's effect is +"+format(this.effect(),4)+" better by prestige points."},
            effect() {return softcap(player.p.points.add(1).log10().add(1).log10().add(1).div(10),new Decimal(0.1),0.1)},
        },
        24:{
            name: "So many boosters!!!",
            done() {return player.ap.activeChallenge==12 && player.pb.points.gte(60)}, // Used to determine when to give the milestone   
            tooltip() {return "Get 60 Prestige Boosts in Atomic Challenge 12.<br>Reward: Hyper Prestige Upgrade 23's effect is +"+format(this.effect(),4)+" better by super prestige points."},
            effect() {return player.sp.points.add(1).log10().add(1).log10().add(1).log10().add(1).div(1000)},
        },
        25:{
            name: "Without Prestige???",
            done() {return player.ap.challenges[31]>=1}, // Used to determine when to give the milestone   
            tooltip() {return "Get 1 Atomic Prestige 31 completion."},
        },
        26:{
            name: "You can be dilated and without prestige! Cool!",
            done() {return player.ap.activeChallenge==31 && player.t.activeChallenge==11 && player.points.gte('1e150000')}, // Used to determine when to give the milestone   
            tooltip() {return "Get 1e150000 Points while in Transcend Challenge 11 and Atomic Challenge 31.<br>Reward: Transcend Point gain is "+format(this.effect())+"x better based on achievements"},
            effect() {return new Decimal(player.ach.achievements.length).add(1).log2().pow(1.5)},
            
        },
        27:{
            name: "Fully Transcended! Or not?",
            done() {return player.t.upgrades.includes(11)&&player.t.upgrades.includes(12)&&player.t.upgrades.includes(13)&&player.t.upgrades.includes(14)}, // Used to determine when to give the milestone   
            tooltip() {return "Buy first row of Transcend Upgrades.<br>Reward: Keep +3 AP challenges completions."},
        },
        28:{
            name: "Even more boosters!!",
            done() {return player.hb.points.gte(7)}, // Used to determine when to give the milestone   
            tooltip() {return "Get 7 Hyper Boosts.<br>Reward: Add +0.015 to hyper Boost effect."},
        },
        29:{
            name: "I. AM. POWER!!!",
            done() {return player.pp.points.gte(1)}, // Used to determine when to give the milestone   
            tooltip() {return "Get a Prestige Power."},
        },
    },
    tabFormat: {
        "Main": {
            content:[
                function() { if (player.tab == "ach")  return ["column", [
    				"prestige-button","resource-display",
                    ["display-text", "You completed <h2 style='color:  gold; text-shadow: gold 0px 0px 10px;'> "+format(player.ach.achievements.length,0)+"/"+format(Object.keys(tmp.ach.achievements).length - 3,0)+"</h2> achievements, that boosts 1st milestone effect by "+format(tmp.ach.achBoost)+"x."],
                "blank",
                "achievements",
                "blank",
                ]
            ]
     },
     ]
		},
    },
	doReset(){},
})