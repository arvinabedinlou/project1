module.exports = {
  products_without_terms: (docs) =>
    docs.map((i) => {
      let item = i.toObject();
      item.terms.forEach((i) => delete i.files);
      return item;
    }),
  product_without_terms: (doc) => {
    delete doc.terms.files;
    return doc;
  },
};

