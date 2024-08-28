import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleRecognizeText = () => {
    setLoading(true);
    setError('');

    Tesseract.recognize(
      image,
      'eng+tur+aze+spa+fra+deu+ita+por+rus+chi_sim+jpn',
      {
        logger: info => console.log(info),
      }
    ).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    }).catch(err => {
      setError('Text recognition failed');
      setLoading(false);
    });
  };

  return (
    <div className='wrapper'>
      <div className='container'>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div className='image-and-recognized'>
          <div className='images'>
            <div className='get-image'>
              <img src={image} alt='Selection is pending' />
            </div>

          </div>
          <div className='recognized'>
            <div className='recognized-items'>
              <h3>Recognized Text</h3>
              <pre>{text}</pre>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
        </div>

        <div className='recognized-button'>
          <button className='btn-grad' onClick={handleRecognizeText} disabled={!image || loading}>
            {loading ? 'Processing...' : 'Recognize Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
