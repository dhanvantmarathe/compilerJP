import React, { useState } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import axios from 'axios';




const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [output, setOutput] = useState('');

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem("code",newCode);
    localStorage.getItem("code")
    
    
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const compileCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/compile', { code, language }
        
      );
      
      
      
      setOutput(response.data.output);
     
       console.log(response);
       
      console.log(response.data.output);
      
    } catch (error) {
      setOutput(`Error from server: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Online Code Compiler</h1>
      <select value={language} onChange={handleLanguageChange}>
       
        <option value="java">Java</option>
        <option value="python">python</option>
        {/* <option value="javascript">JavaScript</option> */}
      </select>
      <AceEditor
        mode={language}
        theme="monokai"
        name="code_editor"
        onChange={handleCodeChange}
        value={code}
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="300px"
      />
      <button onClick={compileCode}>Run Code</button>
      <div>
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default App;
