const apiReferenceModule = "items";
const Lib = require("../../Libs/validations");
const battleJoiSchema = require("./battleJoi");
const csv = require("csvtojson");
const fs = require("fs");

const kings = require("../kings/kingsModel");
const region = require("../region/regionModel");
const Battle = require("./battleModel")




const import_csv = async function(req, res) {
  const apiReference = {
    module: apiReferenceModule,
    api: "import_csv"
  };
  try {
    const readStream = fs.createReadStream("battles.csv");
    csv()
      .fromStream(readStream)

      .subscribe(async function(jsonRow) {
        let attackerKingId, defenderKingId;
        try {
          let king;

          if (jsonRow.attacker_king) {
            // console.log("attacker king present", jsonRow.attacker_king);
            let dataToInsert = {
              name: jsonRow.attacker_king,
              $inc: { total_wars: 1, war_as_attacker: 1 }
            };
            if (jsonRow.attacker_outcome == "win") {
              dataToInsert["$inc"]["wins_as_attacker"] = 1;
            } else if (jsonRow.attacker_outcome == "loss") {
              dataToInsert["$inc"]["lost_as_attacker"] = 1;
            }
            console.log(">>>>>>>update>>>>>>>>>>", dataToInsert);

            let attacker = await kings.findOneAndUpdate(
              { name: jsonRow.attacker_king },
              dataToInsert,
              { upsert: true, new: true, useFindAndModify: false }
            );
            // console.log("experimentation in attacker part============", attacker)
            attackerKingId = attacker._id;
            // if (king && king._id) {
            //   console.log("<<<<attacker king dound here=======", king);
            //   attackerKingId = king._id;
            //   console.log("upatede=======", update);
            //   await kings.updateOne({ _id: attackerKingId }, update);
            // } else {
            //   console.log("attacker king not foud======", update);
            //   attackerKingId = await new kings(update).save();
            //   console.log("attacker king ids===", attackerKingId);
            // }
          }
          if (jsonRow.defender_king) {
            // console.log("defender king present ==>>", jsonRow.defender_king);
            let dataToUpdate = {
              name: jsonRow.defender_king,
              $inc: { total_wars: 1, war_as_defender: 1 }
            };
            if (jsonRow.attacker_outcome == "win") {
              dataToUpdate["$inc"]["lost_as_defender"] = 1;
            } else if (jsonRow.attacker_outcome == "loss") {
              dataToUpdate["$inc"]["wins_as_defender"] = 1;
            }
            console.log(">>>>>>>update>>>>>>>>>>", dataToUpdate);
            let defender = await kings.findOneAndUpdate(
              { name: jsonRow.defender_king },
              dataToUpdate,
              { upsert: true, new: true }
            );
            // console.log("experimentation in attacker part============", defender)
            defenderKingId = defender._id;
            // king = await kings.findOne({ name: jsonRow.defender_king.toString() });

            // if (king && king._id) {
            //   console.log("<<<<defender king dound here=======", king);
            //   defenderKingId = king._id;

            //   await kings.updateOne({ _id: defenderKingId }, update);
            // } else {
            //   console.log("new insertion===defender king=====", update.name);
            //   defenderKingId = await new kings(update).save()._id;
            // }
          }
          let regionData;

          if (jsonRow.region) {
            regionData = await region.findOneAndUpdate(
              { name: jsonRow.region },
              { name: jsonRow.region, $inc: { count: 1 } },
              { upsert: true, new: true }
            );
            // console.log('region is=====', regionData)
          }
          // console.log(
          //   "attacket and defender present===",
          //   jsonRow,
          //   "ids==========",
          //   attackerKingId,
          //   defenderKingId
          // );
          jsonRow.attacker_king = attackerKingId;
          jsonRow.defender_king = defenderKingId;
          jsonRow.region = regionData._id;

          let battle = await new Battle(jsonRow).save();
          //  console.log("battle inserted yeye===>>>", battle)
        } catch (err) {
          console.log("error occure here====", err);
          errors.push(err);
        }
      })

      .on("done", () => {
        console.log("TOTAL ERRORS ARE HERE");
        // if (isValidationError) {
        //     cb(ERROR.CSV_DATA_ERROR);
        // } else {
        //     cb(null, { data: 'successful' });

        // }
      });
    res.json({ success: "Data imported successfully.", status: 200 });
  } catch (err) {
    throw err;
  }
};
const count_items = async function(req, res) {
    try {
      console.log("Req user ere==", req.user)
        let count = await Battle.count()
        console.log("count is====", count)
        res.send({
          status : 200,
          count, 
        })

    } catch(err) {

    }
}
const list_items = async function(req, res) {
    try {
    let location = await Battle.find({location : {$ne : ''}}, {location : 1}).distinct('location')
    console.log("location here==", location)
    res.send({
      status : 200,
      location 
    })

    } catch(err) {

    }
}
const search_items = async function(req, res) {
  let kingId, query = {}
  if(req.query.king) {
    let kingName = req.query.king
    let king = await kings.findOne({name : { $regex: kingName, $options: 'i' }})
    if(king) {
      kingId = king._id
    } else {
      return res.send({
        success : 200,
        data : [],
        count : 0
      })
    }
  }
    if(kingId) {
    
    query = {
      $or : [{
        attacker_king : kingId
      },{
        defender_king : kingId
      }   
      ]
    }
  }
    if(req.query.location){
      query.location = req.query.location
    }
    if(req.query.type) {
      query.battle_type = req.query.type
    }
  
  
  console.log(">>>>>>>>>>query>>>>>>>>>>>>", query)
  let data = [], count;
  if(Object.entries(query).length > 0){
    data = await Battle.find(query);
    count = data.length
  } else {
    data = []
  }
   
  console.log("location here==", data)
  res.send({
    status : 200,
    data,
    count
  })
}

module.exports.import_csv = import_csv;
module.exports.search_items = search_items;
module.exports.list_items = list_items
module.exports.count_items = count_items
    
