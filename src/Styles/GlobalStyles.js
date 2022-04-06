import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export default createGlobalStyle`
    ${reset};
    *{
        box-sizing: border-box;
    }
    html{
        font-size: 16px;
        font-family: 'Noto Sans KR', sans-serif;
        width: 100%;
    }
    body{
        width: 100%;
        overscroll-behavior: none;
    }
    a{
        text-decoration: none;
    }
    input:focus{
        outline: none;
    }
`;
