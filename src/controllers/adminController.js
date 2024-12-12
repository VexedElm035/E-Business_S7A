const controller = {};

controller.print = (req, res) => {
    req.getConnection((err, conn) => {
        res.render('admin');
    });
};

module.exports = controller;