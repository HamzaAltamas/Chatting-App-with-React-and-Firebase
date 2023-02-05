import { Box, height } from "@mui/system";
import React, { useEffect } from "react";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import { BsThreeDotsVertical } from "react-icons/bs";
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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
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
                  key={item.id}
                  name={item.groupname}
                  button={true}
                  buttonName={<BsThreeDotsVertical />}
                  profession={item.grouptag}
                  onClick={() => setOpen(true)}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="create-group-modal"></Box>
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
