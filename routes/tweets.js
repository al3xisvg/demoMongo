const express = require("express");
const controllerRouter = express.Router();
const Tweets = require("../models/tweets");
//Getting all
controllerRouter.get("/", async (req, res) => {
  try {
    const tweets = await Tweets.find({});
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Get One

/*controllerRouter.get("/:id", (req, res) => {
  res.send(req.params.id);
});*/
//Create One
controllerRouter.post("/", async (req, res) => {
  const tweet = new Tweets({
    id: req.body.id,
    user_name: req.body.user_name,
  });
  try {
    const newTweet = await tweet.save();
    res.status(200).json(newTweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Update One
controllerRouter.put("/", (req, res) => {});
//Delte One

// Pregunta 1. Reporte todos los tweets que mencionan al periodista “Phillip Butters” y analize con que acontecimiento esta asociado
controllerRouter.get("/pregunta-1", async (req, res) => {
  try {
    const tweets = await Tweets.find({
      text: { $regex: /phillip butters/i },
    });
    res.status(200).json(tweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Pregunta 2. Mostrar la fecha y el texto de los 10  ́ultimos tweets del dia 23
controllerRouter.get("/pregunta-2", async (req, res) => {
  try {
    const tweets = await Tweets.find(
      { $expr: { $eq: [{ $dayOfMonth: "$date" }, 23] } },
      { date: 1, text: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json(tweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Pregunta 3. Reportar la cantidad de tweets y retweets.
controllerRouter.get("/pregunta-3", async (req, res) => {
  try {
    const tweets = await Tweets.aggregate([
      {
        $group: {
          _id: null,
          totalTweets: { $sum: 1 },
          totalRetweets: {
            $sum: { $cond: [{ $eq: ["$retweeted", true] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalTweets: 1,
          totalRetweets: 1,
        },
      },
    ]);
    res.status(200).json(tweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Pregunta 4. Cantidad de menciones que tuvo Jorge Muñoz en ese día
controllerRouter.get("/pregunta-4", async (req, res) => {
  try {
    const startDate = new Date("2018-08-23T00:00:00Z");
    const endDate = new Date("2018-08-24T00:00:00Z");
    const tweets = await Tweets.find({
      text: { $regex: /jorge muñoz/i },
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).count();

    res.status(200).json(tweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Pregunta 5. Reporte que candidato obtuvo la mayor cantidad de menciones.
controllerRouter.get("/pregunta-5", async (req, res) => {
  try {
    const tweets = await Tweets.aggregate([
      {
        $group: {
          _id: null,
          mencionesPhillip: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$text", regex: /phillip butter/i } },
                1,
                0,
              ],
            },
          },
          mencionesJorge: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$text", regex: /jorge muñoz/i } },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          mencionesPhillip: 1,
          mencionesJorge: 1,
          mayorMencion: {
            $cond: {
              if: { $gt: ["$mencionesPhillip", "$mencionesJorge"] },
              then: "Phillip",
              else: "Jorge",
            },
          },
        },
      },
    ]);

    res.status(200).json(tweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = controllerRouter;
