class ProductPOJO {
    constructor({ _id, productName, category, price, pictures, stockQuantity, createdAt, updatedAt }) {
        this._id = _id;
        this.productName = productName;
        this.category = category;
        this.price = price;
        this.pictures = pictures || [];
        this.stockQuantity = stockQuantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = ProductPOJO; 