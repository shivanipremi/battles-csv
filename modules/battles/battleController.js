"use strict";

const apiReferenceModule = "battles";
const Lib = require("../../Libs/validations");
const csv = require("csvtojson");
const fs = require("fs");

const kings = require("../kings/kingsModel");
const region = require("../region/regionModel");
const Battle = require("./battleModel");
const battleJoi = require("./battleJoi")

const import_csv = async function(req, res) {
  const apiReference = {
    module: apiReferenceModule,
    api: "import_csv"
  };
  try {
    const file = req.files.csv_file.name;
    const readStream = fs.createReadStream(file);
    csv()
      .fromStream(readStream)
      .subscribe(async function(jsonRow) {
        let attackerKingId, defenderKingId;
        if (jsonRow.attacker_king) {
          let dataToInsert = {
            name: jsonRow.attacker_king,
            $inc: { total_wars: 1, war_as_attacker: 1 }
          };
          if (jsonRow.attacker_outcome == "win") {
            dataToInsert["$inc"]["wins_as_attacker"] = 1;
          } else if (jsonRow.attacker_outcome == "loss") {
            dataToInsert["$inc"]["lost_as_attacker"] = 1;
          }

          let attacker = await kings.findOneAndUpdate(
            { name: jsonRow.attacker_king },
            dataToInsert,
            { upsert: true, new: true, useFindAndModify: false }
          );
          attackerKingId = attacker._id;
        }
        if (jsonRow.defender_king) {
          let dataToUpdate = {
            name: jsonRow.defender_king,
            $inc: { total_wars: 1, war_as_defender: 1 }
          };
          if (jsonRow.attacker_outcome == "win") {
            dataToUpdate["$inc"]["lost_as_defender"] = 1;
          } else if (jsonRow.attacker_outcome == "loss") {
            dataToUpdate["$inc"]["wins_as_defender"] = 1;
          }
          let defender = await kings.findOneAndUpdate(
            { name: jsonRow.defender_king },
            dataToUpdate,
            { upsert: true, new: true }
          );
          defenderKingId = defender._id;
        }
        let regionData;

        if (jsonRow.region) {
          regionData = await region.findOneAndUpdate(
            { name: jsonRow.region },
            { name: jsonRow.region, $inc: { count: 1 } },
            { upsert: true, new: true }
          );
        }

        jsonRow.attacker_king = attackerKingId;
        jsonRow.defender_king = defenderKingId;
        jsonRow.region = regionData._id;

        await new Battle(jsonRow).save();
      })

      .on("done", () => {
        console.log("done");
      });
    return res.json({ success: "Data imported successfully.", status: 200 });
  } catch (err) {
    console.log("error here==", err)
    return res.json({ error: "Oops! Something went wrong.", status: 400 });
  }
};

const count_items = async function(req, res) {
  try {
    let count = await Battle.count();
    res.send({
      status: 200,
      count
    });
  } catch (err) {
    return res.json({ error: "Oops! Something went wrong.", status: 400 });
  }
};
const list_items = async function(req, res) {
  try {
    let location = await Battle.find(
      { location: { $ne: "" } },
      { location: 1 }
    ).distinct("location");
    res.send({
      status: 200,
      location
    });
  } catch (err) {
    return res.json({ error: "Oops! Something went wrong.", status: 400 });
  }
};
const search_items = async function(req, res) {
  try {
    let kingId,
      query = {};
    if (req.query.king) {
      let kingName = req.query.king;
      let king = await kings.findOne({
        name: { $regex: kingName, $options: "i" }
      });
      if (king) {
        kingId = king._id;
      } else {
        return res.send({
          success: 200,
          data: [],
          count: 0
        });
      }
    }
    if (kingId) {
      query = {
        $or: [
          {
            attacker_king: kingId
          },
          {
            defender_king: kingId
          }
        ]
      };
    }
    if (req.query.location) {
      query.location = req.query.location;
    }
    if (req.query.type) {
      query.battle_type = req.query.type;
    }
    let data = [],
      count;
    if (Object.entries(query).length > 0) {
      data = await Battle.find(query);
      count = data.length;
    } else {
      data = [];
    }
    res.send({
      status: 200,
      data,
      count
    });
  } catch (err) {
    return res.json({ error: "Oops! Something went wrong.", status: 400 });
  }
};

const item_stats = async function(req, res) {
  try {
  let mostActiveAttacker = await kings.findOne().sort({war_as_attacker : -1})
  let mostActiveDefender = await kings.findOne().sort({war_as_defender : -1})
  let mostActiveRegion = await region.findOne().sort({count : -1})
  let battleTypes = await Battle.find().distinct('battle_type');
  let defenderSize = await Battle.aggregate([
    {
       $group: {
           _id: null,
           maxQuantity: {$max: "$defender_size"},
           minQuantity: {$min: "$defender_size"},
           avgQuantity: {$avg: "$defender_size"}
       }
   }
  ])
  let win =  await Battle.find({attacker_outcome : 'win'}).count();
  let loss = await Battle.find({attacker_outcome : 'loss'}).count();
  let data = {};
  data.attacker_outcome ={
    win, loss
  }
  data.defenderSize = {
    average : defenderSize && defenderSize[0].avgQuantity || 0,
    min : defenderSize && defenderSize[0].minQuantity|| 0,
    max : defenderSize && defenderSize[0].maxQuantity|| 0
  }

  data.most_active = {
    attacker_king : mostActiveAttacker.name,
    defender_king : mostActiveDefender.name,
    region : mostActiveRegion.name
  }
  data.battleTypes = battleTypes;
  res.send({
    status : 200,
    data
  })

  } catch(err) {
    return res.json({ error: "Oops! Something went wrong.", status: 400 });
  }
}


module.exports.import_csv = import_csv;
module.exports.search_items = search_items;
module.exports.list_items = list_items;
module.exports.count_items = count_items;
module.exports.item_stats = item_stats
