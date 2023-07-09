import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordCheck, emailCheck, usernameCheck, checkAll } from "../utilities/availCheck";
import axios from "axios";



const SignUpPage = () => {
  const navigate = useNavigate();
 
  const [userInput, setUserInput] = useState({
    email: "",
    username: "",
    password: "",
    passwordCheck: "",
  });

  const [errMessage, setErrMessage] = useState({
    emailErr: "",
    usernameErr: "",
    passwordErr: "",
    passwordCheckErr: "",
    other: "",
  });

  const handleUserInput = (key) => (e) => {
    setUserInput({ ...userInput, [key]: e.target.value });
  };

  const handleUsernameExist = (e) => {
    e.preventDefault();

    const { username } = userInput;

    axios
      .get(`${process.env.REACT_APP_SERVER_DOMAIN}/signup/${username}`, {
        withCredentials: true,
      })
      .then(() => {
        setErrMessage({
          ...errMessage,
          usernameErr: "사용 가능한 유저이름 입니다",
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 409) {
            setErrMessage({
              ...errMessage,
              usernameErr: "중복되는 유저이름이 있습니다",
            });
          }
          console.log(err.response);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log("Error :", err.message);
        }
        console.log(err.config);
      });
  };


  const handleSignUp = (e) => {
    e.preventDefault();

    const { email, username, password } = userInput;

    if (!email || !username || !password) {
      setErrMessage({
        ...errMessage,
        other: "모든 항목은 필수입니다",
      });
      return;
    }

    if (!checkAll(username, email, password)) {
      setErrMessage({
        ...errMessage,
        other: "모든 항목을 올바르게 작성해 주세요",
      });
      return;
    }

    setErrMessage({
      ...errMessage,
      other: "",
    });

    axios
      .post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/signup`,
        {
          email: email,
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
            navigate("/");
          })
        
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 409) {
            if (err.response.data.message === "email exist") {
              setErrMessage({
                ...errMessage,
                other: "이미 가입한 회원입니다",
              });
            } else {
              setErrMessage({
                ...errMessage,
                other: "중복되는 유저이름이 있습니다",
              });
            }
            console.log(err.response);
          } else if (err.request) {
            console.log(err.request);
          } else {
            console.log("Error :", err.message);
          }
          console.log(err.config);
        }
      });
  };

  const handleErrMessage = (message) => {
    switch (message) {
      case "1":
        setErrMessage({
          ...errMessage,
          passwordErr: "비밀번호는 8자리 이상이어야 합니다",
        });
        break;
      case "2":
        setErrMessage({
          ...errMessage,
          passwordErr: "비밀번호는 영어,숫자,특수문자를 포함해야 합니다",
        });
        break;
      case "3":
        setErrMessage({
          ...errMessage,
          usernameErr: "유저이름은 2글자 이상이어야 합니다",
        });
        break;
      case "4":
        setErrMessage({
          ...errMessage,
          usernameErr:
            "유저이름은 한글,영어,숫자로 구성되며 공백이 없어야 합니다",
        });
        break;
      case "5":
        setErrMessage({
          ...errMessage,
          emailErr: "올바른 이메일을 입력해 주세요",
        });
        break;
      case "emailAvail":
        setErrMessage({
          ...errMessage,
          emailErr: "",
        });
        break;
      case "usernameAvail":
        setErrMessage({
          ...errMessage,
          usernameErr: "",
        });
        break;
      case "passwordAvail":
        setErrMessage({
          ...errMessage,
          passwordErr: "",
        });
        break;
      default:
        return "";
    }
  };

  return (
    
      <div className="signup-page-wrapper">
        <h1>Sign Up</h1>
        <form>
          <label>Email</label>
          <input
            type="text"
            onChange={handleUserInput("email")}
            onKeyUp={() => handleErrMessage(emailCheck(userInput.email))}
          ></input>
          {errMessage.emailErr && <p>{errMessage.emailErr}</p>}
          <label>Username</label>
          <div id="username-input-wrapper">
            <input
              type="text"
              onChange={handleUserInput("username")}
              onKeyUp={() =>
                handleErrMessage(usernameCheck(userInput.username))
              }
              placeholder="닉네임은 2자 이상으로 공백을 제외해야 합니다"
            ></input>
            <button onClick={handleUsernameExist}>중복검사</button>
          </div>
          {errMessage.usernameErr && <p>{errMessage.usernameErr}</p>}
          <label>Password</label>
          <input
            type="password"
            onChange={handleUserInput("password")}
            onKeyUp={() => handleErrMessage(passwordCheck(userInput.password))}
            placeholder="비밀번호는 8자리 이상으로 영어,숫자,특수문자가 포함되어야 합니다"
          ></input>
          {errMessage.passwordErr && <p>{errMessage.passwordErr}</p>}
          <label>Password Check</label>
          <input
            type="password"
            onChange={handleUserInput("passwordCheck")}
          ></input>
          {userInput.password &&
            userInput.passwordCheck &&
            userInput.password !== userInput.passwordCheck && (
              <p>입력한 비밀번호와 다릅니다</p>
            )}
          <button onClick={handleSignUp}>Submit</button>
          {errMessage.other && <p>{errMessage.other}</p>}
        </form>
        
        <p id="sign-in-link">
          이미 회원 이신가요?
          <span onClick={() => navigate("/LogInPage")}>로그인 하러 가기</span>
        </p>
      </div>
   
  );
};

export default SignUpPage;
