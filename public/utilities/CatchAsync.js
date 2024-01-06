// Handle async function errors not handled in express < 5
function CatchAsync(func){
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err));
    }
}

module.exports = CatchAsync;