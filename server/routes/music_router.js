const express = require('express');
const router = express.Router();
const pool = require ('../modules/pool.js'); 

router.get('/', (req, res) => {
    // res.send(musicLibrary);
    let queryTest =`SELECT * FROM "songs" ORDER BY "id" ;`;
    pool.query(queryTest).then((result)=>{
        res.send(result.rows);
    })
    .catch((error)=>{
        console.log('error making query', error);
        res.sendStatus(500);
        
    })
});

router.put('/rank/:id', (req, res)=>{
    console.log(req.params.id, req.body.direction);
    let songId=req.params.id;
    let direction= req.body.direction;
    let queryTest= ''
    if(direction == '+'){
        queryTest = `UPDATE "songs" SET "rank" = "rank" + 1 WHERE "id" = $1;`;
    }else if(direction == '-'){
        queryTest = `UPDATE "songs" SET "rank" = "rank" - 1 WHERE "id" = $1;`;
    }else {
        res.sendStatus(500);
        return;
    }
    pool.query(queryTest,[songId]).then(()=>{
      res.sendStatus(201);
    }).catch((error)=>{
        console.log('error from put request', error);
        res.sendStatus(500);
        })

})

router.delete('/:id', (req, res) => {
    console.log(req.params.id);
 
    let queryTest =`DELETE FROM "songs" WHERE "id" = $1;`;
    pool.query(queryTest, [req.params.id]).then((result)=>{
        res.sendStatus(200);
    })
    .catch((error)=>{
        console.log('error making query', error);
        res.sendStatus(500);
    })
});

router.post('/', (req, res) => {
    console.log("HELLO FROM THE POST", req.body);
    const newSong= req.body;
    const queryText = `INSERT INTO "songs" ("artist", "track", "rank", "published")
    VALUES ($1, $2, $3, $4);`
    //update values to utilized values in req.body
    
    pool.query(queryText, [newSong.artist, newSong.track, newSong.rank, newSong.published])
    .then((result)=>{
        console.log('post resulllltttt', result);
        res.sendStatus(201);
        
    })
    .catch((error)=>{
        console.log(`error making query ${queryText}`, error);
        res.sendStatus(500);
        
    })
})

module.exports = router;