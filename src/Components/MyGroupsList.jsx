import { Box, height } from "@mui/system";
import React, { useEffect } from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import { BsThreeDotsVertical } from "react-icons/bs";
import ListButton from "./ListButton";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 4,
  borderRadius: "20px",
};

const MyGroupsList = ({ title, button, buttonName, date }) => {
  let userData = useSelector((state) => state);
  let [myGroupArr, setMyGroupArr] = useState([]);
  let [memberReqArr, setMemberReqArr] = useState([]);
  let [memberModalShow, setMembermodalShow] = useState(false);
  let [memberArr, setMemberArr] = useState([]);
  let [id, setID] = useState();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setMembermodalShow(false);
  };
  let db = getDatabase();
  useEffect(() => {
    let db = getDatabase();
    const myGroupRef = ref(db, "grouplist");
    onValue(myGroupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (items.val().adminID == userData.userData.userInfo.uid) {
          arr.push({ ...items.val(), id: items.key });
        }
      });
      setMyGroupArr(arr);
    });
  }, []);

  let groupDetails = (idd) => {
    setOpen(true);
    setID(idd);
    let db = getDatabase();
    const myGroup = ref(db, "grouprequest");
    onValue(myGroup, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (items.val().groupID == id) {
          arr.push({ ...items.val(), id: items.key });
        }
      });

      setMemberReqArr(arr);
    });
  };
  let handleCancelMember = (id) => {
    remove(ref(db, "grouprequest/" + id));
  };

  let handleMemberAccept = (item) => {
    set(push(ref(db, "groupmembers")), {
      groupID: item.groupID,
      groupname: item.groupname,
      whoJoined: item.whoJoined,
      whoJoinedName: item.whoJoinedName,
      whoJoinedPhoto: item.whoJoinedPhoto,
    }).then(() => {
      remove(ref(db, "grouprequest/" + item.id));
    });
  };
  let membersListshow = (id) => {
    setMembermodalShow(true);
    let db = getDatabase();
    const myGroup = ref(db, "groupmembers");
    onValue(myGroup, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (items.val().groupID == id) {
          arr.push({ ...items.val(), id: items.key });
        }
      });

      setMemberArr(arr);
    });
  };
  return (
    <>
      <Box
        sx={{
          width: { md: "49%", lg: "32%" },
          height: { xs: "300px", sm: "350px", md: "48%" },
          background: "white",
          borderRadius: "15px",
          marginTop: { xs: "20px", sm: "20px", md: "0" },
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        <ListHeader title={title} />
        <Box
          sx={{
            height: "80%",
            width: "100%",
            padding: "0 20px",
            overflowY: "scroll",
          }}
        >
          <ul>
            {myGroupArr.map((item) => (
              <div key={item.id}>
                <ListItems
                  name={item.groupname}
                  button={true}
                  buttonName="Member Requests"
                  profession={item.grouptag}
                  doubleButton={true}
                  secontBtnName="group Info"
                  secondButtonOnclick={() => membersListshow(item.id)}
                  onClick={() => groupDetails(item.id)}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="create-group-modal">
                    <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
                      Member Request
                    </h2>
                    <ul>
                      {memberReqArr.length === 0 ? (
                        <h4
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#d1d1d1",
                          }}
                        >
                          No Member Request
                        </h4>
                      ) : (
                        memberReqArr.map((item) => (
                          <ListItems
                            key={item.id}
                            imgsrc={item.whoJoinedPhoto}
                            name={item.whoJoinedName}
                            button={true}
                            doubleButton={true}
                            buttonName="Accept"
                            secontBtnName="Reject"
                            secondButtonOnclick={() =>
                              handleCancelMember(item.id)
                            }
                            onClick={() => handleMemberAccept(item)}
                          />
                        ))
                      )}
                    </ul>
                  </Box>
                </Modal>
                <Modal
                  open={memberModalShow}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="create-group-modal">
                    <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
                      Members
                    </h2>
                    <ul>
                      {memberArr.length === 0 ? (
                        <h4
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#d1d1d1",
                          }}
                        >
                          No Members
                        </h4>
                      ) : (
                        memberArr.map((item) => (
                          <ListItems
                            key={item.id}
                            imgsrc={item.whoJoinedPhoto}
                            name={item.whoJoinedName}
                            button={true}
                            buttonName="Remove"
                            onClick={() =>
                              remove(ref(db, "groupmembers/" + item.id))
                            }
                          />
                        ))
                      )}
                    </ul>
                    <ListButton
                      style={{ marginTop: "15px" }}
                      title="Delete Group"
                      onClick={() => {
                        remove(ref(db, "grouplist/" + item.id));
                        setMembermodalShow(false);
                      }}
                    />
                  </Box>
                </Modal>
              </div>
            ))}
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default MyGroupsList;
