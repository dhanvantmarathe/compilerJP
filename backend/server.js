const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/compile', (req, res) => {
  const { code, language } = req.body;
  let fileName = '';
  let compileCommand = '';
  let runCommand = '';
  console.log('Request received for language:',language);
console.log('Code:',code);


  // Save the submitted code to a temporary file
  switch (language) {
   
    case 'java':
      fileName = 'Temp.java';
      fs.writeFileSync(fileName, code);
      compileCommand = `javac ${fileName}`;
      runCommand = `java Temp`;
      break;

      case 'python':
      fileName = 'Temp.py';
      fs.writeFileSync(fileName, code);
      compileCommand = "";
      runCommand = `python -u Temp.py`;
      break;
    case 'javascript':
      fileName = 'temp.js';
      fs.writeFileSync(fileName, code);
      compileCommand = ''; // No compile command needed for JavaScript
      runCommand = `node temp.js`;
      break;
    default:
      return res.status(400).json({ error: 'Language not supported' });
  }

  // Compile (if needed) and execute the code
  if (compileCommand) {
    exec(compileCommand, (err, stdout, stderr) => {
      if (err) {
        // Cleanup the temporary file in case of error
        fs.unlinkSync(fileName);
        return res.status(500).json({ error: stderr || err.message });
      }
      exec(runCommand, (err, stdout, stderr) => {
        // Cleanup the temporary file after execution
        fs.unlinkSync(fileName);
        if (err) {
          return res.status(500).json({ error: stderr || err.message });
        }
        res.json({ output: stdout });
      });
    });
  } else {
    exec(runCommand, (err, stdout, stderr) => {
      // Cleanup the temporary file after execution
      fs.unlinkSync(fileName);
      if (err) {
        return res.status(500).json({ error: stderr || err.message });
      }
      res.json({ output: stdout });
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
