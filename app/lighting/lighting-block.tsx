export const LightingBlock = () => {
  return (
    <>
      <div className="lighting-container">
        <img
          src="https://images.unsplash.com/photo-1758486561455-ebd0d3ba7423?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU1fE04alZiTGJUUndzfHxlbnwwfHx8fHw%3D"
          alt="lighting"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative">
        <div className="lighting-grain" />
        <div className="lighting-light" />
        <div className="lighting-circular-light" />
        <div className="lighting-artifact-top" />
        <div className="lighting-circular-light-artifact" />
        <div className="lighting-tiny-circular-light" />
        <div className="lighting-yummy-color-grading" />
        <div className="lighting-warmth" />
      </div>
    </>
  );
};
