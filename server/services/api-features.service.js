class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  limitFields() {
    if (this.queryString.fields) {
      //logic here
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      //logic here
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  search(...searchFields) {
    if (this.queryString.keyword) {
      //logic here
      const query = {
        $or: [],
      };

      searchFields.forEach((searchField) =>
        query.$or.push({
          [searchField]: { $regex: this.queryString.keyword, options: "i" },
        })
      );

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  filter() {
    const queryString = { ...this.queryString };
    const excludeFields = ["sort", "fields", "keyword", "page", "limit"];
    excludeFields.forEach((field) => delete queryString[field]);

    let queryStr = JSON.stringify(queryString);
    queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  paginate(documentCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(documentCount / limit),
    };

    if (endIndex < documentCount) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
