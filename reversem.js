41:{
    name: "Hyper Dilation",
    completionLimit: Infinity,
    challengeDescription() {return "All Atomic-Prestige challenges at once.<br>"+format(challengeCompletions(this.layer, this.id),4) +" completions"},
    unlocked() { return player.m.points.gte(158) },
    goal() {
        return this.goalAfter120(Math.ceil(player.ap.challenges[41]+0.002));
    },
    currencyDisplayName: "points",
    currencyInternalName: "points",
    rewardEffect() {
        let ret = new Decimal(player.ap.challenges[41]).add(1).times(2.42).pow(1.05).max(1);
        if (player.ep.buyables[11].gte(1)) ret=ret.times(tmp.ep.oneEffect)
        return ret;
    },
    rewardDisplay() { return "154th Milestone effect is x"+format(this.rewardEffect())+ " better" },
    rewardDescription() { return "154th Milestone effect is better." },
completionsAfter120(){
let p=player.points;
if(player.m.points.gte(141)){
    if(p.lte("e1820"))return 0;
    return p.log10().div(1820).log(1.02).pow(1/1.15).toNumber();
}
if(player.m.points.gte(130)){
    if(p.lte("e1860"))return 0;
    return p.log10().div(1860).log(1.02).pow(1/1.15).toNumber();
}
if(p.lte("e1950"))return 0;
return p.log10().div(1950).log(1.02).pow(1/1.15).toNumber();
},
goalAfter120(x=player.ap.challenges[41]){
if(player.m.points.gte(141))return Decimal.pow(10,Decimal.pow(1.02,Decimal.pow(x,1.15)).mul(1820));
if(player.m.points.gte(130))return Decimal.pow(10,Decimal.pow(1.02,Decimal.pow(x,1.15)).mul(1860));
return Decimal.pow(10,Decimal.pow(1.02,Decimal.pow(x,1.15)).mul(1950));
},
canComplete(){
return player.points.gte(tmp.ap.challenges[this.id].goal)&&player.m.points.lt(110);
},

},