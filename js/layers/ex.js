function checkFeatureDot(dot = "") {
	if (dot == `(${tmp.ex.xGoal};${tmp.ex.yGoal})`) {
		switch (player.ex.zone) {
			case "a":
				if (player.ex.dotUnl < player.ex.aLimit) player.ex.dotUnl += 1
				break
			case "a-02":
				if (player.ex.a2Unl < player.ex.a2Limit) player.ex.a2Unl += 1
				break
			case "a-03":
				if (player.ex.a3Unl < player.ex.a3Limit) player.ex.a3Unl += 1
				break
			case "b-01":
				if (player.ex.b1Unl < player.ex.b1Limit) player.ex.b1Unl += 1
				break
		}
	}
}
function pointWithinBounds(point, topLeft, bottomRight) {
  if (point[0] < topLeft[0]) return false;
  if (point[0] > bottomRight[0]) return false;
  if (point[1] < topLeft[1]) return false;
  if (point[1] > bottomRight[1]) return false;
  return true;
}

function checkDirection(dir) {
  let pos;
  switch (dir) {
    case LEFT: pos = [player.ex.buyables[11].sub(1).toNumber(), player.ex.buyables[12].toNumber()]; break;
    case RIGHT: pos = [player.ex.buyables[11].add(1).toNumber(), player.ex.buyables[12].toNumber()]; break;
    case UP: pos = [player.ex.buyables[11].toNumber(), player.ex.buyables[12].sub(1).toNumber()]; break;    
	case DOWN: pos = [player.ex.buyables[11].toNumber(), player.ex.buyables[12].add(1).toNumber()]; break;
  }
  for (const wall of getWalls()) { 
// walls are defined as `[[x1,y1], [x2,y2]]`
    if (pointWithinBounds(pos, wall[0], wall[1])) return false;
  }
  return true;
}
function getWalls() {
  switch (player.ex.zone) {
    default: return [];
    case "a-02": return [
      [[3,0], [3,1]],
      [[3,4], [3,6]],
	  [[1,3],[3,3]],
	  [[0,5],[1,5]],
	  [[1,6],[3,6]],
	  [[3,5],[6,5]]
    ];
    case "a-03": return [
      [[0,1], [0,2]],
      [[2,1], [2,1]],
	  [[1,4],[4,4]],
	  [[4,5],[4,7]],
	  [[0,6],[2,6]],
	  [[2,7],[4,7]],
	  [[2,6],[2,7]]
    ];
    case "b-01": return [
      [[0,1], [0,1]],
      [[2,1], [4,1]],
	  [[6,0],[6,3]],
	  [[1,3],[5,3]],
	  [[1,7],[7,7]],
	  [[0,5],[4,5]],
	  [[6,5],[7,5]]
    ];
}
}
function checkIfMaxExploreBonus() {
	let max = 0
	zone = player.ex.zone
	switch (zone) {
		case "a":
			max = 3
			break
		case "a-02":
			max = 1
			break
		case "a-03":
			max = 6
			break
		case "b-01":
			max = 6
			break
	}
	return max
}
function checkPortalEnterDot(dot = "") {
	dot = []
	dot2 = []
	dotback = []
	zone = player.ex.zone
	switch (zone) {
		case "a":
			dot = ["(10;5)", "a-02"]
			dot2 = ["(9;9)", "a-03"]
			break
		case "a-02":
			dotback = ["(1;1)", "a"]
			dot = ["(5;3)", "b-01"]
			dot2 = ["(6;5)", "c-01"]
			break
		case "a-03":
			dotback = ["(1;1)", "a"]
			break
		case "b-01":
			dotback = ["(1;1)", "a-02"]
			break
	}
	if (dot[0] == `(${player.ex.buyables[11]};${player.ex.buyables[12]})`) {
		player.ex.zone = dot[1]
		player.ex.buyables[11] = new Decimal(0)
		player.ex.buyables[12] = new Decimal(0)
	}
	else if (dot2[0] == `(${player.ex.buyables[11]};${player.ex.buyables[12]})`) {
		player.ex.zone = dot2[1]
		player.ex.buyables[11] = new Decimal(0)
		player.ex.buyables[12] = new Decimal(0)
	}
	else if (dotback[0] == `(${player.ex.buyables[11]};${player.ex.buyables[12]})`) {
		player.ex.zone = dotback[1]
		player.ex.buyables[11] = new Decimal(0)
		player.ex.buyables[12] = new Decimal(0)
	}
}
addLayer("ex", {
	name: "exploration points", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "EX", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() {
		return {
			unlocked: false,
			points: new Decimal(0),
			zone: "a",
			dotUnl: 0,
			a2Unl: 0,
			a3Unl: 0,
			b1Unl: 0,
			c1Unl: 0,
			aLimit: 4,
			a2Limit: 3,
			a3Limit: 5,
			b1Limit: 1,
			c1Limit: 1,
		}
	},
	color() { return '#46a364' },
	requires() {
		return new Decimal(1e100)
	},
	resource() { return 'exploration points' },
	baseResource() { return 'prestige essence' }, // Name of resource prestige is based on
	baseAmount() { return player.pm.essence }, // Get the current amount of baseResource
	type() { return "static" }, // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		let m = new Decimal(0.3);
		return m;
	},
	xLimit() {
		zone = player.ex.zone
		let x = new Decimal(0)
		switch (zone) {
			case "a":
				x = new Decimal(8)
				x = x.mul(player.ex.points.add(1).pow(0.37).mul(1.05)).floor()
				break
			case "a-02":
				x = new Decimal(6)
				break
			case "a-03":
				x = new Decimal(6)
				x = x.mul(player.ex.points.sub(3).add(1).pow(0.37).mul(1.05)).floor()
				break
			case "b-01":
				x = new Decimal(7)
				x = x.mul(player.ex.points.sub(3).add(1).pow(0.2)).floor()
				break
		}
		return x
	},
	yLimit() {
				zone = player.ex.zone
		let x = new Decimal(0)
		switch (zone) {
			case "a":
				x = new Decimal(5)
				x = x.mul(player.ex.points.add(1).div(2).mul(1.25)).floor()
				break
			case "a-02":
				x = new Decimal(6)
				break
			case "a-03":
				x = new Decimal(7)
				x = x.mul(player.ex.points.sub(3).add(1).pow(0.37).mul(1.05)).floor()
				break
			case "b-01":
				x = new Decimal(6)
				x = x.mul(player.ex.points.sub(3).add(1).pow(0.75).mul(1.05)).floor()
				break
		}
		return x
	},
	xGoal(x = new Decimal(player.ex.dotUnl)) {
		let goal = new Decimal(8)
		switch (player.ex.zone) {
			case "a":
				goal = new Decimal(8)
				if (x < 2) goal = goal.add(x)
				if (x >= 2) goal = goal.add(x.add(1).mul(1.15)).floor()
				break
			case "a-02":
				x = player.ex.a2Unl
				goal = new Decimal(3)
				goal = goal.add(x)
				if (x==1) goal = new Decimal(2)
				break
			case "a-03":
				x = player.ex.a3Unl
				goal = new Decimal(2)
				goal = goal.add(x)
				if (player.ex.a3Unl>=2) goal = new Decimal(2).add(x*2)
				break
			case "b-01":
				x = new Decimal(player.ex.b1Unl)
				goal = new Decimal(4)
				goal = goal = goal.add(x.add(1).mul(1.15)).floor()
				if (x.gte(1)) goal = new Decimal(1)
				break
		}
		return goal
	},
	yGoal(x = new Decimal(player.ex.dotUnl)) {
		let goal = new Decimal(4)
		switch (player.ex.zone) {
			case "a":
				if (x < 2) goal = goal.add(x)
				if (x >= 2) goal = goal.add(x.add(1).mul(1.25)).floor()
				break
			case "a-02":
				x = new Decimal(player.ex.a2Unl)
				goal = new Decimal(2)
				goal = goal.add(x)
				if (player.ex.a2Unl>=1) goal = goal.add(2)
				break
			case "a-03":
				x = new Decimal(player.ex.a3Unl)
				goal = new Decimal(5)
				goal = goal.add(x)
				if (player.ex.a3Unl>=2) goal = new Decimal(5).add(Math.floor(x*1.5))
				break
			case "b-01":
				x = new Decimal(player.ex.b1Unl)
				goal = new Decimal(4)
				goal = goal.add(x.add(1).mul(1.15)).floor()
				break
		}
		return goal
	},
	exOneEffect() {
		let eff = new Decimal(1)
		if (player.ex.dotUnl >= 1) eff = eff.mul(player.ex.points.add(1).pow(2.674))
		if (hasUpgrade('ex', 12)) eff = eff.mul(player.ex.points.add(1).pow(2.867))
		eff = softcap(eff, new Decimal(1000), 0.15)
		return eff
	},
	exponent: function () {
		return new Decimal(3)
	},
	row: 2, // Row the layer is in on the tree (0 is the first row)
	exponent: 5,
	hotkeys: [
		{ key: "ctrl+e", description: "Ctrl+E: Reset for exploration points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
		{ key: "ArrowDown", description: "↓: Move down on exploration grid", onPress() { buyBuyable('ex', 12) } },
		{ key: "ArrowRight", description: "→: Move right on exploration grid", onPress() { buyBuyable('ex', 11) } },
		{ key: "ArrowLeft", description: "←: Move left on exploration grid", onPress() { buyBuyable('ex', 13) }},
		{ key: "ArrowUp", description: "↑: Move up on exploration grid", onPress() { buyBuyable('ex', 14) } },
		{ key: "r", description: "R: Reset the current position", onPress() { respecBuyables('ex') } }
	],
	layerShown() { return (hasMalware("m", 9)) && (player.mp.activeChallenge == 21) },
	upgrades: {
		rows: 4,
		cols: 4,
		11: {
			title: "Explore Upgrade 11",
			description() { return `slog(points)*${player.ex.b1Unl >= 1 ? `C` : `Square root of c`}urrent coordinates summa<br>Exponents Prestige Essence effect outside Prestige Universe at boosted rate` },
			cost: new Decimal(2),
			unlocked() { return hasMalware("m", 14) }, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base = 100;
				let xPos = player.ex.buyables[11]
				let yPos = player.ex.buyables[12]
				let ret = (new Decimal(player.points).add(1).slog(2).max(1)).mul(xPos.add(yPos).pow(0.5).mul(base)).max(1)
				if (player.ex.b1Unl >= 1) ret = (new Decimal(player.points).add(1).slog(1.5).max(1)).mul(xPos.add(yPos).mul(base)).max(1)
				return ret;
			},
			pay() {
			},
			effectDisplay() { return "^" + format(this.effect(), 4) }, // Add formatting to the effect
		},
		12: {
			title: "Explore Upgrade 12",
			description: "Zone a (8;4) reward formula is slightly better. Corruption Booster effect is slightly better.",
			cost: new Decimal(3),
			unlocked() { return hasMalware("m", 14) }, // The upgrade is only visible when this is true
			pay() {
			}, // Add formatting to the effect
		},
	},
	buyables: {
		respec() {
			for (i in player.ex.buyables) {
				player.ex.buyables[i] = new Decimal(0)
			}
		},
		respecMessage() { return "Are you sure you want to respec Multiversal Fusioners? This will reset your current position (" + format(player.ex.buyables[11], 0) + ";" + format(player.ex.buyables[12], 0) + ") to (0,0)!" },
		respecText: "Respec Position",
		showRespec() { return player.ex.points.gte(1) },
		rows: 4,
		cols: 4,
		11: {
			title() {
				return "<h3 class='exf'>Increase X</h3>";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "You went right for " + format(player[this.layer].buyables[this.id], 0) + " tiles<br>" +
					"Cost: " + format(data.cost, 0) + " Prestige Essences";
			},
			cost(x) {
				let cost = Decimal.pow(10, x.add(1).mul(11.76))
				switch (player.ex.zone) {
					case "a":
						cost = Decimal.pow(10, x.add(1).mul(11.76))
						break
					case "a-02":
						cost = Decimal.pow(17, x.add(1).mul(22.6))
						break
					case "a-03":
						cost = Decimal.pow(15, x.add(1).mul(8.6))
						break
					case "b-01":
						cost = Decimal.pow(15, x.add(1).mul(23.6))
						break
				}
				return cost
			},
			canAfford() {
				let basicCond = player.pm.essence.gte(tmp[this.layer].buyables[this.id].cost)
				let can = false
				let maxX = tmp.ex.xLimit
				if (checkDirection(RIGHT) && player.ex.buyables[11].lte(tmp.ex.xLimit)&&basicCond) can = true
				return can
			},
			buy() {
				player.pm.essence = player.pm.essence.sub(this.cost())
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				if (player[this.layer].buyables[13].gt(0))player[this.layer].buyables[13] = player[this.layer].buyables[13].sub(1)
			},
			effect() {
				let b = 1;
				let eff = new Decimal(0).add(player[this.layer].buyables[this.id].mul(b));
				return eff;
			},
			unlocked() {
				return player.mp.activeChallenge == 21 && player.ex.points.gte(1);
			},
			style() {
				if (!this.canAfford()) return {
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
				return "<h3 class='exf'>Increase Y</h3>";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "You went down for " + format(player[this.layer].buyables[this.id], 0) + " tiles<br>" +
					"Cost: " + format(data.cost, 0) + " Corruption Essences";
			},
			cost(x) {
				let cost = Decimal.pow(2, x.add(1).mul(3.76))
				switch (player.ex.zone) {
					case "a":
						cost = Decimal.pow(2, x.add(1).mul(3.76))
						break
					case "a-02":
						cost = Decimal.pow(6, x.mul(3.25).add(1))
						break
					case "a-03":
						cost = Decimal.pow(8, x.mul(2.65).add(1))
						break
					case "b-01":
						cost = Decimal.pow(5, x.mul(2.75).add(1))
						break
				}
				return cost
			},
			canAfford() {
				let basicCond = player.cp.formatted.gte(tmp[this.layer].buyables[this.id].cost)
				let can = false
				let maxX = tmp.ex.yLimit
				if (checkDirection(DOWN) && player.ex.buyables[12].lte(tmp.ex.yLimit)&&basicCond) can = true
				return can
			},
			buy() {
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				if (player[this.layer].buyables[14].gt(0)) player[this.layer].buyables[14] = player[this.layer].buyables[14].sub(1)
			},
			effect() {
				let b = 1;
				let eff = new Decimal(0).add(player[this.layer].buyables[this.id].mul(b));
				return eff;
			},
			unlocked() {
				return player.mp.activeChallenge == 21 && player.ex.points.gte(1);
			},
			style() {
				if (!this.canAfford()) return {
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
		13: {
			title() {
				return "<h3 class='exf'>Decrease X</h3>";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "You went left for " + format(player[this.layer].buyables[13], 0) + " tiles<br>Move left without a cost";
			},
			cost(x) {
				let cost = Decimal.pow(2, x.add(1).mul(3.76))
				switch (player.ex.zone) {
					case "a":
						cost = Decimal.pow(2, x.add(1).mul(3.76))
						break
					case "a-02":
						//cost = Decimal.pow(6, x.mul(3.25).add(1))
						cost = Decimal.pow(1, x.mul(3.25).add(1))
						break
					case "a-03":
						cost = Decimal.pow(8, x.mul(2.65).add(1))
						break
					case "b-01":
						cost = Decimal.pow(5, x.mul(2.75).add(1))
						break
				}
				return cost
			},
			canAfford() {
				let basicCond = player.ex.buyables[11].gt(0)
				let can = false
				let maxX = tmp.ex.yLimit
				if (checkDirection(LEFT) && player.ex.buyables[11].lte(tmp.ex.xLimit)&&basicCond) can = true
				return can
			},
			buy() {
				player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(1)
				player[this.layer].buyables[13] = player[this.layer].buyables[13].add(1)
			},
			effect() {
				let b = 1;
				let eff = new Decimal(0).add(player[this.layer].buyables[this.id].mul(b));
				return eff;
			},
			unlocked() {
				return player.mp.activeChallenge == 21 && player.ex.points.gte(1);
			},
			style() {
				if (!this.canAfford()) return {
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
		14: {
			title() {
				return "<h3 class='exf'>Decrease Y</h3>";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "You went up for " + format(player[this.layer].buyables[14], 0) + " tiles<br>Move up without a cost";
			},
			canAfford() {
				let basicCond = player.ex.buyables[12].gt(0)
				let can = false
				let maxX = tmp.ex.yLimit
				if (checkDirection(UP) && player.ex.buyables[12].lte(tmp.ex.xLimit)&&basicCond) can = true
				return can
			},
			buy() {
				player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(1)
				player[this.layer].buyables[14] = player[this.layer].buyables[14].add(1)
			},
			effect() {
				let b = 1;
				let eff = new Decimal(0).add(player[this.layer].buyables[this.id].mul(b));
				return eff;
			},
			unlocked() {
				return player.mp.activeChallenge == 21 && player.ex.points.gte(1);
			},
			style() {
				if (!this.canAfford()) return {
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
	tabFormat: {
		"Main": {
			content: [
				"main-display", "prestige-button", "resource-display",
				["display-text", function () {
					table = ""
					if (player.ex.points.gte(1)) table = 'You can move in the zone by typing arrow keys and reset current position by clicking R button.<br>our exploration points are increasing your exploration area limits. For now, your area limits are: X axis - ' + format(tmp.ex.xLimit) + ", Y axis - " + format(tmp.ex.yLimit) + ".<br>By reaching some of positions in the area you can unlock new features.<br>New feature is at " + `(${tmp.ex.xGoal};${tmp.ex.yGoal})`
						+ `. Current zone: ${player.ex.zone}<br>For mobile players, the buyables are shown below:`
					return table
				}],
				"buyables",
				["display-text", function () {
					table = ""
					if (player.ex.points.gte(1)) table = `Green circle is current position, the yellow star is a position for a new feature${hasMalware('m', 14) ? `,<br> the Portal is a teleport to a new zone, the yellow arrow is the portal to go to previous zone` : "."}.<br><svg style="background:url(zones/${player.ex.zone}-${player.ex.points.min(checkIfMaxExploreBonus())}.svg)"width="${((tmp.ex.xLimit) * 20) + 60}" height="${((tmp.ex.yLimit) * 20) + 90}" version="1.1">
					<text x="0" y="40" fill="white" font-size="12px">0</text>`
					zone = player.ex.zone
					let dot = undefined
					let dot2 = undefined
					let dot3 = undefined
					dotback = undefined
					switch (zone) {
						case "a":
							dot = [10, 5]
							dot2 = [9, 8]
							break
						case "a-02":
							dot = [5, 3]
							dotback = [1, 1]
							break
						case "a-03":
							dot = [16, 3]
							dotback = [1, 1]
							break
						case "b-01":
							dot = [25, 25]
							dotback = [1, 1]
							break
					}
					for (xPos = 1; xPos <= Math.floor(tmp.ex.xLimit); xPos++) {
						for (y = 1; y <= Math.floor(tmp.ex.yLimit); y++) {
							table += `
						 <text x="0" y="${Math.floor(Math.floor(tmp.ex.yLimit) * 20) + 75}" fill="white" font-size="16px">Y</text>
						 <text x="${Math.floor(Math.floor(tmp.ex.xLimit) * 20) + 35}" y="40" fill="white" font-size="16px">X</text>
						 <text x="${Math.floor(xPos * 20) + 15}" y="40" fill="white" font-size="12px">${format(xPos, 0)}</text>
						 <text x="0" y="${Math.floor(y * 20) + 55}" fill="white" font-size="12px">${format(y, 0)}</text>`
						}
					}
					if (player.ex.points.gte(1)) table += `
					<text x="${player.ex.buyables[11].mul(20).add(11)}" y="${player.ex.buyables[12].mul(20).add(55)}" fill="#46a364" font-size="12px">🟢</text>`
					if (((player.ex.dotUnl < player.ex.aLimit) || (player.ex.a2Unl < player.ex.a2Limit) || (player.ex.a3Unl < player.ex.a3Limit))&&(tmp.ex.xGoal.lte(tmp.ex.xLimit)&&tmp.ex.yGoal.lte(tmp.ex.yLimit))) table += `<text x="${tmp.ex.xGoal.mul(20).add(11)}" y="${tmp.ex.yGoal.mul(20).add(55)}" fill="yellow" font-size="20px">★</text>`
					if (hasMalware('m', 14)) {
						table += `<text x="${new Decimal(dot[0]).mul(20).add(6)}" y="${new Decimal(dot[1]).mul(20).add(55)}" fill="yellow" font-size="20px">🌀</text>`
						if (dot2 != undefined) table += `<text x="${new Decimal(dot2[0]).mul(20).add(10)}" y="${new Decimal(dot2[1]).mul(20).add(55)}" fill="yellow" font-size="20px">꩜</text>`
						if (dot3 != undefined) table += `<text x="${new Decimal(dot3[0]).mul(20).add(6)}" y="${new Decimal(dot3[1]).mul(20).add(55)}" fill="red" font-size="20px">꩜</text>`
						if (dotback != undefined) table += `<text x="${new Decimal(dotback[0]).mul(20).add(8)}" y="${new Decimal(dotback[1]).mul(20).add(57)}" fill="yellow" font-size="20px">⇦</text>`
					}
					return table + "</svg>"
				}]
			]
		},
		"Upgrades": {
			content: [
				function () {
					if (player.tab == "ex") return ["column", [
						"main-display", "prestige-button", "resource-display",
						"upgrades",
					]
					]
				},
			]
		},
		"Rewards": {
			content: [
				["display-text", function () {
					let tableA = hasMalware("m", 14) ? "<br>Zone A Rewards:" : ""
					let tableA2 = player.ex.a2Unl >= 1 ? "<br>Zone A-2 Rewards:" : ""
					let tableA3 = player.ex.a3Unl >= 1 ? "<br>Zone A-3 Rewards:" : ""
					let tableB1 = player.ex.b1Unl >= 1 ? "<br>Zone B-1 Rewards:" : ""
					if (player.ex.dotUnl >= 1) tableA += "<br>(8;4) - [ Corruptions rewards are " + format(tmp.ex.exOneEffect) + "x better.<br>Unlock one Super Prestige Upgrade in Normal Universe. ]"
					if (player.ex.dotUnl >= 2) tableA += "<br>(9;5) - [ Unlock more Malware Milestones. ]"
					if (player.ex.dotUnl >= 3) tableA += "<br>(11;7) - [ Unlock one Malware Milestones. ]"
					if (player.ex.a2Unl >= 1) tableA2 += "<br>Zone A-2 (3;2) - [ Unlock Security Algorithms. ]"
					if (player.ex.a2Unl >= 2) tableA2 += "<br>Zone A-2 (4;4) - [ Expand Disks to 6x6 grid. ]"
					if (player.ex.b1Unl >= 1) tableB1 += "<br>Zone B-1 (5;5) - [ Explore Upgrade 11 formula is better ]"
					table = "Currently unlocked:" + tableA + tableA2 + tableA3 + tableB1
					return table
				}],
			]
		},
	},
	branches: ["pep", "cp"],
	softcap() {
		return new Decimal(Infinity);
	},
	softcapPower() {
		return new Decimal(1);
	},
	doReset(l) {
		if (player.mp.activeChallenge == 21) player.pm.essence = new Decimal(0)
	},
	update(diff) {
		if (player.ex.zone == undefined) player.ex.zone = "a"
		checkFeatureDot(dot = `(${player.ex.buyables[11]};${player.ex.buyables[12]})`)
		if (hasMalware('m', 14)) checkPortalEnterDot(dot = `(${player.ex.buyables[11]};${player.ex.buyables[12]})`)
	}
})