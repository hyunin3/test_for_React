import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logIn } from "../actions/index";
import axios from "axios";

const LogInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [errMessage, setErrMessage] = useState("");
  // 초기상태 설정
  // 컴포넌트의 상태를 관리하는 React Hook인 useState
  // 사용자가 입력한 이메일과 비밀번호를 담고 있는 userInput
  // 오류 메시지를 담고 있는 errMessage

  const handleUserInput = (key) => (e) =>
    setUserInput({ ...userInput, [key]: e.target.value });
  // 사용자 입력처리. 사용자의 입력을 처리하며, 이메일과 비밀번호 필드의 값이 
  // 변경될 때마다 호출. 이 함수는 변경된 필드의 key와 이벤트 객체 e를 인자로 받아
  // 해당 필드의 값을 userInput 상태에 반영 
  
  const handleLogIn = (e) => {
    e.preventDefault();

    const { email, password } = userInput;

    if (!email || !password) {
      setErrMessage("이메일과 비밀번호는 필수 항목 입니다");
      return;
    } else if (email && password) {
      setErrMessage("");
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DOMAIN}/user`,
          {
            email: email,
            password: password,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const { email, accessToken, username, userId, category } = res.data;
          dispatch(logIn(email, userId, username, accessToken, category));
          navigate("/");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              setErrMessage("잘못된 비밀번호 입니다");
              return;
            } else if (err.response.status === 404) {
              setErrMessage("회원정보를 찾을 수 없습니다");
              return;
            }
          } else if (err.request) {
            console.log(err.request);
          } else {
            console.log("Error :", err.message);
          }
          console.log(err.config);
        });
    }
  };
  // userInput 상태에서 이메일과 비밀번호를 가져옴. 
  // 만약 이메일이나 비밀번호가 없다면, 오류 메시지
  // 그렇지 않다면, 서버에 로그인 요청

  return (
    <div>
      <h1>로그인 페이지입니다</h1>
      <form>
        <label>Email</label>
        <input type="text" onChange={handleUserInput("email")}></input>
        <label>Password</label>
        <input type="password" onChange={handleUserInput("password")}></input>
        {errMessage && <p>{errMessage}</p>}
        <div>
          <button onClick={handleLogIn}>Log In</button>
        </div>
      </form>
    </div>
  );
};

// 이메일과 비밀번호 필드는 각각 handleUserInput 함수를 사용하여 값 변경을 처리
// errMessage가 있을 경우에는 보여주고, 로그인 버튼은 
// handleLogIn 함수를 호출하여 로그인 처리

export default LogInPage;
