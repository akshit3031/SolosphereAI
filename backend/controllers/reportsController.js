const Report = require('../models/Report');

const postReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    console.log(req.body);
    await report.save();
    res.status(201).json({ message: 'Report saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save report' });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      // Sort by timestamp descending so latest docs come first
      { $sort: { timestamp: -1 } },

      // Group by machine_id, take the first doc in each group (latest because sorted)
      {
        $group: {
          _id: "$machine_id",
          doc: { $first: "$$ROOT" } // entire document
        }
      },

      // Replace root with the doc object to get clean results
      { $replaceRoot: { newRoot: "$doc" } },

      // Optionally, sort again by timestamp descending for final output
      { $sort: { timestamp: -1 } }
    ]);

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const filterReports = async (req, res) => {
  const { os, issues } = req.query;
  let query = {};

  if (os) query.os = os;
  if (issues === 'true') {
    query.$or = [
      { encryption: false },
      { os_updated: false },
      { sleep_timeout_minutes: { $gt: 10 } }
    ];
  }

  const results = await Report.find(query).sort({ timestamp: -1 });
  res.json(results);
};

const machineHistory = async(req,res)=>{
   const { machineId } = req.params;

  try {
    // Find all reports for this machine, sorted by lastCheckIn descending
    

    const history = await Report.find({ machine_id:machineId }).sort({lastCheckIn:-1});
    console.log(history)
    res.json(history); // send as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching history' });
  }

}

module.exports = { postReport, getReports, filterReports, machineHistory };
