"use client";

type Props = {
  isPlaying: boolean;
};

const AnimationVoice = (props: Props) => {

  const { isPlaying } = props;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="200px" height="300px" viewBox="0 0 10 8" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 0.5)" stroke="currentColor" strokeWidth="1" fillRule="evenodd" strokeLinecap="round">
          {[8.5, 6.5, 4.5, 2.5, 0.5].map((x, i) => {
            const animateData = [
              { y1: "2;0;2", y2: "5;7;5", dur: ".8s" },
              { y1: "0;2;0", y2: "7;5;7", dur: ".5s" },
              { y1: "1;3;1", y2: "6;4;6", dur: ".6s" },
              { y1: "2;1;2", y2: "5;6;5", dur: ".7s" },
              { y1: "3;0;3", y2: "4;7;4", dur: ".9s" }
            ][i];
            return (
              <line key={i} x1={x} y1="0" x2={x} y2="7">
                {isPlaying && (
                  <>
                    <animate attributeType="XML" attributeName="y1" values={animateData.y1} keyTimes="0;0.5;1" dur={animateData.dur} repeatCount="indefinite" />
                    <animate attributeType="XML" attributeName="y2" values={animateData.y2} keyTimes="0;0.5;1" dur={animateData.dur} repeatCount="indefinite" />
                  </>
                )}
              </line>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default AnimationVoice;
