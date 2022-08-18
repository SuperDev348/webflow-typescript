var express = require('express');
var path = require('path');
app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
var port = process.env.PORT || 6001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/, serving ${path.join(__dirname, 'build')}`);
});