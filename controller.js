const { selectTopics } = require("./model")


exports.getTopics = (req, res, next) => {
    selectTopics().then((result) =>{
        res.status(200).send({result})
    })
    .catch((err)=>{
        next(err)
    })
    
}