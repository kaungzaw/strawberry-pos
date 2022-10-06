export const getDocuments = (documents) => {
  if (Array.isArray(documents)) {
    return documents.map((document) => document._doc);
  } else {
    return documents._doc;
  }
};
