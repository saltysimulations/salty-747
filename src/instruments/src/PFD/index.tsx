import { React } from "react";
import { render } from "../Common";

import "./index.scss";

const PFD: React.FC = () => {
    return (
        <svg className="pfd-svg" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <text x={300} y={300}>
                hello world
            </text>
        </svg>
    );
};

render(<PFD />);
