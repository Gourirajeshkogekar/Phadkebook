const VirtualKeyboard = ({ onKeyPress, layout = 'marathi', theme = 'light' }) => {
    const marathiLayout = [
      ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ', 'ॡ'],
      ['ऍ', 'ऎ', 'ए', 'ऐ', 'ऑ', 'ऒ', 'ओ', 'औ', 'क', 'ख'],
      ['ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ'],
      ['ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ'],
      ['ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स'],
      ['ह', 'ळ', 'क्ष', 'ज्ञ', 'श्र', '०', '१', '२', '३', '४'],
      ['५', '६', '७', '८', '९', 'मं', 'म्ह', 'ई', 'अं', 'ं'],
      ['अः', 'ऽ', '।', '॥', '१२३', 'abcd']
    ];
  
    const handleKeyClick = (key) => {
      if (onKeyPress) {
        onKeyPress(key);  // Pass the clicked key back to the parent component
      }
    };
  
    return (
      <div className={`virtual-keyboard ${theme}`}>
        {marathiLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key, index) => (
              <button key={index} onClick={() => handleKeyClick(key)}>
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default VirtualKeyboard;
  