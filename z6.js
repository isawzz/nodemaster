// C:\DATA\dev_2020\CODEBASE\tnt_code\_front\asimple\js
var unitTestId = 0;
//#endregion

//#region generators (unitTests.js)

//#region generators (unitTests.js)
function generateCard(hasOwner = true, hasContent = true, visibleToN = 1) {
  let id = "action_" + unitTestId;
  unitTestId += 1;
  let o = JSON.parse(`
  {
    "wildcard": "Isolationism",
    "season": "Fall",
    "priority": "H",
    "value": 8,
    "obj_type": "action_card",
    "visible": {
      "xset": [
        "Axis"
      ]
    },
    "owner": "Axis",
    "_id": "action_48"
  }
  `);
  if (!hasContent) {
    o = JSON.parse(`
    {
    "obj_type": "action_card",
    "visible": {
      "xset": [
        "Axis"
      ]
    },
    "owner": "Axis",
    "_id": "action_48"
  }
  `);
  }
  o._id = id;
  if (!hasOwner) {
    delete o.owner;
  }
  if (visibleToN == 0) {
    o.visible.xset = [];
  } else if (visibleToN == 2) {
    o.visible.xset.push("West");
  } else if (visibleToN == 3) {
    o.visible.xset = ["Axis", "West", "USSR"];
  }
  return {id: id, o: o};
}
function generateUnitList() {
  data = {
    created: {
      "246": {
        nationality: "Britain",
        tile: "London",
        type: "Fleet",
        cv: 4,
        obj_type: "unit",
        visible: {
          xset: ["West"]
        },
        _id: 246
      },
      "246": {
        nationality: "Britain",
        tile: "London",
        type: "Fleet",
        cv: 4,
        obj_type: "unit",
        visible: {
          xset: ["West"]
        },
        _id: 246
      },
      "247": {
        nationality: "Britain",
        tile: "Gibraltar",
        type: "Fortress",
        cv: 1,
        obj_type: "unit",
        visible: {
          xset: ["West"]
        },
        _id: 247
      },
      "248": {
        nationality: "Britain",
        tile: "Karachi",
        type: "Fortress",
        cv: 1,
        obj_type: "unit",
        visible: {
          xset: ["West"]
        },
        _id: 248
      }
    }
  };
  return data;
}
//#endregion generators (unitTests.js)

//#region cards (unitTests.js)
function testCreateNCards() {
  let cman = new ACards(assets);
  let n = 20;
  for (let i = 0; i < n; i++) {
    let c = generateCard();
    cman.createCard(c.id, c.o);
  }
}
function testCreateOneCard() {
  let c = generateCard();
  let cman = new ACards(assets);
  cman.createCard(c.id, c.o);
}
function testIntegrationCards(filename = "prod_complete", player = "Axis") {
  execOptions.output = "none";
  addIf("cards", execOptions.activatedTests);
  if (empty(filename)) {
    sendInit(player, gameloop, 0);
  } else {
    sendLoading(filename, player, gameloop);
  }
}
//#endregion cards (unitTests.js)

//#region communication (unitTests.js)
function testInitToEnd(player = "USSR", seed = 0) {
  hide(bStop);
  sendInit(player, d => testRunToEnd(d, player), seed);
}
function testLoadToEnd(player = "Axis", filename = "setup_complete") {
  hide(bStop);
  sendLoading(filename, player, d => testRunToEnd(d, player), "raw");
}
function testRunToEnd(data, player) {
  let tuples = getTuples(data);
  if (empty(tuples)) {
    let waitingSet = getSet(data, "waiting_for");
    if (empty(waitingSet)) {
      error("NO ACTIONS AND EMPTY WAITING SET... sending empty action!!!");
      sendAction(player, ["none"], d => testRunToEnd(d, player));
    } else {
      let nextPlayer = waitingSet[0];
      sendChangeToPlayer(nextPlayer, d1 => {
        testRunToEnd(d1, nextPlayer);
      });
    }
  } else {
    decider.pickTuple(tuples, t => {
      sendAction(player, t, d => testRunToEnd(d, player));
    });
  }
}
//#endregion communication (unitTests.js)

//#region control (unitTests.js)
function testControlFlow(player = "USSR", filename = "", seed = 4) {
  execOptions.output = "none";
  addIf("control", execOptions.activatedTests);
  if (empty(filename)) {
    sendInit(player, gameloop, seed);
  } else {
    sendLoading(filename, player, gameloop);
  }
}
//#endregion control (unitTests.js)

//#region edit (unitTests.js)
function testEditModeCreateUnit() {
  player = "USSR";
  sendLoading("setup_complete", player, dInit => {
    sender.send("edit/" + player + "/USSR+Moscow+Infantry", dEdit => {
      let newUnit = Object.values(dEdit.created)[0];
      let newId = Object.keys(dEdit.created)[0];
      dInit.created[newId] = newUnit;
      gameloop(dInit);
    });
  });
}
function testEditModeCreateUnit_trial1() {
  sendInit(player, dInit => {
    gameloop(dInit);
  });
}
//#endregion edit (unitTests.js)

//#region map (unitTests.js)
function testAddInfluence(mapController, gObjects) {
  let data = {};
  addIf("map", execOptions.activatedTests);
  data.created = {
    "507565": {
      value: 1,
      nation: "Canada",
      faction: "Axis",
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 507565
    },
    "531772": {
      value: 2,
      nation: "Ireland",
      faction: "West",
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531772
    },
    "531773": {
      value: 3,
      nation: "Portugal",
      faction: "USSR",
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531773
    },
    "531774": {
      value: 2,
      nation: "Norway",
      faction: "Axis",
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531774
    },
    "531775": {
      value: 4,
      nation: "Latin_America",
      faction: "Axis",
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531775
    }
  };
  mapController.update(data, gObjects);
}
function testIntegrationMap(filename = "prod_complete", player = "Axis") {
  execOptions.output = "none";
  addIf("map", execOptions.activatedTests);
  if (empty(filename)) {
    sendInit(player, gameloop, 0);
  } else {
    sendLoading(filename, player, gameloop);
  }
}
function testRemoveInfluence(mapController, gObjects) {
  let data = {};
  addIf("map", execOptions.activatedTests);
  data.removed = {
    "507565": {
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 507565
    },
    "531772": {
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531772
    },
    "531773": {
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531773
    },
    "531774": {
      value: 2,
      nation: "Norway",
      faction: "Axis",
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531774
    },
    "531775": {
      value: 4,
      nation: "Latin_America",
      faction: "Axis",
      obj_type: "influence",
      visible: {
        xset: ["Axis", "USSR", "West"]
      },
      _id: 531775
    }
  };
  mapController.update(data, gObjects);
}
//#endregion map (unitTests.js)

//#region random (unitTests.js)
function sendRandom(G, n, callback) {}
function testRandomSeries(G, n, callback) {
  sender.send("init/hotseat/Axis/1", dInit => {
    testRandomSeriesRec([], dInit, G, n, callback);
  });
}
function testRandomSeries_sendInit(lst, G, n, callback) {
  sendInit(
    G.player,
    dInit => {
      lst.push();
      testRandomSeriesRec(dInit, G, n - 1, callback);
    },
    G.seed
  );
}
function testRandomSeriesRec(lst, dInit, G, n, callback) {
  sender.send("randint/" + 100, di => {
    let x = di.int;
    lst.push(x);
    if (n > 0) {
      testRandomSeriesRec(lst, dInit, G, n - 1, callback);
    } else {
      callback(dInit);
    }
  });
}
//#endregion random (unitTests.js)

//#region save (unitTests.js)
function testEdit(origData, player = "USSR", filename = "test1", seed = 0) {
  execOptions.output = "none";
  sendInit(player, d1 => {
    freezeUI();
    let tuples = getTuples(d1);
    sendEditAction(player, ["France", "Vienna", "Fleet"], d2 => {
      gameloop(origData);
    });
  });
}
function testEditAddRandomUnit() {
  let tuple = randomUnitTuple();
}
function testLoadSpring(filename = "spring_start", player = "Axis") {
  execOptions.output = "none";
  if (empty(filename)) {
    sendInit(player, gameloop, 5);
  } else {
    sendLoading(filename, player, gameloop);
  }
}
function testMovement(filename = "test_movement", player = "Axis") {
  execOptions.output = "none";
  if (empty(filename)) {
    sendInit(player, gameloop, 5);
  } else {
    sendLoading(filename, player, gameloop);
  }
}
//#endregion save (unitTests.js)

//#region tests (unitTests.js)
function testStep(data, player) {
  let tuples = getTuples(data);
  if (empty(tuples)) {
    let waitingSet = getSet(data, "waiting_for");
    if (empty(waitingSet)) {
      error("NO ACTIONS AND EMPTY WAITING SET... sending empty action!!!");
      nextAction = () => sendAction(player, ["none"], d => testStep(d, player));
    } else {
      let nextPlayer = waitingSet[0];
      nextAction = () =>
        sendChangeToPlayer(nextPlayer, d1 => {
          testStep(d1, nextPlayer);
        });
    }
  } else {
    decider.pickTuple(tuples, t => {
      sendAction(player, t, d => testStep(d, player));
    });
  }
  show(bStep);
}
function testStepByStep(player = "Axis", filename = "gov_complete") {
  sendLoading(filename, player, d => testStep(d, player), "raw");
}
//#endregion tests (unitTests.js)

//#region units (unitTests.js)
function testCreateMultipleUnitsOnSameTile() {
  execOptions.output = "none";
  addIf("units", execOptions.activatedTests);
  let data = generateUnitList();
  let player = "West";
  for (const id in data.created) {
    const o = data.created[id];
    o.tile = "London";
    o.nationality = "Britain";
    units.createUnit(id, o, player);
  }
  player = "USSR";
  for (const id in data.created) {
    let idNew = id + 200;
    const o = data.created[id];
    o.tile = "Berlin";
    o.nationality = "Germany";
    o._id = idNew;
    units.createUnit(idNew, o, player);
  }
}
function testCreateSingleUnit() {
  execOptions.output = "none";
  addIf("units", execOptions.activatedTests);
  let data = generateUnitList();
  let player = "West";
  for (const id in data.created) {
    const o = data.created[id];
    units.createUnit(id, o, player);
    break;
  }
}
function testIntegrationUnits(filename = "", player = "USSR", seed = 4) {
  execOptions.output = "none";
  addIf("units", execOptions.activatedTests);
  if (empty(filename)) {
    sendInit(player, gameloop, seed);
  } else {
    sendLoading(filename, player, gameloop);
  }
}
//#endregion units (unitTests.js)
