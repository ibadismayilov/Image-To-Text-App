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
  
    const img = new Image();
    img.src = image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      const width = img.width;
      const height = img.height;
  
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
  
      const optimizedImage = canvas.toDataURL();

      Tesseract.recognize(
        optimizedImage,
        'eng+tur+aze+rus',
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
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="file-upload-container">
          <input
            type="file"
            accept="image/*"
            id="file-input"
            className="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="file-input" className="file-label">
            Choose File
          </label>
        </div>

        <div className="image-and-recognized">
          <div className="images">
            <div className="get-image">
              {image && <img src={image} alt="Selected" />}
            </div>
          </div>
          <div className="recognized">
            <div className="recognized-items">
              <h3>Recognized Text</h3>
              <pre>{text}</pre>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
        </div>

        <div className="recognized-button">
          <button
            className="btn-grad"
            onClick={handleRecognizeText}
            disabled={!image || loading}
          >
            {loading ? 'Processing...' : 'Recognize Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
