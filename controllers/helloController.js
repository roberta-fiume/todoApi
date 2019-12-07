exports.getHello = (req, res) => {
    let namePerson = req.params.name
    res.send(`hello123 ${namePerson}`);
}

