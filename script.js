const fs = require("fs");

// write file function
fs.writeFile("try.txt", "hello jani bus laga rah ", function (err) {
  if (err) console.error(err);
  else console.log("done jani");
});

//appendFile function
// fs.appendFile(
//   "try.txt",
//   "laga huwa hu kafi ab bus Allah pay h sub",
//   function (err) {
//     if (err) console.error(err);
//     else console.log("day diya jawab");
//   }
// );

// copyfile function
// fs.copyFile("./try.txt", "./personal.txt", function (err) {
//   if (err) console.error(err);
//   else console.log("done hugaya capyy");
// });

// unlike function
// fs.unlink("./personal.txt", function (err) {
//   if (err) console.error(err);
//   else console.log("hugai remove");
// });

// rm function
// fs.rm("./copy", { recursive: true }, function (err) {
//   if (err) console.error(err);
//   else console.log("removed");
// });

// readFile function
fs.readFile("./try.txt", "utf8", function (err, data) {
  if (err) console.error(err);
  else console.log(data);
});
