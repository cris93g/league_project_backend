const {getUserAccount} = require('../controllers/league_api')

module.exports= app =>{
    app.get(`/api/account`,getUserAccount)
}