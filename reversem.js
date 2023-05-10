milestones: {
   158: {
        requirementDescription: "1st Milestone",
        unlocked() {return player[this.layer].best.gte(0)},
        done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
        effectDescription: function(){
            return "Gain "+format(new Decimal(1).max(getPointGen()))+" points per second."
        },
    },
   157: {
        requirementDescription: "2nd Milestone",
        unlocked() {return player[this.layer].best.gte(1)},
        done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
        effectDescription: "Triple the first Milestone's effect."
    },
    156:{
        requirementDescription: "3rd Milestone",
        unlocked() {return player[this.layer].best.gte(2)},
        done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First Milestone's effect is boosted by your points. Currently: "+format(tmp.m.milestone3Effect)+"x";
        },
    },
    155:{
        requirementDescription: "4th Milestone",
        unlocked() {return player[this.layer].best.gte(3)},
        done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Third Milestone's effect is better based on your milestones. Currently: 3rd Milestone's base effect base +"+format(tmp.m.milestone4Effect);
        },
    },
    154:{
        requirementDescription: "5th Milestone",
        unlocked() {return player[this.layer].best.gte(4)},
        done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock the next layer. Milestones don't reset on all resets.";
        },
    },
   153:{
        requirementDescription: "6th Milestone",
        unlocked() {return player[this.layer].best.gte(5)},
        done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Point gain is boosted by your milestones. Currently: "+format(tmp.m.milestone6Effect)+"x";
        },
    },
   152: {
        requirementDescription: "7th Milestone",
        unlocked() {return player[this.layer].best.gte(6)},
        done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect is powered by 1.5";
        },
    },
   151: {
        requirementDescription: "8th Milestone",
        unlocked() {return player[this.layer].best.gte(7)},
        done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect is powered by 1.2";
        },
    },
   150:{
        requirementDescription: "9th Milestone",
        unlocked() {return player[this.layer].best.gte(8)},
        done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect is powered by 1.1";
        },
    },
   149: {
        requirementDescription: "10th Milestone",
        unlocked() {return player[this.layer].best.gte(9)},
        done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock 2 new Prestige Upgrades.";
        },
    },
   148: {
        requirementDescription: "11th Milestone",
        unlocked() {return player[this.layer].best.gte(10)},
        done() {return player[this.layer].best.gte(11)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Upgrade 11's effect is better.";
        },
    },
   147: {
        requirementDescription: "12th Milestone",
        unlocked() {return player[this.layer].best.gte(11)},
        done() {return player[this.layer].best.gte(12)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Upgrade 12's effect is better.";
        },
    },
  146:  {
        requirementDescription: "13th Milestone",
        unlocked() {return player[this.layer].best.gte(12)},
        done() {return player[this.layer].best.gte(13)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Upgrade 13's effect is better.";
        },
    },
  145:  {
        requirementDescription: "14th Milestone",
        unlocked() {return player[this.layer].best.gte(13)},
        done() {return player[this.layer].best.gte(14)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Upgrade 14's effect is better.";
        },
    },
   144: {
        requirementDescription: "15th Milestone",
        unlocked() {return player[this.layer].best.gte(14)},
        done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock 2 new Prestige Upgrades.";
        },
    },
   143: {
        requirementDescription: "16th Milestone",
        unlocked() {return player[this.layer].best.gte(15)},
        done() {return player[this.layer].best.gte(16)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.016";
        },
    },
   142: {
        requirementDescription: "17th Milestone",
        unlocked() {return player[this.layer].best.gte(16)},
        done() {return player[this.layer].best.gte(17)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.017";
        },
    },
    141:{
        requirementDescription: "18th Milestone",
        unlocked() {return player[this.layer].best.gte(17)},
        done() {return player[this.layer].best.gte(18)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.018";
        },
    },
    140:{
        requirementDescription: "19th Milestone",
        unlocked() {return player[this.layer].best.gte(18)},
        done() {return player[this.layer].best.gte(19)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.019";
        },
    },
   139: {
        requirementDescription: "20th Milestone",
        unlocked() {return player[this.layer].best.gte(19)},
        done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            if(player[this.layer].best.gte(135))return "Gain 1e12% of Prestige Point gain per second.";
            return "Gain 10000% of Prestige Point gain per second.";
        },
    },
    138:{
        requirementDescription: "21st Milestone",
        unlocked() {return player[this.layer].best.gte(20)},
        done() {return player[this.layer].best.gte(21)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock 2 new Prestige Upgrades.";
        },
    },
    137:{
        requirementDescription: "22nd Milestone",
        unlocked() {return player[this.layer].best.gte(21)},
        done() {return player[this.layer].best.gte(22)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Point Gain is multiplied by 22";
        },
    },
    136:{
        requirementDescription: "23rd Milestone",
        unlocked() {return player[this.layer].best.gte(22)},
        done() {return player[this.layer].best.gte(23)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Upgrade 23's effect is better.";
        },
    },
    135:{
        requirementDescription: "24th Milestone",
        unlocked() {return player[this.layer].best.gte(23)},
        done() {return player[this.layer].best.gte(24)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Upgrade 24's effect is better.";
        },
    },
   134: {
        requirementDescription: "25th Milestone",
        unlocked() {return player[this.layer].best.gte(24)},
        done() {return player[this.layer].best.gte(25)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer.";
        },
    },
    133:{
        requirementDescription: "26th Milestone",
        unlocked() {return player[this.layer].best.gte(25)},
        done() {return player[this.layer].best.gte(26)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep Prestige upgrades on Super-Prestige.";
        },
    },
    132:{
        requirementDescription: "27th Milestone",
        unlocked() {return player[this.layer].best.gte(26)},
        done() {return player[this.layer].best.gte(27)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Super-Prestige Point gain is boosted by your milestones. Currently: "+format(tmp.m.milestone27Effect)+"x";
        },
    },
    131:{
        requirementDescription: "28th Milestone",
        unlocked() {return player[this.layer].best.gte(27)},
        done() {return player[this.layer].best.gte(28)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "27th Milestone's effect is powered by 1.5";
        },
    },
    130:{
        requirementDescription: "29th Milestone",
        unlocked() {return player[this.layer].best.gte(28)},
        done() {return player[this.layer].best.gte(29)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "27th Milestone's effect is powered by 1.2";
        },
    },
   129: {
        requirementDescription: "30th Milestone",
        unlocked() {return player[this.layer].best.gte(29)},
        done() {return player[this.layer].best.gte(30)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock 2 new Super-Prestige Upgrades.";
        },
    },
    128:{
        requirementDescription: "31st Milestone",
        unlocked() {return player[this.layer].best.gte(30)},
        done() {return player[this.layer].best.gte(31)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige and Super-Prestige Upgrade 11's effect is better.";
        },
    },
    127:{
        requirementDescription: "32nd Milestone",
        unlocked() {return player[this.layer].best.gte(31)},
        done() {return player[this.layer].best.gte(32)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige and Super-Prestige Upgrade 12's effect is better.";
        },
    },
   126: {
        requirementDescription: "33rd Milestone",
        unlocked() {return player[this.layer].best.gte(32)},
        done() {return player[this.layer].best.gte(33)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige and Super-Prestige Upgrade 13's effect is better.";
        },
    },
   125: {
        requirementDescription: "34th Milestone",
        unlocked() {return player[this.layer].best.gte(33)},
        done() {return player[this.layer].best.gte(34)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige and Super-Prestige Upgrade 14's effect is better.";
        },
    },
    124:{
        requirementDescription: "35th Milestone",
        unlocked() {return player[this.layer].best.gte(34)},
        done() {return player[this.layer].best.gte(35)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock 2 new Super-Prestige Upgrades, 6th Milestone's effect ^3.5.";
        },
    },
   123: {
        requirementDescription: "36th Milestone",
        unlocked() {return player[this.layer].best.gte(35)},
        done() {return player[this.layer].best.gte(36)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.036";
        },
    },
    122:{
        requirementDescription: "37th Milestone",
        unlocked() {return player[this.layer].best.gte(36)},
        done() {return player[this.layer].best.gte(37)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.037";
        },
    },
    121:{
        requirementDescription: "38th Milestone",
        unlocked() {return player[this.layer].best.gte(37)},
        done() {return player[this.layer].best.gte(38)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.038";
        },
    },
    120:{
        requirementDescription: "39th Milestone",
        unlocked() {return player[this.layer].best.gte(38)},
        done() {return player[this.layer].best.gte(39)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's effect ^1.039";
        },
    },
    119:{
        requirementDescription: "40th Milestone",
        unlocked() {return player[this.layer].best.gte(39)},
        done() {return player[this.layer].best.gte(40)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer. Unlock 2 new Super-Prestige Upgrades.";
        },
    },
    118:{
        requirementDescription: "41st Milestone",
        unlocked() {return player[this.layer].best.gte(40)},
        done() {return player[this.layer].best.gte(41)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.003";
        },
    },
    117:{
        requirementDescription: "42nd Milestone",
        unlocked() {return player[this.layer].best.gte(41)},
        done() {return player[this.layer].best.gte(42)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect ^(1+(meta-milestones)).";
        },
    },
   116: {
        requirementDescription: "43rd Milestone",
        unlocked() {return player[this.layer].best.gte(42)},
        done() {return player[this.layer].best.gte(43)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
   115: {
        requirementDescription: "44th Milestone",
        unlocked() {return player[this.layer].best.gte(43)},
        done() {return player[this.layer].best.gte(44)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Prestige Upgrades is boosted.";
        },
    },
   114: {
        requirementDescription: "45th Milestone",
        unlocked() {return player[this.layer].best.gte(44)},
        done() {return player[this.layer].best.gte(45)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new row of Prestige Upgrades.";
        },
    },
   113: {
        requirementDescription: "46th Milestone",
        unlocked() {return player[this.layer].best.gte(45)},
        done() {return player[this.layer].best.gte(46)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.001";
        },
    },
   112: {
        requirementDescription: "47th Milestone",
        unlocked() {return player[this.layer].best.gte(46)},
        done() {return player[this.layer].best.gte(47)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "27th Milestone's effect ^(1+(meta-milestones^0.25)).";
        },
    },
   111: {
        requirementDescription: "48th Milestone",
        unlocked() {return player[this.layer].best.gte(47)},
        done() {return player[this.layer].best.gte(48)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    110:{
        requirementDescription: "49th Milestone",
        unlocked() {return player[this.layer].best.gte(48)},
        done() {return player[this.layer].best.gte(49)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Super-Prestige Upgrades is boosted.";
        },
    },
   109: {
        requirementDescription: "50th Milestone",
        unlocked() {return player[this.layer].best.gte(49)},
        done() {return player[this.layer].best.gte(50)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer.";
        },
    },
    108:{
        requirementDescription: "51st Milestone",
        unlocked() {return player[this.layer].best.gte(50)},
        done() {return player[this.layer].best.gte(51)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.00175";
        },
    },
    107:{
        requirementDescription: "52nd Milestone",
        unlocked() {return player[this.layer].best.gte(51)},
        done() {return player[this.layer].best.gte(52)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect ^(1+(meta-milestones^0.1)).";
        },
    },
    106:{
        requirementDescription: "53rd Milestone",
        unlocked() {return player[this.layer].best.gte(52)},
        done() {return player[this.layer].best.gte(53)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    105:{
        requirementDescription: "54th Milestone",
        unlocked() {return player[this.layer].best.gte(53)},
        done() {return player[this.layer].best.gte(54)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Prestige Upgrades is boosted.";
        },
    },
    104:{
        requirementDescription: "55th Milestone",
        unlocked() {return player[this.layer].best.gte(54)},
        done() {return player[this.layer].best.gte(55)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new row of Super-Prestige Upgrades.";
        },
    },
    103:{
        requirementDescription: "56th Milestone",
        unlocked() {return player[this.layer].best.gte(55)},
        done() {return player[this.layer].best.gte(56)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.00078";
        },
    },
    102:{
        requirementDescription: "57th Milestone",
        unlocked() {return player[this.layer].best.gte(56)},
        done() {return player[this.layer].best.gte(57)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            if(player[this.layer].best.gte(135))return "Gain 1e12% of Super-Prestige Point gain per second.";
            return "Gain 100% of Super-Prestige Point gain per second.";
        },
    },
    101:{
        requirementDescription: "58th Milestone",
        unlocked() {return player[this.layer].best.gte(57)},
        done() {return player[this.layer].best.gte(58)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    100:{
        requirementDescription: "59th Milestone",
        unlocked() {return player[this.layer].best.gte(58)},
        done() {return player[this.layer].best.gte(59)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Super-Prestige Upgrades is boosted.";
        },
    },
    99:{
        requirementDescription: "60th Milestone",
        unlocked() {return player[this.layer].best.gte(59)},
        done() {return player[this.layer].best.gte(60)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer. Keep Prestige upgrades on Prestige Boost.";
        },
    },
    98:{
        requirementDescription: "61st Milestone",
        unlocked() {return player[this.layer].best.gte(60)},
        done() {return player[this.layer].best.gte(61)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.0005";
        },
    },
   97: {
        requirementDescription: "62nd Milestone",
        unlocked() {return player[this.layer].best.gte(61)},
        done() {return player[this.layer].best.gte(62)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect ^(meta-milestones^0.129).";
        },
    },
    96:{
        requirementDescription: "63rd Milestone",
        unlocked() {return player[this.layer].best.gte(62)},
        done() {return player[this.layer].best.gte(63)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    95:{
        requirementDescription: "64th Milestone",
        unlocked() {return player[this.layer].best.gte(63)},
        done() {return player[this.layer].best.gte(64)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Prestige Upgrades is boosted.";
        },
    },
    94:{
        requirementDescription: "65th Milestone",
        unlocked() {return player[this.layer].best.gte(64)},
        done() {return player[this.layer].best.gte(65)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Prestige Boost doesn't reset anything. Keep Prestige and Super-Prestige upgrades on Hyper-Prestige. Unlock 2 new Hyper-Prestige Upgrades.";
        },
    },
    93:{
        requirementDescription: "66th Milestone",
        unlocked() {return player[this.layer].best.gte(65)},
        done() {return player[this.layer].best.gte(66)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.0005";
        },
    },
    92:{
        requirementDescription: "67th Milestone",
        unlocked() {return player[this.layer].best.gte(66)},
        done() {return player[this.layer].best.gte(67)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "27th Milestone's effect ^(meta-milestones^0.147).";
        },
    },
    91:{
        requirementDescription: "68th Milestone",
        unlocked() {return player[this.layer].best.gte(67)},
        done() {return player[this.layer].best.gte(68)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
   90: {
        requirementDescription: "69th Milestone lol",
        unlocked() {return player[this.layer].best.gte(68)},
        done() {return player[this.layer].best.gte(69)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Super-Prestige and Hyper-Prestige Upgrades is boosted.";
        },
    },
   89: {
        requirementDescription: "70th Milestone",
        unlocked() {return player[this.layer].best.gte(69)},
        done() {return player[this.layer].best.gte(70)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep Prestige Boost upgrades on Hyper-Prestige. Unlock a new row of Hyper-Prestige Upgrades.";
        },
    },
   88: {
        requirementDescription: "71st Milestone",
        unlocked() {return player[this.layer].best.gte(70)},
        done() {return player[this.layer].best.gte(71)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.001236";
        },
    },
    87:{
        requirementDescription: "72nd Milestone",
        unlocked() {return player[this.layer].best.gte(71)},
        done() {return player[this.layer].best.gte(72)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect ^(meta-milestones^0.1).";
        },
    },
    86:{
        requirementDescription: "73rd Milestone",
        unlocked() {return player[this.layer].best.gte(72)},
        done() {return player[this.layer].best.gte(73)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    85:{
        requirementDescription: "74th Milestone",
        unlocked() {return player[this.layer].best.gte(73)},
        done() {return player[this.layer].best.gte(74)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Prestige Upgrades is boosted.";
        },
    },
    84:{
        requirementDescription: "75th Milestone",
        unlocked() {return player[this.layer].best.gte(74)},
        done() {return player[this.layer].best.gte(75)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            if(player[this.layer].best.gte(135))return "Gain 1e12% of Hyper-Prestige Point gain per second.";
            return "Gain 10000% of Hyper-Prestige Point gain per second.";
        },
    },
    83:{
        requirementDescription: "76th Milestone",
        unlocked() {return player[this.layer].best.gte(75)},
        done() {return player[this.layer].best.gte(76)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.00157";
        },
    },
   82: {
        requirementDescription: "77th Milestone",
        unlocked() {return player[this.layer].best.gte(76)},
        done() {return player[this.layer].best.gte(77)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a Super-Prestige buyable.";
        },
    },
    81:{
        requirementDescription: "78th Milestone",
        unlocked() {return player[this.layer].best.gte(77)},
        done() {return player[this.layer].best.gte(78)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
   80: {
        requirementDescription: "79th Milestone",
        unlocked() {return player[this.layer].best.gte(78)},
        done() {return player[this.layer].best.gte(79)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Super-Prestige and Hyper-Prestige Upgrades is boosted.";
        },
    },
    79:{
        requirementDescription: "80th Milestone",
        unlocked() {return player[this.layer].best.gte(79)},
        done() {return player[this.layer].best.gte(80)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer. Autoget Prestige Boosts.";
        },
    },
    78:{
        requirementDescription: "81st Milestone",
        unlocked() {return player[this.layer].best.gte(80)},
        done() {return player[this.layer].best.gte(81)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.0005. You keep Prestige, Super-Prestige and Prestige Boost Upgrades on Atomic-Prestige.";
        },
    },
    77:{
        requirementDescription: "82nd Milestone",
        unlocked() {return player[this.layer].best.gte(81)},
        done() {return player[this.layer].best.gte(82)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect ^(meta-milestones^0.2). You keep Hyper-Prestige Upgrades on Atomic-Prestige.";
        },
    },
    76:{
        requirementDescription: "83rd Milestone",
        unlocked() {return player[this.layer].best.gte(82)},
        done() {return player[this.layer].best.gte(83)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted. Autobuy the first Super-Prestige buyable.";
        },
    },
    75:{
        requirementDescription: "84th Milestone",
        unlocked() {return player[this.layer].best.gte(83)},
        done() {return player[this.layer].best.gte(84)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Prestige and Atomic-Prestige Upgrades is boosted.";
        },
    },
   74:{
        requirementDescription: "85th Milestone",
        unlocked() {return player[this.layer].best.gte(84)},
        done() {return player[this.layer].best.gte(85)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a Hyper-Prestige buyable. Unlock a new row of Hyper-Prestige upgrades.";
        },
    },
    73:{
        requirementDescription: "86th Milestone",
        unlocked() {return player[this.layer].best.gte(85)},
        done() {return player[this.layer].best.gte(86)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.0005.";
        },
    },
    72:{
        requirementDescription: "87th Milestone",
        unlocked() {return player[this.layer].best.gte(86)},
        done() {return player[this.layer].best.gte(87)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "27th Milestone's effect ^(meta-milestones^0.3).";
        },
    },
    71:{
        requirementDescription: "88th Milestone",
        unlocked() {return player[this.layer].best.gte(87)},
        done() {return player[this.layer].best.gte(88)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    70:{
        requirementDescription: "89th Milestone",
        unlocked() {return player[this.layer].best.gte(88)},
        done() {return player[this.layer].best.gte(89)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Super-Prestige and Hyper-Prestige Upgrades is boosted.";
        },
    },
   69: {
        requirementDescription: "90th Milestone",
        unlocked() {return player[this.layer].best.gte(89)},
        done() {return player[this.layer].best.gte(90)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            if(player[this.layer].best.gte(135))return "Gain 1e12% of Atomic-Prestige Point gain per second.";
            return "Gain 500% of Atomic-Prestige Point gain per second.";
        },
    },
    68:{
        requirementDescription: "91st Milestone",
        unlocked() {return player[this.layer].best.gte(90)},
        done() {return player[this.layer].best.gte(91)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.0005.";
        },
    },
    67:{
        requirementDescription: "92nd Milestone",
        unlocked() {return player[this.layer].best.gte(91)},
        done() {return player[this.layer].best.gte(92)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th Milestone's effect ^(meta-milestones^0.3).";
        },
    },
    66:{
        requirementDescription: "93rd Milestone",
        unlocked() {return player[this.layer].best.gte(92)},
        done() {return player[this.layer].best.gte(93)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    65:{
        requirementDescription: "94th Milestone",
        unlocked() {return player[this.layer].best.gte(93)},
        done() {return player[this.layer].best.gte(94)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "First row of Prestige and Atomic-Prestige Upgrades is boosted.";
        },
    },
    64:{
        requirementDescription: "95th Milestone",
        unlocked() {return player[this.layer].best.gte(94)},
        done() {return player[this.layer].best.gte(95)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock an Atomic-Prestige Challenge. Autobuy the first Hyper-Prestige buyable.";
        },
    },
    63:{
        requirementDescription: "96th Milestone",
        unlocked() {return player[this.layer].best.gte(95)},
        done() {return player[this.layer].best.gte(96)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.0005.";
        },
    },
    62:{
        requirementDescription: "97th Milestone",
        unlocked() {return player[this.layer].best.gte(96)},
        done() {return player[this.layer].best.gte(97)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "27th Milestone's effect ^(meta-milestones^0.4).";
        },
    },
    61:{
        requirementDescription: "98th Milestone",
        unlocked() {return player[this.layer].best.gte(97)},
        done() {return player[this.layer].best.gte(98)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted.";
        },
    },
    60:{
        requirementDescription: "99th Milestone",
        unlocked() {return player[this.layer].best.gte(98)},
        done() {return player[this.layer].best.gte(99)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer.";
        },
    },
    59:{
        requirementDescription: "100th Milestone",
        unlocked() {return player[this.layer].best.gte(99)},
        done() {return player[this.layer].best.gte(100)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep Prestige and Super-Prestige upgrades on Transcend";
        },
    },
    58:{
        requirementDescription: "101st Milestone",
        unlocked() {return player[this.layer].best.gte(100)},
        done() {return player[this.layer].best.gte(101)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep Hyper-Prestige and Prestige Boost upgrades on Transcend";
        },
    },
    57:{
        requirementDescription: "102nd Milestone",
        unlocked() {return player[this.layer].best.gte(101)},
        done() {return player[this.layer].best.gte(102)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep Atomic-Prestige upgrades on Transcend";
        },
    },
    56:{
        requirementDescription: "103rd Milestone",
        unlocked() {return player[this.layer].best.gte(102)},
        done() {return player[this.layer].best.gte(103)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Autocomplete AP challenge 1-5 3 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
        },
    },
    55:{
        requirementDescription: "104th Milestone",
        unlocked() {return player[this.layer].best.gte(103)},
        done() {return player[this.layer].best.gte(104)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted. Unlock a new layer. Unlock 4 new Transcend upgrades. Unlock a Hyper-Prestige buyable. Unlock a Transcend challenge.";
        },
    },
    54:{
        requirementDescription: "105th Milestone",
        unlocked() {return player[this.layer].best.gte(104)},
        done() {return player[this.layer].best.gte(105)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "1st milestone's softcap starts later based on your milestones. Currently: "+format(tmp.m.milestone105Effect)+"x later";
        },
    },
    53:{
        requirementDescription: "106th Milestone",
        unlocked() {return player[this.layer].best.gte(105)},
        done() {return player[this.layer].best.gte(106)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "6th and 27th milestone's effect ^(meta-milestones^0.5).";
        },
    },
    52:{
        requirementDescription: "107th Milestone",
        unlocked() {return player[this.layer].best.gte(106)},
        done() {return player[this.layer].best.gte(107)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "3rd Milestone's base effect exponent ^1.002. Autobuy the second Hyper-Prestige buyable.";
        },
    },
    51:{
        requirementDescription: "108th Milestone",
        unlocked() {return player[this.layer].best.gte(107)},
        done() {return player[this.layer].best.gte(108)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Autocomplete AP challenge 1-5 6 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
        },
    },
    50:{
        requirementDescription: "109th Milestone",
        unlocked() {return player[this.layer].best.gte(108)},
        done() {return player[this.layer].best.gte(109)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "4th Milestone is boosted. Unlock a Transcend challenge.";
        },
    },
    49:{
        requirementDescription: "110th Milestone",
        unlocked() {return player[this.layer].best.gte(109)},
        done() {return player[this.layer].best.gte(110)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain 0.2% of Transcend Point gain per second. Transcend challenge 1's base goal is decreased to x^2. You can complete an AP challenge without exiting it.";
        },
    },
    48:{
        requirementDescription: "111th Milestone",
        unlocked() {return player[this.layer].best.gte(110)},
        done() {return player[this.layer].best.gte(111)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Hyper Boost doesn't reset anything. Prestige boost is cheaper, and Unlock a new row of Prestige Boost upgrades. Unlock a new row of Transcend upgrades.";
        },
    },
    47{
        requirementDescription: "112th Milestone",
        unlocked() {return player[this.layer].best.gte(111)},
        done() {return player[this.layer].best.gte(112)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Transcend Challenge 2's reward is enabled while you're in Transcend Challenge 2.";
        },
    },
    46:{
        requirementDescription: "113th Milestone",
        unlocked() {return player[this.layer].best.gte(112)},
        done() {return player[this.layer].best.gte(113)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 0.3% of Transcend Point gain per second (total 0.5%). 6th and 27th milestone's effect ^(meta-milestones^0.3).";
        },
    },
    45:{
        requirementDescription: "114th Milestone",
        unlocked() {return player[this.layer].best.gte(113)},
        done() {return player[this.layer].best.gte(114)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Autocomplete AP challenge 1-5 9 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
        },
    },
    44:{
        requirementDescription: "115th Milestone",
        unlocked() {return player[this.layer].best.gte(114)},
        done() {return player[this.layer].best.gte(115)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 0.5% of Transcend Point gain per second (total 1%). Unlock a Transcend challenge.";
        },
    },
    43:{
        requirementDescription: "116th Milestone",
        unlocked() {return player[this.layer].best.gte(115)},
        done() {return player[this.layer].best.gte(116)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 1% of Transcend Point gain per second (total 2%). Autoget Hyper Boosts.";
        },
    },
    42:{
        requirementDescription: "117th Milestone",
        unlocked() {return player[this.layer].best.gte(116)},
        done() {return player[this.layer].best.gte(117)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 3% of Transcend Point gain per second (total 5%). Prestige boost is cheaper.";
        },
    },
    41:{
        requirementDescription: "118th Milestone",
        unlocked() {return player[this.layer].best.gte(117)},
        done() {return player[this.layer].best.gte(118)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 5% of Transcend Point gain per second (total 10%). 4th Milestone is boosted.";
        },
    },
    40:{
        requirementDescription: "119th Milestone",
        unlocked() {return player[this.layer].best.gte(118)},
        done() {return player[this.layer].best.gte(119)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 10% of Transcend Point gain per second (total 20%). Hyper boost is cheaper.";
        },
    },
    39:{
        requirementDescription: "120th Milestone",
        unlocked() {return player[this.layer].best.gte(119)},
        done() {return player[this.layer].best.gte(120)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 10% of Transcend Point gain per second (total 30%). AP challenge 1-5 goals are reduced, and you can complete an AP challenge a non-integer number of times.";
        },
    },
    38:{
        requirementDescription: "121st Milestone",
        unlocked() {return player[this.layer].best.gte(120)},
        done() {return player[this.layer].best.gte(121)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Autocomplete AP challenge 1-5 12 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
        },
    },
    37:{
        requirementDescription: "122nd Milestone",
        unlocked() {return player[this.layer].best.gte(121)},
        done() {return player[this.layer].best.gte(122)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "AP challenge 4 (Reduced Points)'s formula is changed. AP challenge 2 (No Super-Prestige) completions past-5 add the reward by 0.015 each instead of 0.01.";
        },
    },
   36: {
        requirementDescription: "123rd Milestone",
        unlocked() {return player[this.layer].best.gte(122)},
        done() {return player[this.layer].best.gte(123)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 15% of Transcend Point gain per second (total 45%). Unlock a Prestige buyable.";
        },
    },
    35:{
        requirementDescription: "124th Milestone",
        unlocked() {return player[this.layer].best.gte(123)},
        done() {return player[this.layer].best.gte(124)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new row of Prestige upgrades. Autobuy the first Prestige buyable.";
        },
    },
    34:{
        requirementDescription: "125th Milestone",
        unlocked() {return player[this.layer].best.gte(124)},
        done() {return player[this.layer].best.gte(125)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer. Reset on this layer doesn't reset anything. This layer doesn't reset on all resets except 7th row reset. Unlock a Transcend Challenge. Unlock a new row of Transcend upgrades.";
        },
    },
    33:{
        requirementDescription: "126th Milestone",
        unlocked() {return player[this.layer].best.gte(125)},
        done() {return player[this.layer].best.gte(126)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Auto-collect Prestige Energy.";
        },
    },
    32:{
        requirementDescription: "127th Milestone",
        unlocked() {return player[this.layer].best.gte(126)},
        done() {return player[this.layer].best.gte(127)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 15% of Transcend Point gain per second (total 60%). Unlock a new row of Super-Prestige upgrades.";
        },
    },
    31:{
        requirementDescription: "128th Milestone",
        unlocked() {return player[this.layer].best.gte(127)},
        done() {return player[this.layer].best.gte(128)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Transcend Upgrade 54 is boosted. Unlock an AP challenge.";
        },
    },
    30:{
        requirementDescription: "129th Milestone",
        unlocked() {return player[this.layer].best.gte(128)},
        done() {return player[this.layer].best.gte(129)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a Super-Prestige buyable.";
        },
    },
    29:{
        requirementDescription: "130th Milestone",
        unlocked() {return player[this.layer].best.gte(129)},
        done() {return player[this.layer].best.gte(130)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 20% of Transcend Point gain per second (total 80%). Autobuy the second Super-Prestige buyable. AP challenge 1-3 and 6 goals are reduced. Unlock a new tab in Transcend.";
        },
    },
    28:{
        requirementDescription: "131st Milestone",
        unlocked() {return player[this.layer].best.gte(130)},
        done() {return player[this.layer].best.gte(131)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Autocomplete AP challenge 1-5 15 times on Transcend. This milestone is disabled when you're in a Transcend challenge.";
        },
    },
    27:{
        requirementDescription: "132nd Milestone",
        unlocked() {return player[this.layer].best.gte(131)},
        done() {return player[this.layer].best.gte(132)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "The second Super-Prestige buyable's effect is better. Unlock a new row of Prestige Boost upgrades.";
        },
    },
    26:{
        requirementDescription: "133rd Milestone",
        unlocked() {return player[this.layer].best.gte(132)},
        done() {return player[this.layer].best.gte(133)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Gain additional 20% of Transcend Point gain per second (total 100%). The 105th milestone's effect ^1.2";
        },
    },
    25:{
        requirementDescription: "134th Milestone",
        unlocked() {return player[this.layer].best.gte(133)},
        done() {return player[this.layer].best.gte(134)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep Hyper Boost upgrades on Transcend.";
        },
    },
    24:{
        requirementDescription: "135th Milestone",
        unlocked() {return player[this.layer].best.gte(134)},
        done() {return player[this.layer].best.gte(135)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "20th Milestone, 57th Milestone, 75th Milestone and 90th Milestone's effects are 1e12%.";
        },
    },
    23:{
        requirementDescription: "136th Milestone",
        unlocked() {return player[this.layer].best.gte(135)},
        done() {return player[this.layer].best.gte(136)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new row of Transcend Upgrades. AP challenge 5's goal is reduced.";
        },
    },
    22:{
        requirementDescription: "137th Milestone",
        unlocked() {return player[this.layer].best.gte(136)},
        done() {return player[this.layer].best.gte(137)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a Transcend Challenge. Transcend's requirement is 1e640 instead of 1e850 (doesn't affect Transcend Point gain).";
        },
    },
    21:{
        requirementDescription: "138th Milestone",
        unlocked() {return player[this.layer].best.gte(137)},
        done() {return player[this.layer].best.gte(138)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "AP challenge 2 (No Super-Prestige) completions past-5 add the reward by 0.02 each instead of 0.015.";
        },
    },
    20:{
        requirementDescription: "139th Milestone",
        unlocked() {return player[this.layer].best.gte(138)},
        done() {return player[this.layer].best.gte(139)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Base effect formulas of 4th, 6th and 27th milestones are better (linear -> exponential).";
        },
    },
    19:{
        requirementDescription: "140th Milestone",
        unlocked() {return player[this.layer].best.gte(139)},
        done() {return player[this.layer].best.gte(140)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep AP challenge completions on Transcend (per T challenge, AP challenge completions will reset on 7th row reset). You can complete a T challenge without exiting it. Unlock a new layer.";
        },
    },
    18:{
        requirementDescription: "141st Milestone",
        unlocked() {return player[this.layer].best.gte(140)},
        done() {return player[this.layer].best.gte(141)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "AP challenge 6's goal is reduced.";
        },
    },
    17:{
        requirementDescription: "142nd Milestone",
        unlocked() {return player[this.layer].best.gte(141)},
        done() {return player[this.layer].best.gte(142)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new row of Hyper-Prestige Upgrades.";
        },
    },
    16:{
        requirementDescription: "143rd Milestone",
        unlocked() {return player[this.layer].best.gte(142)},
        done() {return player[this.layer].best.gte(143)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "The 105th milestone's effect ^1.1";
        },
    },
    15:{
        requirementDescription: "144th Milestone",
        unlocked() {return player[this.layer].best.gte(143)},
        done() {return player[this.layer].best.gte(144)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "AP challenge 2 (No Super-Prestige) completions past-5 add the reward by 0.025 each instead of 0.02.";
        },
    },
    14:{
        requirementDescription: "145th Milestone",
        unlocked() {return player[this.layer].best.gte(144)},
        done() {return player[this.layer].best.gte(145)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "You can complete AP Challenge 1-3 outside of it.";
        },
    },
    13:{
        requirementDescription: "146th Milestone",
        unlocked() {return player[this.layer].best.gte(145)},
        done() {return player[this.layer].best.gte(146)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock more Super Energy upgrades.";
        },
    },
    12:{
        requirementDescription: "147th Milestone",
        unlocked() {return player[this.layer].best.gte(146)},
        done() {return player[this.layer].best.gte(147)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "You can complete T Challenge 1-2 outside of it.";
        },
    },
    11:{
        requirementDescription: "148th Milestone",
        unlocked() {return player[this.layer].best.gte(147)},
        done() {return player[this.layer].best.gte(148)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Double Super-Energy gain.";
        },
    },
    10:{
        requirementDescription: "149th Milestone",
        unlocked() {return player[this.layer].best.gte(148)},
        done() {return player[this.layer].best.gte(149)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Double Super-Energy gain.";
        },
    },
    9:{
        requirementDescription: "150th Milestone",
        unlocked() {return player[this.layer].best.gte(149)},
        done() {return player[this.layer].best.gte(150)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "You can complete AP Challenge 5-6 outside of it.";
        },
    },
    8:{
        requirementDescription: "151st Milestone",
        unlocked() {return player[this.layer].best.gte(150)},
        done() {return player[this.layer].best.gte(151)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock a new layer.";
        },
    },
    7:{
        requirementDescription: "152nd Milestone",
        unlocked() {return player[this.layer].best.gte(151)},
        done() {return player[this.layer].best.gte(152)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Double Super-Energy gain.";
        },
    },
    6:{
        requirementDescription: "153rd Milestone",
        unlocked() {return player[this.layer].best.gte(152)},
        done() {return player[this.layer].best.gte(153)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Keep Prestige upgrades on PP reset.";
        },
    },
   5: {
        requirementDescription: "154th Milestone",
        unlocked() {return player[this.layer].best.gte(153)},
        done() {return player[this.layer].best.gte(154)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Power Scaler's effect is boosted by Prestige Power amount.<br>Currently: " + format(tmp.m.milestone154Effect) + "x";
        },
    },
    4: {
        requirementDescription: "155th Milestone",
        unlocked() {return player[this.layer].best.gte(154)},
        done() {return player[this.layer].best.gte(155)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Unlock More Prestige Power upgrades";
        },
    },
    3: {
        requirementDescription: "156th Milestone",
        unlocked() {return player[this.layer].best.gte(155)},
        done() {return player[this.layer].best.gte(156)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Requirement for Special Points is 1e400";
        },
    },
    2: {
        requirementDescription: "157th Milestone",
        unlocked() {return player[this.layer].best.gte(156)},
        done() {return player[this.layer].best.gte(157)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Passively generate 30% of Prestige Power gain";
        },
    },
    1: {
        requirementDescription: "158th Milestone",
        unlocked() {return player[this.layer].best.gte(157)},
        done() {return player[this.layer].best.gte(158)}, // Used to determine when to give the milestone
        effectDescription:  function(){
            return "Reach current endgame.";
        },
       },
       },