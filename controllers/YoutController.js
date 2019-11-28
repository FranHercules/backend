var User = require('../models/youtuber');
var debug = require('debug')('blog:user_controller');

// Search a one user y database
module.exports.getOne = (req, res, next) => {
    debug("Search User", req.params);
    User.findOne({
            Id: req.params.Id
        }, "-password -login_count")
        .then((foundUser) => {
            debug("Found User", foundUser);
            if (foundUser)
                return res.status(200).json(foundUser);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

module.exports.getAll = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";

    debug("Usert List", {
        size: perPage,
        page,
        sortby: sortProperty,
        sort
    });

    User.find({}, "-password -login_count")
        .limit(perPage)
        .skip(perPage * page)
        .sort({
            [sortProperty]: sort
        })
        .then((users) => {
            debug("Found users", users);
            return res.status(200).json(users)
        }).catch(err => {
            next(err);
        });

}

// New User

module.exports.register = (req, res, next) => {
    debug("New User", {
        body: req.body
    });
    User.findOne({
            Id: req.body.Id
        }, "-password -login_count")
        .then((foundUser) => {
            if (foundUser) {
                debug("Usuario duplicado");
                throw new Error(`Usuario duplicado ${req.body.Id}`);
            } else {
                let newUser = new User({
                    Id: req.body.Id,
                    Subject: req.body.Subject || "",
                    Description: req.body.Description || "",
                    StartTime:req.body.StartTime,
                    EndTime: req.body.EndTime,
                    RoomId: req.body.RoomId /*TODO: Modificar, hacer hash del password*/
                });
                return newUser.save();
            }
        }).then(user => {
            return res
                .header('Location', '/users/' + user.Id)
                .status(201)
                .json({
                    Id: user.Id
                });
        }).catch(err => {
            next(err);
        });
}


// Update user 

module.exports.update = (req, res, next) => {
    debug("Update user", {
        Id: req.params.Id,
        ...req.body
    });

    let update = {
        ...req.body
    };

    User.findOneAndUpdate({
            Id: req.params.Id
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}

//Eliminar youtuber
module.exports.delete = (req, res, next) => {

    debug("Delete user", {
        Id: req.params.Id,
    });

    User.findOneAndDelete({Id: req.params.Id})
    .then((data) =>{
        if (data) res.status(200).json(data);
        else res.status(404).send();
    }).catch( err => {
        next(err);
    })
}