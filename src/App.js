import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { css } from "@emotion/css";
import { Modal, Button, Input, Select, DatePicker, message } from "antd";
import { TransactionRow } from "./Components/TransactionRow";
import { useEffect, useState } from "react";
import { CreateModal } from "./Components/CreateModal";
import styled from "@emotion/styled";
import axios from "axios";

const PageContainer = styled.div`
  background-color: aliceblue;
  height: 100vh;
  width: 100vw;
  padding-top: 100px;
`;

const PageContent = styled.div`
  width: 80%;
  margin: auto;
  max-width: 500px;
`;

const FlexBox = styled.div`
  display: flex;
`;

function App() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [search, setSearch] = useState("");
  const [token, setToken] = useState();

  const fetchTransactions = async () => {
    const response = await axios.get("http://localhost:3000/api/transactions", {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    // console.log(response);
    setTransactions(response.data.transactions);
  };

  useEffect(() => {
    const oldToken = localStorage.getItem("token");
    if (oldToken) {
      setToken(oldToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const onDeleteItem = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const filteredTransaction = transactions.filter((tx) =>
    tx.category.includes(search)
  );

  return (
    <PageContainer>
      <div
        className={css`
          position: fixed;
          top: 0;
          z-index: 10;
          display: flex;
          padding: 16px;
          width: 100%;
          background-color: white;
        `}
      >
        {token ? (
          <div>{token}</div>
        ) : (
          <div
            className={css`
              display: flex;
            `}
          >
            <Input
              placeholder="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />{" "}
            <Input
              placeholder="password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />{" "}
            <Button
              onClick={async () => {
                console.log(username, password);
                const login = await axios.post(
                  "http://localhost:3000/user/login",
                  {
                    username,
                    password,
                  }
                );
                // message.success(username + " " + password);
                console.log(login);
                setToken(login.data.token);
                localStorage.setItem("token", login.data.token);
                //console.log(login);
              }}
            >
              LogIn
            </Button>
          </div>
        )}
      </div>
      <PageContent>
        <FlexBox>
          <Input
            placeholder="Search by text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button onClick={() => setCreateModalVisible(true)}>Create</Button>
        </FlexBox>
        {transactions.length === 0 ? (
          <FlexBox
            className={css`
              padding-top: 3rem;
              justify-content: center;
            `}
          >
            <h1>No data</h1>
          </FlexBox>
        ) : (
          ""
        )}
        {filteredTransaction.map((tx) => (
          <TransactionRow tx={tx} onDeleteItem={onDeleteItem} />
        ))}
      </PageContent>
      <CreateModal
        visible={createModalVisible}
        onCreate={(tx) => {
          tx.id = transactions.length + 1;
          setTransactions([...transactions, tx]);
          setCreateModalVisible(false);
        }}
        onClose={() => setCreateModalVisible(false)}
      />
    </PageContainer>
  );
}

export default App;
