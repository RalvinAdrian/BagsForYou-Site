function validateLoginStatus(req) {
    const isAdmin = Number(req.cookies.is_admin);
    if (!req.cookies.username) {
        return 'anon';
    }
    else {
        if (isAdmin === 1) {
            return 'admin';
        }
        else {
            return 'user';
        }
    }
}
function returnUsername(req) {
    // console.log(req.cookies)
    return req.cookies.username;
}

export { validateLoginStatus, returnUsername };