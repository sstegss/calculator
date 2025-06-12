import { useMemo, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import backspace from "/backspace.svg";
import moon from "/moon.svg";
import sun from "/sun.svg";
import { lightTheme, darkTheme } from "./styles/theme";
import { formatExpression, solveExpression } from "./calculatorLogic";

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.background};
  width: 500px;
  justify-self: center;
  border-radius: 30px;
  padding: 20px;
  outline: none;
  @media (max-width: 500px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
`;
const Control = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 5px;
  width: 100%;
`;
const Bnt = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonColor};
  border: none;
  border-radius: 10px;
  aspect-ratio: 1/1;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  & > img {
    max-width: 50px;
  }
  &:active {
    background: ${({ theme }) => theme.buttonPressed};
    transform: scale(0.9);
  }

  @media (max-width: 500px) {
    font-size: 2rem;
    width: auto;
    & > img {
      max-width: 25px;
    }
  }
  @media (max-width: 400px) {
    font-size: 1.5rem;
    width: auto;
    & > img {
      max-width: 25px;
    }
  }
`;

//Возможно, вот этот div можно было бы вынести в отдельный компонент
const Display = styled.div`
  text-align: end;
  width: 100%;
  border: 2px solid black;
  padding: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.diplayBg};
  color: ${({ theme }) => theme.text};
  margin-block: 20px;
  font-size: 3.5rem;
  min-height: 7rem;
  overflow-x: hidden;
  white-space: nowrap;
  justify-content: flex-end;
  display: flex;
  align-self: center;
  @media (max-width: 500px) {
    font-size: 2rem;
    min-height: 4.5rem;
  }
`;
const ThemeButton = styled.button`
  background: ${({ theme }) => theme.diplayBg};
  width: 50px;
  padding: 10px;
  border-radius: 10px;
  border: none;
`;
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
function App() {
  const MAX_LENGTH = 15; //максимальное кол-во символов на дисплее
  const OPERATORS = "+-*/%";
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const iconFilter = isDark ? "brightness(0) invert(1)" : "none"; // для цвета svg иконок
  const [expression, setExpression] = useState<string[]>([]); //математическое выражение
  const [value, setValue] = useState<string>(""); //последнее число
  //число и выражение разбиты для удобства


  //отображаемое выражение, вынесено в отдельную переменную для удобства вычисления длинны
  //наверное не самое лучше использование useMemo, тк мы постоянно меняем наше выражение
  const diplayString = useMemo(
    () => formatExpression(expression, value),
    [expression, value]
  );
  //функция отвечает на вопрос "а можем ли мы добавить ещё один символ в наше выражение/число, чтобы оно уместилось на экране"
  const calculateLength = () => {
    return diplayString.length < MAX_LENGTH ? true : false;
  };

  //функция для кнопки "+/-" просто изменяет знак перед числом
  const negateValue = () => {
    if (value === "" || value === "Error") {
      setValue("-");
    } else if (value === "-") {
      setValue("");
    } else {
      setValue(String(-1 * Number(value))); //не самая умная строчка, но зато удобная. Убирает ведущий знак без slice'ов
    }
  };

  //функция добавления цифры в число
  const addToValue = (addedNumber: string) => {
    if (value === "Error") {
      setValue(addedNumber);
    } else if (calculateLength()) {
      setValue(value + addedNumber);
    }
  };

  //функция для удаления последнего чара у числа, если числа нет, удаляет знак оператора.
  //Если удалили и оператор, то заменяет число на последний элемент в выражении
  const deleteLastChar = () => {
    if (value === "" && expression.length >= 2) {
      const newExpression = expression.slice(0, -2);
      const lastNumber = expression[expression.length - 2] || "";
      setValue(lastNumber);
      setExpression(newExpression);
    } else {
      setValue(value.slice(0, -1));
    }
  };

  const clear = () => {
    setValue("");
    setExpression([]);
  };

  //функция добавления оператора в выражение, также добавляет и обнуляет нынешнее число
  const addOperator = (operator: string) => {
    if (!calculateLength()) return; //если дисплей полный, то мы не можем добавить ещё один знак
    if (value !== "") {
      setExpression([...expression, value, operator]);
      setValue("");
    } else if (
      //если у нас уже есть знак оператора, то мы не можем добавить ещё один, нужно изменить прошлый
      expression.length > 0 &&
      OPERATORS.includes(expression[expression.length - 1])
    ) {
      setExpression([...expression.slice(0, -1), operator]);
    }
  };

  //функция добавления десятичной точки
  const addDot = () => {
    if (!value.includes(".")) {
      addToValue(".");
    }
  };

  //обработка решения выражения
  const handleSolve = () => {
    const result = solveExpression(expression,value)
    setValue(result)
    setExpression([])
  }

  //обработчик нажатий на клавиатуру
  const keyboardHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const pressedKey = event.key;
    if ("1234567890".includes(pressedKey)) {
      addToValue(pressedKey);
    }
    if ("." === pressedKey || "," === pressedKey) {
      addDot();
    }
    if ("+-*/%".includes(pressedKey)) {
      addOperator(pressedKey);
    }
    if ("Escape" === pressedKey) {
      clear();
    }
    if ("Backspace" === pressedKey) {
      deleteLastChar();
    }
    if ("Enter" === pressedKey || "=" === pressedKey) {
      handleSolve()
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container onKeyDown={keyboardHandler} tabIndex={0}>
        <Head>
          <h1>Calculator</h1>
          <ThemeButton onClick={() => setIsDark(!isDark)}>
            {isDark ? (
              <img style={{ filter: iconFilter }} src={sun} /> //иконки луны и солнца для темы
            ) : (
              <img style={{ filter: iconFilter }} src={moon} />
            )}
          </ThemeButton>
        </Head>
        <Display>{diplayString}</Display>
        <Control>
          {/* тут обычным for'ом или чем-то подобным не обойтись, так что всё захардкожено */}
          <Bnt style={{background:"grey"}} onClick={clear}>AC</Bnt>
          <Bnt style={{background:"grey"}} onClick={deleteLastChar}>
            <img style={{ filter: iconFilter }} src={backspace} alt="<-" />
          </Bnt>
          <Bnt style={{background:"grey"}} onClick={() => addOperator("%")}>mod</Bnt>
          <Bnt style={{background:"grey"}} onClick={() => addOperator("/")}>/</Bnt>
          <Bnt onClick={() => addToValue("7")}>7</Bnt>
          <Bnt onClick={() => addToValue("8")}>8</Bnt>
          <Bnt onClick={() => addToValue("9")}>9</Bnt>
          <Bnt style={{background:"grey"}} onClick={() => addOperator("*")}>X</Bnt>
          <Bnt onClick={() => addToValue("4")}>4</Bnt>
          <Bnt onClick={() => addToValue("5")}>5</Bnt>
          <Bnt onClick={() => addToValue("6")}>6</Bnt>
          <Bnt style={{background:"grey"}} onClick={() => addOperator("-")}>-</Bnt>
          <Bnt onClick={() => addToValue("1")}>1</Bnt>
          <Bnt onClick={() => addToValue("2")}>2</Bnt>
          <Bnt onClick={() => addToValue("3")}>3</Bnt>
          <Bnt style={{background:"grey"}} onClick={() => addOperator("+")}>+</Bnt>
          <Bnt onClick={negateValue}>+/-</Bnt>
          <Bnt  onClick={() => addToValue("0")}>0</Bnt>
          <Bnt onClick={addDot}>,</Bnt>
          <Bnt style={{background:"orange"}} onClick={handleSolve}>=</Bnt>
        </Control>
      </Container>
    </ThemeProvider>
  );
}

export default App;
