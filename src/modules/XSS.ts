const tagBody: string = "(?:[^\"'>]|\"[^\"]*\"|'[^']*')*";

const tagOrComment = new RegExp(
  "<(?:" +
    // Comment body.
    "!--(?:(?:-*[^->])*--+|-?)" +
    // Special "raw text" elements whose content should be elided.
    "|script\\b" +
    tagBody +
    ">[\\s\\S]*?</script\\s*" +
    "|style\\b" +
    tagBody +
    ">[\\s\\S]*?</style\\s*" +
    // Regular name
    "|/?[a-z]" +
    tagBody +
    ")>",
  "gi"
);

const removeTags = (input: string): string => {
  let oldinput;
  do {
    oldinput = input;
    input = input.replace(tagOrComment, "");
  } while (input !== oldinput);
  return input.replace(/</g, "&lt;");
};

export default removeTags;
