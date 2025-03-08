import "../index.css"; // Import the CSS file

const Instructions = () => {
  return (
    <div className="instructions-container">
      <h1 className="instructions-title">Instructions</h1>
      <ul className="instructions-list">
        <li>You can move the <span className="highlight">Black box</span> or the parent box.</li>
        <li>You can move the objects in the parent box and adjust them according to your choice.</li>
      </ul>
    </div>
  );
};

export default Instructions;
