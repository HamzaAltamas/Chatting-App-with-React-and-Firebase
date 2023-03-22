import React from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import {
  getDatabase,
  push,
  ref,
  set,
  onValue,
  remove,
} from "firebase/database";

import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import Heading from "./Heading";
import InputBox from "./InputBox";
import CommonButton from "./CommonButton";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { PhotoCamera } from "@mui/icons-material";
import {
  getDownloadURL,
  getStorage,
  ref as storegRef,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { Cropper } from "react-cropper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  p: 4,
  borderRadius: "20px",
  height: "400px",
  overflowY: "scroll",
};

const SubmitButtonStyle = styled(Button)({
  width: "80%",
  fontSize: "17px",
  padding: "19px 12px",
  textTransform: "capitalize",
  borderRadius: "86px",
  marginTop: "30px",

  color: "white",
  backgroundColor: "#5F35F5",

  fontFamily: '"Nunito", sans-serif',
  "&:hover": {
    backgroundColor: "#5f35f59e",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "none",
    borderColor: "none",
  },
  "&:focus": {
    boxShadow: "none",
  },
});

const GroupList = ({ title, button, buttonName, date }) => {
  let data = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  let [errorText, setErrorText] = useState("");
  let [reqArr, setReqArr] = useState([]);
  let [gReqID, setGreqID] = useState([]);
  let [createGroupInfo, setCreateGroupInfo] = useState({
    groupname: "",
    grouptag: "",
  });
  const db = getDatabase();
  let handleChange = (e) => {
    let { value, name } = e.target;
    setCreateGroupInfo((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
    console.log(createGroupInfo);
  };
  let [groupArr, setGroupArr] = useState([]);
  useEffect(() => {
    let db = getDatabase();
    const myGroupRef = ref(db, "grouplist");
    onValue(myGroupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        if (items.val().adminID !== data.userData.userInfo.uid) {
          arr.push({ ...items.val(), id: items.key });
        }
      });
      setGroupArr(arr);
    });
  }, []);
  let handleCreateGroup = () => {
    if (!createGroupInfo.groupname) {
      setErrorText("Please type your group name");
    } else if (!createGroupInfo.grouptag) {
      setErrorText("Please type your group tag");
    } else {
      set(push(ref(db, "grouplist")), {
        groupname: createGroupInfo.groupname,
        grouptag: createGroupInfo.grouptag,
        adminID: data.userData.userInfo.uid,
        adminName: data.userData.userInfo.displayName,
        groupImg: dpurl,
      }).then(() => {
        setOpen(false);
        setErrorText("");
        setCreateGroupInfo({
          groupname: "",
          grouptag: "",
        });
      });
    }
  };
  // read group ,member list
  let [memberArr, setMemberArr] = useState([]);
  useEffect(() => {
    let db = getDatabase();
    const myGroup = ref(db, "groupmembers");
    onValue(myGroup, (snapshot) => {
      let arr = [];
      snapshot.forEach((items) => {
        items.val().whoJoined == data.userData.userInfo.uid &&
          arr.push(items.val().groupID);
      });

      setMemberArr(arr);
    });
  }, []);
  useEffect(() => {
    let db = getDatabase();
    const myGroup = ref(db, "grouprequest");
    onValue(myGroup, (snapshot) => {
      let arr = [];
      let greqarr = [];
      snapshot.forEach((items) => {
        console.log(items.val());
        if (data.userData.userInfo.uid == items.val().whoJoined) {
          arr.push(items.val().groupID);
          greqarr.push({ ...items.val(), id: items.key });
        }
      });
      setReqArr(arr);
      setGreqID(greqarr);
    });
  }, []);
  let handleJoinGroup = (item) => {
    set(push(ref(db, "grouprequest")), {
      groupID: item.id,
      groupname: item.groupname,
      whoJoined: data.userData.userInfo.uid,
      whoJoinedName: data.userData.userInfo.displayName,
      whoJoinedPhoto: data.userData.userInfo.photoURL,
      groupImg: dpurl,
    }).then(() => {
      toast.success("Join request sent", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  };

  const handleClose = () => setOpen(false);
  let createGroup = () => {
    setOpen(true);
  };
  let cancleReq = (id) => {
    gReqID.map((item) => {
      id === item.groupID && remove(ref(db, "grouprequest/" + item.id));
    });
  };

  // groupImage functionality
  let [grpImg, setGrpImg] = useState();
  const [cropper, setCropper] = useState();
  const [cropData, setCropData] = useState("#");
  let [dpurl, setDpurl] = useState("");
  const cropperChange = (e) => {
    e.preventDefault();
    let files;
    console.log(e.target.files);
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    console.log(files);
    const reader = new FileReader();
    reader.onload = () => {
      setGrpImg(reader.result);
      console.log(grpImg);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
    const storage = getStorage();
    const dpRef = storegRef(storage, `groupImage/${Math.random()}`); //base64 image upload on upload button
    // Data URL string
    const cropedDp = cropper.getCroppedCanvas().toDataURL();
    uploadString(dpRef, cropedDp, "data_url").then((snapshot) => {
      console.log("Uploaded a data_url string!");

      getDownloadURL(dpRef).then((downloadURL) => {
        setDpurl(downloadURL);
        console.log(dpRef, downloadURL);
        setGrpImg();
      });
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
        <ListHeader title={title} onClick={createGroup} headerButton={true} />
        <Box
          sx={{
            height: "80%",
            width: "100%",
            padding: "0 20px",
            overflowY: "scroll",
          }}
        >
          <ul>
            {groupArr.map((item) =>
              reqArr.includes(item.id) ? (
                <ListItems
                  key={item.id}
                  imgsrc={item.groupImg}
                  name={item.groupname}
                  button={button}
                  buttonName="cancel join request"
                  profession={item.grouptag}
                  onClick={() => cancleReq(item.id)}
                />
              ) : memberArr.includes(item.id) ? (
                <ListItems
                  key={item.id}
                  imgsrc={item.groupImg}
                  name={item.groupname}
                  button={button}
                  buttonName="Joined"
                  profession={item.grouptag}
                />
              ) : (
                <ListItems
                  key={item.id}
                  name={item.groupname}
                  imgsrc={item.groupImg}
                  button={button}
                  buttonName="Join"
                  profession={item.grouptag}
                  onClick={() => handleJoinGroup(item)}
                />
              )
            )}
          </ul>
        </Box>
      </Box>
      {/* modal start */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-group-modal">
          <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
            Create group
          </h2>
          <h6
            style={{
              textAlign: "center",
              color: "red",
            }}
          >
            {errorText}
          </h6>
          <InputBox
            label="Group Name"
            variant="outlined"
            onChange={handleChange}
            type="text"
            name="groupname"
            sx={{
              width: "100%",
              marginTop: "30px",
            }}
          />{" "}
          <InputBox
            label="Group Tag"
            variant="outlined"
            onChange={handleChange}
            type="text"
            name="grouptag"
            sx={{
              width: "100%",
              marginTop: "30px",
            }}
            // value={}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {grpImg && (
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
                className="img-preview"
              ></Box>
            )}
          </Box>
          {grpImg && (
            <Cropper
              style={{ height: 400, width: "100%", marginTop: "20px" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={grpImg}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={true}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={cropperChange}
              />
              <PhotoCamera />
            </IconButton>
            {grpImg && <Button onClick={getCropData}>Select</Button>}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {dpurl && (
              <CommonButton
                title="Create Group"
                buttonName={SubmitButtonStyle}
                onClick={handleCreateGroup}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GroupList;
