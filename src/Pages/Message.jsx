import React from "react";
import {
  getDatabase,
  push,
  ref,
  set,
  onValue,
  remove,
} from "firebase/database";
import ScrollToBottom from "react-scroll-to-bottom";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import ListHeader from "../Components/ListHeader";
import ListItems from "../Components/ListItems";

import InputBox from "../Components/InputBox";

import {
  Camera as cam,
  CameraAlt,
  Delete,
  PhotoCamera,
  Send,
  Share,
} from "@mui/icons-material";
import ListButton from "../Components/ListButton";
import moment from "moment/moment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  getDownloadURL,
  getStorage,
  ref as storageref,
  uploadBytes,
} from "firebase/storage";
import zIndex from "@mui/material/styles/zIndex";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 4,
  borderRadius: "20px",
};

const Message = () => {
  let data = useSelector((state) => state);
  const storage = getStorage();
  let navigate = useNavigate();
  let [dlt, setDlt] = useState([]);
  let [message, setMessage] = useState("");
  let [singleMsgArr, setSingleMsgArr] = useState([]);
  let [textID, setTextId] = useState("");
  let [friendItem, setFriendItem] = useState({
    date: "17/2/2023",
    id: "-NORCsUPbPtChRjLYALF",
    recieverID: "KtzcmrwhUfQcxxFZuj7qzc50QAP2",
    recieverName: "Hamza Altamas",
    recieverPhoto:
      "https://lh3.googleusercontent.com/a/AEdFTp4B_0clDzIbpQq-TcImqIk9LYOYORhQjSwQIJ2v=s96-c",
    senderName: "Hamza Altamas",
    senderPhoto:
      "https://firebasestorage.googleapis.com/v0/b/mitro-social-media.appspot.com/o/mitroDP%2FC8pyEWx232gBBsZNIng5lVmcocb2?alt=media&token=e9b0c698-ad59-437d-bf45-ec7f931855a9",
    senderUid: "C8pyEWx232gBBsZNIng5lVmcocb2",
  });
  useEffect(() => {
    if (!data.userData.userInfo) {
      navigate("/login");
    }
  }, []);

  // my groups functionality
  let userData = useSelector((state) => state);
  let [myGroupArr, setMyGroupArr] = useState([]);
  let [memberReqArr, setMemberReqArr] = useState([]);
  let [memberModalShow, setMembermodalShow] = useState(false);

  let [id, setID] = useState();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setMembermodalShow(false);
  };

  // read group members data
  let [memberArr, setMemberArr] = useState([]);
  useEffect(() => {
    let db = getDatabase();
    const myGroupRef = ref(db, "groupmembers");
    onValue(myGroupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        arr.push(items.val().groupID + items.val().whoJoined);

        setMemberArr(arr);
      });
    });
  }, []);
  let db = getDatabase();
  useEffect(() => {
    let db = getDatabase();
    const myGroupRef = ref(db, "grouplist");
    onValue(myGroupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (
          items.val().adminID == userData.userData.userInfo.uid ||
          memberArr.includes(items.key + userData.userData.userInfo.uid)
        ) {
          arr.push({ ...items.val(), id: items.key });
        }
      });
      setMyGroupArr(arr);
    });
  }, [memberArr]);

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

  // friends list functionality added

  let [friends, setFriends] = useState([]);

  useEffect(() => {
    let db = getDatabase();
    const friendListRef = ref(db, "friendsList");
    onValue(friendListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (
          userData.userData.userInfo.uid == items.val().senderUid ||
          userData.userData.userInfo.uid == items.val().recieverID
        ) {
          arr.push({ ...items.val(), id: items.key });
        }
      });
      setFriends(arr);
    });
  }, []);
  let handleText = (item) => {
    setFriendItem(item);
  };
  let handleSentMessage = () => {
    if (friendItem.status === "singlemsg") {
      set(push(ref(db, "singlemsg")), {
        whosendid: userData.userData.userInfo.uid,
        whosendname: userData.userData.userInfo.displayName,
        whorecieveid:
          userData.userData.userInfo.uid == friendItem.recieverID
            ? friendItem.senderUid
            : friendItem.recieverID,
        whorecievename:
          userData.userData.userInfo.uid == friendItem.recieverID
            ? friendItem.senderName
            : friendItem.recieverName,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        message: message,
      }).then(() => {
        setMessage("");
      });
    }
  };
  let enterMessage = (e) => {
    if (e.key === "Enter") {
      if (friendItem.status === "singlemsg") {
        set(push(ref(db, "singlemsg")), {
          whosendid: userData.userData.userInfo.uid,
          whosendname: userData.userData.userInfo.displayName,
          whorecieveid:
            userData.userData.userInfo.uid == friendItem.recieverID
              ? friendItem.senderUid
              : friendItem.recieverID,
          whorecievename:
            userData.userData.userInfo.uid == friendItem.recieverID
              ? friendItem.senderName
              : friendItem.recieverName,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          message: message,
        }).then(() => {
          setMessage("");
        });
      }
    }
  };

  // read single message data
  useEffect(() => {
    let db = getDatabase();
    const singlemsgref = ref(db, "singlemsg");
    onValue(singlemsgref, (snapshot) => {
      let arr = [];
      let dltTxtArr = [];
      let id =
        friendItem.recieverID === userData.userData.userInfo.uid
          ? friendItem.senderUid
          : friendItem.recieverID;
      snapshot.forEach((items) => {
        console.log(items.val());
        if (
          (items.val().whosendid === userData.userData.userInfo.uid &&
            items.val().whorecieveid === id) ||
          (items.val().whosendid === id &&
            items.val().whorecieveid === userData.userData.userInfo.uid)
        ) {
          arr.push({ ...items.val(), id: items.key });
        }
        dltTxtArr.push({ ...items.val(), id: items.key });
      });
      setSingleMsgArr(arr);
      setDlt(dltTxtArr);
    });
  }, [friendItem]);
  // message dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const menuopen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleoff = () => {
    setAnchorEl(null);
  };
  // delete message

  // image send modal functionality
  const [imageSendOpen, setImageSendOpen] = useState(false);
  let [msgImg, setMsgImg] = useState();
  const handleimageSendOpen = () => setImageSendOpen(true);
  const handleimageSendClose = () => setImageSendOpen(false);

  let handleImageUpload = (e) => {
    console.log(e.target.files[0]);
    const storageRef = storageref(
      storage,
      `messageImages/${e.target.files[0].name}`
    );

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log(downloadURL);

        setMsgImg(downloadURL);
      });
      console.log("Uploaded a blob or file!");
    });
  };
  let handleImageSend = () => {
    if (friendItem.status === "singlemsg") {
      set(push(ref(db, "singlemsg")), {
        whosendid: userData.userData.userInfo.uid,
        whosendname: userData.userData.userInfo.displayName,
        whorecieveid:
          userData.userData.userInfo.uid == friendItem.recieverID
            ? friendItem.senderUid
            : friendItem.recieverID,
        whorecievename:
          userData.userData.userInfo.uid == friendItem.recieverID
            ? friendItem.senderName
            : friendItem.recieverName,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        image: msgImg,
      }).then(() => {
        setMessage("");
        setMsgImg();
        setImageSendOpen(false);
      });
    }
  };
  // captured image
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log("takePhoto");
  }
  return (
    <>
      <Box
        sx={{
          width: "15%",
          height: "100vh",
          display: { xs: "none", sm: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
        }}
      ></Box>
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "85%" },
          display: { xs: "block", sm: "block", md: "flex" },
          rowGap: "10px",
          columnGap: "15px",
          padding: "15px",
          height: "100vh",
          marginBottom: { xs: "150px", sm: "150px", md: "0" },
        }}
      >
        <Box
          sx={{
            width: { md: "49%", lg: "32%" },
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          {/* group start */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "300px", sm: "350px", md: "48%" },
              background: "white",
              borderRadius: "15px",
              marginTop: { xs: "20px", sm: "20px", md: "0" },
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            <ListHeader title="Group List" />
            <Box
              sx={{
                height: "80%",
                width: "100%",
                padding: "0 20px",
                overflowY: "scroll",
              }}
            >
              <ul>
                {myGroupArr.map((item, index) => (
                  <div key={index}>
                    <ListItems
                      name={item.groupname}
                      button={true}
                      profession={item.grouptag}
                      buttonName="Group Info"
                      onClick={() => membersListshow(item.id)}
                    />
                  </div>
                ))}
              </ul>
            </Box>
          </Box>
          {/* group end */}
          {/* friendslist start */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "300px", sm: "350px", md: "48%" },
              background: "white",
              borderRadius: "15px",
              marginTop: { xs: "20px", sm: "20px", md: 0 },
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            <ListHeader title="Friends" />
            <Box
              sx={{
                height: "80%",
                width: "100%",
                padding: "0 20px",
                overflowY: "scroll",
              }}
            >
              <ul>
                {friends.length === 0 ? (
                  <h4
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#d1d1d1",
                    }}
                  >
                    No Friends
                  </h4>
                ) : (
                  friends.map((item, index) =>
                    userData.userData.userInfo.uid == item.senderUid ? (
                      <ListItems
                        key={index}
                        date={item.date}
                        button={true}
                        buttonName="Text"
                        name={item.recieverName}
                        imgsrc={item.recieverPhoto}
                        onClick={() =>
                          handleText({ ...item, status: "singlemsg" })
                        }
                      />
                    ) : (
                      <ListItems
                        key={index}
                        date={item.date}
                        button={true}
                        buttonName="Text"
                        name={item.senderName}
                        imgsrc={item.senderPhoto}
                        onClick={() =>
                          handleText({ ...item, status: "singlemsg" })
                        }
                      />
                    )
                  )
                )}
              </ul>
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
                      memberArr.map((item, index) => (
                        <ListItems
                          key={index}
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
                </Box>
              </Modal>
            </Box>
          </Box>
          {/* friends list end */}
        </Box>
        {/* messasge area */}
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "66%" },
            height: "100%",
            marginBottom: { xs: "150px", sm: "150px", md: "0" },
            background: "white",
            borderRadius: "15px",
            marginTop: { xs: "20px", sm: "20px", md: "0" },
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "15%",

              padding: "0 0 0 20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{ height: "60px", width: "60px" }}
                src={
                  friendItem.senderUid === data.userData.userInfo.uid
                    ? friendItem.recieverPhoto
                    : friendItem.senderPhoto
                }
              />
              <Box sx={{ padding: "0 0 0 20px" }}>
                <h3>
                  {friendItem.senderUid === data.userData.userInfo.uid
                    ? friendItem.recieverName
                    : friendItem.senderName}
                </h3>
                <h6 style={{ color: "#d1d1d1" }}>Online</h6>
              </Box>
            </Box>
          </Box>
          <ScrollToBottom
            // sx={{
            //   width: "100%",
            //   height: "65%",
            //   background: "#fff",
            //   overflowY: "scroll",
            //   padding: "10px",
            // }}
            className="chatArea"
          >
            {singleMsgArr.map(
              (item) =>
                item.whosendid === data.userData.userInfo.uid ? (
                  item.image ? (
                    <Box
                      onClick={() => setDlt(item.id)}
                      sx={{
                        width: "100%",
                        padding: "6px",
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Box>
                        <p
                          style={{
                            color: "#d1d1d1",
                            fontSize: "13px",
                            marginBottom: "5px",
                          }}
                        >
                          {item.whosendname}
                        </p>
                        <Box
                          id="demo-positioned-button"
                          aria-controls={
                            menuopen ? "demo-positioned-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={menuopen ? "true" : undefined}
                          onClick={handleClick}
                          sx={{
                            borderRadius: "13px",
                            background: "#5f34f5",
                            padding: "10px",
                            color: "#fff",
                          }}
                        >
                          <img
                            style={{ width: "250px", height: "auto" }}
                            src={item.image}
                          />
                        </Box>
                        <Menu
                          id="demo-positioned-menu"
                          aria-labelledby="demo-positioned-button"
                          anchorEl={anchorEl}
                          open={menuopen}
                          onClose={handleoff}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          <MenuItem onClick={handleoff}>
                            <Share /> Forward
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleoff();
                              remove(ref(db, "singlemsg/" + dlt));
                            }}
                          >
                            <Delete /> Delete
                          </MenuItem>
                        </Menu>
                        <p
                          style={{
                            color: "#d1d1d1",
                            fontSize: "13px",
                            marginTop: "5px",
                          }}
                        >
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </Box>
                    </Box>
                  ) : (
                    /* message who login start */
                    <Box
                      onClick={() => setDlt(item.id)}
                      sx={{
                        width: "100%",
                        padding: "6px",
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <Box>
                        <p
                          style={{
                            color: "#d1d1d1",
                            fontSize: "13px",
                            marginBottom: "5px",
                          }}
                        >
                          {item.whosendname}
                        </p>
                        <Box
                          id="demo-positioned-button"
                          aria-controls={
                            menuopen ? "demo-positioned-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={menuopen ? "true" : undefined}
                          onClick={handleClick}
                          sx={{
                            borderRadius: "13px",
                            background: "#5f34f5",
                            padding: "10px",
                            color: "#fff",
                          }}
                        >
                          {item.message}
                        </Box>
                        <Menu
                          id="demo-positioned-menu"
                          aria-labelledby="demo-positioned-button"
                          anchorEl={anchorEl}
                          open={menuopen}
                          onClose={handleoff}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          <MenuItem onClick={handleoff}>
                            <Share /> Forward
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleoff();
                              remove(ref(db, "singlemsg/" + dlt));
                            }}
                          >
                            <Delete /> Delete
                          </MenuItem>
                        </Menu>
                        <p
                          style={{
                            color: "#d1d1d1",
                            fontSize: "13px",
                            marginTop: "5px",
                          }}
                        >
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </Box>
                    </Box>
                  )
                ) : item.image ? (
                  <Box
                    onClick={() => setDlt(item.id)}
                    sx={{
                      width: "100%",
                      padding: "6px",
                      display: "flex",
                      justifyContent: "start",
                    }}
                  >
                    <Box>
                      <p
                        style={{
                          color: "#d1d1d1",
                          fontSize: "13px",
                          marginBottom: "5px",
                        }}
                      >
                        {item.whorecievename}
                      </p>
                      <Box
                        id="demo-positioned-button"
                        aria-controls={
                          menuopen ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={menuopen ? "true" : undefined}
                        onClick={handleClick}
                        sx={{
                          borderRadius: "13px",
                          background: "#d1d1d1",
                          padding: "10px",
                          color: "#222",
                        }}
                      >
                        <img
                          style={{ width: "250px", height: "auto" }}
                          src={item.image}
                        />
                      </Box>
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={menuopen}
                        onClose={handleoff}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem onClick={handleoff}>
                          <Share /> Forward
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleoff();
                            remove(ref(db, "singlemsg/" + dlt));
                          }}
                        >
                          <Delete /> Delete
                        </MenuItem>
                      </Menu>
                      <p
                        style={{
                          color: "#d1d1d1",
                          fontSize: "13px",
                          marginTop: "5px",
                        }}
                      >
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </p>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    onClick={() => setDlt(item.id)}
                    sx={{
                      width: "100%",
                      padding: "6px",
                      display: "flex",
                      justifyContent: "start",
                    }}
                  >
                    <Box>
                      <p
                        style={{
                          color: "#d1d1d1",
                          fontSize: "13px",
                          marginBottom: "5px",
                        }}
                      >
                        {item.whorecievename}
                      </p>
                      <Box
                        id="demo-positioned-button"
                        aria-controls={
                          menuopen ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={menuopen ? "true" : undefined}
                        onClick={handleClick}
                        sx={{
                          borderRadius: "13px",
                          background: "#d1d1d1",
                          padding: "10px",
                          color: "#222",
                        }}
                      >
                        {item.message}
                      </Box>
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={menuopen}
                        onClose={handleoff}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem onClick={handleoff}>
                          <Share /> Forward
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleoff();
                            remove(ref(db, "singlemsg/" + dlt));
                          }}
                        >
                          <Delete /> Delete
                        </MenuItem>
                      </Menu>
                      <p
                        style={{
                          color: "#d1d1d1",
                          fontSize: "13px",
                          marginTop: "5px",
                        }}
                      >
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </p>
                    </Box>
                  </Box>
                )
              /* message who login end */
            )}
          </ScrollToBottom>
          <Box
            sx={{
              width: "100%",
              height: "20%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
              background: "#fff",
              display: "flex",
            }}
          >
            <Box
              sx={{
                padding: "0 0 0 20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex ", gap: "10px", alignItems: "center" }}>
                <InputBox
                  onKeyUp={enterMessage}
                  label="Type a Message"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                {/* <Box
                  sx={{
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                    top: "0",
                    left: "0",
                    zIndex: "999999",
                  }}
                >
                  <Camera
                    onTakePhoto={(dataUri) => {
                      handleTakePhoto(dataUri);
                    }}
                  />
                </Box> */}
                <ListButton title={<Send />} onClick={handleSentMessage} />
                <CameraAlt
                  onClick={handleimageSendOpen}
                  sx={{ color: "#5f34f5" }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* image open modal */}
      <Modal
        open={imageSendOpen}
        onClose={handleimageSendClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ background: "#fff" }}>
          <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
            Send Image
          </h2>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img style={{ width: "200px", height: "auto" }} src={msgImg} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  // accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                />
                <PhotoCamera />
              </IconButton>

              {msgImg && (
                <Button onClick={handleImageSend} variant="contained">
                  Send
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Message;
