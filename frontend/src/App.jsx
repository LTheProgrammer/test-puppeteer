import './App.css'
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = (dataId) => {
    setIsLoading(true);
    axios.get('/api/generatePDF', {
      params: {
        exempleNumber: dataId,
      },
      responseType: 'blob',
    }).then(async (response) => {

      console.log(response);
      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

    }).catch(error => {
      console.error(error);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <>
      <button disabled={isLoading} onClick={() => generatePDF(1)}>{isLoading ? 'Generating the pdf' : 'Generate invoice 1'}</button>
      <button disabled={isLoading} onClick={() => generatePDF(2)}>{isLoading ? 'Generating the pdf' : 'Generate invoice 2'}</button>
      <button disabled={isLoading} onClick={() => generatePDF(3)}>{isLoading ? 'Generating the pdf' : 'Generate invoice 3'}</button>
    </>
  )
}

export default App
