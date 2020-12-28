const axios = require('axios')
const {LEAGUE_API,API_URL}= process.env


let getUserAccount = async (req,res)=>{
    let username = req.body.username;
    try{
        let getAccount = await axios.get(`${API_URL}summoner/v4/summoners/by-name/${username}`,{
            headers: {
                    'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Riot-Token': LEAGUE_API,
                }
        })
        let userId = getAccount.data.id;
        console.log(userId)
        let getProfileInfo = await axios.get(`${API_URL}league/v4/entries/by-summoner/${userId}`,{
            headers: {
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Riot-Token': LEAGUE_API,
            },
        })
        let resultsFromApi = getProfileInfo.data;
        resultsFromApi.push(getAccount.data)
        let data= resultsFromApi.reduce((current,added)=>{
            for(let key in added) current[key]= added[key]
            return current;
        },{})
        data ? res.status(200).send(data) : res.status(400).send('sorry wrong username')
    }catch(err){
        res.status(400).json('sorry wrong username was put in try again')
    }
}

let getMatchHistory = async(req, res) => {
    let { accountId } = req.body;
    let data = await axios.get(
        `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=2`, {
            headers: {
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Riot-Token': LEAGUE_API,
            },
        },
    );
    let info = data.data.matches;
    let arr = [];
    if (info) {
        for (let i = 0; i < info.length; i++) {
            arr.push(info[i].gameId);
        }
    }
    let final = [];
    let hist = [];
    for (let i = 0; i < arr.length; i++) {
        final.push(
            await axios.get(
                `https://na1.api.riotgames.com/lol/match/v4/matches/${arr[i]}`, {
                    headers: {
                        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Riot-Token': LEAGUE_API,
                    },
                },
            ),
        );
    }
    if (final) {
        for (let j = 0; j < final.length; j++) {
            hist.push(final[j].data);
            
        }
    }
    
    let hash=Object.create(null)
     hist[0].participants
       .concat(hist[0].participantIdentities)
       .forEach(function(obj) {
         hash[obj.participantId] = Object.assign(
           hash[obj.participantId] || {},
           obj,
         );
       });

  let together= Object.keys(hash).map(function(key){
      return hash[key]
   })

   together.concat(hist[0].teams).forEach(function(obj){
       hash[obj.teamId]=Object.assign(hash[obj.teamId] || {},obj)
   })
   let lastOne = Object.keys(hash).map(function(key){
       return hash[key]
   })
 
   if(lastOne){
       res.status(200).send(lastOne)
   }
   
};




let checkCurrentGame = async (req,res)=>{
    let {id}= req.body;
    let gameData = await axios.get(`${API_URL}spectator/v4/active-games/by-summoner/${id}`,{
        headers: {
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Riot-Token': LEAGUE_API,
        },
    })
    let gameDataResults = gameData.data.participants;
    gameDataResults ? res.status(200).send(gameDataResults) : console.error(err)
}

let leagueStatus = async(req, res) => {
    let info = await axios.get(
        `https://na1.api.riotgames.com/lol/status/v3/shard-data`
    ,{
        headers:{
            'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Riot-Token': LEAGUE_API,
        }
    });
    let results = info.data;
    results ?  res.status(200).send(results) : console.error(err)
       
    
};

let champRotation = async(req, res) => {

    let info = await axios.get(
        `https://na1.api.riotgames.com/lol/platform/v3/champion-rotations`, {
            headers: {
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Riot-Token': LEAGUE_API,
            },
        },
    );
    let champIdArray=info.data.freeChampionIds;


    let championData = await axios.get(
        `http://ddragon.leagueoflegends.com/cdn/10.25.1/data/en_US/champion.json`,
    );
    let listOfChamps= Object.values(championData.data.data);

    let results=[]
    for(let item in listOfChamps){
        if(champIdArray.includes(parseInt(listOfChamps[item].key))){
            results.push(listOfChamps[item])
        }
    }
    results.length > 1 ? res.status(200).json(results) : console.err(error) 

    
};

module.exports={
    getUserAccount,
    getMatchHistory,
    checkCurrentGame,
    leagueStatus,
    champRotation
}