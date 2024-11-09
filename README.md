## Consultas

---

```
~ mongoimport --db Twitter --collection tweets --file tweets.json --jsonArray
```

- [x] 1. Philip Butters

```
~ db.getCollection("tweets").find({ text: { $regex: /phillip butters/i }}).count()
```

- [x] 2. Últimos 10 tweets del día 23

```
~ db.getCollection("tweets").aggregate([{
    $addFields: {
        date: { $toDate: "$date" }
    }
  },
  {
    $merge: {
      into: "tweets",
      whenMatched: "merge",
      whenNotMatched: "insert"
    }
  }])
~ db.getCollection("tweets").find({ $expr: { $eq: [{ $dayOfMonth: "$date" }, 23] } }, { date: 1, text: 1 }).sort({ createdAt: -1 }).limit(10)
```

- [x] 3. Cantidad de tweets y retweets

```
~ db.getCollection("tweets").aggregate([
{
    $group: {
      _id: null,
      totalTweets: { $sum: 1 },
      totalRetweets: { $sum: { $cond: [{ $eq: ["$retweeted", true] }, 1, 0] } }
    }
  },
  {
    $project: {
      _id: 0,
      totalTweets: 1,
      totalRetweets: 1
    }
  }
])
```

- [x] 4. Cantidad de menciones que tuvo Jorge Muñoz en ese día

```
~ db.getCollection("tweets").find({
  text: {  $regex: /jorge muñoz/i },
  date: {
    $gte: ISODate("2018-08-23T00:00:00Z"),
    $lt: ISODate("2018-08-24T00:00:00Z")
  }
})

```

- [x] 5. Reporte que candidato obtuvo la mayor cantidad de menciones.

```
~ db.getCollection("tweets").aggregate([
{
    $group: {
      _id: null,
      mencionesPhillip: {
        $sum: { $cond: [{ $regexMatch: { input: "$text", regex: /phillip butter/i } }, 1, 0] }
      },
      mencionesJorge: {
        $sum: { $cond: [{ $regexMatch: { input: "$text", regex: /jorge muñoz/i } }, 1, 0] }
      }
    }
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
          else: "Jorge"
        }
      }
    }
  }
])

```

## Probar

---

http://localhost:3000/tweets/pregunta-1
http://localhost:3000/tweets/pregunta-2
http://localhost:3000/tweets/pregunta-3
http://localhost:3000/tweets/pregunta-4
http://localhost:3000/tweets/pregunta-5
