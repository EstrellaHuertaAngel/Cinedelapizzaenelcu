
exports.SessionInvalid = function(req, res, next){
    if(req.session.user){
        res.redirect('/peliculas');
    }else{
        next();
    }
}

exports.SessionValidClient = function(req, res, next){
    if(req.session.user){
        if(req.session.user.Rol == 'cliente'){
            next();
        }else{
            res.redirect('/AdminPeliculas');
        }
    }else{
        res.redirect('/');
    }
}

exports.SessionValidAdmin = function(req, res, next){
    if(req.session.user){
        if(req.session.user.Rol == 'admin'){
            next();
        }else{
            res.redirect('/peliculas');
        }
    }else{
        res.redirect('/');
    }
}