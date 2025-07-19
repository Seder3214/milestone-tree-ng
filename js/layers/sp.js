function helper(num) {
	let endings = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
	return endings[num % 10]
}
function fetchTimer(id, burnTimer) {
	player.sp.timer[id] = burnTimer
}
function maxMilestones() {
	let max = 3
	if (hasMalware('m', 18)) max += 1
	return max
}
function countPermanent() {
	let x = 0
	for (i in tmp.sp.milestones) {
		if (tmp.sp.milestones[i].permanent == true) x++
	}
	return x
}
function checkLastUnPermSpark() {
	let min = 0
	for (i of tmp.sp.milestones) {
		if (i.permanent == false) {
			min = Math.max(min, i.id)
			return min
		}
	}
}
function handleBurnDisplay(checkId) {
	if (new Decimal(checkId).lt(player.sp.sparkMilestones) && (tmp.sp.milestones[checkId].permanent == false)) return ["display-text", `<div if="new Decimal(player.sp.chosenSparkMil+1).lt(player.sp.sparkMilestones)" style="border:2px solid white; width:300px; height:44px; background:linear-gradient(to right,rgb(174, 113, 42) ${player.sp.timer[checkId] != undefined ? ((1 - (Math.max(0, (240 - player.sp.timer[checkId]) / 240))) * 300) : 300}px,rgb(30, 30, 30) 0px); display:flexflex-wrap: wrap; align-content: center; justify-content: center; align-items: center;"><span style='font-size:14px'>
	Milestone ${player.sp.timer[checkId] == 0 ? ' Ashed' : ' is Burning'}</span><hr color="#4f4f4f"><span style="font-size:14px">Burning power: </span><span style='color:  rgb(249, 147, 30); text-shadow: rgb(249, 147, 30) 0px 0px 10px; font-size:16px'>` + format(player.sp.timer[checkId] != undefined ? ((1 - (Math.max(0, (240 - player.sp.timer[checkId]) / 240))) * 100) : 100, 3) + `%</span></div>`]
	if (new Decimal(checkId).lt(player.sp.sparkMilestones) && (tmp.sp.milestones[checkId].permanent == true)) return ["display-text", `<div if="new Decimal(player.sp.chosenSparkMil+1).lt(player.sp.sparkMilestones)" style="border:2px solid white; width:300px; height:44px; background:linear-gradient(to right,rgb(174, 113, 42) 300px,rgb(30, 30, 30) 0px); display:flexflex-wrap: wrap; align-content: center; justify-content: center; align-items: center;"><span style='font-size:14px'>
	Milestone is Permanent</span><hr color="#4f4f4f"><span style='font-size:12px'>This milestone will be skipped when burning</span></div>`]
}
function handleBasicMilestoneDisplay(id) {
	return ["row", [["milestone", [id]], handleBurnDisplay(id)]]
}
function handleDisplay() {
	let table1 = handleBasicMilestoneDisplay(player.sp.chosenSparkMil)
	let table2 = ["column", [
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil),
		["blank", '5px'],
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil + 1),
		["blank", '5px'],
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil + 2)]]
	let table3 = ["column", [
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil),
		["blank", '5px'],
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil + 1),
		["blank", '5px'],
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil + 2),
		["blank", '5px'],
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil + 3),
		["blank", '5px'],
		handleBasicMilestoneDisplay(player.sp.chosenSparkMil + 4),
	]
	]
	if (player.sp.showSparkAmt == 1) return table1
	if (player.sp.showSparkAmt == 3) return table2
	if (player.sp.showSparkAmt == 5) return table3
}
addLayer("sp", {
	name: "super-prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() {
		return {
			unlocked: false,
			points: new Decimal(0),
			timer: [],
			ambers: new Decimal(0),
			sparkFill: new Decimal(0),
			ambersDbg: new Decimal(0),
			sparkMilestones: new Decimal(0),
			maxMilestone: 3,
			showSparkAmt: 1,
			chalCooldown: new Decimal(0),
			chosenSparkMil: 0,
			burningTimer: 0,
			ashedMilestones: 0,
			sparkPage: 1,
			fillActive: false,
			perkUpgs: [],
		}
	},
	color() {
		if (hasMalware('m', 15)) return "rgb(238, 112, 112)"
		return "#65A0B0"
	},
	requires() {
		return new Decimal(1e98);
	}, // Can be a function that takes requirement increases into account
	resource() {
		if (hasMalware("m", 15)) return "<span style='color:red'>infected</span> super prestige points"
		return "super-prestige points"
	}, // Name of prestige currency
	baseResource: "prestige points", // Name of resource prestige is based on
	baseAmount() { return player.p.points }, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		if (player.ap.activeChallenge == 12 || player.ap.activeChallenge == 41) return new Decimal(0);
		if (player.m.best.gte(27)) mult = mult.mul(tmp.m.milestone27Effect);
		if (hasAchievement('ach', 19)) mult = mult.mul(achievementEffect('ach', 19))
		if (hasUpgrade("sp", 21)) mult = mult.mul(upgradeEffect("sp", 21));
		if (hasUpgrade("sp", 22)) mult = mult.mul(upgradeEffect("sp", 22));
		if (hasUpgrade("hp", 21)) mult = mult.mul(upgradeEffect("hp", 21));
		if (hasUpgrade("hp", 22)) mult = mult.mul(upgradeEffect("hp", 22));
		if (hasUpgrade("ap", 13)) mult = mult.mul(upgradeEffect("ap", 13));
		mult = mult.mul(tmp.hp.buyables[12].effect);
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		mult = new Decimal(1)
		if (player.m.best.gte(27)) mult = mult.mul(tmp.ap.challenges[12].rewardEffect);
		if (hasUpgrade("t", 13)) mult = mult.mul(1.005);
		if (hasUpgrade("t", 33)) mult = mult.mul(1.005);
		if (player.t.activeChallenge == 31) mult = mult.mul(tmp.t.dilationEffect);
		return mult
	},
	row: 2, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.1,
	hotkeys: [
		{ key: "s", description: "S: Reset for super-prestige points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
	],
	reigniteCost() {
		let cost = (new Decimal(240).sub(player.sp.timer[player.sp.ashedMilestones])).div(15.175).mul(player.sp.ashedMilestones + 1).mul(tmp.sp.milestones[player.sp.ashedMilestones].permanent==true?checkLastUnPermSpark()*2:1)
		if (player.sp.timer[player.sp.ashedMilestones] == 0) cost = cost.mul(1.5)
		return cost
	},
	ambersGain() {
		let eff = player.points.max(1).log(10).pow(0.5).mul(player.m.points.div(player.points.max(1).log(2).pow(0.015).add(1)))
		return eff;
	},
	SparkUnlReq() {
		let base = new Decimal(20)
		if (player.sp.sparkMilestones.gte(2)) base = base.mul(1.17)
		let cost = base.mul(player.sp.sparkMilestones.add(1).pow(1.367).mul(1.45))
		return cost;
	},
	layerShown() { return player.m.best.gte(25) && (player.mp.activeChallenge != 21) || player.pm.activeChallenge == 12 || player.pm.activeChallenge == 13 },
	clickables: {
		11: {
			title() { return `<span style="color:orange; font-size:16px">Ignite the Milestone.</span>` },
			display() { return `<span style="font-size:14px">Auto-fill: ${player.sp.fillActive ? "ON" : "OFF"}</span> <hr color="#4f4f4f"><span style="font-size:10px"><i>Turn your prestige ashes into something that will light you the way from the fall of the Milestone universes</span>` },
			canClick() { return player.sp.ambers.gt(0) },
			onClick() {
				player.sp.fillActive = !player.sp.fillActive
			},
			style() {
				if (!this.canClick) return {
					'border-radius': '0%',
					'color': 'white',
					'background': `linear-gradient(to right, rgb(174, 113, 42) ${player.sp.sparkFill.div(tmp.sp.SparkUnlReq).mul(250)}px ,rgb(30, 30, 30) 0px)`,
					'border': '2px solid',
					'width': '250px',
					'min-height': '100px'
				}
				else return {
					'border-radius': '0%',
					'color': 'white',
					'background': `linear-gradient(to right, rgb(174, 113, 42) ${player.sp.sparkFill.div(tmp.sp.SparkUnlReq).mul(250)}px ,rgb(66, 66, 66) 0px)`,
					'border': '2px solid',
					'min-height': '100px',
					'width': '250px',
				}
			},
			unlocked() {
				return true
			},
		},
		12: {
			title() { return `<` },
			canClick() { return new Decimal(player.sp.chosenSparkMil).gt(0) },
			onClick() {
				if (player.sp.showSparkAmt == 1) player.sp.chosenSparkMil--
				if (player.sp.showSparkAmt == 3) player.sp.chosenSparkMil = player.sp.chosenSparkMil - 3
				if (player.sp.showSparkAmt == 5) player.sp.chosenSparkMil = player.sp.chosenSparkMil - 5
				player.sp.sparkPage--
			},
			style() {
				if (new Decimal(player.sp.chosenSparkMil).gt(0)) return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `grey`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
				else return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `rgb(20, 20, 20)`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
			},
		},
		13: {
			title() { return `>` },
			canClick() {
				return new Decimal(player.sp.chosenSparkMil).lt(player.sp.sparkMilestones.sub(player.sp.showSparkAmt))
			},
			onClick() {
				if (player.sp.showSparkAmt == 1) player.sp.chosenSparkMil++
				if (player.sp.showSparkAmt == 3) player.sp.chosenSparkMil = player.sp.chosenSparkMil + 3
				if (player.sp.showSparkAmt == 5) player.sp.chosenSparkMil = player.sp.chosenSparkMil + 5
				player.sp.sparkPage++
			},
			style() {
				if (new Decimal(player.sp.chosenSparkMil).lt(player.sp.sparkMilestones.sub(player.sp.showSparkAmt))) return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `grey`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
				else return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `rgb(20, 20, 20)`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
			},
		},
		14: {
			canClick() { return true },
			display() { return `<h3>Show Multiple Milestones</h3><hr><b>Currently: ${format(player.sp.showSparkAmt, 0)} Spark Milestone${player.sp.showSparkAmt == 1 ? '' : 's'}</b>` },
			onClick() {
				if (player.sp.showSparkAmt == 1) player.sp.showSparkAmt = 3
				else if (player.sp.showSparkAmt == 3) player.sp.showSparkAmt = 5
				else if (player.sp.showSparkAmt == 5) player.sp.showSparkAmt = 1
				player.sp.sparkPage = 1
				player.sp.chosenSparkMil = 0
			},
			style() {
				return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `grey`,
					'border': '2px solid',
					'min-height': '50px',
					'width': '150px'
				}
			},
		},
		15: {
			title() { return `<<` },
			canClick() { return new Decimal(player.sp.chosenSparkMil).gt(0) },
			onClick() {
				player.sp.chosenSparkMil = 0
				player.sp.sparkPage = 1
			},
			style() {
				if (new Decimal(player.sp.chosenSparkMil).gt(0)) return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `grey`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
				else return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `rgb(20, 20, 20)`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
			},
		},
		16: {
			title() { return `>>` },
			canClick() { return new Decimal(player.sp.chosenSparkMil).lt(player.sp.sparkMilestones.sub(player.sp.showSparkAmt)) },
			onClick() {
				player.sp.chosenSparkMil = new Decimal(player.sp.showSparkAmt).mul(player.sp.sparkMilestones.div(player.sp.showSparkAmt).sub(player.sp.showSparkAmt == 1 ? 1 : 0).floor()).toNumber()
				player.sp.sparkPage = new Decimal(player.sp.sparkMilestones.div(player.sp.showSparkAmt).ceil().max(1)).toNumber()
			},
			style() {
				if (new Decimal(player.sp.chosenSparkMil).lt(player.sp.sparkMilestones.sub(player.sp.showSparkAmt))) return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `grey`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
				else return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': `rgb(20, 20, 20)`,
					'border': '2px solid',
					'min-height': '44px',
					'width': '40px'
				}
			},
		},
		21: {
			title() { return `<span style="color:orange; font-size:16px">Regnite the Milestone #${tmp.sp.milestones[player.sp.ashedMilestones].permanent == true ? checkLastUnPermSpark()+1:player.sp.ashedMilestones+1}.</span>` },
			display() { return `<hr color="#4f4f4f"><span style="font-size:12px">Spend <b>${format(tmp.sp.reigniteCost)}</b> filled prestige ashes to reignite the Spark Milestone ` + (player.sp.ashedMilestones > 0 && player.sp.ashedMilestones==checkLastUnPermSpark()-1? `will burn Spark Milestone #${tmp.sp.milestones[player.sp.ashedMilestones].permanent == true ? checkLastUnPermSpark():player.sp.ashedMilestones} to 10% power)</span>` : '') },
			canClick() { return player.sp.sparkFill.gte(tmp.sp.reigniteCost) },
			onClick() {
				if (player.sp.sparkFill.gte(tmp.sp.reigniteCost)) player.sp.sparkFill = player.sp.sparkFill.sub(tmp.sp.reigniteCost)
				if (player.sp.ashedMilestones >= 0) {
				player.sp.timer[player.sp.ashedMilestones] = 240
				if (player.sp.timer[player.sp.ashedMilestones - 1] == 0 && player.sp.ashedMilestones>0) player.sp.timer[player.sp.ashedMilestones - 1] = 36
				if (player.sp.timer[player.sp.ashedMilestones] == 240 && player.sp.ashedMilestones>0) player.sp.ashedMilestones--
				player.sp.burningTimer = player.sp.timer[player.sp.ashedMilestones]
					let min = 100
					if (tmp.sp.milestones[player.sp.ashedMilestones].permanent == true) for (i of tmp.sp.milestones) {
						if (i.permanent == false) {
							min = Math.min(min, i.id)
							player.sp.ashedMilestones = min
							if (player.sp.timer[min]<1)player.sp.timer[min] = 36
							player.sp.burningTimer = 240
							console.log(`${min}, ${i.id}, ${player.sp.ashedMilestones}`)
						}
					}
			}
			},
			style() {
				return {
					'border-radius': '0%',
					'color': 'white',
					'background': `linear-gradient(to right, rgb(66, 66, 66) 0px)`,
					'border': '2px solid',
					'min-height': '100px',
					'width': '250px',
				}
			},
			unlocked() {
				return player.sp.burningTimer > 0 || player.sp.ashedMilestones > 0
			},
		},
	},
	upgrades: {
		rows: 5,
		cols: 4,
		11: {
			title: "Super-Prestige Delayer I",
			description: "First Milestone's effect is boosted by your super-prestige points.",
			cost: new Decimal(1),
			unlocked() { return true }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = 50;
				if (player.m.best.gte(31)) base += 5;
				if (player.m.best.gte(49)) base += 5;
				if (player.m.best.gte(59)) base += 5;
				if (player.m.best.gte(69)) base += 5;
				if (player.m.best.gte(79)) base += 10;
				if (player.m.best.gte(89)) base += 5;
				if (hasUpgrade("sp", 44)) base += 10;
				let ret = Decimal.pow(base, Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return ret;
			},
			effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
		},
		12: {
			title: "Super-Prestige Delayer II",
			description: "First Milestone's effect is boosted by your super-prestige points.",
			cost: new Decimal(4),
			unlocked() { return true }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = 10;
				if (player.m.best.gte(32)) base += 1;
				if (player.m.best.gte(49)) base += 1;
				if (player.m.best.gte(59)) base += 2;
				if (player.m.best.gte(69)) base += 1;
				if (player.m.best.gte(79)) base += 2;
				if (player.m.best.gte(89)) base += 1;
				if (hasUpgrade("sp", 44)) base += 2;
				let ret = Decimal.pow(base, Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return softcap(ret, new Decimal('e5e14'), 0.2);
			},
			effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
		},
		13: {
			title: "Super-Prestige Prestige Boost I",
			description: "Prestige Point gain is boosted by your super-prestige points.",
			cost: new Decimal(1e15),
			unlocked() { return player.m.best.gte(30) }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = 3;
				if (player.m.best.gte(33)) base += 0.5;
				if (player.m.best.gte(49)) base += 0.5;
				if (player.m.best.gte(59)) base += 0.92;
				if (player.m.best.gte(69)) base += 0.58;
				if (player.m.best.gte(79)) base += 1;
				if (player.m.best.gte(89)) base += 0.5;
				if (hasUpgrade("sp", 44)) base += 1;
				let ret = Decimal.pow(base, Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return softcap(ret, new Decimal('e5e14'), 0.2);
			},
			effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
		},
		14: {
			title: "Super-Prestige Prestige Boost II",
			description: "Prestige Point gain is boosted by your super-prestige points.",
			cost: new Decimal(1e37),
			unlocked() { return player.m.best.gte(30) }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = 1.5;
				if (player.m.best.gte(34)) base += 0.5;
				if (player.m.best.gte(49)) base += 0.5;
				if (player.m.best.gte(59)) base += 0.5;
				if (player.m.best.gte(69)) base += 0.5;
				if (player.m.best.gte(79)) base += 0.766;
				if (player.m.best.gte(89)) base += 0.234;
				if (hasUpgrade("sp", 44)) base += 1;
				let ret = Decimal.pow(base, Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return softcap(ret, new Decimal('e5e14'), 0.2);
			},
			effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
		},
		21: {
			title: "Super-Prestige Self Boost I",
			description: "Super-Prestige Point gain is boosted by your super-prestige points.",
			cost: new Decimal(1e63),
			unlocked() { return player.m.best.gte(35) }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = 1.3;
				let ret = Decimal.pow(base, Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return ret;
			},
			effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
		},
		22: {
			title: "Super-Prestige Self Boost II",
			description: "Super-Prestige Point gain is boosted by your super-prestige points.",
			cost: new Decimal(1e110),
			unlocked() { return player.m.best.gte(35) }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = 1.1;
				let ret = Decimal.pow(base, Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
				return ret;
			},
			effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
		},
		23: {
			title: "Super-Prestige Milestone Boost I",
			description: "6th and 27th Milestone's effect ^(2+(meta-milestones))",
			cost: new Decimal(1e185),
			unlocked() { return player.m.best.gte(40) }, // The upgrade is only visible when this is true、
		},
		24: {
			title: "Super-Prestige Milestone Boost II",
			description: "Third Milestone's effect is boosted by your super-prestige points.",
			cost: new Decimal(1e227),
			unlocked() { return player.m.best.gte(40) }, // The upgrade is only visible when this is true、
		},
		31: {
			title: "Super-Prestige Scaling Delayer I",
			description: "Milestone Cost Scaling is weaker based on your super-prestige points.",
			cost: new Decimal("1e6864"),
			effect() {
				let p = player.sp.points.add(1e20).log10().log10().div(65);
				if (hasUpgrade("sp", 32)) p = p.mul(2);
				if (hasUpgrade("sp", 33)) p = p.mul(1.5);
				if (hasUpgrade("sp", 34)) p = p.mul(1.2);
				if (hasUpgrade("t", 21)) p = p.mul(1.1);
				return p.add(1);
			},
			unlocked() { return player.m.best.gte(55) }, // The upgrade is only visible when this is true
			effectDisplay() { return format(this.effect(), 4) + "x weaker" }, // Add formatting to the effect
		},
		32: {
			title: "Super-Prestige Upgrade 31 Boost I",
			description: "Super-Prestige Upgrade 31 is boosted.",
			cost: new Decimal("1e9617"),
			unlocked() { return player.m.best.gte(55) }, // The upgrade is only visible when this is true
		},
		33: {
			title: "Super-Prestige Upgrade 31 Boost II",
			description: "Super-Prestige Upgrade 31 is boosted.",
			cost: new Decimal("1e13713"),
			unlocked() { return player.m.best.gte(55) }, // The upgrade is only visible when this is true
		},
		34: {
			title: "Super-Prestige Upgrade 31 Boost II",
			description: "Super-Prestige Upgrade 31 is boosted.",
			cost: new Decimal("1e13839"),
			unlocked() { return player.m.best.gte(55) }, // The upgrade is only visible when this is true
		},
		41: {
			title: "Super-Prestige Milestone Boost III",
			description: "Same as Super-Prestige Upgrade 24. To buy this upgrade, You need to complete AP challenge 2 15 times.",
			cost() {
				if (player.ap.challenges[12] < 15) return new Decimal(Infinity);
				return new Decimal("e447e8");
			},
			unlocked() { return player.m.best.gte(127) }, // The upgrade is only visible when this is true
		},
		42: {
			title: "Super-Prestige Milestone Boost IV",
			description: "Same as Super-Prestige Upgrade 24. To buy this upgrade, You need to complete AP challenge 4 21 times.",
			cost() {
				if (player.ap.challenges[22] < 21) return new Decimal(Infinity);
				return new Decimal("e478e8");
			},
			unlocked() { return player.m.best.gte(127) }, // The upgrade is only visible when this is true
		},
		43: {
			title: "Super-Prestige Cost Reducer I",
			description: "First Super-Prestige buyable is cheaper. You can buy this upgrade while you're in AP challenge 6.",
			cost() {
				if (player.ap.activeChallenge != 32) return new Decimal(Infinity);
				return new Decimal("e401e8");
			},
			unlocked() { return player.m.best.gte(127) }, // The upgrade is only visible when this is true
		},
		44: {
			title: "Super-Prestige Row 1 Boost I",
			description: "First row of Super-Prestige upgrades is boosted. You can buy this upgrade while you're in T challenge 5.",
			cost() {
				if (player.t.activeChallenge != 31) return new Decimal(Infinity);
				return new Decimal("e1293e4");
			},
			unlocked() { return player.m.best.gte(127) }, // The upgrade is only visible when this is true
		},
		51: {
			title: "Prestige Essence Boost I",
			description: "Prestige Essence gain is boosted by your prestige points.",
			cost: new Decimal(`e2.52e14`),
			unlocked() { return player[this.layer].perkUpgs.includes(Number(this.id)) }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = new Decimal(2).add(player[this.layer].points.add(1).log10().add(1).log10().pow(1.55).div(100));
				let ret = Decimal.pow(base, Decimal.log10(player[this.layer].points.add(1)).add(1).log10().pow(0.9).add(1))
				if (player.pep.buyables[11].gte(5)) ret = ret.mul(tmp.pep.prFiveEffect)
				if (hasMalware('m', 17)) ret = ret.pow(milestoneEffect('m', 17))
				return softcap(ret, new Decimal('e5e16'), 0.1);
			},
			perkReq() { return "To get this upgrade, get " + format(this.perkCost) + " points in T Challenge 6." },
			perkCan() { return player.points.gte(`e5.985e14`) && player.t.activeChallenge == 32 },
			perkUnl() { return player.ex.dotUnl >= 1 },
			perkCost: new Decimal(`e5.985e14`),
			effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
		},
	},
	challenges: {
		11: {
			onEnter() {
				player.p.perkUpgs = [15, 25, 35, 45]
				player.m.points = new Decimal(0)
				player.em.points = new Decimal(0)
				player.mm.points = new Decimal(0)
				player.points = new Decimal(0)
				player.sp.chalCooldown = new Decimal(20)
			},
			onExit() {
				if (player.sp.chalCooldown.lte(0)) player.sp.ambers = player.sp.ambers.add(tmp.sp.ambersGain)
				player.sp.ambersDbg = player.sp.ambersDbg.add(tmp.sp.ambersGain)
				player.p.perkUpgs = [15, 25, 35, 45]
			},
			name: "Milestone Dilation",
			completionLimit() {
				let comps = new Decimal(0)
				return comps
			},
			challengeDescription() { return "<br>Points and prestige points gain is slog(1.15). Also unlocks more in-challenge Perk Upgrades." },
			unlocked() { return player.pm.best.gte(12) },
			canComplete() {
				return false
			},
			goalDescription() { return "Based on bought milestones amount and points you will produce Milestone Ambers, that can be spent for a temporal boosts for both universes." },
			currencyDisplayName: "Points",
			rewardDescription() { return "The challenge has no rewards, it only produces Milestone Ambers" },
			style() {
				if (!this.canComplete()) return {
					'border-radius': '0%',
					'color': 'rgb(238, 112, 112)',
					'background-color': 'black',
					'border': '2px solid rgb(238, 112, 112)',
					'height': '330px',
					'border-radius': '33%',
					'width': '330px',
					"transition": " border 3s"
				}
				else return {
					'border-radius': '0%',
					'color': 'gold',
					'background-color': 'black',
					'border': '2px solid gold',
					'cursor': 'pointer',
					'height': '330px',
					'width': '330px',
				}
			},
			buttonStyle() {
				if (!this.canComplete()) return {
					'border-radius': '0%',
					'color': 'rgb(238, 112, 112)',
					'border-radius': '33%',
					'background-color': 'rgba(0,0,0,0)',
					'border': '2px solid rgb(238, 112, 112)',
					"transition": " all 1s"
				}
				return {
					'border-radius': '0%',
					'color': 'gold',
					'background-color': 'rgba(0,0,0,0)',
					'border': '2px solid gold',
				}
			},
		},
	},
	buyables: {
		rows: 1,
		cols: 2,
		11: {
			title() {
				return "<h3 class='sr'>Prestige Multiplier</h3>";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"Prestige Point is multiplied by " + format(data.effect) + "<br>" +
					"Cost for Next Level: " + format(data.cost) + " Super-Prestige points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				if (a.gte(3)) {
					let p = 1.309;
					if (hasUpgrade("sp", 43)) p -= 0.029;
					a = a.div(3).pow(p).mul(3);
				}
				return new Decimal("1e652955").mul(Decimal.pow("1e12345", a));
			},
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
			buy() {
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			effect() {
				if (player.ap.activeChallenge == 32 || player.ap.activeChallenge == 41) return new Decimal(1);
				let eff = new Decimal("1e10000").pow(player[this.layer].buyables[this.id]);
				if (hasUpgrade("hp", 31)) eff = eff.pow(1.05);
				eff = eff.pow(tmp.ap.challenges[32].rewardEffect);
				return eff;
			},
			unlocked() {
				return player.m.best.gte(77);
			},
			style() {
				if (player.sp.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': 'black',
					'border': '2px solid',
					'height': '100px'
				}
				else return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': 'rgb(68, 68, 68)',
					'border': '2px solid',
					'height': '100px'
				}
			},
		},
		12: {
			title() {
				return "<h3 class='sr'>Softcap Delayer</h3>";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"1st Milestone's softcap starts " + format(data.effect) + "x later<br>" +
					"Cost for Next Level: " + format(data.cost) + " Super-Prestige points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				a = Decimal.pow(2, a);
				return new Decimal(1).mul(Decimal.pow("ee10", a));
			},
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
			},
			buy() {
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			effect() {
				if (player.ap.activeChallenge == 32 || player.ap.activeChallenge == 41) return new Decimal(1);
				let b = 0.02;
				if (player.m.best.gte(132)) b += 0.01;
				let eff = new Decimal(1).add(player[this.layer].buyables[this.id].mul(b));
				eff = eff.pow(tmp.ap.challenges[32].rewardEffect);
				return eff;
			},
			unlocked() {
				return player.m.best.gte(129);
			},
			style() {
				if (player.sp.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': 'black',
					'border': '2px solid',
					'height': '100px'
				}
				else return {
					'border-radius': '0%',
					'color': 'white',
					'background-color': 'rgb(68, 68, 68)',
					'border': '2px solid',
					'height': '100px'
				}
			},
		},
	},
	milestones: [
		{
			requirementDescription() { return `<span class='spark'>Spark Milestone #${new Decimal(this.id).add(1)}</span>` },
			id: 0,
			unlocked() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) },
			permanent: false,
			tooltip() { return `Currently: ${format(this.effect())}x` },
			tooltipStyle() {
				return {
					'border': '2px solid lime',
					'background': `rgb(19, 19, 19)`,
					'font-size': '12px',
					'border-width': '2px 2px 0 2px',
					'border-image': 'linear-gradient(to right, orange 0%, rgb(255, 132, 0) 50%,orange 100%)',
					'width': '200px',
					'margin-bottom': '0px',
					'border-image-slice': '1'
				}
			},
			done() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) }, // Used to determine when to give the milestone
			effectDescription: function () {
				return `<hr color="#4f4f4f"><span style="font-size:11px">Boost points gain after slog in [Milestone Overflow] by current points.</span>`
			},
			effect() {
				let base = new Decimal(1.155)
				let timerMult = 1 - (Math.max(0, (240 - player.sp.timer[this.id]) / 240))
				let thisId = new Decimal(this.id).toNumber()
				let eff = new Decimal(10).mul(player.sp.ambers.max(1).log(1.5).pow(base).add(1)).pow(player.points.max(1).log(10).max(1).log(2).max(1).pow(0.25)).mul(player.sp.ashedMilestones >= (thisId) ? timerMult : 1).max(1)
				return eff
			},
			style() {
				return {
					'border-radius': '0%',
					'color': 'white',
					'background': `rgb(19, 19, 19)`,
					'border': '2px solid',
					'min-height': '102px'
				}
			},
		},
		{
			requirementDescription() { return `<span class='spark'>Spark Milestone #${new Decimal(this.id).add(1)}</span>` },
			id: 1,
			unlocked() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) },
			tooltip() { return `Currently: ${format(this.effect())}x` },
			permanent: false,
			tooltipStyle() {
				return {
					'border': '2px solid lime',
					'background': `rgb(19, 19, 19)`,
					'font-size': '12px',
					'border-width': '2px 2px 0 2px',
					'border-image': 'linear-gradient(to right, orange 0%, rgb(255, 132, 0) 50%,orange 100%)',
					'width': '200px',
					'margin-bottom': '0px',
					'border-image-slice': '1'
				}
			},
			done() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) }, // Used to determine when to give the milestone
			effectDescription: function () {
				return `<hr color="#4f4f4f"><span style="font-size:11px">Boost [Alternate Prestige Boost I].</span>`
			},
			effect() {
				let base = new Decimal(10)
				let timerMult = 1 - (Math.max(0, (240 - player.sp.timer[this.id]) / 240))
				let thisId = new Decimal(this.id).toNumber()
				let eff = new Decimal(5).mul(player.sp.ambers.max(1).log(base).add(1)).mul(player.sp.ashedMilestones >= (thisId) ? timerMult : 1).max(1)
				return eff
			},
			style() {
				return {
					'border-radius': '0%',
					'color': 'white',
					'background': `rgb(19, 19, 19)`,
					'border': '2px solid',
					'min-height': '102px'
				}
			},
		},
		{
			requirementDescription() { return `<span class='spark'>Spark Milestone #${new Decimal(this.id).add(1)}</span>` },
			id: 2,
			unlocked() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) },
			tooltip() { return `Unlocked: [${format(this.effect(), 0)} / 9]` },
			permanent: true,
			tooltipStyle() {
				return {
					'border': '2px solid lime',
					'background': `rgb(19, 19, 19)`,
					'font-size': '12px',
					'border-width': '2px 2px 0 2px',
					'border-image': 'linear-gradient(to right, orange 0%, rgb(255, 132, 0) 50%,orange 100%)',
					'width': '200px',
					'margin-bottom': '0px',
					'border-image-slice': '1'
				}
			},
			done() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) }, // Used to determine when to give the milestone
			effectDescription: function () {
				return `<hr color="#4f4f4f"><span style="font-size:11px">[Permanent] Unlock more Malware Milestones.</span>`
			},
			effect() {
				let thisId = new Decimal(this.id).toNumber()
				let eff = player.sp.ambers.max(1).pow(0.55).max(1).log(2).floor().add(1).min(9)
				return eff.toNumber()
			},
			style() {
				return {
					'border-radius': '0%',
					'color': 'white',
					'background': `rgb(19, 19, 19)`,
					'border': '2px solid',
					'min-height': '102px'
				}
			},
		},
		{
			requirementDescription() { return `<span class='spark'>Spark Milestone #${new Decimal(this.id).add(1)}</span>` },
			id: 3,
			unlocked() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) },
			tooltip() { return `Currently: ${this.done() ? "Unlocked" : "Not Unlocked"}` },
			permanent: true,
			tooltipStyle() {
				return {
					'border': '2px solid lime',
					'background': `rgb(19, 19, 19)`,
					'font-size': '12px',
					'border-width': '2px 2px 0 2px',
					'border-image': 'linear-gradient(to right, orange 0%, rgb(255, 132, 0) 50%,orange 100%)',
					'width': '200px',
					'margin-bottom': '0px',
					'border-image-slice': '1'
				}
			},
			done() { return player[this.layer].sparkMilestones.gte(new Decimal(this.id).add(1)) }, // Used to determine when to give the milestone
			effectDescription: function () {
				return `<hr color="#4f4f4f"><span style="font-size:11px">[Permanent] Unlock CNU3 in Prestige Universe [ENDGAME].</span>`
			},
			style() {
				return {
					'border-radius': '0%',
					'color': 'white',
					'background': `rgb(19, 19, 19)`,
					'border': '2px solid',
					'min-height': '102px'
				}
			},
		},
	],
	tabFormat: {
		"Main": {
			content: [
				"main-display", "prestige-button", "resource-display",
				'buyables',
				'upgrades',

			]
		},
		"Prestige Ashes": {
			unlocked() { return hasMalware('m', 15) },
			content: [
				"main-display", "prestige-button", "blank",
				["display-text", function () { if (hasMalware('m', 15)) return "You have <h2 style='color:  rgb(249, 147, 30); text-shadow: rgb(249, 147, 30) 0px 0px 10px;'>" + format(player.sp.ambers) + "</h2> Prestige Ashes" }],
				"resource-display",
				"challenges",
			]
		},
		"Spark Milestones": {
			unlocked() { return hasMalware('m', 15) },
			content: [
				"main-display", "prestige-button", "blank",
				["display-text", function () { if (hasMalware('m', 15)) return `You have <h2 style='color:  rgb(249, 147, 30); text-shadow: rgb(249, 147, 30) 0px 0px 10px;'>` + format(player.sp.ambers) + "</h2> Prestige Ashes" }],
				["display-text", function () { if (hasMalware('m', 15)) return "Here you can burn Prestige Ashes to earn Spark Milestones, which will temporarily [Burn]. <br>In order to get the bonuses from these milestones, you should check if they're still burning (working). If they're not, you should burn them by using Prestige Ashes. " }],
				"blank",
				["clickable", [14]],
				"blank",
				["row", [["display-text", function () { return `<div style="border:2px solid white; width:630px; height:96px; display:flexflex-wrap: wrap; align-content: center; justify-content: center; align-items: center;"><span style='font-size:20px'>To unlock Spark Milestone:</span><span style='color:  rgb(249, 147, 30); text-shadow: rgb(249, 147, 30) 0px 0px 10px; font-size:16px'><br>` + format(player.sp.sparkFill) + " / " + format(tmp.sp.SparkUnlReq) + `</span> Prestige Ashes (Unlocked ${format(player.sp.sparkMilestones, 0)} / ${format(maxMilestones(), 0)} Spark Milestones) <hr color="#4f4f4f">Tip: Tap to the clickable on the right to activate/deactivate auto-fill of Prestige Ashes` }], ["display-text", `</div>`], ["clickable", [11]], ["clickable", [21]]]],
				"blank",
				["row", [["display-text", function () { return `(${format(player.sp.ashedMilestones, 0)} / ${format(player.sp.sparkMilestones, 0)} Spark Milestones are Ashed, where ${format(countPermanent(), 0)} of them are [Permanent])` }]]],
				"blank",
				function () {
					return handleDisplay()
				},
				"blank",
				["row", [["clickable", [15]], "blank", ["clickable", [12]], "blank", ["display-text", function () { if (hasMalware('m', 15)) return `Page: ${format(player.sp.sparkPage, 0)}/${format(player.sp.sparkMilestones.div(player.sp.showSparkAmt).ceil().max(1), 0)}` }], "blank", ["clickable", [13]], "blank", ["clickable", [16]]]]
			]
		},
	},
	branches: ["p"],
	passiveGeneration() {
		if (player.m.best.gte(135)) return 1e10;
		if (player.m.best.gte(57)) return 1;
		return 0;
	},
	resetsNothing() {
		return player.pm.activeChallenge == 12 || player.pm.activeChallenge == 13
	},
	softcap: new Decimal(Infinity),
	softcapPower: new Decimal(1),
	doReset(l) {
		if (hasMalware('m', 15)) { return; }
		else {
			if (l == "sp") { return; }
			if (l == "hp") if (player.m.best.gte(65)) layerDataReset("sp", ["upgrades"]); else layerDataReset("sp", []);
			if (l == "ap") { if (player.m.best.gte(81)) layerDataReset("sp", ["upgrades"]); else layerDataReset("sp", []); }
			if (l == "t") if (player.m.best.gte(100)) layerDataReset("sp", ["upgrades"]); else layerDataReset("sp", []);
			if (l == "hb") if (player.m.best.gte(104)) layerDataReset("sp", ["upgrades"]); else layerDataReset("sp", []);
			if (l == 'mp') if (player.sp.sparkMilestones.gt(0)) { return; }
		}
	},
	update(diff) {
		if (tmp.sp.milestones[player.sp.ashedMilestones].permanent == true && (new Decimal(player.sp.ashedMilestones + 1).lt(player.sp.sparkMilestones))) player.sp.ashedMilestones++
		if (player.sp.burningTimer >= 0 && (new Decimal(player.sp.ashedMilestones).lt(player.sp.sparkMilestones)) && (tmp.sp.milestones[player.sp.ashedMilestones].permanent == false)) player.sp.burningTimer = new Decimal(player.sp.burningTimer).sub(diff).max(0).toNumber()
		if (player.sp.burningTimer <= 0) {
			if (new Decimal(player.sp.ashedMilestones + 1).lt(player.sp.sparkMilestones)) {
				player.sp.ashedMilestones++
				player.sp.burningTimer = player.sp.timer[player.sp.ashedMilestones]
			}
		}
		if (player.sp.activeChallenge == 11 && player.sp.chalCooldown > 0) player.sp.chalCooldown = player.sp.chalCooldown.sub(diff).max(0)
		if (player.sp.sparkFill.gte(tmp.sp.SparkUnlReq) && player.sp.sparkMilestones.lt(maxMilestones())) {
			player.sp.sparkFill = player.sp.sparkFill.min(tmp.sp.SparkUnlReq)
			player.sp.sparkFill = player.sp.sparkFill.sub(tmp.sp.SparkUnlReq)
			player.sp.sparkMilestones = player.sp.sparkMilestones.add(1)
			player.sp.burningTimer = 240
			player.sp.timer[player.sp.sparkMilestones] = 240
		}
		if (player.sp.fillActive) {
			let filler = new Decimal(1)
			if (player.sp.sparkFill.lt(tmp.sp.SparkUnlReq)) {
				player.sp.ambers = player.sp.ambers.sub(10 * diff).max(0)
				if (player.sp.ambers.toNumber() != 0) player.sp.sparkFill = player.sp.sparkFill.add(10 * diff)
				if (player.sp.ambers.toNumber() == 0) player.sp.fillActive = false
			}
		}
		if (player.m.best.gte(83)) {
			var target = player.sp.points.add(1).div("1e652955").log("1e12345");
			if (target.gte(3)) {
				let p = 1.309;
				if (hasUpgrade("sp", 43)) p -= 0.029;
				target = target.div(3).pow(1 / p).mul(3);
			}
			target = target.add(1).floor();
			if (target.gt(player.sp.buyables[11])) {
				player.sp.buyables[11] = target;
			}
		}
		if (player.m.best.gte(130)) {
			var target = player.sp.points.add(1).div(1).log("ee10").max(0.1).log(2);
			target = target.add(1).floor();
			if (target.gt(player.sp.buyables[12])) {
				player.sp.buyables[12] = target;
			}
		}
		for (i in player.sp.milestones) {
			if (player.sp.ashedMilestones > i && player.sp.timer[i] < 1) {
				fetchTimer(i, Math.floor(player.sp.timer[i]))
			}
			if (player.sp.ashedMilestones == i) fetchTimer(i, player.sp.burningTimer)
		}
	}
})