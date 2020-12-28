const {getUserAccount,getMatchHistory,leagueStatus,champRotation,checkCurrentGame} = require('../controllers/league_api')

module.exports= app =>{
    app.get(`/api/status`,leagueStatus)
    app.get(`/api/rotation`,champRotation)
    app.post(`/api/account`,getUserAccount)
    app.post(`/api/history`,getMatchHistory)
    app.post(`/api/game`,checkCurrentGame)
}