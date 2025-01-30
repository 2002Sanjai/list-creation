import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftArrow from "./LeftArrow";
import RightArrow from "./RightArrow";

const API_URL = "https://apis.ccbp.in/list-creation/lists";

interface ListItem {
  id: number;
  name: string;
  description: string;
  list_number: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ListCreationAppProps {}

const ListCreationApp: React.FC<ListCreationAppProps> = () => {
  const [listOne, setListOne] = useState<ListItem[]>([]);
  const [listTwo, setListTwo] = useState<ListItem[]>([]);
  const [listThree, setListThree] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setNewList] = useState<ListItem[]>([]);
  const [showListThree, setShowListThree] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setLoadingProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        fetchLists();
      }
    }, 500);
  }, []);

  const fetchLists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      const lists: ListItem[] = response.data.lists;
      console.log(lists);
      setListOne(lists.filter((list) => list.list_number === 1));
      setListTwo(lists.filter((list) => list.list_number === 2));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to fetch lists. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const moveToThree = (
    item: ListItem,
    _fromList: ListItem[],
    setFromList: React.Dispatch<React.SetStateAction<ListItem[]>>
  ) => {
    setFromList((prev) => prev.filter((i) => i.id !== item.id));
    setListThree((prev) => [...prev, item]);
  };

  const handleListSelection = (list_number: number) => {
    console.log(`List number ${list_number} is toggled`);
    setSelectedLists((prev) => {
      if (prev.includes(list_number)) {
        return prev.filter((num) => num !== list_number);
      } else {
        return [...prev, list_number];
      }
    });
  };

  const handleCreateNewList = () => {
    if (selectedLists.length !== 2) {
      alert("You should select exactly 2 lists to create a new list");
      return;
    }
    setNewList((prev) => [
      ...prev,
      {
        id: prev.length + 3,
        name: `List ${prev.length + 3}`,
        description: "This is a dynamically created list.",
        list_number: 3,
      },
    ]);
    // Show List 3 when both List 1 and List 2 are selected
    if (selectedLists.includes(1) && selectedLists.includes(2)) {
      setShowListThree(true);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting List 3 items:", listThree);
    console.log("Final List 1:", listOne);
    console.log("Final List 2:", listTwo);
    console.log("Final List 3:", listThree);
    // setListThree([]);
    setShowListThree(true);
    setSelectedLists([1, 2, 3]);
  };

  const handleCancel = () => {
    const updatedListOne: ListItem[] = [];
    const updatedListTwo: ListItem[] = [];

    listThree.forEach((item) => {
      if (item.list_number === 1) {
        updatedListOne.push(item);
      } else if (item.list_number === 2) {
        updatedListTwo.push(item);
      }
    });

    setListOne((prev) => [...prev, ...updatedListOne]);
    setListTwo((prev) => [...prev, ...updatedListTwo]);

    setListThree([]);
    setShowListThree(false);
    setSelectedLists([]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#007bff"
              strokeWidth="8"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset={`${251.2 - (251.2 * loadingProgress) / 100}`}
              style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
            />
          </svg>
        </div>
      )}
      {error && (
        <div
          style={{
            display: " flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20%",
          }}
        >
          <p>{error}</p>
          <button
            onClick={fetchLists}
            style={{
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: "5%",
            }}
          >
            <h1>List Creation</h1>
            <button
              style={{
                padding: "10px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleCreateNewList}
            >
              Create a new list
            </button>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "none",
                padding: "10px",
                overflowY: "scroll",
                height: "90vh",
                borderRadius: "10px",
                background: "#64b5f626",
              }}
            >
              <h3>
                {showListThree ? (
                  `List 1(${listOne.length})`
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedLists.includes(1)}
                      onChange={() => handleListSelection(1)}
                    />
                    List 1({listOne.length})
                  </>
                )}
              </h3>
              {listOne.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                    background: "White",
                    borderRadius: "15px",
                  }}
                >
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  {showListThree && (
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        style={{ border: "none", background: "none" }}
                        onClick={() => moveToThree(item, listOne, setListOne)}
                      >
                        <RightArrow />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {showListThree && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "none",
                  padding: "10px",
                  overflowY: "scroll",
                  height: "90vh",
                  width: "25%",
                  borderRadius: "10px",
                  background: "#64b5f626",
                }}
              >
                <h3>List 3({listThree.length})</h3>
                {listThree.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      marginBottom: "10px",
                      background: "White",
                      borderRadius: "15px",
                    }}
                  >
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "none",
                padding: "10px",
                overflowY: "scroll",
                height: "90vh",
                borderRadius: "10px",
                background: "#64b5f626",
              }}
            >
              <h3>
                {showListThree ? (
                  `List 2(${listTwo.length})`
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={selectedLists.includes(2)}
                      onChange={() => handleListSelection(2)}
                    />
                    List 2({listTwo.length})
                  </>
                )}
              </h3>
              {listTwo.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                    background: "White",
                    borderRadius: "15px",
                  }}
                >
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  {showListThree && (
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        style={{ border: "none", background: "none" }}
                        onClick={() => moveToThree(item, listTwo, setListTwo)}
                      >
                        <LeftArrow />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {showListThree && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  padding: "5px 20px",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "5px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListCreationApp;
