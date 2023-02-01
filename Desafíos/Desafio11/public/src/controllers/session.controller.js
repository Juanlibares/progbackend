function destroyCredentials(req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    const username = req.user[0].username;
    req.session.destroy((err) => {
        if (err) console.error(err);
        else
            return res
                .clearCookie("connect.sid")
                .render("disconnect_user", { user: username, script: 'redirect' });
    });
}

function renderSignUp(req, res) {
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render("signup");
}

function renderFailLogin(req, res) {
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render('error', { process: 'LOGIN' })
}

function renderFailSignUp(req, res) {
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render('error', { process: 'SIGNUP' })
}

function renderLogin(req, res) {
    return req.isAuthenticated()
        ? res.redirect("/")
        : res.render("login");
}

export {
    destroyCredentials,
    renderFailLogin,
    renderLogin,
    renderFailSignUp,
    renderSignUp
};