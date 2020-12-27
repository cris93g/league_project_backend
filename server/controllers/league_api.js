const axios = require('axios')
const {LEAGUE_API,API_URL}= process.env


let getUserAccount = async (req,res)=>{
    let username = req.body;
    let getAccount = await axios.get(`${API_URL}summoner/v4/summoners/by-name/bloodstrive`,{
        headers: {
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Riot-Token': LEAGUE_API,
            }
    })
    let userId = getAccount.data.id;
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
    data ? res.status(200).send(data) : console.error(err)
}

module.exports={
    getUserAccount
}