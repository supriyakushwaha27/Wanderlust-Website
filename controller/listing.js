const List = require("../models/listing");

module.exports.home = async (req, res, next) => {
    let lists = await List.find({});
    res.render("listings/home.ejs", { lists });
}


module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.newPost = async (req, res, next) => {
    let { list } = req.body;
    let data = new List(list);
    data.owner = req.user._id;
    await data.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    let list = await List.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!list) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
}

module.exports.edit = async (req, res, next) => {
    let { id } = req.params;
    let list = await List.findById(id);
    if (!list) {
        req.flash("error", "Listing Does Not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });
}


module.exports.update = async (req, res, next) => {
    let { id } = req.params;
    let { list } = req.body;
    await List.findByIdAndUpdate(id, list, { new: true, runValidators: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}/show`);
}


module.exports.destroy = async (req, res, next) => {
    let { id } = req.params;
    const list = await List.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}


module.exports.search = async (req, res, next) => {
    let { search } = req.query;
    let query = { country: { $regex: `^${search}$`, $options: 'i' } };
    let lists = await List.find(query);
    if (lists.length === 0) {
        req.flash("error", "Country not found!");
        return res.redirect("/listings");
    }
    res.render("listings/home.ejs", { lists });
};
