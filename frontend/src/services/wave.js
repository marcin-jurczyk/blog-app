import Wave from "react-wavify";
import React from "react";

export const wave = (color1, color2, height) => {
    return (
        <Wave className="wave" mask="url(#mask)" fill="url(#gradient)"
              paused={false}
              style={{
                  height: height
              }}
              options={{
                  amplitude: 40,
                  speed: 0.15,
                  points: 3
              }}>
            <defs>
                <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="10%" stopColor={color2}/>
                    <stop offset="90%" stopColor={color1}/>
                </linearGradient>
            </defs>
        </Wave>
    )
}