class CategoryPOJO {
    constructor({ _id, categoryName, description, createdAt, updatedAt }) {
        this._id = _id;
        this.categoryName = categoryName;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = CategoryPOJO; 