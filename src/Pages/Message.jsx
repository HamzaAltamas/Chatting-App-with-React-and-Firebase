import React from "react";
import {
  getDatabase,
  push,
  ref,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";
import ScrollToBottom from "react-scroll-to-bottom";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  Badge,
} from "@mui/material";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";
import ListHeader from "../Components/ListHeader";
import ListItems from "../Components/ListItems";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import InputBox from "../Components/InputBox";

import {
  Camera as cam,
  CameraAlt,
  CameraAltRounded,
  CameraAltSharp,
  Delete,
  EmojiEmotions,
  ExitToApp,
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
  uploadString,
} from "firebase/storage";

import { styled } from "@mui/material/styles";

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
  let [openCamera, setOpenCamera] = useState(false);
  let [singleMsgArr, setSingleMsgArr] = useState([]);
  let [emojiShow, setEmojiShow] = useState(false);
  let [groupItem, setGroupItem] = useState({
    adminID: "m6A9ckEiMOdw3m0NmKF1DnvoO2F3",
    adminName: "Hamza Altamas",
    groupname: "Pern",
    grouptag: "no-group-items",
    id: "-NOa6x5ZwWiTZx1ZGQ2I",
  });
  // let [textID, setTextId] = useState("");
  let [friendItem, setFriendItem] = useState({
    date: "17/2/2023",
    id: "-NORCsUPbPtChRjLYALF",
    recieverID: "KtzcmrwhUfQcxxFZuj7qzc50QAP2",
    recieverName: "Hamza Altamas",
    recieverPhoto:
      "https://lh3.googleusercontent.com/a/AEdFTp4B_0clDzIbpQq-TcImqIk9LYOYORhQjSwQIJ2v=s96-c",
    senderName: "Hamza Altamas",
    senderPhoto: "no-user",
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
    if (message !== "") {
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
          setEmojiShow(false);
        });
      }
    }
    // group msg
    if (groupmsg !== "") {
      if (groupItem.status === "group-message") {
        set(push(ref(db, "groupmsg")), {
          whosendid: userData.userData.userInfo.uid,
          whosendname: userData.userData.userInfo.displayName,
          recieveGroupid: groupItem.id,

          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          groupmessage: groupmsg,
        }).then(() => {
          setGroupmsg("");
          setEmojiShow(false);
        });
      }
    }
  };
  let enterMessage = (e) => {
    if (message !== "") {
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
            setEmojiShow(false);
            update(ref(db, "friendsList/" + friendItem.id), {
              lastTxt: message,
            });
          });
        }
      }
    }
    // group msg
    if (groupmsg !== "") {
      if (e.key === "Enter") {
        if (groupItem.status === "group-message") {
          set(push(ref(db, "groupmsg")), {
            whosendid: userData.userData.userInfo.uid,
            whosendname: userData.userData.userInfo.displayName,
            recieveGroupid: groupItem.id,

            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
            groupmessage: groupmsg,
          }).then(() => {
            setGroupmsg("");
            setEmojiShow(false);
          });
        }
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
        setOpenCamera(false);
        setMsgImg(downloadURL);
      });
      console.log("Uploaded a blob or file!");
    });
  };
  // image sent
  let handleImageSend = () => {
    setEmojiShow(false);
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
        setEmojiShow(false);
        update(ref(db, "friendsList/" + friendItem.id), {
          lastTxt: msgImg && "A photo Shared",
        });
      });
    }
    // group Img
    if (groupItem.status === "group-message") {
      set(push(ref(db, "groupmsg")), {
        whosendid: userData.userData.userInfo.uid,
        whosendname: userData.userData.userInfo.displayName,
        recieveGroupid: groupItem.id,

        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        groupImg: msgImg,
      }).then(() => {
        setMsgImg("");
        setImageSendOpen(false);
        setImageSendOpen(false);
        setEmojiShow(false);
        setOpenCamera(false);
      });
    }
  };
  // captured image
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log(dataUri);
    const captureImg = dataUri;
    let storageRef = storageref(storage, `messageImages/${Math.random()}`);
    uploadString(storageRef, captureImg, "data_url").then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log(downloadURL);
        setMsgImg(downloadURL);
        setOpenCamera(false);
      });
      console.log("Uploaded a data_url string!");
    });
  }
  // audio recording frunctionality
  let [audio, setAudio] = useState();
  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob) => {
    // const reader = new FileReader();
    // reader.readAsDataURL(blob);
    // reader.onloadend = () => {
    //   const base64data = reader.result;
    //   console.log("grgergr", base64data);
    console.log(blob);

    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

    let storageRef = storageref(storage, `textAudio/${Math.random()}`);
    uploadBytes(storageRef, blob).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
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
            audio: downloadURL,
          }).then(() => {
            setMessage("");
          });
        }
        if (groupItem.status === "group-message") {
          set(push(ref(db, "groupmsg")), {
            whosendid: userData.userData.userInfo.uid,
            whosendname: userData.userData.userInfo.displayName,
            recieveGroupid: groupItem.id,

            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
            audio: downloadURL,
          }).then(() => {
            setMsgImg("");
            setImageSendOpen(false);
            setImageSendOpen(false);
            setEmojiShow(false);
            setOpenCamera(false);
          });
        }
      });
      console.log("Uploaded a blob or file!");
    });
  };
  // emoji functionality
  let handleEmoji = (e) => {
    setMessage(message + e.emoji);
    setGroupmsg(groupmsg + e.emoji);
  };
  // last message showing in friendslist
  let lastMessage = () => {
    update(ref(db, "friendsList/" + friendItem.id), {
      lastTxt: message,
    });
  };
  // style badge
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  // group message functionality
  let [groupmsg, setGroupmsg] = useState("");
  let [groupImg, setGroupImg] = useState("");
  let [groupAudio, setGroupAudio] = useState("");
  let [groupMsgArr, setGroupMsgArr] = useState("");
  useEffect(() => {
    let db = getDatabase();
    const groupmsgRef = ref(db, "groupmsg");
    onValue(groupmsgRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((items) => {
        arr.push({ ...items.val(), id: items.key });
      });
      setGroupMsgArr(arr);
      // setDlt(dltTxtArr);
    });
  }, [groupItem]);
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
                      doubleButton={true}
                      secontBtnName="Text"
                      secondButtonOnclick={() => {
                        setGroupItem({ ...item, status: "group-message" });
                        console.log(groupItem);
                        friendItem.senderPhoto = "no-user";
                      }}
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
                        // date={item.date}
                        button={true}
                        buttonName="Text"
                        name={item.recieverName}
                        imgsrc={item.recieverPhoto}
                        profession={item.lastTxt}
                        onClick={() =>
                          handleText({ ...item, status: "singlemsg" })
                        }
                      />
                    ) : (
                      <ListItems
                        key={index}
                        // date={item.date}
                        button={true}
                        buttonName="Text"
                        name={item.senderName}
                        imgsrc={item.senderPhoto}
                        profession={item.lastTxt}
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
        {friendItem.senderPhoto !== "no-user" ? (
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "66%" },
              height: "100%",
              marginBottom: { xs: "150px", sm: "150px", md: "0" },
              background: "white",
              borderRadius: "15px",
              marginTop: { xs: "20px", sm: "20px", md: "0" },
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
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
                borderRadius: "15px 15px 0 0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    sx={{ height: "60px", width: "60px" }}
                    src={
                      friendItem.senderUid === data.userData.userInfo.uid
                        ? friendItem.recieverPhoto
                        : friendItem.senderPhoto
                    }
                  />
                </StyledBadge>

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
                            {!item.image ? (
                              <p>Your message Removed</p>
                            ) : (
                              <img
                                style={{ width: "250px", height: "auto" }}
                                src={item.image}
                              />
                            )}
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
                                update(ref(db, "singlemsg/" + dlt), {
                                  image: "",
                                });
                                navigate("/chattingup/message");
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
                    ) : item.audio ? (
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
                            {item.audio === "" ? (
                              "Your message Removed"
                            ) : (
                              <audio src={item.audio} controls></audio>
                            )}
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
                                update(ref(db, "singlemsg/" + dlt), {
                                  audio: "Your message Removed",
                                });
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
                                update(ref(db, "singlemsg/" + dlt), {
                                  message: "Your message Removed",
                                });
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
                          {item.image.includes === "Your message Removed" ? (
                            item.image
                          ) : (
                            <img
                              style={{ width: "250px", height: "auto" }}
                              src={item.image}
                            />
                          )}
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
                              update(ref(db, "singlemsg/" + dlt), {
                                image: "Your message Removed",
                              });
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
                  ) : item.audio ? (
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
                          {item.audio === "" ? (
                            <p>Your message Removed</p>
                          ) : (
                            <audio src={item.audio} controls></audio>
                          )}
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
                              update(ref(db, "singlemsg/" + dlt), {
                                audio: "Your message Removed",
                              });
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
                              update(ref(db, "singlemsg/" + dlt), {
                                message: "Your message Removed",
                              });
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
                borderRadius: "0 0 15px 15px",
              }}
            >
              <Box
                sx={{
                  padding: "0 0 0 20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ display: "flex ", gap: "10px", alignItems: "center" }}
                >
                  <InputBox
                    onKeyUp={enterMessage}
                    label="Type a Message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                  />
                  {openCamera && (
                    <Box
                      sx={{
                        position: "fixed",
                        width: "100%",
                        height: "100vh",
                        top: "0",
                        left: "0",
                        zIndex: "999999",
                      }}
                    >
                      <ExitToApp
                        sx={{
                          position: "absolute",
                          zIndex: "9999999",
                          top: "50px",
                          left: "50px",
                        }}
                        onClick={() => setOpenCamera(false)}
                      />{" "}
                      <Camera
                        idealResolution={{ width: "100%" }}
                        isFullscreen={true}
                        onTakePhoto={(dataUri) => {
                          handleTakePhoto(dataUri);
                        }}
                      />
                    </Box>
                  )}

                  <CameraAlt
                    onClick={handleimageSendOpen}
                    sx={{
                      color: "#5f34f5",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <Box sx={{ position: "relative" }}>
                    {emojiShow && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "30px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <EmojiPicker onEmojiClick={(e) => handleEmoji(e)} />
                      </Box>
                    )}
                    <EmojiEmotions
                      sx={{ color: "#5f34f5", marginTop: "6px" }}
                      onClick={() => setEmojiShow((prev) => !prev)}
                    />
                  </Box>

                  <AudioRecorder
                    onRecordingComplete={(blob) => addAudioElement(blob)}
                    recorderControls={recorderControls}
                  />
                  <ListButton
                    title={<Send />}
                    onClick={() => {
                      handleSentMessage();
                      lastMessage();
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        ) : groupItem.grouptag !== "no-group-items" ? (
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "66%" },
              height: "100%",
              marginBottom: { xs: "150px", sm: "150px", md: "0" },
              background: "white",
              borderRadius: "15px",
              marginTop: { xs: "20px", sm: "20px", md: "0" },
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
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
                borderRadius: "15px 15px 0 0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar sx={{ height: "60px", width: "60px" }} />
                </StyledBadge>

                <Box sx={{ padding: "0 0 0 20px" }}>
                  <h3>{groupItem.groupname}</h3>
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
              {groupMsgArr.map((item) =>
                item.recieveGroupid === groupItem.id ? (
                  item.whosendid === data.userData.userInfo.uid ? (
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
                        {item.groupImg ? (
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
                                {!item.groupImg ? (
                                  <p>Your message Removed</p>
                                ) : (
                                  <img
                                    style={{ width: "250px", height: "auto" }}
                                    src={item.groupImg}
                                  />
                                )}
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
                                    update(ref(db, "singlemsg/" + dlt), {
                                      image: "",
                                    });
                                    navigate("/chattingup/message");
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
                        ) : item.audio ? (
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
                            {item.audio === "" ? (
                              <p>Your message Removed</p>
                            ) : (
                              <audio src={item.audio} controls></audio>
                            )}
                          </Box>
                        ) : (
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
                            {item.groupmessage}
                          </Box>
                        )}

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
                              update(ref(db, "singlemsg/" + dlt), {
                                message: "Your message Removed",
                              });
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
                          {item.whosendname}
                        </p>
                        {item.groupImg ? (
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
                              color: "#fff",
                            }}
                          >
                            {!item.groupImg ? (
                              <p>Your message Removed</p>
                            ) : (
                              <img
                                style={{ width: "250px", height: "auto" }}
                                src={item.groupImg}
                              />
                            )}
                          </Box>
                        ) : item.audio ? (
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
                            {item.audio === "" ? (
                              <p>Your message Removed</p>
                            ) : (
                              <audio src={item.audio} controls></audio>
                            )}
                          </Box>
                        ) : (
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
                            {item.groupmessage}
                          </Box>
                        )}

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
                              update(ref(db, "singlemsg/" + dlt), {
                                message: "Your message Removed",
                              });
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
                ) : (
                  ""
                )
              )}
            </ScrollToBottom>
            <Box
              sx={{
                width: "100%",
                height: "20%",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                background: "#fff",
                display: "flex",
                borderRadius: "0 0 15px 15px",
              }}
            >
              <Box
                sx={{
                  padding: "0 0 0 20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ display: "flex ", gap: "10px", alignItems: "center" }}
                >
                  <InputBox
                    onKeyUp={enterMessage}
                    label="Type a Message"
                    onChange={(e) => setGroupmsg(e.target.value)}
                    value={groupmsg}
                  />
                  {openCamera && (
                    <Box
                      sx={{
                        position: "fixed",
                        width: "100%",
                        height: "100vh",
                        top: "0",
                        left: "0",
                        zIndex: "999999",
                      }}
                    >
                      <ExitToApp
                        sx={{
                          position: "absolute",
                          zIndex: "9999999",
                          top: "50px",
                          left: "50px",
                        }}
                        onClick={() => setOpenCamera(false)}
                      />{" "}
                      <Camera
                        idealResolution={{ width: "100%" }}
                        isFullscreen={true}
                        onTakePhoto={(dataUri) => {
                          handleTakePhoto(dataUri);
                        }}
                      />
                    </Box>
                  )}

                  <CameraAlt
                    onClick={handleimageSendOpen}
                    sx={{
                      color: "#5f34f5",
                      display: "flex",
                      alignItems: "center",
                    }}
                  />
                  <Box sx={{ position: "relative" }}>
                    {emojiShow && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "30px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <EmojiPicker onEmojiClick={(e) => handleEmoji(e)} />
                      </Box>
                    )}
                    <EmojiEmotions
                      sx={{ color: "#5f34f5", marginTop: "6px" }}
                      onClick={() => setEmojiShow((prev) => !prev)}
                    />
                  </Box>

                  <AudioRecorder
                    onRecordingComplete={(blob) => addAudioElement(blob)}
                    recorderControls={recorderControls}
                  />
                  <ListButton
                    title={<Send />}
                    onClick={() => {
                      handleSentMessage();
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <h4
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#d1d1d1",
            }}
          >
            Choose Friend or Group to start Text
          </h4>
        )}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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

              <Button onClick={() => setOpenCamera(true)} variant="contained">
                Open Camera
              </Button>
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
