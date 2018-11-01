module.exports = function (app, db) {
    let registration_details = db.model('registration');

    app.post('/registration/create',(req,res) => {
        let registration = req.body;
        console.log(registration);
        let reg_details = new registration_details({
            first_name: registration.firstName ,
            last_name: registration.lastName,
            email_Id: registration.email,
            password: registration.password
        });
        reg_details.save((err, registration) => {
            if (!err) {
                res.send({
                    result: "Success",
                    data: registration
                });
            } else {
                res.send({
                    result: "Failure",
                    message: "Error in registering user details",
                    error: err
                });
            }
        })
    });
};