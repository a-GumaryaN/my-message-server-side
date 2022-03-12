const crypto = require("crypto");

export const secret = "<?yvS?$/^A6*@$V2?XW(!//^$";

const hashMaker = (
  input: string,
  algo: string = "md5",
  charStandard: string = "utf-8",
  hashFormat: string = "hex"
) => {
  const hash = crypto.createHash(algo);
  hash.update(input, charStandard);
  return hash.digest(hashFormat);
};

export default hashMaker;