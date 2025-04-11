import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('file-input').click();
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
      <h1>Free Online OCR</h1>
      <p>Extract text from Images, PDFs, and Documents with one click.</p>

      <div className="image-and-recognized">
        <div className="upload-area">
          {imageLoading && !image ? (
            <p>Loading image...</p>
          ) : (
            <img
              src={image || "/path-to-icon.png"}
              alt="Selected or Default"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImage(null);
                setImageLoading(false);
              }}
            />
          )}
          <p>Drag & Drop files here to upload</p>
          <div className="or">or</div>
          <button onClick={handleButtonClick}>Choose File</button>
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {image && (
          <div className="recognized">
            <h3>Recognized Text</h3>
            <pre>{text || 'No text recognized yet. Click the button below to start.'}</pre>
            <button className="btn-grad" onClick={handleRecognizeText} disabled={loading}>
              {loading ? 'Processing...' : 'Recognize Text'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
